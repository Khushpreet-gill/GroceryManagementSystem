import { IStock } from '@/interfaces/stockInterface';
import mongoose, { Schema, Document } from 'mongoose';

const StockSchema: Schema = new Schema({
    product: { type: String, required: true },
    supplier: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    dateOfEntry: { type: Date, required: true },
    location: { type: String, required: true }
});
   
export default mongoose.model<IStock>('Stock', StockSchema);