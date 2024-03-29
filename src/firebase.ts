
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: "chat-5a4ff.firebaseapp.com",
    projectId: "chat-5a4ff",
    storageBucket: "chat-5a4ff.appspot.com",
    messagingSenderId: "678798702803",
    appId: "1:678798702803:web:eec76a3d5a11da1408fc26"
};

export const appFirebase = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(appFirebase);
export const auth = getAuth(appFirebase);
