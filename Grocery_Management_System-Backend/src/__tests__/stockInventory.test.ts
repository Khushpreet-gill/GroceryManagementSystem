// test/stockInventoryRoutes.test.ts
import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; // Assuming your Express app is exported from app.ts
import StockInventoryModel from "../models/stockInventoryModel";

describe("Stock Inventory API Integration Tests", () => {
  it("should create a new inventory order", async () => {
    const newOrder = {
      customerName: "Test Customer",
      product: "Test Product",
      supplier: "Test Supplier",
      dateOfEntry: new Date(),
      quantity: 100,
      price: 50,
      sellingPrice: 75,
      cashier: "Test Cashier",
      status: "completed",
    };

    const response = await request(app)
      .post("/api/inventoryOrders")
      .send(newOrder)
      .expect(201);

    expect(response.text).toBe("Inventory order created successfully.");
  });

  it("should fetch all inventory orders", async () => {
    const order1 = new StockInventoryModel({
      customerName: "Customer 1",
      product: "Product 1",
      supplier: "Supplier 1",
      dateOfEntry: new Date(),
      quantity: 100,
      price: 50,
      sellingPrice: 75,
      cashier: "Cashier 1",
      status: "completed",
    });
    const order2 = new StockInventoryModel({
      customerName: "Customer 2",
      product: "Product 2",
      supplier: "Supplier 2",
      dateOfEntry: new Date(),
      quantity: 200,
      price: 100,
      sellingPrice: 150,
      cashier: "Cashier 2",
      status: "pending",
    });

    await order1.save();
    await order2.save();

    const response = await request(app)
      .get("/api/inventoryOrders/getAll")
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].customerName).toBe(order1.customerName);
    expect(response.body[1].customerName).toBe(order2.customerName);
  });

  it("should fetch orders grouped by date", async () => {
    const order1 = new StockInventoryModel({
      customerName: "Customer 1",
      product: "Product 1",
      supplier: "Supplier 1",
      dateOfEntry: new Date("2023-01-01"),
      quantity: 100,
      price: 50,
      sellingPrice: 75,
      cashier: "Cashier 1",
      status: "completed",
    });
    const order2 = new StockInventoryModel({
      customerName: "Customer 2",
      product: "Product 2",
      supplier: "Supplier 2",
      dateOfEntry: new Date("2023-01-01"),
      quantity: 200,
      price: 100,
      sellingPrice: 150,
      cashier: "Cashier 2",
      status: "pending",
    });

    await order1.save();
    await order2.save();

    const response = await request(app)
      .get("/api/inventoryOrders?view=daily")
      .expect(200);

    expect(response.body.dailyOrders["2023-01-01"].length).toBe(2);
  });

  it("should fetch the latest stock", async () => {
    const order1 = new StockInventoryModel({
      customerName: "Customer 1",
      product: "Product 1",
      supplier: "Supplier 1",
      dateOfEntry: new Date("2023-01-01"),
      quantity: 100,
      price: 50,
      sellingPrice: 75,
      cashier: "Cashier 1",
      status: "completed",
    });
    const order2 = new StockInventoryModel({
      customerName: "Customer 2",
      product: "Product 2",
      supplier: "Supplier 2",
      dateOfEntry: new Date("2023-01-02"),
      quantity: 200,
      price: 100,
      sellingPrice: 150,
      cashier: "Cashier 2",
      status: "pending",
    });

    await order1.save();
    await order2.save();

    const response = await request(app)
      .get("/api/inventoryOrders/getNewStock")
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].customerName).toBe(order2.customerName);
  });

  it("should return 500 on server error", async () => {
    jest.spyOn(StockInventoryModel, 'find').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .get('/api/inventoryOrders/getAll')
      .expect(500);

    expect(response.text).toBe('Internal Server Error');
  });
});
