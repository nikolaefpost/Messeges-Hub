import {FC, useState} from 'react';
import { IoMdTrash } from "react-icons/io";
import styles from "./chat.module.scss";
import {IPosition, useTrackMousePosition} from "../../hooks/useTrackMousePosition.ts";

interface IMenuMessage {
    onHandleDeleteMessage: () => void;
    setOpenMenu: (arg: boolean) => void;
    position: IPosition
}

const MenuMessage: FC<IMenuMessage> = ({onHandleDeleteMessage, setOpenMenu, position}) => {
    const [coords] = useState(position)
    useTrackMousePosition(setOpenMenu)

    const style = {
        top: coords.y ?? 0,
        left: coords.x ?? 0,
    };

    return (
        <div className={styles.float_menu} style={style}>
            <IoMdTrash color="#c3073f" size={18}/>
            <input type="button" value="delete message" onClick={onHandleDeleteMessage}/>
        </div>
    );
};

export default MenuMessage;