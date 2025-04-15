export interface IShipment extends Document {
    shipperName: string;
    phoneNo: string;
    status: string;
    product: string;
    supplier: string;
    quantity: number;
    price: number;
    deliveryDate: Date;
    consignee: string;
    destination: string;
    connection: string;
    task: string;
  }