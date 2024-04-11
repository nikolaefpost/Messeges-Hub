import {motion} from "framer-motion";
import {FC} from "react";
import {IMenuItem} from "../../../types";

import styles from "./menu.module.scss";

interface IItem {
    item: IMenuItem
    onModalOpen?: ()=>void
}

const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: {stiffness: 1000, velocity: -100}
        }
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: {stiffness: 1000}
        }
    }
};

const MenuItem: FC<IItem> = ({item, onModalOpen}) => {
    const {icon: Icon, title} = item

    return (
        <motion.li
            variants={variants}
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.95}}
            onClick={onModalOpen}
        >
            <Icon size={30} color="#fefefe"/>
            <div className={styles.title}>{title}</div>
        </motion.li>
    );
};

export default MenuItem;