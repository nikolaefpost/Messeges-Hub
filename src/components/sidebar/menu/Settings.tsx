
import React, {FC, useState} from "react";
import {User} from "firebase/auth";
import styles from "./menu.module.scss";
import {IoIosContact} from "react-icons/io";
import {add_photo} from "../../../assets";
import {updateUser} from "../../../api/firebase.ts";

interface Interface {
    currentUser: User | null
    onModalClose: () => void
}

const Settings: FC<Interface> = ({currentUser, onModalClose}) => {

    const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
    const [file, setFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Get the first selected file
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
        }
    };

    const onUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updateUser({file, displayName})
        onModalClose();
    }



    return (
        <div className={styles.settings}>
            <div className={styles.header_set}>
                {currentUser?.photoURL ? <img src={currentUser.photoURL} alt=""/> : <IoIosContact/>}
                <span>{currentUser?.email}</span>
            </div>
            <form onSubmit={onUpdateProfile}>
                <input
                    type="file"
                    style={{display: "none"}}
                    id="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="file">
                    <img src={add_photo} alt=""/>
                </label>
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <button type="submit">Update profile</button>
            </form>
        </div>
    );
};

export default Settings;