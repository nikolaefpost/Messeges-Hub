
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import {FC} from "react";
import {motion, useCycle} from "framer-motion";
import {MenuToggle} from "./menu/MenuToggle.tsx";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
import Menu from "./menu/Menu.tsx";

import styles from "./sidebar.module.scss";



interface ISidebar {
    setIsSidebar?: (boolean: boolean)=>void
}

const sidebar = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2
        },
        opacity: 1
    }),
    closed: {
        clipPath: "circle(30px at 30px 30px)",
        transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40,
        },
        opacity: 0
    }
};

const Sidebar: FC<ISidebar > = ({setIsSidebar}) => {

    const [isOpen, toggleOpen] = useCycle(false, true);
    const media = useMediaQuery(480, 0);

    return (
        <motion.div
            initial={false}
            animate={isOpen ? "open" : "closed"}
            className={styles.sidebar}
        >
            <MenuToggle toggle={() => toggleOpen()} color='#fefefe'/>
            <motion.div className={styles.background} variants={sidebar}/>
            <Menu media={media}/>
            <Navbar media={media} />
            <Search/>
            <Chats setIsSidebar={setIsSidebar}/>
        </motion.div>
    );
};

export default Sidebar;