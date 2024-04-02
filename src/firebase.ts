
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: "messages-406cc.firebaseapp.com",
    projectId: "messages-406cc",
    storageBucket: "messages-406cc.appspot.com",
    messagingSenderId: "176263071607",
    appId: "1:176263071607:web:96550bd42f783695e9c372"
};

export const appFirebase = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(appFirebase);
export const storage = getStorage();
export const auth = getAuth(appFirebase);
