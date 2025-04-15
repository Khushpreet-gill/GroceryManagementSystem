import express from 'express';

import { getOrders, addOrders, getAllOrders } from '../controllers/orderController';

import {authMiddleware} from '../middlewares/authMiddleware';



const router = express.Router();



router.get('/orders', getOrders);
router.get('/orders/all', getAllOrders);

router.post('/orders', authMiddleware, addOrders); 



export default router;