type TAttendee = {
    username: string;
    numberOfTotalTickets: number;
}

export interface ITicket {
    event: string; // event name
    numberOfTotalTickets: number;
} 

export interface IOrder { 
    event: string;
    price: number;
    numberOfTotalTickets: number;
}

export type TTickets = {
    [eventName: string]: number;
}

export interface IUser {
    username: string;
    password: string;
    balance: number;

    tickets?: TTickets;
}

export interface IEvent {
    name: string;
    host: string;
    minPrice: number;
    maxPrice: number;
    numberOfTotalTickets: number;
    startingPrice: number;
    currentPrice: number;
    slippage: number;
    isClosed: boolean;

    attendees: TAttendee[];

    numberOfAvailableTickets: number; // how much tickets available
}

export type ICreateEventInputs = {
    name: string,
    max: number,
    start: number,
    numberOfTotalTickets: number,
    slippage: number,
}

