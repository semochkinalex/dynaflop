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

export const buyTicket = async (eventName: string, userData: any) => {
    try {
        const eventRef = doc(firestore, "orders", eventName);
        const eventSnap = await getDoc(eventRef);

        const eventData = eventSnap.data();

        if (!eventData) return Promise.reject("Failed to fetch event");

        if (eventData?.availabe <= 0) return Promise.reject("No more tickets available");
        if (userData?.balance < eventData.currentPrice) return Promise.reject("Insufficient account balance");

        const ticketCount = eventData['attendees'][userData.username] || eventData['attendees'][userData.username] === 0 ? eventData['attendees'][userData.username] + 1 : 1;
        await setDoc(doc(firestore, "orders", eventName), {...eventData, available: eventData.available - 1, currentPrice: eventData.currentPrice + eventData.slippage, attendees: {...eventData.attendees, [userData.username]: ticketCount}});

        await setDoc(doc(firestore, "users", userData.username), {
            ...userData,
            balance: userData.balance - eventData.currentPrice,
            tickets: {
                ...userData.tickets,
                [eventName]: ticketCount,
            }
        });

        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
}

export const sellTicket = async (eventName: string, userData: IUser) => {
    try {
        // if (!(userData.username in event.attendees)) return Promise.reject("User doesn't have available tickets");

        const eventRef = doc(firestore, "orders", eventName);
        const eventSnap = await getDoc(eventRef);

        const eventData = eventSnap.data();

        if (!eventData) return Promise.reject("Failed to fetch event data");
        if (!userData) return Promise.reject("Invalid user account");

        if (!(userData.username in eventData.attendees) || eventData.attendees[userData.username] <= 0) return Promise.reject("User has no available tickets to sell");
        
        let updatedAttendees;

        if (eventData['attendees'][userData.username] - 1 === 0) {
            let {[userData.username]: deletedAttendee, ...leftAttendees} = eventData?.attendees;
            updatedAttendees = leftAttendees;
        } else {
            updatedAttendees = {
                ...eventData?.attendees,
                [userData.username]: eventData?.attendees[userData.username] - 1,
            };
        }
        // {...eventData.attendees, [userData.username]: eventData['attendees'][userData.username] - 1}
        await setDoc(doc(firestore, "orders", eventName), {...eventData, available: eventData.available + 1, currentPrice: eventData.currentPrice - eventData.slippage, attendees: updatedAttendees});
        
        let updatedUserTickets;

        if (userData?.tickets[eventName] - 1) {
            updatedUserTickets = {
                ...userData?.tickets,
                [eventName]: userData?.tickets[eventName] - 1
            };
        } else {
            let {[eventName]: deletedEvent, ...leftUserTickets} = userData?.tickets;
            updatedUserTickets = leftUserTickets;
        }

        await setDoc(doc(firestore, "users", userData.username), {
            ...userData,
            balance: userData.balance + eventData.currentPrice - eventData.slippage,
            tickets: updatedUserTickets
        });

        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
}

export const createEvent = async (name: any, host: any, start: any, min: any, max: any, quantity: any, slippage: any) => {
    try {
        await setDoc(doc(firestore, "orders", name), {
            name,
            startingPrice: +start,
            currentPrice: +start,
            minPrice: +min,
            maxPrice: +max,
            available: +quantity,
            quantity: +quantity,
            slippage: +slippage,
            attendees: {},
            host,
        });

        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
}