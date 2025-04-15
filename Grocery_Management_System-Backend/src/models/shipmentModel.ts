import { IShipment } from "@/interfaces/shipmentInterface";
import mongoose, { Schema } from "mongoose";

const ShipmentSchema: Schema = new Schema({
    shipperName: { type: String, required: true },
    phoneNo: { type: String, required: true },
    status: { type: String, required: true },
    product: { type: String, required: true },
    supplier: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    consignee: { type: String, required: true },
    destination: { type: String, required: true },
    connection: { type: String, required: true },
    task: { type: String, required: true }
  });
  
  export default mongoose.model<IShipment>('Shipment', ShipmentSchema);