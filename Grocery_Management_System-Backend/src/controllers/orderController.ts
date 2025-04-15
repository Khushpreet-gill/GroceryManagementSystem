import { Request, Response } from 'express';

import Order from '../models/orderModel';
import { AuthRequest } from '@/interfaces/authRequest';
import { IOrder } from '@/interfaces/orderInterface';


export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({}, 'date numOfActiveOrders numOfInactiveOrders').lean().exec();
    const ordersWithRenamedFields = orders.map(order => {
      const { _id, numOfActiveOrders, numOfInactiveOrders, ...rest } = order;
      return {
        ...rest,
        numOfAvailableStock: numOfActiveOrders,
        numOfUnavailableStock: numOfInactiveOrders
      };
    });
    res.status(200).json(ordersWithRenamedFields);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {

 const { status, startDate, endDate } = req.query;


 try {

  if (!status || (status !== 'active' && status !== 'inactive')) {

   res.status(400).send('Invalid status parameter. Must be "active" or "inactive".');

   return;

  }

  const query: any = {};

  if (startDate) {

   query.date = { $gte: new Date(startDate as string) };

  }

  if (endDate) {

   if (!query.date) {

    query.date = {};

   }

   query.date.$lte = new Date(endDate as string);

  }


  const orders = await Order.find(query);

  let totalOrders = 0;

  if (status === 'active') {

   totalOrders = orders.reduce((sum, order) => sum + order.numOfActiveOrders, 0);

  } else if (status === 'inactive') {

   totalOrders = orders.reduce((sum, order) => sum + order.numOfInactiveOrders, 0);

  }


  res.status(200).json({ totalOrders });

 } catch (error) {

  console.error('Error fetching orders:', error);

  res.status(500).send('Internal Server Error');

 }

};



export const addOrders = async (req: AuthRequest, res: Response): Promise<void> => {

 const orders = req.body;



 try {

  if (!Array.isArray(orders)) {

   res.status(400).send('Invalid data format. Expected an array of orders.');

   return;

  }


  const bulkOps = orders.map((order: IOrder) => ({

   updateOne: {

    filter: { date: order.date },

    update: { $set: order },

    upsert: true

   }

  }));


  await Order.bulkWrite(bulkOps);

  res.status(200).send('Orders added successfully.');

 } catch (error) {

  console.error('Error adding orders:', error);

  res.status(500).send('Internal Server Error');

 }

};

