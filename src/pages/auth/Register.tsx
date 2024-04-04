import styles from "./auth.module.scss"
import React, {useState} from "react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import {Link, useNavigate} from "react-router-dom";
import {add_pic} from "../../assets";
// import {setStorageUser} from "../../helpers";
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
        if (!file) {
            // Handle the case where no file is selected
            return;
        }

        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        //Update profile
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        // create user on firestore
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });

                        //create empty user chats on firestore
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        // setStorageUser({email, password});
                        navigate("/");
                    } catch (err) {
                        console.log(err);
                        setErr(true);
                        setLoading(false);
                    }
                });
            });

        } catch (err) {
            setErr(true);
            setLoading(false);
        }
        setLoading(false);
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formWrapper}>
                <span className={styles.logo}>Message hub</span>
                <span className={styles.title}>Register</span>
                <form onSubmit={handleSubmit}>
                    <input required type="text" placeholder="display name"/>
                    <input required type="email" placeholder="email"/>
                    <input required type="password" placeholder="password"/>
                    <input  style={{display: "none"}} type="file" id="file"/>
                    <label htmlFor="file">
                        <img src={add_pic} alt=""/>
                        <span>Add an avatar</span>
                    </label>
                    <button disabled={loading}>Sign up</button>
                    {loading && <div className={styles.loading}>Uploading and compressing the image please wait...</div>}
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