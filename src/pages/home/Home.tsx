
import {Chat, Sidebar} from "../../components";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
import {useState} from "react";

import styles from "./home.module.scss"

const Home = () => {
    const [isSidebar, setIsSidebar] = useState(true)
    const media = useMediaQuery(480, 0);

    return (!media ?
            <div className={styles.home}>
                <div className={styles.container}>
                    <Sidebar  />
                    <Chat/>
                </div>
            </div> :
            <div className={styles.home}>
                <div className={styles.container} style={{alignItems:isSidebar? "flex-start": "flex-end"}}>
                    {
                        isSidebar?
                            <Sidebar setIsSidebar={setIsSidebar}/>
                            :<Chat setIsSidebar={setIsSidebar} />
                    }
                </div>
            </div>
    );
};

export default Home;