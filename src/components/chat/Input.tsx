import React, { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { imgIcon, attach } from "../../assets"

import styles from "./chat.module.scss"
import {onSendMessage} from "../../api/firebase.ts";

const Input: React.FC = () => {
    const [text, setText] = useState<string>("");
    const [img, setImg] = useState<File[] | []>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);


    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {

        if (!currentUser || !data.user) return;

        try{
            await onSendMessage({currentUser, data, img, text, setUploadProgress})
            setText("");
            setImg([]);
            setUploadProgress(0);

        }catch (error){
            console.error("Error uploading images:", error);
        }


    };

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files: File[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                files.push(e.target.files[i]);
            }
            setImg(files);
        }
    };

    return (
        <form className={styles.input} onSubmit={handleSend}>
            <input
                type="text"
                placeholder="Type something..."
                onChange={handleTextChange}
                value={text}
            />
            <div className={styles.send}>
                <img src={attach} alt="" />
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="file"
                    multiple
                    onChange={handleFileChange}
                />
                <label htmlFor="file">
                    <img src={imgIcon} alt="" />
                </label>
                <button
                    type='submit'
                    // onClick={handleSend}
                >Send</button>
                {uploadProgress > 0 && ( // Display progress only if it's greater than 0
                    <div className={styles.boot}>{uploadProgress}%</div>
                )}
            </div>
        </form>
    );
};

export default Input;
