import { doc, onSnapshot, DocumentSnapshot, DocumentData } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import styles from "./sidebar.module.scss"

interface UserInfo {
    uid: string;
    displayName: string;
    photoURL: string;
}

interface ChatInfo {
    userInfo: UserInfo;
    lastMessage?: {
        text: string;
    };
    date: {
        seconds: number;
        nanoseconds: number;
    };
}

const Chats: React.FC = () => {
    const [chats, setChats] = useState<ChatInfo>();
    console.log(chats)
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            if (!currentUser) return;

            const userChatDocRef = doc(db, "userChats", currentUser.uid);

            const unsub = onSnapshot(userChatDocRef, (docSnapshot: DocumentSnapshot<DocumentData>) => {
                if (docSnapshot.exists()) {
                    setChats(docSnapshot.data() as ChatInfo);
                } else {
                    // Handle the case where the document doesn't exist
                    console.log("Document does not exist");
                }
            });

            return () => {
                unsub();
            };
        };

        currentUser?.uid && getChats();
    }, [currentUser]);

    const handleSelect = (u: UserInfo) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    return (
        <div className={styles.chats}>
            {chats && Object.entries(chats).sort((a, b) => {
                return b[1].date?.seconds - a[1].date?.seconds
            }).map(([chatId, chat]) => (
                <div
                    className={styles.userChat}
                    key={chatId}
                    onClick={() => handleSelect(chat.userInfo)}
                >
                    <img src={chat.userInfo.photoURL} alt="" />
                    <div className={styles.userChatInfo}>
                        <span>{chat.userInfo.displayName}</span>
                        <p>{chat.lastMessage?.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chats;
