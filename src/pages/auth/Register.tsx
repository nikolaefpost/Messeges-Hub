import styles from "./auth.module.scss";
import React, { useState } from "react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";

import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { add_pic, imgIcon } from "../../assets";
import {uploadFile} from "../../api/firebase.ts"; // Import your default image


const Register = () => {
    const [err, setErr] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        const form = e.currentTarget;
        const displayNameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
        const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
        const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;

        const displayName = displayNameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const file = fileInput.files && fileInput.files[0];
        let photoURL = imgIcon; // Set default image URL

        if (file) {
            try {
                // Upload selected image
                // const date = new Date().getTime();
                // const storageRef = ref(storage, `${displayName + date}`);
                // await uploadBytesResumable(storageRef, file);
                // photURL = await getDownloadURL(storageRef);
                photoURL = await uploadFile(displayName, file);

            } catch (error) {
                console.error("Error uploading image:", error);
                setErr(true);
                setLoading(false);
                return;
            }
        }

        try {
            // Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile
            await updateProfile(res.user, {
                displayName,
                photoURL,
            });

            // Create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL,
            });

            // Create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
        } catch (error) {
            console.error("Error creating user:", error);
            setErr(true);
        }

        setLoading(false);
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formWrapper}>
                <span className={styles.logo}>Message hub</span>
                <span className={styles.title}>Register</span>
                <form onSubmit={handleSubmit}>
                    <input required type="text" placeholder="display name" />
                    <input required type="email" placeholder="email" />
                    <input required type="password" placeholder="password" />
                    <input style={{ display: "none" }} type="file" id="file" />
                    <label htmlFor="file">
                        <img src={add_pic} alt="" />
                        <span>Add an avatar</span>
                    </label>
                    <button disabled={loading} type="submit">Sign up</button>
                    {loading && (
                        <div className={styles.loading}>
                            Uploading and compressing the image please wait...
                        </div>
                    )}
                    {err && <span className={styles.err}>Something went wrong</span>}
                </form>
                <p>
                    You do have an account?
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
