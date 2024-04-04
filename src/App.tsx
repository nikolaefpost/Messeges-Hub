import React, {useContext, useEffect} from "react";
import {AuthContext} from "./context/AuthContext";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {Home, Login, Register} from "./pages";



const App = () => {
    const {currentUser} = useContext(AuthContext);
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

export default App;