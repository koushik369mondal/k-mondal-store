import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

/**
 * Initialize Razorpay instance with credentials from environment variables
 */
const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        const err = new Error('Razorpay API keys are not configured');
        err.statusCode = 401;
        throw err;
    }

    return new Razorpay({
        key_id,
        key_secret
    });
};

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order
 * Request: { amount (paise), currency, receipt }
 * Return: { order_id, amount, currency }
 * Minimum amount: 100 paise
 */
export const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt, notes } = req.body;

        // Validation: Validate amount >= 100 paise
        if (amount === undefined || amount === null || isNaN(amount) || Number(amount) < 100) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount. Minimum amount is 100 paise (₹1).'
            });
        }

        const razorpay = getRazorpayInstance();

        const options = {
            amount: Math.round(Number(amount)),
            currency: (currency || 'INR').toUpperCase(),
            receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            notes: notes || {}
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order_id: razorpayOrder.id,
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);

        // Handle auth failures (return 401)
        if (error.statusCode === 401 || error.error?.code === 'AUTHENTICATION_FAILED' || (error.message && error.message.includes('not configured'))) {
            return res.status(401).json({
                success: false,
                message: 'Razorpay authentication failed. Please verify API keys.'
            });
        }

        // Handle other Razorpay API errors (return 500)
        return res.status(500).json({
            success: false,
            message: error.error?.description || error.message || 'Failed to create Razorpay order'
        });
    }
};

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 * Return success only if signatures match
 */
export const verifyPayment = async (req, res) => {
    try {
        const {
            order_id,
            razorpay_order_id,
            payment_id,
            razorpay_payment_id,
            signature,
            razorpay_signature,
            storeOrderId
        } = req.body;

        const finalOrderId = razorpay_order_id || order_id;
        const finalPaymentId = razorpay_payment_id || payment_id;
        const finalSignature = razorpay_signature || signature;

        // Validation: Missing fields -> return 400
        if (!finalOrderId || !finalPaymentId || !finalSignature) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment verification fields (order_id, payment_id, signature)'
            });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return res.status(500).json({
                success: false,
                message: 'Razorpay secret key not found on server'
            });
        }

        // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
        const generatedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${finalOrderId}|${finalPaymentId}`)
            .digest('hex');

        // Compare generated signature with razorpay_signature
        const isValidSignature =
            generatedSignature.length === finalSignature.length &&
            crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(finalSignature));

        // Signature mismatch: return 400, do NOT mark as paid
        if (!isValidSignature) {
            if (storeOrderId) {
                await Order.findByIdAndUpdate(storeOrderId, {
                    paymentStatus: 'failed'
                }).catch(err => console.error('Error marking order failed:', err));
            }

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: Signature mismatch'
            });
        }

        // Return success only if signatures match
        let updatedOrder = null;
        if (storeOrderId) {
            updatedOrder = await Order.findByIdAndUpdate(
                storeOrderId,
                {
                    paymentStatus: 'paid',
                    status: 'confirmed',
                    razorpayOrderId: finalOrderId,
                    razorpayPaymentId: finalPaymentId,
                    razorpaySignature: finalSignature
                },
                { new: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order_id: finalOrderId,
            payment_id: finalPaymentId,
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error during payment verification'
        });
    }
};

/**
 * Optional config endpoint to get public key ID
 */
export const getPublicKey = (req, res) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
        return res.status(401).json({
            success: false,
            message: 'Razorpay Key ID is not configured'
        });
    }
    return res.status(200).json({
        success: true,
        key_id: keyId
    });
};
