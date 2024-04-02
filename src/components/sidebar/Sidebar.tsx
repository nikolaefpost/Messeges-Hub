
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"

import styles from "./sidebar.module.scss"

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <Navbar />
            <Search/>
            <Chats/>
        </div>
    );
};

export default Sidebar;