import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; 
import User from "../models/userModel";


  it("should return 401 if user is not authenticated", async () => {
    const response = await request(app)
      .get("/api/profile")
      .expect(400);
  });

  it("should return user profile if authenticated", async () => {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: "testuser",
      email: "testuser@example.com",
      password: "password123"
    });
    await user.save();

    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer testtoken`)
      .expect(200);

    expect(response.body.username).toBe(user.username);
    expect(response.body.email).toBe(user.email);
  });

  it("should return 400 if user profile fetch fails", async () => {
    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error('Profile Fetch Error');
    });

    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer testtoken`)
      .expect(400);

    expect(response.body.message).toBe("Profile Fetch Error: Profile Fetch Error");
  });