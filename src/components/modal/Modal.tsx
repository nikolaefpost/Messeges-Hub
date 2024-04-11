import React, {FC} from 'react';
import {IoIosClose} from "react-icons/io";
import Portal from "./Portal";

import styles from "./modal.module.scss";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";

interface IModal {
    showModal: boolean
    children: React.ReactNode;
    onModalClose: () => void
}

const Modal: FC<IModal> = ({showModal, onModalClose, children}) => {
    const media = useMediaQuery(480, 0);
    return (<>
            {showModal && <Portal>
                <div className={styles.modal}>
                    <div className={styles.wrapper}/>
                    <div className={styles.content}>
                        <span onClick={onModalClose} className={styles.cross}><IoIosClose size={media? 45: 24}/></span>
                        {children}
                    </div>
                </div>
            </Portal>}
        </>

    );
};

export default Modal;