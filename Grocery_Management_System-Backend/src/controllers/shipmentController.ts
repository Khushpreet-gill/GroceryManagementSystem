import { Request, Response } from 'express';
import Shipment from '../models/shipmentModel';
import { AuthRequest } from '../interfaces/authRequest';



export const getShipments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const addShipment = async (req: AuthRequest, res: Response): Promise<void> => {
  const shipmentData = req.body;

  try {
    const newShipment = new Shipment(shipmentData);
    await newShipment.save();
    res.status(201).send('Shipment added successfully.');
  } catch (error) {
    console.error('Error adding shipment:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getShipmentStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shipments = await Shipment.aggregate([
      {
        $group: {
          _id: "$status",
          totalQuantity: { $sum: "$quantity" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(shipments);
  } catch (error) {
    console.error('Error fetching shipment statistics:', error);
    res.status(500).send('Internal Server Error');
  }
};
