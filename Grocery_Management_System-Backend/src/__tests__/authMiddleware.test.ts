import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; 
import Blacklist from "../models/blacklistModel";
import { authMiddleware } from "../middlewares/authMiddleware";
import jwt from "jsonwebtoken";

describe("Auth Middleware Integration Tests", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
  });

  afterAll(async () => {
    process.env.NODE_ENV = 'development';
  });

  it("should bypass authentication in test mode", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it("should return 401 if no token is provided", async () => {
    process.env.NODE_ENV = 'development'; // Temporarily switch to development mode

    const response = await request(app)
      .get("/api/tasks")
      .expect(401);

    expect(response.body.message).toBe("No token provided");

    process.env.NODE_ENV = 'test'; // Switch back to test mode
  });

  it("should return 401 if token is blacklisted", async () => {
    process.env.NODE_ENV = 'development'; // Temporarily switch to development mode

    const token = jwt.sign({ userId: "testUserId" }, "secret");
    await new Blacklist({ token }).save();

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);

    expect(response.body.message).toBe("Token is blacklisted");

    process.env.NODE_ENV = 'test'; // Switch back to test mode
  });

  it("should return 401 if token is invalid", async () => {
    process.env.NODE_ENV = 'development'; // Temporarily switch to development mode

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", "Bearer invalidtoken")
      .expect(401);

    expect(response.body.message).toBe("Invalid token");

    process.env.NODE_ENV = 'test'; // Switch back to test mode
  });

  it("should pass authentication if token is valid", async () => {
    process.env.NODE_ENV = 'development'; // Temporarily switch to development mode

    const token = jwt.sign({ userId: "testUserId" }, "secret");

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeDefined();

    process.env.NODE_ENV = 'test'; // Switch back to test mode
  });
});
