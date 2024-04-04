import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import {AuthContextProvider} from "./context/AuthContext.tsx";
import {ChatContextProvider} from "./context/ChatContext.tsx";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
        <ChatContextProvider>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </ChatContextProvider>
    </AuthContextProvider>
,
)
