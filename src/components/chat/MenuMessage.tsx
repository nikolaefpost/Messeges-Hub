import {FC, useState} from 'react';
import { IoMdTrash, IoMdCopy } from "react-icons/io";
import styles from "./chat.module.scss";
import {IPosition, useTrackMousePosition} from "../../hooks/useTrackMousePosition.ts";

interface IMenuMessage {
    onHandleDeleteMessage: () => void;
    setOpenMenu: (arg: boolean) => void;
    position: IPosition;
    copyToClipboard: () => void;
}

const MenuMessage: FC<IMenuMessage> = ({onHandleDeleteMessage, setOpenMenu, position, copyToClipboard}) => {
    const [coords] = useState(position)
    useTrackMousePosition(setOpenMenu)

    const style = {
        top: coords.y ?? 0,
        left: coords.x ?? 0,
    };

    return (
        <div className={styles.float_menu} style={style}>
            <div className={styles.button_block}>
                <IoMdTrash color="#c3073f" size={18}/>
                <input type="button" value="delete" onClick={onHandleDeleteMessage}/>
            </div>
            <div className={styles.button_block}>
                <IoMdCopy color="$background" size={18}/>
                <input type="button" value="copy " onClick={copyToClipboard}/>
            </div>
        </div>


    );
};

export default MenuMessage;