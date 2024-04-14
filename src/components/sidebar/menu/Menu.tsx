import {motion } from "framer-motion";
import {FC, useContext, useState} from "react";
import {AuthContext} from "../../../context/AuthContext.tsx";
import UserShortInfo from "./UserShortInfo.tsx";
import MenuItem from "./MenuItem.tsx";
import {menuItems} from "../../../dataApp.ts";
import Settings from "./Settings.tsx";
import Modal from "../../modal/Modal.tsx";

import styles from "./menu.module.scss";

interface IMenu {
    media: boolean
}



const menuItem = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
};



const Menu: FC<IMenu> = ({media}) => {
    const [modal, setModal] = useState(false);

    const menu = {
        open: {
            height: '100vh',
            width: media? "100%": "33%",
            transition: {
                type: "spring",
                stiffness: 20,
                restDelta: 2
            },
        },
        closed: {
            transition: {
                delay: 0.5,
                type: "spring",
                stiffness: 400,
                damping: 40,
            },
            height: '0',
            width: "0",
        }
    };
    const {currentUser} = useContext(AuthContext)

    return (
        <motion.div
            variants={menu}
            className={styles.menu}
        >
            <UserShortInfo currentUser={currentUser}/>
            <motion.ul
                className={styles.menu_item}
                variants={menuItem}
            >
                {menuItems.map(item => (
                    <MenuItem item={item} onModalOpen={()=>setModal(true)}  key={item.id}/>
                ))}
            </motion.ul>
            <Modal showModal={modal} onModalClose={()=>setModal(false)}>
                <Settings currentUser={currentUser} onModalClose={()=>setModal(false)}  />
            </Modal>

        </motion.div>
    );
};

export default Menu;