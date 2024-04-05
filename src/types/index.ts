import firebase from "firebase/compat/app";
export interface IUser {
    uid: string;
    displayName: string;
    photoURL: string;
    email: string;
    // Define other properties of the user as needed
}

export interface IChatInfo {
    userInfo: IUser;
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