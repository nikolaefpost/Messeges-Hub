import React, { useContext, useState, KeyboardEvent } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
    DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { IoIosSearch } from "react-icons/io";
import {IUser} from "../../types";

import styles from "./sidebar.module.scss"



const Search: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [user, setUser] = useState<IUser | null>(null);
    const [err, setErr] = useState<boolean>(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        if(!username.trim()) return;

        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(doc.data())
                setUser(doc.data() as IUser);
            });
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
            const res: DocumentSnapshot = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                // Create a chat in the chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                // Create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
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
                    <img src={user.photoURL} alt="photo" />
                    <div className={styles.userChatInfo}>
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
