import { ITask } from "@/interfaces/taskInterface";
import mongoose, { Schema } from "mongoose";

const TaskSchema: Schema = new Schema({
    taskType: { type: String, required: true },
    assignee: { type: String, required: true },
    priorityLevel: { type: String, required: true },
    dueDate: { type: Date, required: true },
    location: { type: String, required: true }
   });
   
   export default mongoose.model<ITask>('Task', TaskSchema);
   
   