import React, {useContext, useEffect} from "react";
import {AuthContext} from "./context/AuthContext";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";

const Apps = () => {
    const {currentUser} = useContext(AuthContext);
    console.log(currentUser)
    const ProtectedRoute = ({element}: { element: React.ReactNode }) => {
        if (!currentUser) {
            return <Navigate to="/login"/>;
        }
        return element;
    };

    const router = createBrowserRouter([
        {
            path: "/",
            element: <ProtectedRoute element={<Home/>}/>,
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/register",
            element: <Register/>
        }
    ]);

    useEffect(() => {
        // Redirect to Home page when currentUser is available
        if (currentUser) {
            router.navigate('/');
        }
    }, [currentUser, router]);

    return (
        <RouterProvider router={router}/>
    );
};

export default Apps;