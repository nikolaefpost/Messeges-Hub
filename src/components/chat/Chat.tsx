import  { useContext } from "react";
import Messages from "./Messages.tsx";
import {ChatContext} from "../../context/ChatContext.tsx";
import { IoMdVideocam, IoIosPersonAdd, IoIosMore } from "react-icons/io";
import Input from "./Input";

import styles from "./chat.module.scss"


const Chat = () => {
    const { data } = useContext(ChatContext);

    return (
        <div className={styles.chat}>
            <div className={styles.chatInfo}>
                <div className={styles.user_short}>
                    <img src={data.user?.photoURL} alt="photo"/>
                    <span>
                    {data.user?.displayName}
                </span>
                </div>

                <div className={styles.chatIcons}>
                    <IoMdVideocam size={24} color="#fefefe" />
                    <IoIosPersonAdd size={24} color="#fefefe" />
                    <IoIosMore size={24} color="#fefefe" />
                </div>
            </div>
            <Messages/>
            <Input/>
        </div>
    );
};

export default Chat;