import  { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../firebase'
import { AuthContext } from '../../context/AuthContext';
import { IoIosLogOut, IoIosContact } from "react-icons/io";

import styles from "./sidebar.module.scss";
// import {setNullStorageUser} from "../../helpers";

const Navbar = () => {
    const {currentUser} = useContext(AuthContext)

    const userSignOut = () => {
        signOut(auth);
        // setNullStorageUser()
    }

    return (
        <div className={styles.navbar}>
            <span className={styles.logo}>Messages Hub</span>
            <div className={styles.user}>
                {currentUser?.photoURL? <img src={currentUser.photoURL} alt=""/>:<IoIosContact />}
                <span>{currentUser?.displayName}</span>
                <button onClick={userSignOut}>
                    <IoIosLogOut color="#fefefe" size={20} />
                </button>
            </div>
        </div>
    )
}

export default Navbar