import  { FC, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
// import { ChatContext } from "../../context/ChatContext";
import {IMessage} from "../../types";
import cn from "classnames";

import styles from "./chat.module.scss"
interface MessageProps {
    message: IMessage;
}

const Message: FC<MessageProps> = ({ message }) => {
    console.log(message)
    const { currentUser } = useContext(AuthContext);
    // const { data } = useContext(ChatContext);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div
            ref={ref}
            // className={`message ${message.senderId === currentUser?.uid ? "owner" : ""}`}
            className={cn(styles.message, {[styles.owner]: message.senderId === currentUser?.uid})}
        >
            <div className={styles.messageInfo}>
                {message.senderId === currentUser?.uid && <img
                    src={currentUser?.photoURL ?? ""}
                    alt=""
                />}
            </div>
            <div className={styles.messageContent}>
                <p>{message.text}
                    <span>now</span>
                </p>
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    );
};

export default Message;