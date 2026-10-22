import express from 'express';
import {
    createOrder,
    verifyPayment,
    getPublicKey
} from '../controllers/paymentController.js';

const router = express.Router();

// Razorpay standard checkout routes
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/razorpay-key', getPublicKey);

// Route aliases in case nested under /api/payment or /api
router.post('/payment/create-order', createOrder);
router.post('/payment/verify-payment', verifyPayment);
router.get('/payment/razorpay-key', getPublicKey);

export default router;
