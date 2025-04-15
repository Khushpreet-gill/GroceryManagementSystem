import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Shipment from "../models/shipmentModel";

describe("Shipment API Integration Tests", () => {
  it("should create a new shipment", async () => {
    const newShipment = {
      shipperName: "Test Shipper",
      phoneNo: "1234567890",
      status: "pending",
      product: "Test Product",
      supplier: "Test Supplier",
      quantity: 100,
      price: 200,
      deliveryDate: new Date(),
      consignee: "Test Consignee",
      destination: "Test Destination",
      connection: "Test Connection",
      task: "Test Task",
    };

    const response = await request(app)
      .post("/api/shipment")
      .send(newShipment)
      .expect(201);

    expect(response.text).toBe("Shipment added successfully.");
  });

  it("should fetch all shipments", async () => {
    const shipment1 = new Shipment({
      shipperName: "Shipper 1",
      phoneNo: "1234567890",
      status: "pending",
      product: "Product 1",
      supplier: "Supplier 1",
      quantity: 100,
      price: 200,
      deliveryDate: new Date(),
      consignee: "Consignee 1",
      destination: "Destination 1",
      connection: "Connection 1",
      task: "Task 1",
    });
    const shipment2 = new Shipment({
      shipperName: "Shipper 2",
      phoneNo: "0987654321",
      status: "completed",
      product: "Product 2",
      supplier: "Supplier 2",
      quantity: 200,
      price: 400,
      deliveryDate: new Date(),
      consignee: "Consignee 2",
      destination: "Destination 2",
      connection: "Connection 2",
      task: "Task 2",
    });

    await shipment1.save();
    await shipment2.save();

    const response = await request(app)
      .get("/api/shipment")
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].shipperName).toBe(shipment1.shipperName);
    expect(response.body[1].shipperName).toBe(shipment2.shipperName);
  });

  it("should fetch shipment statistics", async () => {
    const shipment1 = new Shipment({
      shipperName: "Shipper 1",
      phoneNo: "1234567890",
      status: "pending",
      product: "Product 1",
      supplier: "Supplier 1",
      quantity: 100,
      price: 200,
      deliveryDate: new Date(),
      consignee: "Consignee 1",
      destination: "Destination 1",
      connection: "Connection 1",
      task: "Task 1",
    });
    const shipment2 = new Shipment({
      shipperName: "Shipper 2",
      phoneNo: "0987654321",
      status: "completed",
      product: "Product 2",
      supplier: "Supplier 2",
      quantity: 200,
      price: 400,
      deliveryDate: new Date(),
      consignee: "Consignee 2",
      destination: "Destination 2",
      connection: "Connection 2",
      task: "Task 2",
    });

    await shipment1.save();
    await shipment2.save();

    const response = await request(app)
      .get("/api/shipment/stats")
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0]._id).toBe("pending");
    expect(response.body[0].totalQuantity).toBe(100);
    expect(response.body[0].totalOrders).toBe(1);
    expect(response.body[1]._id).toBe("completed");
    expect(response.body[1].totalQuantity).toBe(200);
    expect(response.body[1].totalOrders).toBe(1);
  });

  it("should return 500 on server error", async () => {
    jest.spyOn(Shipment, 'find').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .get('/api/shipment')
      .expect(500);

    expect(response.text).toBe('Internal Server Error');
  });
});
