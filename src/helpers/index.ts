import {ISignInUser} from "../types";

const storage = window.localStorage;

export const currentTime = (seconds: number) => {
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds

// Get hours and minutes
    const hours = date.getHours().toString().padStart(2, '0'); // Ensures double digit
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures double digit

    return `${hours}:${minutes}`;
}
export const getStorageUser = () => JSON.parse(storage.getItem('currentUser')?? '{}')
export const setStorageUser = (signUser: ISignInUser) => {
    storage.setItem('currentUser', JSON.stringify(signUser))
}

export const setNullStorageUser = () => {
    localStorage.removeItem('currentUser')
}