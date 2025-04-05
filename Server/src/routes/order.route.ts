import express from 'express';
import * as orderController from '../controller/order.controller';
import { verifyJWT } from '../middleware/auth.middleware';

const router = express.Router();

// Create new order
router.post('/',
    //  verifyJWT,
      orderController.createOrder);

// Get all orders
router.get('/',
     verifyJWT,
      orderController.getOrders);

// Get order by ID
router.get('/:id',
    //  verifyJWT,
     orderController.getOrderById);

export default router; 