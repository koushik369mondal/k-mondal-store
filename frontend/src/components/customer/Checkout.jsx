import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const Checkout = ({ onSuccess }) => {
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
        const deliveryCharges = itemsTotal < 100 ? 40 : 0;
        const codRiskFee = selectedPaymentMethod === 'cod' ? 20 : 0;
        const totalAmount = itemsTotal + deliveryCharges + codRiskFee;

        return {
            itemsTotal,
            deliveryCharges,
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
        <div className="card max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-charcoal border-b-2 border-secondary pb-4">Checkout</h2>

            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-secondary text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            1
                        </div>
                        <span className="ml-2 text-sm font-semibold text-charcoal">Address</span>
                    </div>
                    <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-secondary' : 'bg-gray-300'}`}></div>
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-secondary text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            2
                        </div>
                        <span className="ml-2 text-sm font-semibold text-charcoal">Payment</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* STEP 1: DELIVERY ADDRESS */}
                <div className={`rounded-2xl border-2 ${currentStep === 1 ? 'border-secondary' : 'border-cream-dark'}`}>
                    <div className="bg-cream p-4 rounded-t-xl border-b-2 border-cream-dark">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                                <span className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Delivery Address
                            </h3>
                            {lockedAddress && currentStep > 1 && (
                                <button
                                    onClick={handleChangeAddress}
                                    className="text-sm text-primary hover:text-primary-light font-semibold underline"
                                >
                                    Change
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-6">
                        {lockedAddress && currentStep > 1 ? (
                            // Show locked address
                            <div className="bg-green-50 border-2 border-green-500 p-4 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="text-green-600 text-2xl">✓</div>
                                    <div>
                                        <p className="font-bold text-charcoal mb-1">{lockedAddress.customerName}</p>
                                        <p className="text-sm text-gray-600 mb-1">{lockedAddress.customerPhone}</p>
                                        <p className="text-sm text-gray-700">{lockedAddress.customerAddress}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Address selection/entry
                            <>
                                {/* Saved Addresses Section */}
                                {user && savedAddresses.length > 0 && (
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-charcoal">Select Delivery Address</h4>
                                            <button
                                                type="button"
                                                onClick={() => setUseNewAddress(!useNewAddress)}
                                                className="text-sm text-primary hover:text-primary-light font-semibold underline"
                                            >
                                                {useNewAddress ? 'Use Saved Address' : '+ Add New Address'}
                                            </button>
                                        </div>

                                        {!useNewAddress && (
                                            <div className="space-y-3">
                                                {savedAddresses.map((address) => (
                                                    <div
                                                        key={address._id}
                                                        onClick={() => setSelectedAddressId(address._id)}
                                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedAddressId === address._id
                                                            ? 'border-secondary bg-cream/50'
                                                            : 'border-cream-dark bg-white hover:border-primary'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="radio"
                                                                name="savedAddress"
                                                                checked={selectedAddressId === address._id}
                                                                onChange={() => setSelectedAddressId(address._id)}
                                                                className="mt-1 w-5 h-5 accent-primary cursor-pointer"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-bold text-charcoal">{address.name}</span>
                                                                    {address.isDefault && (
                                                                        <span className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded">
                                                                            DEFAULT
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                                                                <p className="text-sm text-gray-700">
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
                                    <div className="space-y-4">
                                        {user && savedAddresses.length > 0 && (
                                            <h4 className="font-semibold text-charcoal">Enter New Address</h4>
                                        )}

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-charcoal">Full Name</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-charcoal">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="input-field"
                                                value={formData.customerPhone}
                                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-charcoal">Delivery Address</label>
                                            <textarea
                                                rows="3"
                                                className="input-field"
                                                value={formData.customerAddress}
                                                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                                                placeholder="Enter your complete delivery address"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleDeliverHere}
                                    className="btn-secondary w-full text-lg py-3 mt-6"
                                >
                                    Deliver Here
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* STEP 2: PAYMENT METHOD */}
                {currentStep >= 2 && (
                    <div className={`rounded-2xl border-2 ${currentStep === 2 ? 'border-secondary' : 'border-cream-dark'}`}>
                        <div className="bg-cream p-4 rounded-t-xl border-b-2 border-cream-dark">
                            <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                                <span className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Payment Method
                            </h3>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => handlePaymentSelect(method.id)}
                                        className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${selectedPaymentMethod === method.id
                                            ? 'border-secondary bg-cream/50 shadow-md'
                                            : 'border-cream-dark bg-white hover:border-primary hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={selectedPaymentMethod === method.id}
                                                onChange={() => handlePaymentSelect(method.id)}
                                                className="w-5 h-5 accent-primary cursor-pointer"
                                            />
                                            <div className="text-3xl">{method.icon}</div>
                                            <div className="flex-1">
                                                <p className="font-bold text-charcoal text-lg">{method.name}</p>
                                                <p className="text-sm text-gray-600">{method.description}</p>
                                            </div>
                                            {selectedPaymentMethod === method.id && (
                                                <div className="text-green-600 text-2xl">✓</div>
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
                    <div className="bg-cream border-2 border-secondary p-6 rounded-2xl shadow-premium">
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>Items Total:</span>
                                <span className="font-semibold">₹{calculateCharges().itemsTotal}</span>
                            </div>

                            {/* Delivery Charges */}
                            <div className="flex justify-between text-gray-700">
                                <span className="flex items-center gap-1">
                                    Delivery Charges:
                                    {calculateCharges().itemsTotal < 100 && (
                                        <span className="text-xs text-orange-600">(Below ₹100)</span>
                                    )}
                                </span>
                                {calculateCharges().deliveryCharges > 0 ? (
                                    <span className="font-semibold text-orange-600">₹{calculateCharges().deliveryCharges}</span>
                                ) : (
                                    <span className="font-semibold text-green-600">FREE</span>
                                )}
                            </div>

                            {/* COD Risk Fee */}
                            {selectedPaymentMethod === 'cod' && (
                                <div className="flex justify-between text-gray-700">
                                    <span className="flex items-center gap-1">
                                        COD Risk Fee:
                                        <span className="text-xs text-blue-600">(Cash on Delivery)</span>
                                    </span>
                                    <span className="font-semibold text-blue-600">₹{calculateCharges().codRiskFee}</span>
                                </div>
                            )}

                            {/* Total Amount */}
                            <div className="border-t-2 border-secondary pt-3 flex justify-between font-bold text-xl">
                                <span className="text-charcoal">Total Amount:</span>
                                <span className="text-secondary text-2xl">₹{calculateCharges().totalAmount}</span>
                            </div>

                            {/* Savings Message */}
                            {calculateCharges().itemsTotal >= 100 && (
                                <div className="bg-green-50 border border-green-400 rounded-lg p-2 text-center">
                                    <p className="text-green-700 text-sm font-semibold">
                                        🎉 You saved ₹40 on delivery charges!
                                    </p>
                                </div>
                            )}

                            {/* Minimum Order Message */}
                            {calculateCharges().itemsTotal < 100 && (
                                <div className="bg-orange-50 border border-orange-400 rounded-lg p-2 text-center">
                                    <p className="text-orange-700 text-sm font-semibold">
                                        💡 Add ₹{(100 - calculateCharges().itemsTotal).toFixed(2)} more to get FREE delivery!
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading || !selectedPaymentMethod}
                            className={`w-full text-lg py-4 mt-6 rounded-xl font-bold transition-all ${loading || !selectedPaymentMethod
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
                            <p className="text-sm text-gray-600 text-center mt-3">
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
