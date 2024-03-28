export interface OrderInputs {
    foodId: string;
    unit: number;
}

export enum OrderStatus {
    CREATED = "CREATED",
    ACCEPTED = "ACCEPTED",
    REJECT = "REJECT",
    PROCESSING = "ACCEPTED",
    READY = "READY",
    DELIVERED = "READY",
    FINISHED = "FINISHED"
}

export interface OrderProcessInputs {
    id: String;
    status: OrderStatus;
}
