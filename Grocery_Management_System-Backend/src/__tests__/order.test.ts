
import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; 
import Order from "../models/orderModel";

describe("Order API Integration Tests", () => {
  it("should create new orders", async () => {
    const orders = [
      {
        date: new Date("2023-01-01"),
        numOfActiveOrders: 10,
        numOfInactiveOrders: 5,
      },
      {
        date: new Date("2023-01-02"),
        numOfActiveOrders: 15,
        numOfInactiveOrders: 3,
      },
    ];

    const response = await request(app)
      .post("/api/orders")
      .send(orders)
      .expect(200);

    expect(response.text).toBe("Orders added successfully.");
  });

  it("should fetch all orders", async () => {
    const order1 = new Order({
      date: new Date("2023-01-01"),
      numOfActiveOrders: 10,
      numOfInactiveOrders: 5,
    });
    const order2 = new Order({
      date: new Date("2023-01-02"),
      numOfActiveOrders: 15,
      numOfInactiveOrders: 3,
    });

    await order1.save();
    await order2.save();

    const response = await request(app)
      .get("/api/orders?status=active")
      .expect(200);

    expect(response.body.totalOrders).toBe(25);
  });

  it("should return 400 for invalid status parameter", async () => {
    const response = await request(app)
      .get("/api/orders?status=invalid")
      .expect(400);

    expect(response.text).toBe('Invalid status parameter. Must be "active" or "inactive".');
  });

  it("should fetch orders within a date range", async () => {
    const order1 = new Order({
      date: new Date("2023-01-01"),
      numOfActiveOrders: 10,
      numOfInactiveOrders: 5,
    });
    const order2 = new Order({
      date: new Date("2023-01-02"),
      numOfActiveOrders: 15,
      numOfInactiveOrders: 3,
    });

    await order1.save();
    await order2.save();

    const response = await request(app)
      .get("/api/orders?status=active&startDate=2023-01-01&endDate=2023-01-02")
      .expect(200);

    expect(response.body.totalOrders).toBe(25);
  });

  it("should return 500 on server error", async () => {
    jest.spyOn(Order, 'find').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .get('/api/orders?status=active')
      .expect(500);

    expect(response.text).toBe('Internal Server Error');
  });
});
