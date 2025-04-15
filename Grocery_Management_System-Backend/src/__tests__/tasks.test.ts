import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; 
import Task from "../models/taskModel";

describe("Task API Integration Tests", () => {
  it("should create a new task", async () => {
    const newTask = {
      taskType: "Test Task",
      assignee: "Test Assignee",
      priorityLevel: "High",
      dueDate: new Date(),
      location: "Test Location",
    };

    const response = await request(app)
      .post("/api/tasks")
      .send(newTask)
      .expect(201);

    expect(response.text).toBe("Task created successfully.");
  });

  it("should not create a duplicate task", async () => {
    const newTask = {
      taskType: "Test Task",
      assignee: "Test Assignee",
      priorityLevel: "High",
      dueDate: new Date(),
      location: "Test Location",
    };

    await new Task(newTask).save();

    const response = await request(app)
      .post("/api/tasks")
      .send(newTask)
      .expect(409);

    expect(response.text).toBe("Task record already exists.");
  });

  it("should fetch all tasks", async () => {
    const task1 = new Task({
      taskType: "Task 1",
      assignee: "Assignee 1",
      priorityLevel: "High",
      dueDate: new Date(),
      location: "Location 1",
    });
    const task2 = new Task({
      taskType: "Task 2",
      assignee: "Assignee 2",
      priorityLevel: "Medium",
      dueDate: new Date(),
      location: "Location 2",
    });

    await task1.save();
    await task2.save();

    const response = await request(app)
      .get("/api/tasks")
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].taskType).toBe(task1.taskType);
    expect(response.body[1].taskType).toBe(task2.taskType);
  });

  it("should return 500 on server error", async () => {
    jest.spyOn(Task, 'find').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .get('/api/tasks')
      .expect(500);

    expect(response.text).toBe('Internal Server Error');
  });
});
