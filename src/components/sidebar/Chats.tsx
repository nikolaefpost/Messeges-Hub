
import  {FC, useContext, useEffect, useState} from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {IChatInfoData } from "../../types";
import {User} from "firebase/auth";
import {getChats, onDeleteMessages} from "../../api/firebase.ts";
import { IoMdTrash } from "react-icons/io";
import styles from "./sidebar.module.scss"

interface IChats {
    setIsSidebar?: (boolean: boolean)=>void
}


const Chats: FC<IChats> = ({setIsSidebar}) => {
    const [chats, setChats] = useState<IChatInfoData>();
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        currentUser?.uid && getChats(currentUser, setChats);
    }, [currentUser]);

    const handleSelect = (u: User) => {
        dispatch({ type: "CHANGE_USER", payload: u });
        if(setIsSidebar) setIsSidebar(false);
    };

    const onHandleDelete = (chatId: string, userUid: string) => {
        if (!currentUser) return
         onDeleteMessages(currentUser, chatId, userUid)
        console.log(chatId+"::"+ userUid)
    }

    return (
        <div className={styles.chats}>
            {chats && Object.entries(chats).sort((a, b) => {
                return b[1].date?.seconds - a[1].date?.seconds
            }).map(([chatId, chat]) => (
                <div
                    className={styles.userChat}
                    key={chatId}
                >
                    <div
                        className={styles.info_chat}
                        onClick={() => handleSelect(chat.userInfo)}
                    >
                        {chat.userInfo.photoURL && <img src={chat.userInfo.photoURL} alt=""/>}
                        <div className={styles.userChatInfo}>
                            <span>{chat.userInfo.displayName}</span>
                            <p>{chat.lastMessage?.text}</p>
                        </div>
                    </div>
                    <span onClick={()=>onHandleDelete(chatId, chat.userInfo.uid)}><IoMdTrash size={18} color="#fefefe" /></span>

                </div>
            ))}
        </div>
    );
};

export default Chats;
