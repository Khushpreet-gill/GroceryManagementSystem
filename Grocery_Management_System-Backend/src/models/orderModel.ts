import { IOrder } from "@/interfaces/orderInterface";
import mongoose, { Schema } from "mongoose";

const OrderSchema: Schema = new Schema({

    date: { type: Date, required: true },
   
    numOfActiveOrders: { type: Number, required: true },
   
    numOfInactiveOrders: { type: Number, required: true }
   
   });
   
   
   
   export default mongoose.model<IOrder>('Order', OrderSchema);