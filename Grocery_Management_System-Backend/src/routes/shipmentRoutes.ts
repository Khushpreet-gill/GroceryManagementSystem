import express from 'express';
import { getShipments, addShipment, getShipmentStats } from '../controllers/shipmentController';
import {authMiddleware} from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', getShipments);
router.post('/', addShipment);
router.get('/stats', authMiddleware, getShipmentStats);

export default router;