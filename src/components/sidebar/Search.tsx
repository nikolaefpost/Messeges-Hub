import React, { useContext, useState, KeyboardEvent } from "react";
import { AuthContext } from "../../context/AuthContext";
import { IoIosSearch } from "react-icons/io";
import {User} from "firebase/auth";
import {createChat, onGetUser} from "../../api/firebase.ts";

import styles from "./sidebar.module.scss"



const Search: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [err, setErr] = useState<boolean>(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        if(!username.trim()) return;
        try {
            await onGetUser(username, setUser)
        } catch (err) {
            setErr(true);
        }
    };

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
             handleSearch();
        }
    };

    const handleSelect = async () => {
        if (!currentUser || !user) return;

        // Check whether the group (chats in Firestore) exists, if not create
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            await createChat(currentUser , user, combinedId);
        } catch (err) {
            console.log(err)
        }

        setUser(null);
        setUsername("");
    };

    return (
        <div className={styles.search}>
            <div className={styles.searchForm}>
                <div onClick={handleSearch}><IoIosSearch size={18} color="#4e4e50" /></div>
                <input
                    type="text"
                    placeholder="Find a user"
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {err && <span>User not found!</span>}
            {user && (
                <div className={styles.userChat} onClick={handleSelect}>
                    {user.photoURL &&<img src={user.photoURL} alt="photo"/>}
                    <div className={styles.userChatInfo}>
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
