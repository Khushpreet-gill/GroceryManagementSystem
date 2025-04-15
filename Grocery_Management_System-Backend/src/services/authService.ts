import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import { generateToken } from '../utils/jwtUtils';
import { IUser } from '../interfaces/userInterface';

export const signUp = async (userData: IUser): Promise<string> => {
  const { username, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  const token = generateToken(user._id as string);
  return token;
};

export const signIn = async (username: string, password: string): Promise<string> => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id as string);
  return token;
};
