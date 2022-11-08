// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { IUser } from "./types";
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
    try {
        const unsub = onSnapshot(doc(firestore, "users", username), (user) => {
            callback(user.data());
        });
        return Promise.resolve(unsub);
    } catch (err) {
        return Promise.reject(err);
    }

}

export const subscribeEvent = async (event: string, callback: (fetchedEvent: any) => void) => {
    try {
        const unsub = onSnapshot(doc(firestore, "orders", event), (fetchedEvent) => {
            callback(fetchedEvent.data());
        });
        return Promise.resolve(unsub);
    } catch (err) {
        return Promise.reject(err);
    }

}

export const authenticateUser = async (username: string) => {
    const userRef = doc(firestore, "users", username);
    const userSnap = await getDoc(userRef);

    // If an account doesn't exist, we create it.
    if (!userSnap.exists()) {

        const data: IUser = {
            username: username,
            balance: 1000,    
        }

        try {
            await setDoc(doc(firestore, "users", username), data);
            return Promise.resolve(data);
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
        
    } else {
        return Promise.resolve(userSnap.data());
    }
};

export const changeBalance = async (username: string, amount: number) => {
    const userRef = doc(firestore, "users", username);
    const userSnap = await getDoc(userRef);

    // If an account doesn't exist, we create it.
    if (userSnap.exists()) {
        const data = userSnap.data();
        
        await setDoc(doc(firestore, "users", username), {...data, balance: data.balance + amount});
        return Promise.resolve();
        
    } else {
        return Promise.resolve(userSnap.data());
    }
}

export const fetchEvents = async () => {
    try {
        const events: any = [];
        const querySnapshot = await getDocs(collection(firestore, "orders"));

        querySnapshot.forEach((doc) => {
          events.push(doc.data());
        });

        return Promise.resolve(events);
    } catch (err) {
        return Promise.reject();
    }
}

export const buyTicket = async (event, userData) => {
    try {
        if (userData.balance < event.price) return Promise.reject("Insufficient balance");
        const eventRef = doc(firestore, "orders", event);
        const eventSnap = await getDoc(eventRef);

        const data = eventSnap.data();
        // change price
        // MAKE SURE U CAN HAVE MULTIPLE TICKETS  PER ACCOUNT
        await setDoc(doc(firestore, "orders", event), {...data, currentPrice: data.currentPrice + data.slippage, attendees: {...data.attendees, [userData.username]: 1}});
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
}

// 1. check whether there are any orders which equal or higher the current price 
// 2. if there are said orders, fullfill them until there are no viable left

// 3. check whether user's order price is lower than set order
// 4. if there is lower or equal, than it buys everything for the lowest availabe price
// 5. if the price rises more than the user can afford, the set order stays but doesnt 