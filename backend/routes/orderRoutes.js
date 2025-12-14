import express from 'express';
import {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    deleteOrder
} from '../controllers/orderController.js';
import { protect, admin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Place specific routes BEFORE parameterized routes
router.post('/', optionalAuth, createOrder);
router.get('/me', protect, getUserOrders);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder); // User can cancel their own orders
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
