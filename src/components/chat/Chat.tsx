import {FC, useContext} from "react";
import Messages from "./Messages.tsx";
import {ChatContext} from "../../context/ChatContext.tsx";
import {IoMdVideocam, IoIosPersonAdd, IoIosMore, IoIosContact, IoMdReturnLeft} from "react-icons/io";
import Input from "./Input";

import styles from "./chat.module.scss";
import {useBrowserHeaderHeight} from "../../hooks/useBrowserHeaderHeight.ts";

interface IChat {
    setIsSidebar?: (boolean: boolean) => void
}


const Chat: FC<IChat> = ({setIsSidebar}) => {
    const {data} = useContext(ChatContext);
    const h = useBrowserHeaderHeight();
    // const handleBackSidebar = () => {
    //     if(setIsSidebar) setIsSidebar(false);
    // }

    return (
        <div className={styles.chat}>
            <div className={styles.chatInfo}>
                <div className={styles.user_short}>
                    {setIsSidebar &&
                        <span onClick={() => setIsSidebar(true)}><IoMdReturnLeft color='#fefefe' size={24}/></span>}
                    {data.user?.photoURL ? <img src={data.user?.photoURL} alt="photo"/> :
                        <IoIosContact size={24} color="#fefefe"/>}
                    <span>{data.user?.displayName}</span>
                    {h}
                </div>

                <div className={styles.chatIcons}>
                    <IoMdVideocam size={24} color="#fefefe"/>
                    <IoIosPersonAdd size={24} color="#fefefe"/>
                    <IoIosMore size={24} color="#fefefe"/>
                </div>
            </div>
            <Messages/>
            <Input/>
        </div>
    );
};

export default Chat;