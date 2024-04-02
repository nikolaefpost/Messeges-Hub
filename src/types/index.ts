import {ReactNode} from "react";

export interface IAuth {
    setIsAuth: (isAuth: boolean) => void;
}

export interface IAppWrapper {
    children: ReactNode;
    setIsAuth: (isAuth: boolean) => void;
    isAuth: boolean;
    setIsInChat: (isAuth: boolean ) => void;
}

export interface IChat {
    room: string;
}

export interface IMessage {
    id: string;
    text: string;
    createdAt: any;
    user: string;
}

export interface IMessage {
    senderId: string;
    text: string;
    img?: string;
}