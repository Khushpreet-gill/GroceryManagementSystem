import { Request, Response } from 'express';
import { signUp, signIn } from '../services/authService';
import Blacklist from '../models/blacklistModel';
// comment
export const signUpController = async (req: Request, res: Response) => {
  try {
    const token = await signUp(req.body);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: `Sign Up Error: ${error.message}` });
  }
};

export const signInController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await signIn(username, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: `Sign In Error: ${error.message}` });
  }
};

export const signOutController = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(400).json({ message: 'No token provided' });
      return;
    }
  
    try {
      const blacklistedToken = new Blacklist({ token });
      await blacklistedToken.save();
      res.status(200).json({ message: 'Sign out successful' });
    } catch (error) {
      res.status(500).json({ message: `Sign out error: ${error.message}` });
    }
  };