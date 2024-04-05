
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import {FC} from "react";

import styles from "./sidebar.module.scss";


interface ISidebar {
    setIsSidebar?: (boolean: boolean)=>void
}

const Sidebar: FC<ISidebar > = ({setIsSidebar}) => {
    return (
        <div className={styles.sidebar}>
            <Navbar />
            <Search/>
            <Chats setIsSidebar={setIsSidebar}/>
        </div>
    );
};

export default Sidebar;