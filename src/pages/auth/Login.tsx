
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";

import styles from "./auth.module.scss"
const Login = () => {
    const [err, setErr] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
        const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            await signInWithEmailAndPassword(auth, email, password) .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user)
                // ...
            });
            navigate("/")
            console.log(email, password)
        } catch (err) {
            setErr(true);
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
                    <button>Sign in</button>
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