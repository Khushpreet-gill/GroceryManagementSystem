import { Request, Response } from "express";
import StockInventoryModel from "../models/stockInventoryModel";

// Function to group orders by date (YYYY-MM-DD)
const groupOrdersByDate = (orders: any[]) => {
  return orders.reduce((acc, order) => {
    const dateKey = order.dateOfEntry.toISOString().split("T")[0]; 
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(order);
    return acc;
  }, {} as Record<string, typeof orders>);
};


export const getOrders = async (req: Request, res: Response): Promise<any> => {
  const { view } = req.query;

  try {
    const orders = await StockInventoryModel.find();

    if (view === "daily") {
      const dailyOrders = groupOrdersByDate(orders);
      return res.json({ dailyOrders });
    }

    return res.status(400).send("Invalid view parameter");
  } catch (error) {
    return res.status(500).send("Internal Server Error" );
  }
};

export const addOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = new StockInventoryModel(req.body);
    await newOrder.save();
    res.status(201).send('Inventory order created successfully.');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await StockInventoryModel.find();
    res.json(orders);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getNewStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const latestStock = await StockInventoryModel.find().sort({ dateOfEntry: -1 }).limit(1);

    if (latestStock.length === 0) {
      return res.json([]);
    }
    const latestDate = latestStock[0].dateOfEntry;
    const newStock = await StockInventoryModel.find({ dateOfEntry: latestDate });

    res.json(newStock);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};