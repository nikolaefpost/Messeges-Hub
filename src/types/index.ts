import firebase from "firebase/compat/app";
import {User} from "firebase/auth";
import {IconType} from "react-icons";

// export interface IUser {
//     uid: string;
//     displayName: string;
//     photoURL: string;
//     email: string;
//     // Define other properties of the user as needed
// }

export interface ChatState {
    chatId: string;
    user: User;
}

export interface IChatInfo {
    userInfo: User;
    lastMessage?: {
        text: string;
    };
    date: firebase.firestore.Timestamp;
}

export interface IChatInfoData {
    [userId: string]: IChatInfo;
}

export interface IMessage {
    text: string;
    date: firebase.firestore.Timestamp;
    senderId: string;
    id: string;
    img?: string[];
}

export interface ISignInUser {
    email: string;
    password: string;
}

export interface IMenuItem {
    id: number,
    title: string,
    icon: IconType,
}

export interface IUpdateDataUser {
    file: File | null;
    displayName?: string;
}