import { FC, MouseEventHandler, useContext, useEffect, useRef, useState} from "react";
import { AuthContext } from "../../context/AuthContext";
import {IMessage} from "../../types";
import cn from "classnames";

import styles from "./chat.module.scss"
import {currentTime} from "../../helpers";
import {onDeleteMessage} from "../../api/firebase.ts";
import MenuMessage from "./MenuMessage.tsx";
import {useMousePosition} from "../../hooks/useTrackMousePosition.ts";
interface MessageProps {
    message: IMessage;
    chatId: string
}

const Message: FC<MessageProps> = ({ message,  chatId }) => {

    const [openMenu, setOpenMenu] = useState(false);
    const onHandleDeleteMessage = () => {
        try {
             onDeleteMessage(chatId, message)
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }
    const handleRightClick: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        setOpenMenu(true)
    }

    const { currentUser } = useContext(AuthContext);
    // const { data } = useContext(ChatContext);

    const ref = useRef<HTMLDivElement>(null);
    const position = useMousePosition(ref)

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div

            className={cn(styles.message, {[styles.owner]: message.senderId === currentUser?.uid})}
            // onClick={handleRightClick}

        >

            <div className={styles.messageInfo}>
                {message.senderId === currentUser?.uid && <img
                    src={currentUser?.photoURL ?? ""}
                    alt=""
                />}
            </div>
            <div className={styles.messageContent} ref={ref} onContextMenu={handleRightClick}>
                {openMenu && <MenuMessage onHandleDeleteMessage={onHandleDeleteMessage} setOpenMenu={setOpenMenu} position={position}/>}
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