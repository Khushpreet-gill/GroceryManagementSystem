import { Request, Response } from 'express';
import Stock from '../models/stockModel';
import { AuthRequest } from '@/interfaces/authRequest';



export const createStock = async (req: AuthRequest, res: Response): Promise<void> => {

 const { product, supplier, dateOfEntry } = req.body;

 try {

  const existingStock = await Stock.findOne({ product, supplier, dateOfEntry });

  if (existingStock) {

   res.status(409).send('Stock record already exists.');

   return;

  }



  const newStock = new Stock(req.body);

  await newStock.save();

  res.status(201).send('Stock created successfully.');

 } catch (error) {

  console.error('Error creating stock:', error);

  res.status(500).send('Internal Server Error');

 }

};



export const getAllStocks = async (req: AuthRequest, res: Response): Promise<void> => {

 try {

  const stocks = await Stock.find();

  res.status(200).json(stocks);

 } catch (error) {

  console.error('Error fetching stocks:', error);

  res.status(500).send('Internal Server Error');

 }

};