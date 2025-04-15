import { Document } from "mongoose";
export interface IOrder extends Document {
    date: Date;
    numOfActiveOrders: number;
    numOfInactiveOrders: number;  
}