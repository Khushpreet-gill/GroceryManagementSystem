import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import { errorHandler } from './utils/errorHandler';
import blogRoutes from './routes/blogRoutes';
import StockInventoryRoutes from './routes/stockInventoryRoutes';
import shipmentRoutes from './routes/shipmentRoutes';
import orderRoutes from './routes/orderRoutes';
import stockRoutes from './routes/stockRoutes';
import taskRoutes from './routes/taskRoutes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', profileRoutes);
app.use('/api/blogs',blogRoutes);
app.use('/api/inventoryOrders',StockInventoryRoutes)
app.use('/api/shipment',shipmentRoutes)
app.use('/api',orderRoutes)
app.use('/api',stockRoutes)
app.use('/api',taskRoutes)
app.use(errorHandler);

export default app;
