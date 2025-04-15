import { Document } from 'mongoose';

export interface IStock extends Document {
 product: string;
 supplier: string;
 quantity: number;
 price: number;
 sellingPrice: number;
 dateOfEntry: Date;
 location: string;
}

