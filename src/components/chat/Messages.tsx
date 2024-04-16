import { doc, onSnapshot } from "firebase/firestore";
import  { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext.tsx";
import { db } from "../../firebase";
import Message from "./Message";
import {IMessage} from "../../types";
import styles from "./chat.module.scss";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() ? setMessages(doc.data().messages): setMessages([]);
        });

        return () => {
            unSub();
        };
    }, [data.chatId]);

    return (
        <div className={styles.messages}>
            {messages.map((m: IMessage) => (
                <Message message={m} key={m.id} />
            ))}
        </div>
    );
};

export default Messages;