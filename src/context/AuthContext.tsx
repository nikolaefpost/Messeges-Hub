import {createContext, ReactNode, useEffect, useState} from "react";
import {auth} from "../firebase";
import { User} from "firebase/auth";
import {onAuthStateChanged} from "firebase/auth";


export interface AuthContextType {
    currentUser: User | null; // Define type for currentUser
}


export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
});

interface AuthContextProviderProps {
    children: ReactNode; // Define type for children
}

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log(user)
            setCurrentUser(user);
        });

        return () => {
            unsub();
        };
    }, []);


    const value = {currentUser}

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};