import { Schema, model } from 'mongoose';
import { IUserModel } from '@/interfaces/userInterface';

const userSchema = new Schema<IUserModel>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<IUserModel>('User', userSchema);

export default User;
