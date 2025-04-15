import { Request, Response } from 'express';
import Task from "../models/taskModel";
import { AuthRequest } from '@/interfaces/authRequest';


export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {

 const { taskType, assignee, dueDate, location } = req.body;

 try {

  const existingTask = await Task.findOne({ taskType, assignee, dueDate, location });

  if (existingTask) {

   res.status(409).send('Task record already exists.');

   return;

  }



  const newTask = new Task(req.body);

  await newTask.save();

  res.status(201).send('Task created successfully.');

 } catch (error) {

  console.error('Error creating task:', error);

  res.status(500).send('Internal Server Error');

 }

};



export const getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {

 try {

  const tasks = await Task.find();

  res.status(200).json(tasks);

 } catch (error) {

  console.error('Error fetching tasks:', error);

  res.status(500).send('Internal Server Error');

 }

};
