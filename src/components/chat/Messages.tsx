import {doc, onSnapshot} from "firebase/firestore";
import {FC, useContext, useEffect, useState} from "react";
import {ChatContext} from "../../context/ChatContext.tsx";
import {db} from "../../firebase";
import Message from "./Message";
import {IMessage} from "../../types";
import styles from "./chat.module.scss";

interface IMessages {
    heightTextarea: number;
    ableSelect: boolean;
    setAbleSelect: (arg: boolean) => void;
    media: boolean;
    setSelectedMessages: (arg: (pre: IMessage[]) => IMessage[]) => void;
    selectedMessages: IMessage[]
}

const Messages: FC<IMessages> = ({
                                     heightTextarea,
                                     ableSelect,
                                     setAbleSelect,
                                     media,
                                     selectedMessages,
                                     setSelectedMessages
                                 }) => {
    const [messages, setMessages] = useState([]);

    const [heightMessagesWindows, setHeightMessagesWindows] = useState<number>()
    const {data} = useContext(ChatContext);
    const height = window.innerHeight

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
        } else {
            setHeightMessagesWindows(height - heightTextarea - 70)
        }
    }, [heightTextarea, height]);

    return (
        <div
            className={styles.messages}
            style={!media ? {height: `${heightMessagesWindows}px`} : {}}
        >
            {messages.map((m: IMessage) => (
                <Message
                    message={m}
                    key={m.id}
                    chatId={data.chatId}
                    media={media}
                    ableSelect={ableSelect}
                    setAbleSelect={setAbleSelect}
                    setSelectedMessages={setSelectedMessages}
                    selectedMessages={selectedMessages}
                />
            ))}
        </div>
    );
};

export default Messages;