import {FC, useContext} from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../firebase'
import { AuthContext } from '../../context/AuthContext';
import { IoIosLogOut, IoIosContact } from "react-icons/io";
import { motion } from "framer-motion";
import styles from "./sidebar.module.scss";



interface INavbar {
    media:  boolean;
}

const Navbar: FC<INavbar> = ({media}) => {

    const {currentUser} = useContext(AuthContext)
    // const media = useMediaQuery(480, 0);
    const userSignOut = () => {
        signOut(auth);
        // setNullStorageUser()
    }

    return (
        <motion.div
            // initial={false}
            // animate={isOpen ? "open" : "closed"}
            className={styles.navbar}
        >
            <span className={styles.logo}>Messages Hub</span>
            {/*{media && <MenuToggle toggle={() => toggleOpen()} color='#fefefe'/>}*/}
            {/*<motion.div className={styles.background} variants={sidebar}/>*/}
            <div className={styles.user}>
                <div className={styles.short_user}>
                    {currentUser?.photoURL ? <img src={currentUser.photoURL} alt=""/> : <IoIosContact/>}
                    <span>{currentUser?.displayName}</span>
                </div>
                <button onClick={userSignOut}>
                    <IoIosLogOut color="#fefefe" size={media ? 30 : 20}/>
                </button>
            </div>
        </motion.div>
    )
}

export default Navbar