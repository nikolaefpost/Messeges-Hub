import  { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../firebase'
import { AuthContext } from '../../context/AuthContext';
import { IoIosLogOut, IoIosContact } from "react-icons/io";

import styles from "./sidebar.module.scss";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
// import {setNullStorageUser} from "../../helpers";

const Navbar = () => {
    const {currentUser} = useContext(AuthContext)
    const media = useMediaQuery(480, 0);
    const userSignOut = () => {
        signOut(auth);
        // setNullStorageUser()
    }

    return (
        <div className={styles.navbar}>
            <span className={styles.logo}>Messages Hub</span>
            <div className={styles.user}>
                <div className={styles.short_user}>
                    {currentUser?.photoURL? <img src={currentUser.photoURL} alt=""/>:<IoIosContact />}
                    <span>{currentUser?.displayName}</span>
                </div>
                <button onClick={userSignOut}>
                    <IoIosLogOut color="#fefefe" size={media?30:20} />
                </button>
            </div>
        </div>
    )
}

export default Navbar