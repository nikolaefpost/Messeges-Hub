import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {auth, storage} from "../firebase.ts";
import {ISignInUser, IUpdateDataUser} from "../types";
import {signInWithEmailAndPassword, updateProfile} from "firebase/auth";

export const signInUser = async (authData: ISignInUser) => {
    await signInWithEmailAndPassword(auth, authData.email, authData.password)
}

export const uploadFile = async (displayName: string, file: File) => {
    const date = new Date().getTime();
    const storageRef = ref(storage, `${displayName + date}`);
    await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(storageRef);
 }

export const updateUser = async (updateData: IUpdateDataUser) => {
    if (!auth.currentUser) return;

    const updateProfileData: { [key: string]: string } = {}; // Define updateProfileData as a dictionary

    // Check if displayName is provided in updateData, otherwise use currentUser's displayName
    const displayName = updateData.displayName || auth.currentUser.displayName as string;

    if (updateData.file) {
        updateProfileData.photoURL = await uploadFile(displayName, updateData.file);
    }

    // Combine conditions to check if display name needs to be updated and ensure it's not empty
    if (updateData.displayName && updateData.displayName !== auth.currentUser.displayName) {
        updateProfileData.displayName = updateData.displayName;
    }

    // Check if there are any properties to update
    if (Object.keys(updateProfileData).length !== 0) {
        await updateProfile(auth.currentUser, updateProfileData);
    }
};
