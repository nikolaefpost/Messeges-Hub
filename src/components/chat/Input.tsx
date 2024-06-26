import React, {ChangeEvent, FormEvent, useContext, useState} from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { imgIcon, attach } from "../../assets"

import styles from "./chat.module.scss"
import {onSendMessage} from "../../api/firebase.ts";

interface IInput {
    heightTextarea: number;
    setHeightTextarea: (height: number)=>void;
}

const Input: React.FC<IInput> = ({heightTextarea, setHeightTextarea}) => {
    const [text, setText] = useState<string>("");
    const [img, setImg] = useState<File[] | []>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [submissionProcessing, setSubmissionProcessing] = useState(false)


    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmissionProcessing(true)
        if (!currentUser || !data.user) return;
        if(!text.trim() && img.length<1) return;

        try{
            await onSendMessage({currentUser, data, img, text, setUploadProgress})
            setText("");
            setImg([]);
            setUploadProgress(0);
            setSubmissionProcessing(false)

        }catch (error){
            console.error("Error uploading images:", error);
        }
        setHeightTextarea(0)
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        autoResize(e.target)
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

    const autoResize = (element: HTMLTextAreaElement) => {
        setHeightTextarea(element.scrollHeight)
    };

    return (
        <form className={styles.input} onSubmit={handleSend}>
            <textarea
                // type="text"
                placeholder="Type something..."
                onChange={handleTextChange}
                value={text}
                // cols={1}
                style={{height: heightTextarea === 0? "auto": `${heightTextarea}px`}}
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
                    disabled={submissionProcessing}
                >Send</button>
                {uploadProgress > 0 && ( // Display progress only if it's greater than 0
                    <div className={styles.boot}>{uploadProgress}%</div>
                )}
            </div>
        </form>
    );
};

export default Input;
