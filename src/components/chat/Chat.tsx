import {FC, useContext, useState} from "react";
import Messages from "./Messages.tsx";
import {ChatContext} from "../../context/ChatContext.tsx";
import {
    IoMdVideocam,
    IoIosPersonAdd,
    IoIosMore,
    IoIosContact,
    IoMdReturnLeft,
    IoIosClose,
    IoMdTrash
} from "react-icons/io";
import Input from "./Input";

import styles from "./chat.module.scss";
import {IMessage} from "../../types";
import {onDeleteMessage} from "../../api/firebase.ts";

interface IChat {
    setIsSidebar?: (boolean: boolean) => void;
    media: boolean
}


const Chat: FC<IChat> = ({setIsSidebar, media}) => {
    const [heightTextarea, setHeightTextarea] = useState(0)
    const [selectedMessages, setSelectedMessages] = useState<IMessage[]>([])
    const {data} = useContext(ChatContext);
    const [ableSelect, setAbleSelect] = useState(false);

    const onHandleDeleteMessage = () => {
        try {
            selectedMessages.forEach(message => {
                onDeleteMessage(data.chatId, message); // Assuming onDeleteMessage expects chatId and message separately
            });
            setSelectedMessages([])
            setAbleSelect(false)
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }
    console.log(selectedMessages)
    const onHandleAbleSelected = () => {
        setAbleSelect(false);
        setSelectedMessages([])
    }

    return (
        <div className={styles.chat}>
            {!ableSelect ?
                <div className={styles.chatInfo}>
                    <div className={styles.user_short}>
                        {setIsSidebar &&
                            <span onClick={() => setIsSidebar(true)}><IoMdReturnLeft color='#fefefe' size={24}/></span>}
                        {data.user?.photoURL ? <img src={data.user?.photoURL} alt="photo"/> :
                            <IoIosContact size={24} color="#fefefe"/>}
                        <span>{data.user?.displayName}</span>
                    </div>

                    <div className={styles.chatIcons}>
                        <IoMdVideocam size={24} color="#fefefe"/>
                        <IoIosPersonAdd size={24} color="#fefefe"/>
                        <IoIosMore size={24} color="#fefefe"/>
                    </div>
                </div> :
                <div className={styles.chatInfo}>
                    <div onClick={onHandleAbleSelected}><IoIosClose size={32} color="#fefefe" /></div>
                    <div onClick={onHandleDeleteMessage}><IoMdTrash color="#fefefe" size={28}/></div>
                </div>
            }
            <Messages
                heightTextarea={heightTextarea}
                ableSelect={ableSelect}
                setAbleSelect={setAbleSelect}
                media={media}
                selectedMessages={selectedMessages}
                setSelectedMessages={setSelectedMessages}
            />
            <Input heightTextarea={heightTextarea} setHeightTextarea={setHeightTextarea}/>
        </div>
    );
};

export default Chat;