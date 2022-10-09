// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkShxAhXTbM7heV6m-WiY9yq-Ojk6BlPQ",
  authDomain: "dynaflop.firebaseapp.com",
  projectId: "dynaflop",
  storageBucket: "dynaflop.appspot.com",
  messagingSenderId: "548463907079",
  appId: "1:548463907079:web:34d55314ffed8db5a9b5a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export const signupUser = async (username: string, balance: number) => {
    const userRef = doc(firestore, "users", username);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return Promise.reject(`Username ${username} is already taken.`);
    } else {

        try {

            await setDoc(doc(firestore, "users", username), {
                balance
            });

        } catch (err) {
            return Promise.reject(`Error: ${err}.`);
        }
        
    }
}

export const subscribeUser = async (username: string, callback: (user: any) => void) => {
    const unsub = onSnapshot(doc(firestore, "users", username), (user) => {
        callback(user.data());
    });

    return unsub;
}