import React, { useState } from 'react';
import { openRazorpayCheckout } from '../../utils/razorpay';

/**
 * Reusable Razorpay Checkout Button component
 */
const RazorpayButton = ({
    amount, // In Rupees or paise
    isPaise = false,
    currency = 'INR',
    receipt,
    notes = {},
    prefill = {},
    storeOrderId,
    onSuccess,
    onError,
    buttonText,
    className = '',
    disabled = false
}) => {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const amountInPaise = isPaise ? Number(amount) : Math.round(Number(amount) * 100);

    const handlePayment = async () => {
        setLoading(true);
        setStatusMessage(null);

        try {
            await openRazorpayCheckout({
                amountInPaise,
                currency,
                receipt,
                notes,
                prefill,
                storeOrderId,
                onSuccess: (verifyData, rzpData) => {
                    setLoading(false);
                    setStatusMessage({ type: 'success', text: 'Payment successful!' });
                    if (onSuccess) onSuccess(verifyData, rzpData);
                },
                onError: (errorMsg) => {
                    setLoading(false);
                    setStatusMessage({ type: 'error', text: errorMsg });
                    if (onError) onError(errorMsg);
                },
                onDismiss: () => {
                    setLoading(false);
                    setStatusMessage({ type: 'info', text: 'Payment cancelled' });
                }
            });
        } catch (err) {
            setLoading(false);
            const msg = err.message || 'Payment initiation failed';
            setStatusMessage({ type: 'error', text: msg });
            if (onError) onError(msg);
        }
    };

    return (
        <div className="w-full space-y-2">
            <button
                type="button"
                onClick={handlePayment}
                disabled={disabled || loading}
                className={className || `btn-asym inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 font-semibold text-white shadow-md transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50`}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Opening Razorpay...
                    </span>
                ) : (
                    <>
                        <span className="font-bold tracking-wide">
                            {buttonText || `Pay ₹${isPaise ? (amount / 100).toFixed(2) : amount} with Razorpay`}
                        </span>
                        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </>
                )}
            </button>

            {statusMessage && (
                <p className={`text-xs text-center font-medium ${
                    statusMessage.type === 'error'
                        ? 'text-red-500'
                        : statusMessage.type === 'success'
                        ? 'text-emerald-500'
                        : 'text-muted-foreground'
                }`}>
                    {statusMessage.text}
                </p>
            )}
        </div>
    );
};

export default RazorpayButton;
