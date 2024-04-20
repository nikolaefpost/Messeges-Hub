import React, {FC, MouseEventHandler, useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {IMessage} from "../../types";
import cn from "classnames";

import styles from "./chat.module.scss"
import {currentTime} from "../../helpers";
import {onDeleteMessage} from "../../api/firebase.ts";
import MenuMessage from "./MenuMessage.tsx";
import {useMousePosition} from "../../hooks/useTrackMousePosition.ts";

interface MessageProps {
    message: IMessage;
    chatId: string;
    media: boolean;
    ableSelect: boolean;
    setAbleSelect: (arg: boolean) => void;
    setSelectedMessages: (arg: (pre: IMessage[]) => IMessage[]) => void;
    selectedMessages: IMessage[]
}

const Message: FC<MessageProps> = ({
                                       message,
                                       chatId,
                                       media,
                                       ableSelect,
                                       setAbleSelect,
                                       selectedMessages,
                                       setSelectedMessages
                                   }) => {

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

    const handleAbleSelect = () => {
        if (media) {
            setAbleSelect(true)
        }
    }

    const {currentUser} = useContext(AuthContext);
    // const { data } = useContext(ChatContext);

    const ref = useRef<HTMLDivElement>(null);
    const position = useMousePosition(ref)

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: "smooth"});
    }, [message]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message.text)
    };

    // const onHandleSelectMessage = (mes: IMessage) => {
    //     if (!media) return;
    //     setSelectedMessages((pre) => {
    //         return pre.includes(mes)? pre.filter(m=> m!==mes) : [...pre, mes]
    //     });
    // }

    const onHandleSelectMessage = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, mes: IMessage) => {
        event.preventDefault();
        if (!media) return;
        setSelectedMessages((pre) => {
            const messageExists = pre.some(m => m.id === mes.id); // Assuming there's an ID property in IMessage
            return messageExists ? pre.filter(m => m.id !== mes.id) : [...pre, mes];
        });
    }


    return (
        <div className={styles.wrapper}>
            {ableSelect && media && <div
                className={cn(styles.select, {[styles.active]:selectedMessages.includes(message)})}
                onClick={(event)=>onHandleSelectMessage(event, message)}
            />}
            <div
                className={cn(styles.message, {[styles.owner]: message.senderId === currentUser?.uid})}
                onContextMenu={handleAbleSelect}
            >

                <div className={styles.messageInfo}>
                    {message.senderId === currentUser?.uid && <img
                        src={currentUser?.photoURL ?? ""}
                        alt=""
                    />}
                </div>
                <div className={styles.messageContent} ref={ref} onContextMenu={handleRightClick}>
                    {openMenu && !media &&
                        <MenuMessage
                            onHandleDeleteMessage={onHandleDeleteMessage}
                            setOpenMenu={setOpenMenu}
                            position={position}
                            copyToClipboard={copyToClipboard}
                        />}
                    <p>
                        {/*{message.img && <img src={message.img} alt="" />}*/}
                        {message?.img && message.img.map(img => (
                            <img key={img} src={img} alt=""/>
                        ))}
                        {message.text}
                        <span>{currentTime(message.date.seconds)}</span>
                    </p>

                </div>
            </div>
        </div>

    );
};

export default Message;