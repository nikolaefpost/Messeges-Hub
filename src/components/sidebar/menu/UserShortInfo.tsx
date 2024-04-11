import  {FC} from 'react';
import {IoIosContact} from "react-icons/io";
import {User} from "firebase/auth";

import styles from "./menu.module.scss";

interface IUserShortInfo {
    currentUser: User | null
}

const UserShortInfo: FC<IUserShortInfo> = ({currentUser}) => {
    return (
        <div className={styles.user_short_info}>
            {currentUser?.photoURL ? <img src={currentUser.photoURL} alt=""/> : <IoIosContact/>}
            <span className={styles.display_name}>{currentUser?.displayName}</span>
            <span className={styles.mail}>{currentUser?.email}</span>
        </div>
    );
};

export default UserShortInfo;