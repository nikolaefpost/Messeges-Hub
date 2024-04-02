import {createContext, ReactNode, useEffect, useState} from "react";
import {auth} from "../firebase";
import {User} from "firebase/auth";
import {onAuthStateChanged} from "firebase/auth";

export interface AuthContextType {
    currentUser: User | null; // Define type for currentUser
}

export const AuthContext = createContext<AuthContextType>({currentUser: null});

interface AuthContextProviderProps {
    children: ReactNode; // Define type for children
}

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null); // Initialize currentUser with null
    console.log(currentUser)
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log(user);
        });

        return () => {
            unsub();
        };
    }, []);

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    );
};