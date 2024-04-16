import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {auth, db, storage} from "../firebase.ts";
import {ChatState, IChatInfoData, ISignInUser, IUpdateDataUser} from "../types";
import {signInWithEmailAndPassword, updateProfile, User} from "firebase/auth";
import {
    arrayUnion, collection,
    deleteDoc,
    deleteField,
    doc, DocumentData,
    DocumentSnapshot,
    getDoc, getDocs, onSnapshot, query,
    serverTimestamp,
    setDoc, Timestamp,
    updateDoc, where,
} from "firebase/firestore";
import {v4 as uuid} from "uuid";

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
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const updateProfileData: { [key: string]: string } = {}; // Define updateProfileData as a dictionary

    // Check if displayName is provided in updateData, otherwise use currentUser's displayName
    const displayName = updateData.displayName || (currentUser.displayName as string);

    if (updateData.file) {
        updateProfileData.photoURL = await uploadFile(displayName, updateData.file);
    }

    // Combine conditions to check if display name needs to be updated and ensure it's not empty
    if (updateData.displayName && updateData.displayName !== currentUser.displayName) {
        updateProfileData.displayName = updateData.displayName;
    }

    // Check if there are any properties to update
    if (Object.keys(updateProfileData).length !== 0) {
        await updateProfile(currentUser, updateProfileData);
        await updateDoc(doc(db, "users", currentUser.uid), {...updateProfileData});

        const docRef = doc(db, "userChats", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const chatsUsers = docSnap.data();
            for (const chat in chatsUsers) {
                const updateFields: { [key: string]: string } = {};

                // Conditionally add displayName to updateFields if it exists in updateProfileData
                if (updateProfileData.displayName) {
                    updateFields[chat + ".userInfo.displayName"] = updateProfileData.displayName;
                }

                // Conditionally add photoURL to updateFields if it exists in updateProfileData
                if (updateProfileData.photoURL) {
                    updateFields[chat + ".userInfo.photoURL"] = updateProfileData.photoURL;
                }

                // Only update the document if there are fields to update
                if (Object.keys(updateFields).length !== 0) {
                    await updateDoc(doc(db, "userChats", chatsUsers[chat].userInfo.uid), updateFields);
                }
            }
        } else {
            console.log("No such document!");
        }
    }
};



export const createChat = async (currentUser: User, user: User, combinedId: string) => {
    const res: DocumentSnapshot = await getDoc(doc(db, "chats", combinedId));

    if (!res.exists()) {
        // Create a chat in the chats collection
        await setDoc(doc(db, "chats", combinedId), {messages: []});

        // Create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId + ".userInfo"]: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
        });
    }
}

interface IonSendMessage {
    currentUser: User,
    data: ChatState,
    img: File[],
    text: string,
    setUploadProgress: (n: number)=>void
}

export const onSendMessage = async ({currentUser, data, img, text, setUploadProgress}: IonSendMessage) =>{
    if (img.length > 0) {
        const downloadURLPromises = img.map((image) => {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, image);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        setUploadProgress((Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100))
                    },
                    (error) => {
                        console.log(error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                resolve(downloadURL);
                            })
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                            });
                    }
                );
            });
        });
        const downloadURLs = await Promise.all(downloadURLPromises);

        await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURLs,
            }),
        });

    } else {
        await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid ,
                date: Timestamp.now(),
            }),
        });
    }

    const res: DocumentSnapshot = await getDoc(doc(db, "userChats",data.user.uid));
    const userChats = res.data()

    if (userChats && !userChats[data.chatId]) {
        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
            text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
            text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
    });
}

export const onGetUser = async (username: string, setUser: (user: User)=>void) => {
    const q = query(
        collection(db, "users"),
        where("displayName", "==", username)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        setUser(doc.data() as User);
    });
}

export const getChats = (currentUser: User, setChats: (chat: IChatInfoData) => void) => {
    if (!currentUser) return;

    const userChatDocRef = doc(db, "userChats", currentUser.uid);

    const unsub = onSnapshot(userChatDocRef, (docSnapshot: DocumentSnapshot<DocumentData>) => {
        if (docSnapshot.exists()) {
            setChats(docSnapshot.data() as IChatInfoData);
        }
    });

    return () => {
        unsub();
    };
};

export const onDeleteMessages = async (currentUser: User, chatId: string, userUid: string) =>{
    await deleteDoc(doc(db, "chats", chatId));

    const currentUserRef = doc(db, 'userChats', currentUser.uid);
    await updateDoc(currentUserRef, {
        [chatId]: deleteField()
    });

    const userRef = doc(db, 'userChats', userUid);
    await updateDoc(userRef, {
        [chatId]: deleteField()
    });
}
