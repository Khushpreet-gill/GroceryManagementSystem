import { Response } from 'express';
import { getProfile } from '../services/profileService';
import { CustomRequest } from '../interfaces/customRequest';


export const profileController = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const user = await getProfile(req.user.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: `Profile Fetch Error: ${error.message}` });
  }
};
