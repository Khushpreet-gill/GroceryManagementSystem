import { Router } from 'express';
import { profileController } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware, profileController);

export default router;
