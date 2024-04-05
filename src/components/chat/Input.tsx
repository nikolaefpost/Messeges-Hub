import React, { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
    arrayUnion,
    doc,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase.ts";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { imgIcon, attach } from "../../assets"

import styles from "./chat.module.scss"

const Input: React.FC = () => {
    const [text, setText] = useState<string>("");
    const [img, setImg] = useState<File[] | []>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);


    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {

        if (!currentUser || !data.user) return;

        try{
            if (img) {
                const downloadURLPromises = img.map((image) => {
                    const storageRef = ref(storage, uuid());
                    const uploadTask = uploadBytesResumable(storageRef, image);

                    return new Promise((resolve, reject) => {
                        uploadTask.on(
                            "state_changed",
                            (snapshot) => {
                                setUploadProgress((Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100))
                            },
                            (error) => {
                                console.log(error);
                                reject(error);
                            },
                            () => {
                                getDownloadURL(uploadTask.snapshot.ref)
                                    .then((downloadURL) => {
                                        resolve(downloadURL);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        reject(error);
                                    });
                            }
                        );
                    });
                });
                const downloadURLs = await Promise.all(downloadURLPromises);

                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: downloadURLs,
                    }),
                });

            } else {
                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid ,
                        date: Timestamp.now(),
                    }),
                });
            }

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

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
        <div className={styles.input}>
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
                <button onClick={handleSend}>Send</button>
                {uploadProgress > 0 && ( // Display progress only if it's greater than 0
                    <div className={styles.boot}>{uploadProgress}%</div>
                )}
            </div>
        </div>
    );
};

export default Input;
