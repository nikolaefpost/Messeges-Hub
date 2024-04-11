
import {FC} from "react";
import {User} from "firebase/auth";

import styles from "./menu.module.scss";
import {IoIosContact} from "react-icons/io";

interface Interface {
    currentUser: User | null
}

const Settings: FC<Interface> = ({currentUser}) => {

    return (
        <div className={styles.settings}>
            <div className={styles.header_set}>
                {currentUser?.photoURL ? <img src={currentUser.photoURL} alt=""/> : <IoIosContact/>}
                <span>{currentUser?.displayName}</span>
            </div>
        </div>
    );
};

export default Settings;