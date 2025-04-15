import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; 
import Stock from "../models/stockModel";

describe("Stock API Integration Tests", () => {
  it("should create a new stock", async () => {
    const newStock = {
      product: "Test Product",
      supplier: "Test Supplier",
      quantity: 100,
      price: 50,
      sellingPrice: 75,
      dateOfEntry: new Date(),
      location: "Test Location",
    };

    const response = await request(app)
      .post("/api/stock")
      .send(newStock)
      .expect(201);

    expect(response.text).toBe("Stock created successfully.");
  });

  it("should not create a duplicate stock", async () => {
    const newStock = {
      product: "Test Product",
      supplier: "Test Supplier",
      quantity: 100,
      price: 50,
      sellingPrice: 75,
      dateOfEntry: new Date(),
      location: "Test Location",
    };

    await new Stock(newStock).save();

    const response = await request(app)
      .post("/api/stock")
      .send(newStock)
      .expect(409);

    expect(response.text).toBe("Stock record already exists.");
  });

  it("should fetch all stocks", async () => {
    const stock1 = new Stock({
      product: "Product 1",
      supplier: "Supplier 1",
      quantity: 100,
      price: 50,
      sellingPrice: 75,
      dateOfEntry: new Date(),
      location: "Location 1",
    });
    const stock2 = new Stock({
      product: "Product 2",
      supplier: "Supplier 2",
      quantity: 200,
      price: 100,
      sellingPrice: 150,
      dateOfEntry: new Date(),
      location: "Location 2",
    });

    await stock1.save();
    await stock2.save();

    const response = await request(app)
      .get("/api/stock")
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].product).toBe(stock1.product);
    expect(response.body[1].product).toBe(stock2.product);
  });

  it("should return 500 on server error", async () => {
    jest.spyOn(Stock, 'find').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .get('/api/stock')
      .expect(500);

    expect(response.text).toBe('Internal Server Error');
  });
});
