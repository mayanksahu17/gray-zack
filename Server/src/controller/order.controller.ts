import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.model';

/**
 * Create a new order
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    
    // Convert string IDs to ObjectIds
    if (orderData.table) {
      orderData.table = new mongoose.Types.ObjectId(orderData.table);
    }
    if (orderData.customer) {
      orderData.customer = new mongoose.Types.ObjectId(orderData.customer);
    }
    if (orderData.server) {
      orderData.server = new mongoose.Types.ObjectId(orderData.server);
    }

    // Convert menuItem IDs in items array to ObjectIds
    orderData.items = orderData.items.map((item: any) => ({
      ...item,
      menuItem: new mongoose.Types.ObjectId(item.menuItem)
    }));

    const order = new Order(orderData);
    await order.save();

    return res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get all orders
 */
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('table', 'tableNumber')
      .populate('customer', 'name')
      .populate('server', 'name')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID format' });
    }

    const order = await Order.findById(id)
      .populate('table', 'tableNumber')
      .populate('customer', 'name')
      .populate('server', 'name')
      .populate('items.menuItem', 'name price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}; 