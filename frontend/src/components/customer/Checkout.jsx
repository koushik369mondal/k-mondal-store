import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const Checkout = ({ onSuccess, onBack }) => {
    const navigate = useNavigate();
    const { cart, getTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerAddress: ''
    });
    const [loading, setLoading] = useState(false);

    // Step-by-step flow state
    const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
    const [lockedAddress, setLockedAddress] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    // Payment methods configuration
    const paymentMethods = [
        {
            id: 'cod',
            name: 'Cash on Delivery',
            icon: '💵',
            description: 'Pay when you receive'
        },
        {
            id: 'upi',
            name: 'UPI',
            icon: '📱',
            description: 'GPay, PhonePe, Paytm',
            subOptions: ['Google Pay', 'PhonePe', 'Paytm', 'Other UPI']
        },
        {
            id: 'card',
            name: 'Debit/Credit Card',
            icon: '💳',
            description: 'Visa, Mastercard, RuPay'
        },
        {
            id: 'netbanking',
            name: 'Net Banking',
            icon: '🏦',
            description: 'All major banks'
        }
    ];

    useEffect(() => {
        if (user) {
            fetchSavedAddresses();
        }
    }, [user]);

    const fetchSavedAddresses = async () => {
        try {
            const { data } = await api.get('/auth/addresses');
            setSavedAddresses(data.addresses || []);

            // Auto-select default address if available
            const defaultAddr = data.addresses?.find(addr => addr.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleDeliverHere = () => {
        // Validate address selection
        if (!useNewAddress && !selectedAddressId) {
            alert('Please select a delivery address');
            return;
        }

        if (useNewAddress && (!formData.customerName || !formData.customerPhone || !formData.customerAddress)) {
            alert('Please fill in all address fields');
            return;
        }

        // Lock the selected address
        let addressToLock;
        if (!useNewAddress && selectedAddressId) {
            const selectedAddr = savedAddresses.find(addr => addr._id === selectedAddressId);
            addressToLock = {
                customerName: selectedAddr.name,
                customerPhone: selectedAddr.phone,
                customerAddress: `${selectedAddr.addressLine}, ${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}`
            };
        } else {
            addressToLock = formData;
        }

        setLockedAddress(addressToLock);
        setCurrentStep(2); // Move to payment step
    };

    const handlePaymentSelect = (methodId) => {
        setSelectedPaymentMethod(methodId);
    };

    // Calculate charges
    const calculateCharges = () => {
        const itemsTotal = getTotal();
        const deliveryCharges = itemsTotal < 300 ? 38 : 0;
        const handlingCharge = 7;
        const codRiskFee = selectedPaymentMethod === 'cod' ? 20 : 0;
        const totalAmount = itemsTotal + deliveryCharges + handlingCharge + codRiskFee;

        return {
            itemsTotal,
            deliveryCharges,
            handlingCharge,
            codRiskFee,
            totalAmount
        };
    };

    const handlePlaceOrder = async () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setLoading(true);

        try {
            const charges = calculateCharges();

            const orderData = {
                ...lockedAddress,
                paymentMethod: selectedPaymentMethod,
                deliveryCharges: charges.deliveryCharges,
                handlingCharge: charges.handlingCharge,
                codRiskFee: charges.codRiskFee,
                items: cart.map(item => ({
                    product: item.product?._id || item._id,
                    quantity: item.quantity
                }))
            };

            const { data } = await api.post('/orders', orderData);
            await clearCart();
            onSuccess(data.order);
        } catch (error) {
            alert('Error placing order: ' + error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeAddress = () => {
        setCurrentStep(1);
        setLockedAddress(null);
    };

    return (
        <div className="w-full px-2 pt-2 pb-4 md:max-w-4xl md:mx-auto md:px-6 md:py-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-2 mb-3 md:mb-6">
                {/* Back Button - All Screen Sizes */}
                <button
                    onClick={() => {
                        if (currentStep === 1) {
                            // Go back to cart view
                            if (onBack) {
                                onBack();
                            } else {
                                navigate('/cart');
                            }
                        } else {
                            setCurrentStep(currentStep - 1); // Go to previous step
                        }
                    }}
                    className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label="Go back"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-base md:text-3xl font-bold text-gray-800 border-b border-gray-200 pb-2 md:pb-4 flex-1">Checkout</h2>
            </div>

            {/* Progress Indicator */}
            <div className="mb-3 md:mb-6">
                <div className="flex items-center justify-center gap-2 md:gap-4">
                    <div className="flex items-center">
                        <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm ${currentStep >= 1 ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                            1
                        </div>
                        <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-gray-700">Address</span>
                    </div>
                    <div className={`h-0.5 w-10 md:w-16 ${currentStep >= 2 ? 'bg-secondary' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center">
                        <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm ${currentStep >= 2 ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                            2
                        </div>
                        <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-gray-700">Payment</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 md:space-y-4">
                {/* STEP 1: DELIVERY ADDRESS */}
                <div className={`rounded-lg border ${currentStep === 1 ? 'border-secondary' : 'border-gray-200'} bg-gray-50`}>
                    <div className="bg-white p-2.5 md:p-4 rounded-t-lg border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm md:text-xl font-semibold text-gray-800 flex items-center gap-1.5 md:gap-2">
                                <span className="bg-secondary text-white w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-sm font-semibold">1</span>
                                Delivery Address
                            </h3>
                            {lockedAddress && currentStep > 1 && (
                                <button
                                    onClick={handleChangeAddress}
                                    className="text-xs md:text-sm text-primary hover:text-primary-light font-medium underline"
                                >
                                    Change
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-3 md:p-6">
                        {lockedAddress && currentStep > 1 ? (
                            // Show locked address
                            <div className="bg-green-50 border border-green-400 p-2.5 md:p-4 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <div className="text-green-600 text-base md:text-xl">✓</div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm md:text-base mb-0.5 leading-tight">{lockedAddress.customerName}</p>
                                        <p className="text-xs md:text-sm text-gray-600 mb-0.5 leading-tight">{lockedAddress.customerPhone}</p>
                                        <p className="text-xs md:text-sm text-gray-700 leading-tight">{lockedAddress.customerAddress}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Address selection/entry
                            <>
                                {/* Saved Addresses Section */}
                                {user && savedAddresses.length > 0 && (
                                    <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-800 text-xs md:text-base">Select Delivery Address</h4>
                                            <button
                                                type="button"
                                                onClick={() => setUseNewAddress(!useNewAddress)}
                                                className="text-xs md:text-sm text-primary hover:text-primary-light font-medium underline"
                                            >
                                                {useNewAddress ? 'Use Saved Address' : '+ Add New Address'}
                                            </button>
                                        </div>

                                        {!useNewAddress && (
                                            <div className="space-y-2">
                                                {savedAddresses.map((address) => (
                                                    <div
                                                        key={address._id}
                                                        onClick={() => setSelectedAddressId(address._id)}
                                                        className={`cursor-pointer p-2.5 md:p-3 rounded-lg border transition-all ${selectedAddressId === address._id
                                                            ? 'border-secondary bg-secondary/5 shadow-sm'
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-2 md:gap-3">
                                                            <input
                                                                type="radio"
                                                                name="savedAddress"
                                                                checked={selectedAddressId === address._id}
                                                                onChange={() => setSelectedAddressId(address._id)}
                                                                className="mt-0.5 w-4 h-4 md:w-5 md:h-5 accent-primary cursor-pointer"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                                    <span className="font-medium text-gray-800 text-sm md:text-base">{address.name}</span>
                                                                    {address.isDefault && (
                                                                        <span className="bg-secondary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                                                            DEFAULT
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs md:text-sm text-gray-600 mb-0.5 leading-tight">{address.phone}</p>
                                                                <p className="text-xs md:text-sm text-gray-700 leading-tight">
                                                                    {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* New Address Form */}
                                {(useNewAddress || !user || savedAddresses.length === 0) && (
                                    <div className="space-y-2.5 md:space-y-3">
                                        {user && savedAddresses.length > 0 && (
                                            <h4 className="text-xs md:text-base font-medium text-gray-800">Enter New Address</h4>
                                        )}

                                        <div>
                                            <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5 text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                className="input-field text-sm md:text-base"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5 text-gray-700">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="input-field text-sm md:text-base"
                                                value={formData.customerPhone}
                                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5 text-gray-700">Delivery Address</label>
                                            <textarea
                                                rows="3"
                                                className="input-field text-sm md:text-base"
                                                value={formData.customerAddress}
                                                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                                                placeholder="Enter your complete delivery address"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleDeliverHere}
                                    className="btn-secondary w-full text-sm md:text-lg py-2.5 md:py-3 mt-3 md:mt-4"
                                >
                                    Deliver Here
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* STEP 2: PAYMENT METHOD */}
                {currentStep >= 2 && (
                    <div className={`rounded-lg border ${currentStep === 2 ? 'border-secondary' : 'border-gray-200'} bg-gray-50`}>
                        <div className="bg-white p-2.5 md:p-4 rounded-t-lg border-b border-gray-200">
                            <h3 className="text-sm md:text-xl font-semibold text-gray-800 flex items-center gap-1.5 md:gap-2">
                                <span className="bg-secondary text-white w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-sm font-semibold">2</span>
                                Payment Method
                            </h3>
                        </div>

                        <div className="p-3 md:p-6">
                            <div className="space-y-2">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => handlePaymentSelect(method.id)}
                                        className={`cursor-pointer p-2.5 md:p-4 rounded-lg border transition-all ${selectedPaymentMethod === method.id
                                            ? 'border-secondary bg-secondary/5 shadow-sm'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5 md:gap-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={selectedPaymentMethod === method.id}
                                                onChange={() => handlePaymentSelect(method.id)}
                                                className="w-4 h-4 md:w-5 md:h-5 accent-primary cursor-pointer"
                                            />
                                            <div className="text-xl md:text-2xl">{method.icon}</div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm md:text-base leading-tight">{method.name}</p>
                                                <p className="text-xs md:text-sm text-gray-600 leading-tight">{method.description}</p>
                                            </div>
                                            {selectedPaymentMethod === method.id && (
                                                <div className="text-green-600 text-lg md:text-xl">✓</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Summary & Place Order */}
                {currentStep >= 2 && (
                    <div className="bg-gray-50 border border-gray-200 p-3 md:p-5 rounded-lg shadow-sm">
                        <div className="space-y-2 md:space-y-2.5">
                            <div className="flex justify-between text-gray-700 text-sm md:text-base">
                                <span>Items Total:</span>
                                <span className="font-semibold">₹{calculateCharges().itemsTotal}</span>
                            </div>

                            {/* Delivery Charges */}
                            <div className="flex justify-between text-gray-700 text-sm md:text-base">
                                <span className="flex items-center gap-1">
                                    Delivery Charges:
                                    {calculateCharges().itemsTotal < 300 && (
                                        <span className="text-[10px] md:text-xs text-orange-600">(Below ₹300)</span>
                                    )}
                                </span>
                                {calculateCharges().deliveryCharges > 0 ? (
                                    <span className="font-semibold text-orange-600">₹{calculateCharges().deliveryCharges}</span>
                                ) : (
                                    <span className="font-semibold text-green-600">FREE</span>
                                )}
                            </div>

                            {/* Handling Charge */}
                            <div className="flex justify-between text-gray-700 text-sm md:text-base">
                                <span>Handling Charge:</span>
                                <span className="font-semibold">₹{calculateCharges().handlingCharge}</span>
                            </div>

                            {/* COD Risk Fee */}
                            {selectedPaymentMethod === 'cod' && (
                                <div className="flex justify-between text-gray-700 text-sm md:text-base">
                                    <span className="flex items-center gap-1">
                                        COD Risk Fee:
                                        <span className="text-[10px] md:text-xs text-blue-600">(Cash on Delivery)</span>
                                    </span>
                                    <span className="font-semibold text-blue-600">₹{calculateCharges().codRiskFee}</span>
                                </div>
                            )}

                            {/* Total Amount */}
                            <div className="border-t border-gray-300 pt-2 md:pt-2.5 flex justify-between font-semibold text-base md:text-xl">
                                <span className="text-gray-800">Total Amount:</span>
                                <span className="text-secondary text-lg md:text-2xl font-bold">₹{calculateCharges().totalAmount}</span>
                            </div>

                            {/* Savings Message */}
                            {calculateCharges().itemsTotal >= 300 && (
                                <div className="bg-green-50 border border-green-300 rounded-lg p-2 text-center">
                                    <p className="text-green-700 text-xs md:text-sm font-medium">
                                        🎉 You saved ₹38 on delivery charges!
                                    </p>
                                </div>
                            )}

                            {/* Minimum Order Message */}
                            {calculateCharges().itemsTotal < 300 && (
                                <div className="bg-orange-50 border border-orange-300 rounded-lg p-2 text-center">
                                    <p className="text-orange-700 text-xs md:text-sm font-medium">
                                        💡 Add ₹{(300 - calculateCharges().itemsTotal).toFixed(2)} more to get FREE delivery!
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading || !selectedPaymentMethod}
                            className={`w-full text-sm md:text-lg py-3 md:py-4 mt-3 md:mt-5 rounded-lg font-semibold transition-all ${loading || !selectedPaymentMethod
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'btn-secondary hover:scale-105'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                '🔒 Place Order'
                            )}
                        </button>

                        {selectedPaymentMethod === 'cod' && (
                            <p className="text-xs md:text-sm text-gray-600 text-center mt-2">
                                💡 Pay ₹{calculateCharges().totalAmount} when you receive your order
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
