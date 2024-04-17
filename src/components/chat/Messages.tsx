import {doc, onSnapshot} from "firebase/firestore";
import {FC, useContext, useEffect, useState} from "react";
import {ChatContext} from "../../context/ChatContext.tsx";
import {db} from "../../firebase";
import Message from "./Message";
import {IMessage} from "../../types";
import styles from "./chat.module.scss";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";

interface IMessages {
    heightTextarea: number;
}

const Messages: FC<IMessages> = ({heightTextarea}) => {
    const [messages, setMessages] = useState([]);
    const [heightMessagesWindows, setHeightMessagesWindows] = useState<number>()
    const {data} = useContext(ChatContext);
    const height = window.innerHeight
    const media = useMediaQuery(480, 0);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() ? setMessages(doc.data().messages) : setMessages([]);
        });

        return () => {
            unSub();
        };
    }, [data.chatId]);

    useEffect(() => {
        if (heightTextarea === 0) {
            setHeightMessagesWindows(height - 120)
        }else {
            setHeightMessagesWindows(height - heightTextarea - 70)
        }
    }, [heightTextarea, height]);

    return (
        <div
            className={styles.messages}
            style={!media? {height: `${heightMessagesWindows}px`}: {}}
        >
            {messages.map((m: IMessage) => (
                <Message message={m} key={m.id} chatId={data.chatId}/>
            ))}
        </div>
    );
};

export default Messages;