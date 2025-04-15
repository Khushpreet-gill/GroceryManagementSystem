import express from 'express';

import { createTask, getAllTasks } from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/tasks', authMiddleware, createTask);

router.get('/tasks', authMiddleware, getAllTasks);

export default router;
