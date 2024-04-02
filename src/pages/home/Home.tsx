
import Sidebar from "../../components/sidebar/Sidebar.tsx";
import Chat from "../../components/chat/Chat.tsx";

import styles from "./home.module.scss"
const Home = () => {
    return (
        <div className={styles.home}>
            <div className={styles.container}>
                <Sidebar/>
                <Chat/>
            </div>
        </div>
    );
};

export default Home;