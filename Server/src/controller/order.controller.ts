import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order, OrderStatus, OrderType, PaymentMethod, PaymentStatus } from '../models/restaurant.model';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new order
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      restaurantId,
      items,
      subtotal,
      tax,
      discount,
      total,
      diningOption,
      tableNumber,
      paymentMethod,
      customerDetails,
      specialInstructions
    } = req.body;

    // Validate required fields
    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID and at least one item are required'
      });
    }

    if (!subtotal || !total || !diningOption || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order details'
      });
    }

    // Validate dining option
    if (diningOption === OrderType.DINE_IN && !tableNumber) {
      return res.status(400).json({
        success: false,
        message: 'Table number is required for dine-in orders'
      });
    }

    // Validate customer details for delivery
    if (diningOption === OrderType.DELIVERY) {
      if (!customerDetails || !customerDetails.name || !customerDetails.phone || !customerDetails.address) {
        return res.status(400).json({
          success: false,
          message: 'Customer details are required for delivery orders'
        });
      }
    }

    // Generate unique IDs
    const orderId = uuidv4();
    const orderNumber = `ORD-${Date.now()}`;

    // Create new order
    const order = new Order({
      restaurantId,
      orderNumber,
      customer: customerDetails,
      items,
      tableNumber,
      status: OrderStatus.PENDING,
      type: diningOption,
      subtotal,
      tax,
      discount,
      total,
      payment: {
        method: paymentMethod,
        status: PaymentStatus.PENDING,
        amount: total,
        tax
      },
      specialInstructions,
      orderDate: new Date(),
      estimatedReadyTime: new Date(Date.now() + 20 * 60000) // 20 minutes from now
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        orderNumber,
        status: order.status,
        estimatedReadyTime: order.estimatedReadyTime
      }
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all orders
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { restaurantId, status, startDate, endDate } = req.query;
    const query: any = {};

    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.orderDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .populate('restaurantId', 'name');

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id).populate('restaurantId', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete order
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 