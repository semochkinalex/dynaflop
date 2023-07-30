type TAttendee = {
    username: string;
    ticketQuantity: number;
}

export interface ITicket {
    event: string; // event name
    quantity: number;
} 

export interface IOrder { 
    event: string;
    price: number;
    quantity: number;
}

export interface IUser {
    username: string;
    password: string;
    balance: number;

    buy?: IOrder[];
    sell?: IOrder[];
    tickets?: ITicket[];
    unsubscribe?: () => void;
}

export interface IEvent {
    name: string;
    host: string;
    minPrice: number;
    maxPrice: number;
    quantity: number;
    startingPrice: number;
    currentPrice: number;
    slippage: number;
    closed: boolean

    attendees: TAttendee[];

    available: number; // how much tickets available
}

export interface IBuyOrders {
    buyers: Omit<IOrder, "event">;
}

export interface IBuyOrders {
    sellers: Omit<IOrder, "event">;
}

export type ICreateEventInputs = {
    name: string,
    max: number,
    start: number,
    quantity: number,
    slippage: number,
}