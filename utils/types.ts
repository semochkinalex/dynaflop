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
}

export interface IEvent {
    event: string; // event name

    minPrice: number;
    maxPrice: number;
    quantity: number;
    startingPrice: number;

    availabe: number; // how much tickets available
}

export interface IBuyOrders {
    buyers: Omit<IOrder, "event">;
}

export interface IBuyOrders {
    sellers: Omit<IOrder, "event">;
}