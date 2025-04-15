import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { CustomRequest } from '../interfaces/customRequest';
import Blacklist from '../models/blacklistModel';

export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {

  if (process.env.NODE_ENV === 'test') {
    // Bypass authentication in test mode
    req.user = { userId: 'testUserId' };
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) {
      res.status(401).json({ message: 'Token is blacklisted' });
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded as { userId: string };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
