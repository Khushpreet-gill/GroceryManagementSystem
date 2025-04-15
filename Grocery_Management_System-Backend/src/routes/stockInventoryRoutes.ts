import { addOrder, getAllOrders, getNewStock, getOrders } from '../controllers/stockInventoryController';
import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';

const router = express.Router();

router.get("/", authMiddleware, getOrders);
router.post("/", authMiddleware, addOrder);
router.get("/getAll", getAllOrders);
router.get("/getNewStock", authMiddleware, getNewStock);

export default router;