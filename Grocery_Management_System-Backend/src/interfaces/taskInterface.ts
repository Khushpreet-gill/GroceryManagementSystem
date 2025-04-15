import { Document } from "mongoose";
export interface ITask extends Document {
  taskType: string;
  assignee: string;
  priorityLevel: string;
  dueDate: Date;
  location: string;
}
