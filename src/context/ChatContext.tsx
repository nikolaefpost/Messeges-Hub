import React, {createContext, useContext, useReducer, ReactNode} from "react";
import {AuthContext} from "./AuthContext";
import {IUser} from "../types";



interface ChatState {
    chatId: string;
    user: IUser;
}

interface Action {
    type: string;
    payload: IUser; // Adjust payload type as needed
}

interface ContextValue {
    data: ChatState;
    dispatch: React.Dispatch<Action>;
}

export const ChatContext = createContext<ContextValue>({
    data: {chatId: "null", user: {} as IUser}, dispatch: () => {
    }
});

interface ChatContextProviderProps {
    children: ReactNode;
}

export const ChatContextProvider = ({children}: ChatContextProviderProps) => {
    const {currentUser} = useContext(AuthContext);
    const INITIAL_STATE: ChatState = {
        chatId: "null",
        user: {} as IUser, // Initialize user with empty object
    };

    const chatReducer = (state: ChatState, action: Action): ChatState => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser && currentUser.uid > action.payload?.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + (currentUser?.uid || ""),
                };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{data: state, dispatch}}>
            {children}
        </ChatContext.Provider>
    );
};
