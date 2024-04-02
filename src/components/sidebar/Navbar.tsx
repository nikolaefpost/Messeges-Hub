import  { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../firebase'
import { AuthContext } from '../../context/AuthContext';
import { IoIosLogOut } from "react-icons/io";

import styles from "./sidebar.module.scss"

const Navbar = () => {
    const {currentUser} = useContext(AuthContext)

    return (
        <div className={styles.navbar}>
            <span className={styles.logo}>Messages Hub</span>
            <div className={styles.user}>
                <img src={currentUser?.photoURL ?? ''} alt="" />
                <span>{currentUser?.displayName}</span>
                <button onClick={()=>signOut(auth)}>
                    <IoIosLogOut color="#fefefe" size={20} />
                </button>
            </div>
        </div>
    )
}

export default Navbar