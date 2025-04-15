import express from 'express';
import { createStock, getAllStocks } from '../controllers/stockController';
import { authMiddleware } from '../middlewares/authMiddleware';


const router = express.Router();


router.post('/stock', authMiddleware, createStock);
router.get('/stock', authMiddleware, getAllStocks);



export default router;