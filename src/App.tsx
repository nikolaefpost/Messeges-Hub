import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./context/AuthContext";

function App() {
    const { currentUser }: AuthContextType = useContext(AuthContext);


    const ProtectedRoute = ({ children }: { children: ReactNode }) => {
        console.log("App: ",currentUser)
        if (!currentUser) {
            return <Navigate to="/login" />;
        }

        return children;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;