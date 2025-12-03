import express from 'express';
import {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user-orders', protect, getUserOrders);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
