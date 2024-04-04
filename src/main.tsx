import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.scss'
import {AuthContextProvider} from "./context/AuthContext.tsx";
import {ChatContextProvider} from "./context/ChatContext.tsx";
import Apps from "./Apps.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
        <ChatContextProvider>
            <React.StrictMode>
                <Apps/>
            </React.StrictMode>
        </ChatContextProvider>
    </AuthContextProvider>
,
)
