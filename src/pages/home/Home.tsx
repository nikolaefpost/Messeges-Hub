
import {Chat, Sidebar} from "../../components";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
import {useEffect, useRef, useState} from "react";

import styles from "./home.module.scss"
import { useScreenHeight} from "../../hooks/useBrowserHeaderHeight.ts";

const Home = () => {
    const [isSidebar, setIsSidebar] = useState(true)
    const media = useMediaQuery(480, 0);
    const heightCur = useScreenHeight()
    console.log(heightCur)

    const homeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Accessing the current reference
        const currentRef = homeRef.current;

        // Checking if the reference exists
        if (currentRef) {
            // Setting styles based on the heightCur prop
            currentRef.style.height = `${heightCur}px`;
        }
    }, [heightCur]);

    return (!media ?
            <div className={styles.home}  ref={homeRef}>
                <div className={styles.container}>
                    <Sidebar  />
                    <Chat/>
                </div>
            </div> :
            <div className={styles.home}>
                <div className={styles.container} >
                    {
                        !isSidebar?
                            <Sidebar setIsSidebar={setIsSidebar}/>
                            :<Chat setIsSidebar={setIsSidebar} />
                    }
                </div>
            </div>
    );
};

export default Home;