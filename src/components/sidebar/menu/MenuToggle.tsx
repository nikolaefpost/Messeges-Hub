
import {CustomValueType, motion, MotionValue} from "framer-motion";

import styles from "./menu.module.scss"
import { FC } from "react";

type closeOpen = {
    d?: string;
    opacity?: number
}
interface PathProps{
    strokeWidth?: number;
    strokeLinecap?: "inherit" | "butt" | "round" | "square" | CustomValueType | MotionValue<number> | MotionValue<string> | undefined;
    d?: string;
    variants: {
        closed: closeOpen;
        open: closeOpen;
    }
    transition?: { duration: number };
}
interface IMenuToggle {
    toggle: () => void;
    color: string;
}
const Path = (props: PathProps) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
        {...props}
    />
);

export const MenuToggle: FC<IMenuToggle> = ({ toggle, color }) => (
    <button onClick={toggle} className={styles.menu_icon}>
        <svg width="23" height="23" viewBox="0 0 23 23" stroke={color}>
            <Path
                variants={{
                    closed: {d: "M 2 2.5 L 20 2.5"},
                    open: {d: "M 3 16.5 L 17 2.5"}
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: {opacity: 1},
                    open: {opacity: 0}
                }}
                transition={{duration: 0.1}}
            />
            <Path
                variants={{
                    closed: {d: "M 2 16.346 L 20 16.346"},
                    open: {d: "M 3 2.5 L 17 16.346"}
                }}
            />
        </svg>
    </button>
);