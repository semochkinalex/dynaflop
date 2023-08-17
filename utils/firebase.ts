// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { IEvent, IUser } from "./types";
import passwordHash from 'password-hash';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#numberOfAvailableTickets-libraries

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

// Recieve updates on any user's profile changes (balance & tickets)
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

// Recieve updates on the event's changes.
export const subscribeEvent = async (event: string, callback: (fetchedEvent: any) => void) => {
    try {
        const unsub = onSnapshot(doc(firestore, "events", event), (fetchedEvent) => {
            callback(fetchedEvent.data());
        });
        return Promise.resolve(unsub);
    } catch (err) {
        return Promise.reject(err);
    }

}

export const isEventNameAvailable =async (eventName:string) => {
    try {
        const eventRef = doc(firestore, "events", eventName);
        const eventSnap = await getDoc(eventRef);

        return !eventSnap.exists();
    } catch {
        return false;
    }
}

// If there is an existing account -> login into it. If there is no account -> create it
export const authenticateUser = async (username: string, password: string) => {

    const passwordRegexp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    
    if (!passwordRegexp.test(password)) {
        return Promise.reject("Your password must include minimum eight characters, at least one letter and one number")
    }

    const userRef = doc(firestore, "users", username);
    const userSnap = await getDoc(userRef);
    
    // If an account doesn't exist, we create it.
    if (!userSnap.exists()) {
        
        const encryptedPassword = passwordHash.generate(password);
        const userData: IUser = { username, password: encryptedPassword, balance: 0 }
 
        try {
            await setDoc(doc(firestore, "users", username), userData);
            return Promise.resolve(userData);
        } catch (error) {
            return Promise.reject(error);
        }
    
    // if it does exist -> we check the password
    } else {
        console.l
        if (passwordHash.verify(password, userSnap.data().password)) {
            return Promise.resolve(userSnap.data());
        } else {
            return Promise.reject("Incorrect Password");
        }
    }
};

export const changeBalance = async (username: string, amount: number) => {
    const userRef = doc(firestore, "users", username);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        
        await setDoc(doc(firestore, "users", username), {...data, balance: data.balance + amount});
        return Promise.resolve();
        
    } else {
        return Promise.reject("Account does not exist");
    }
}

export const fetchEvents = async () => {
    try {
        const events: IEvent[] = [];
        const querySnapshot = await getDocs(collection(firestore, "events"));

        querySnapshot.forEach((doc) => {

            const eventData = doc.data() as IEvent;
            events.push(eventData);

        });
        
        return Promise.resolve(events);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const togglePauseEvent = async (eventName: string, username: string, value: boolean) => {
    try {
        const eventRef = doc(firestore, "events", eventName);
        const eventSnap = await getDoc(eventRef);

        const eventData = eventSnap.data();

        if (!eventData) return Promise.reject("Failed to fetch event");
        
        if (eventData.host !== username) return Promise.reject("You are not the host");
             
        await setDoc(doc(firestore, "events", eventName), {...eventData, isClosed: value});
    
    } catch (err) {
        return Promise.reject(err);
    }
}

const calculateTicketPrice = (price: number, min: number, max: number, slippage: number, isPurchase: boolean) => {
    if (isPurchase) {
        return price + slippage > max ? max : price + slippage;
    } else {
        return price - slippage < min ? min : price - slippage;
    }
}

export const buyTicket = async (eventName: string, userData: IUser) => {
    try {
        // Get all information about the event
        const eventRef = doc(firestore, "events", eventName);
        const eventSnap = await getDoc(eventRef);
        const eventData = eventSnap.data();

        // Get all information about the host
        const hostRef = doc(firestore, "users", eventData?.host);
        const hostSnap = await getDoc(hostRef);
        const hostData = hostSnap.data();
        
        if (!userData) return Promise.reject("Invalid user account");
        if (!eventData) return Promise.reject("Failed to fetch event");
        if (!hostData) return Promise.reject("Invalid host.");
        
        if (eventData?.numberOfAvailableTickets <= 0) return Promise.reject("No more tickets available");
        if (userData?.balance < eventData.currentPrice) return Promise.reject("Insufficient account balance");
        
        const buyPrice = eventData.currentPrice;

        const {currentPrice, minPrice, maxPrice, slippage} = eventData;
        const newPrice = calculateTicketPrice(currentPrice, minPrice, maxPrice, slippage, true);

        // checks whether the user never bought any tickets or has bought them and sold (therefore equals 0)
        const ticketCount = (eventData['attendees'][userData.username] || eventData['attendees'][userData.username] === 0) ? eventData['attendees'][userData.username] + 1 : 1;
        
        // Update event's data
        await setDoc(doc(firestore, "events", eventName), {...eventData, numberOfAvailableTickets: eventData?.numberOfAvailableTickets - 1, currentPrice: newPrice, attendees: {...eventData.attendees, [userData.username]: ticketCount}});
        
        // Pay the host
        await setDoc(doc(firestore, "users", hostData.username), {
            ...hostData,
            balance: hostData?.balance + buyPrice,
        })
        
        // Add tickets to the user and decrease their balance
        await setDoc(doc(firestore, "users", userData.username), {
            ...userData,
            balance: userData.balance - buyPrice,
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

        const eventRef = doc(firestore, "events", eventName);
        const eventSnap = await getDoc(eventRef);
        const eventData = eventSnap.data();

        const hostRef = doc(firestore, "users", eventData?.host);
        const hostSnap = await getDoc(hostRef);
        const hostData = hostSnap.data();

        if (!userData) return Promise.reject("Invalid user account");
        if (!eventData) return Promise.reject("Failed to fetch event data");
        if (!hostData) return Promise.reject("Invalid host."); 

        if (!(userData.username in eventData.attendees) || eventData.attendees[userData.username] <= 0) return Promise.reject("User has no available tickets to sell");
        if (!userData?.tickets) return Promise.reject("User account format isn't supported. Probably was changed manually through firebase");
        
        let updatedAttendees;

        if (eventData['attendees'][userData.username] - 1 === 0) {
            let {[userData.username]: deletedAttendee, ...leftAttendees} = eventData?.attendees;
            updatedAttendees = leftAttendees; // javascript trick to get the rest of attendees.
        } else {
            updatedAttendees = {
                ...eventData?.attendees,
                [userData.username]: eventData?.attendees[userData.username] - 1,
            };
        }
        
        // updated price after selling
        const {currentPrice, minPrice, maxPrice, slippage} = eventData;
        const newPrice = calculateTicketPrice(currentPrice, minPrice, maxPrice, slippage, false);

        // change the event
        await setDoc(doc(firestore, "events", eventName), {...eventData, numberOfAvailableTickets: eventData?.numberOfAvailableTickets + 1, currentPrice: newPrice, attendees: updatedAttendees});
        
        // track the user's tickets
        let updatedUserTickets;

        if (userData?.tickets[eventName] - 1) {
            updatedUserTickets = {
                ...userData?.tickets,
                [eventName]: userData?.tickets[eventName] - 1
            };
        } else {
            // @ts-ignore type has no matching index signature for type 'string' (2537)
            let {[eventName]: deletedEvent, ...leftUserTickets} = userData?.tickets;
            updatedUserTickets = leftUserTickets;
        }

        // subtract money from host
        await setDoc(doc(firestore, "users", hostData.username), {
            ...hostData,
            balance: hostData?.balance - newPrice,
        })

        // change the buyer's profile using updatedUserTickets
        await setDoc(doc(firestore, "users", userData.username), {
            ...userData,
            balance: userData.balance + newPrice,
            tickets: updatedUserTickets
        });


        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
}

export const createEvent = async (name: any, host: any, start: any, max: any, numberOfTotalTickets: any, slippage: any) => {
    try {
        await setDoc(doc(firestore, "events", name), {
            name,
            host,
            attendees: {},
            isClosed: false,
            startingPrice: Number(start),
            currentPrice: Number(start),
            minPrice: Number(start),
            maxPrice: Number(max),
            numberOfAvailableTickets: Number(numberOfTotalTickets),
            numberOfTotalTickets: Number(numberOfTotalTickets),
            slippage: Number(slippage),
        });

        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
}