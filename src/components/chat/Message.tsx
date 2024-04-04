import  { FC, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import {IMessage} from "../../types";
import cn from "classnames";

import styles from "./chat.module.scss"
import {currentTime} from "../../helpers";
interface MessageProps {
    message: IMessage;
}

const Message: FC<MessageProps> = ({ message }) => {
    console.log(message.img)
    const { currentUser } = useContext(AuthContext);
    // const { data } = useContext(ChatContext);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div
            ref={ref}
            className={cn(styles.message, {[styles.owner]: message.senderId === currentUser?.uid})}
        >
            <div className={styles.messageInfo}>
                {message.senderId === currentUser?.uid && <img
                    src={currentUser?.photoURL ?? ""}
                    alt=""
                />}
            </div>
            <div className={styles.messageContent}>
                <p>
                    {/*{message.img && <img src={message.img} alt="" />}*/}
                    {message?.img && message.img.map(img=> (
                        <img key={img} src={img} alt=""/>
                    ))}
                    {message.text}
                    <span>{currentTime(message.date.seconds)}</span>
                </p>

            </div>
        </div>
    );
};

export default Message;