
import {Chat, Sidebar} from "../../components";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
import {useState} from "react";

import styles from "./home.module.scss"
import { useScreenHeight} from "../../hooks/useBrowserHeaderHeight.ts";

const Home = () => {
    const [isSidebar, setIsSidebar] = useState(true)
    const media = useMediaQuery(480, 0);
    const heightCur = useScreenHeight()
    console.log(heightCur)

    return (!media ?
            <div className={styles.home} style={{height: heightCur}}>
                <div className={styles.container}>
                    <Sidebar  />
                    <Chat/>
                </div>
            </div> :
            <div className={styles.home}>
                <div className={styles.container} >
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