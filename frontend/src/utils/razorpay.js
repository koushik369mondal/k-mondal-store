import api from './api';

/**
 * Ensures Razorpay Checkout script is loaded
 */
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/**
 * Initiates Razorpay Standard Checkout
 * 1. Creates order via backend POST /api/create-order
 * 2. Opens Razorpay payment modal
 * 3. On success, verifies signature via POST /api/verify-payment
 */
export const openRazorpayCheckout = async ({
    amountInPaise,
    currency = 'INR',
    receipt,
    notes = {},
    prefill = {},
    storeOrderId,
    onSuccess,
    onError,
    onDismiss
}) => {
    try {
        // Validate minimum amount (100 paise)
        if (!amountInPaise || Number(amountInPaise) < 100) {
            throw new Error('Minimum order amount for Razorpay is 100 paise (₹1).');
        }

        // 1. Ensure script is loaded
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !window.Razorpay) {
            throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        // 2. Fetch Razorpay key ID from environment variable
        const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!keyId) {
            throw new Error('Razorpay Key ID is missing. Please set VITE_RAZORPAY_KEY_ID in .env.');
        }

        // 3. Call backend to create Razorpay Order (STEP 1)
        const orderResponse = await api.post('/create-order', {
            amount: Math.round(Number(amountInPaise)),
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes
        });

        const orderData = orderResponse.data;
        const razorpayOrderId = orderData.order_id || orderData.id;

        if (!razorpayOrderId) {
            throw new Error('Backend failed to return a valid order_id.');
        }

        // 4. Configure Razorpay Standard Checkout options (STEP 2)
        const options = {
            key: keyId,
            amount: orderData.amount,
            currency: orderData.currency || currency,
            name: 'K Mondal Store',
            description: 'Order Payment',
            image: '/src/public/images/logo.png',
            order_id: razorpayOrderId,
            handler: async (response) => {
                try {
                    // 5. Send razorpay_payment_id, razorpay_order_id, razorpay_signature to verify endpoint (STEP 3)
                    const verifyResponse = await api.post('/verify-payment', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        storeOrderId
                    });

                    if (onSuccess) {
                        onSuccess(verifyResponse.data, response);
                    }
                } catch (verifyError) {
                    console.error('Payment verification failed:', verifyError);
                    const errMsg =
                        verifyError.response?.data?.message ||
                        verifyError.message ||
                        'Payment verification failed. Please contact support.';
                    if (onError) onError(errMsg);
                }
            },
            prefill: {
                name: prefill.name || '',
                email: prefill.email || '',
                contact: prefill.contact || ''
            },
            notes: {
                ...notes,
                storeOrderId: storeOrderId || ''
            },
            theme: {
                color: '#10b981' // Matching primary/emerald branding
            },
            modal: {
                ondismiss: () => {
                    console.warn('Razorpay modal dismissed by user');
                    if (onDismiss) {
                        onDismiss('Payment cancelled by user');
                    }
                }
            }
        };

        const rzp = new window.Razorpay(options);

        // Handle payment failure event
        rzp.on('payment.failed', (response) => {
            console.error('Payment failed event:', response.error);
            const failureReason =
                response.error?.description ||
                response.error?.reason ||
                'Payment transaction failed. Please try again.';
            if (onError) {
                onError(failureReason);
            }
        });

        rzp.open();
    } catch (err) {
        console.error('Razorpay checkout initialization error:', err);
        const errMsg = err.response?.data?.message || err.message || 'Failed to initiate Razorpay checkout';
        if (onError) onError(errMsg);
    }
};
