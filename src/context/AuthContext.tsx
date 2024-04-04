import {createContext, ReactNode, useEffect, useState} from "react";
import {auth} from "../firebase";
import {signInWithEmailAndPassword, User} from "firebase/auth";
import {onAuthStateChanged} from "firebase/auth";
// import {getStorageUser} from "../helpers";
import {ISignInUser} from "../types";

export interface AuthContextType {
    currentUser: User | null; // Define type for currentUser
    signInUser: (authData: ISignInUser) => Promise<void>;
}


export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    signInUser:async ()=> {}
});

interface AuthContextProviderProps {
    children: ReactNode; // Define type for children
}

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // const storageUser = getStorageUser();
    const signInUser = async (authData: ISignInUser) => {
        await signInWithEmailAndPassword(auth, authData.email, authData.password) .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user)
            // ...
        })
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => {
            unsub();
        };
    }, []);

    // useEffect(() => {
    //     if (storageUser?.email ) {
    //         signInUser(storageUser)
    //     }
    // }, [storageUser]);

    const value = {currentUser, signInUser}

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};