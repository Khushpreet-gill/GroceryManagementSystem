import { IStockInventory } from "@/interfaces/stockInventoryInterface";
import { model, Schema } from "mongoose";

const orderSchema = new Schema<IStockInventory>({
    customerName: { type: String, required: true },
    product: { type: String, required: true },
    supplier: { type: String, required: true },
    dateOfEntry: { type: Date, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    cashier: { type: String, required: true },
    status: { type: String, required: true, enum: ["completed", "pending", "canceled"] }
  });
  
  const StockInventoryModel = model<IStockInventory>("StockInventory", orderSchema);
  export default StockInventoryModel;