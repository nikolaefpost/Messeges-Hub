
import React, { useState} from "react";
import {signInUser} from "../../api/firebase.ts"
import {  Link } from "react-router-dom";


import styles from "./auth.module.scss"
// import {setStorageUser} from "../../helpers";

const Login = () => {
    const [err, setErr] = useState<boolean>(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
        const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            await signInUser({email, password})
            // setStorageUser({email, password});
        }catch (err){
            setErr(true)
        }
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.formWrapper}>
                <span className={styles.logo}>Messages hub</span>
                <span className={styles.title}>Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="email"/>
                    <input type="password" placeholder="password"/>
                    <button type="submit">Sign in</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>You don't have an account?
                    <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;