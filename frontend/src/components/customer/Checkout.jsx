import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { openRazorpayCheckout } from '../../utils/razorpay';
import {
    MapPin,
    Navigation,
    Truck,
    Clock,
    ShieldCheck,
    Check,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    ArrowLeft,
    Sparkles,
    ShoppingBag
} from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Checkout = ({ onSuccess, onBack }) => {
    const navigate = useNavigate();
    const { cart, getTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    // Address & User states
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        deliveryInstructions: ''
    });

    // Delivery Process States
    const [selectedSlot, setSelectedSlot] = useState('express'); // 'express' | 'evening'
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [showItemsPreview, setShowItemsPreview] = useState(false);

    // Flow & Payment states
    const [currentStep, setCurrentStep] = useState(1); // 1: Delivery Address, 2: Payment & Review
    const [lockedAddress, setLockedAddress] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay'); // Razorpay is pre-selected
    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    // Cleaned-up Payment Methods (Only 2 clear, distinct options)
    const paymentMethods = [
        {
            id: 'razorpay',
            name: 'Pay Online (Razorpay)',
            icon: '⚡',
            description: 'UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, NetBanking, Wallets',
            badge: 'Fastest & Recommended',
            savings: 'Save ₹20 COD Fee',
            perk: 'Zero contact • Priority order dispatch'
        },
        {
            id: 'cod',
            name: 'Cash on Delivery (COD)',
            icon: '💵',
            description: 'Pay in cash or scan delivery QR at your doorstep',
            badge: '+₹20 Handling Fee',
            perk: 'Keep exact cash change ready upon arrival'
        }
    ];

    // Delivery Slots configuration
    const deliverySlots = [
        {
            id: 'express',
            title: 'Express Kirana Delivery',
            time: '30–45 mins',
            badge: 'Instant',
            desc: 'Direct from Santimore store'
        },
        {
            id: 'evening',
            title: 'Evening Slot',
            time: '5:00 PM – 8:00 PM',
            badge: 'Scheduled',
            desc: 'Delivered before dinner'
        }
    ];

    // Auto-prefill user name and fetch saved addresses
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: prev.customerName || user.name || '',
                customerPhone: prev.customerPhone || user.phone || ''
            }));
            fetchSavedAddresses();
        }
    }, [user]);

    const fetchSavedAddresses = async () => {
        try {
            const { data } = await api.get('/auth/addresses');
            const addresses = data.addresses || [];
            setSavedAddresses(addresses);

            const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    // One-click GPS Auto-detect location
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        setLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    if (MAPBOX_TOKEN) {
                        const response = await fetch(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
                        );
                        const data = await response.json();
                        if (data.features && data.features.length > 0) {
                            const detectedAddress = data.features[0].place_name;
                            setFormData(prev => ({
                                ...prev,
                                customerAddress: detectedAddress
                            }));
                            setUseNewAddress(true);
                            setLocating(false);
                            return;
                        }
                    }
                    // Fallback if Mapbox geocoding unavailable
                    setFormData(prev => ({
                        ...prev,
                        customerAddress: `Location: (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) Banarhat, WB`
                    }));
                } catch (err) {
                    console.error('Geocoding error:', err);
                    setFormData(prev => ({
                        ...prev,
                        customerAddress: `GPS Coords: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Banarhat)`
                    }));
                } finally {
                    setLocating(false);
                    setUseNewAddress(true);
                }
            },
            (error) => {
                setLocating(false);
                let msg = 'Could not retrieve your location.';
                if (error.code === error.PERMISSION_DENIED) {
                    msg = 'Location permission denied. Please enter address manually.';
                }
                setLocationError(msg);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Append quick instruction chip
    const handleQuickInstruction = (chip) => {
        setFormData(prev => {
            const current = prev.deliveryInstructions.trim();
            if (current.includes(chip)) return prev;
            return {
                ...prev,
                deliveryInstructions: current ? `${current}, ${chip}` : chip
            };
        });
    };

    const handleDeliverHere = () => {
        if (!useNewAddress && !selectedAddressId) {
            alert('Please select a delivery address or enter a new one');
            return;
        }

        if (useNewAddress && (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.customerAddress.trim())) {
            alert('Please fill in Name, Phone, and Delivery Address');
            return;
        }

        let addressToLock;
        if (!useNewAddress && selectedAddressId) {
            const selectedAddr = savedAddresses.find(addr => addr._id === selectedAddressId);
            addressToLock = {
                customerName: selectedAddr.name,
                customerPhone: selectedAddr.phone,
                customerAddress: `${selectedAddr.addressLine}, ${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}`,
                deliveryInstructions: formData.deliveryInstructions
            };
        } else {
            addressToLock = {
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                customerAddress: formData.customerAddress,
                deliveryInstructions: formData.deliveryInstructions
            };
        }

        setLockedAddress(addressToLock);
        setCurrentStep(2); // Move to Payment & Review
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate charges
    const calculateCharges = () => {
        const itemsTotal = getTotal();
        const deliveryCharges = itemsTotal < 300 ? 38 : 0;
        const handlingCharge = 7;
        const codRiskFee = selectedPaymentMethod === 'cod' ? 20 : 0;

        // Calculate refrigeration charges for cold drinks (₹5 per bottle)
        const refrigerationCharges = cart.reduce((total, item) => {
            const product = item.product || item;
            if (product.category === 'Soft Drinks' || product.category === 'Juices & Cold Drinks') {
                return total + (5 * item.quantity);
            }
            return total;
        }, 0);

        const totalAmount = itemsTotal + deliveryCharges + handlingCharge + codRiskFee + refrigerationCharges;

        return {
            itemsTotal,
            deliveryCharges,
            handlingCharge,
            codRiskFee,
            refrigerationCharges,
            totalAmount
        };
    };

    const handlePlaceOrder = async () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setPaymentError(null);
        setLoading(true);

        try {
            const charges = calculateCharges();

            const orderPayload = {
                customerName: lockedAddress.customerName,
                customerPhone: lockedAddress.customerPhone,
                customerAddress: lockedAddress.customerAddress,
                deliverySlot: selectedSlot === 'express' ? 'Express Delivery (30-45 mins)' : 'Evening Delivery (5 PM - 8 PM)',
                deliveryInstructions: lockedAddress.deliveryInstructions || '',
                paymentMethod: selectedPaymentMethod,
                deliveryCharges: charges.deliveryCharges,
                handlingCharge: charges.handlingCharge,
                codRiskFee: charges.codRiskFee,
                refrigerationCharges: charges.refrigerationCharges,
                items: cart.map(item => ({
                    product: item.product?._id || item._id,
                    quantity: item.quantity,
                    sellingPrice: item.sellingPrice || item.price
                }))
            };

            // 1. CASH ON DELIVERY (COD) FLOW
            if (selectedPaymentMethod === 'cod') {
                const { data } = await api.post('/orders', {
                    ...orderPayload,
                    paymentStatus: 'pending'
                });
                await clearCart();
                setLoading(false);
                onSuccess(data.order);
                return;
            }

            // 2. ONLINE PAYMENT VIA RAZORPAY STANDARD CHECKOUT
            const amountInPaise = Math.round(charges.totalAmount * 100);

            if (amountInPaise < 100) {
                setLoading(false);
                setPaymentError('Minimum order amount for online payment is ₹1.');
                return;
            }

            await openRazorpayCheckout({
                amountInPaise,
                currency: 'INR',
                receipt: `rcpt_${Date.now()}`,
                notes: {
                    customerPhone: lockedAddress.customerPhone,
                    deliverySlot: orderPayload.deliverySlot
                },
                prefill: {
                    name: lockedAddress.customerName || '',
                    contact: lockedAddress.customerPhone || '',
                    email: user?.email || ''
                },
                onSuccess: async (verifyData, rzpData) => {
                    try {
                        // After signature is verified by backend, create confirmed order
                        const { data } = await api.post('/orders', {
                            ...orderPayload,
                            paymentStatus: 'paid',
                            razorpayOrderId: rzpData.razorpay_order_id,
                            razorpayPaymentId: rzpData.razorpay_payment_id,
                            razorpaySignature: rzpData.razorpay_signature
                        });
                        await clearCart();
                        onSuccess(data.order);
                    } catch (saveError) {
                        console.error('Error saving order after payment verification:', saveError);
                        setPaymentError(
                            `Payment verified (${rzpData.razorpay_payment_id}), but order could not be saved. Please contact support.`
                        );
                    } finally {
                        setLoading(false);
                    }
                },
                onError: (errorMsg) => {
                    setLoading(false);
                    setPaymentError(typeof errorMsg === 'string' ? errorMsg : 'Payment failed. Please try again.');
                },
                onDismiss: (reason) => {
                    setLoading(false);
                    setPaymentError(reason || 'Payment cancelled. You can retry whenever you are ready.');
                }
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Error processing checkout. Please try again.';
            console.error('Order placement error:', error);
            setPaymentError(errorMessage);
            setLoading(false);
        }
    };

    const handleChangeAddress = () => {
        setCurrentStep(1);
        setPaymentError(null);
    };

    const charges = calculateCharges();

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
            {/* Header with Navigation */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => {
                        if (currentStep === 1) {
                            if (onBack) onBack();
                            else navigate('/cart');
                        } else {
                            setCurrentStep(1);
                        }
                    }}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-muted/60 hover:bg-muted text-foreground transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="font-montserrat text-xl sm:text-2xl font-bold text-foreground">
                        {currentStep === 1 ? 'Delivery Details' : 'Payment & Review'}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        K Mondal Store • Santimore, Banarhat
                    </p>
                </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="mb-6 bg-card-fill border border-card-edge rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                            currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                            {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-semibold text-foreground">Delivery</p>
                            <p className="text-[10px] text-muted-foreground">Address & Time</p>
                        </div>
                    </div>

                    <div className={`flex-1 h-0.5 mx-3 sm:mx-4 transition-colors ${
                        currentStep >= 2 ? 'bg-emerald-600' : 'bg-muted'
                    }`} />

                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                            currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                            2
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-semibold text-foreground">Payment</p>
                            <p className="text-[10px] text-muted-foreground">Online or COD</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-7 space-y-5">
                    {/* STEP 1: DELIVERY ADDRESS & TIME */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            {/* Fast Delivery Promise Banner */}
                            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                                <Truck className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <div className="text-xs leading-relaxed">
                                    <span className="font-semibold">Instant Local Delivery: </span>
                                    Orders packed with care by Kamakhya Mandal and delivered within 30–45 mins in Banarhat.
                                </div>
                            </div>

                            {/* Delivery Slot Selection */}
                            <div className="bg-card-fill border border-card-edge rounded-xl p-4 sm:p-5 space-y-3">
                                <label className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                    Choose Delivery Slot
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {deliverySlots.map(slot => (
                                        <div
                                            key={slot.id}
                                            onClick={() => setSelectedSlot(slot.id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                selectedSlot === slot.id
                                                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                                                    : 'border-card-edge hover:border-card-edge-hover bg-background/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-foreground">{slot.title}</span>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                                                    {slot.badge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{slot.time}</p>
                                            <p className="text-[11px] text-muted-foreground">{slot.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Saved Addresses List (if available) */}
                            {user && savedAddresses.length > 0 && !useNewAddress && (
                                <div className="bg-card-fill border border-card-edge rounded-xl p-4 sm:p-5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            Select Saved Address
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => setUseNewAddress(true)}
                                            className="text-xs font-medium text-emerald-600 hover:underline"
                                        >
                                            + Add New Address
                                        </button>
                                    </div>

                                    <div className="space-y-2.5">
                                        {savedAddresses.map(address => (
                                            <div
                                                key={address._id}
                                                onClick={() => setSelectedAddressId(address._id)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                                                    selectedAddressId === address._id
                                                        ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                                                        : 'border-card-edge hover:border-card-edge-hover bg-background/40'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="selectedAddress"
                                                    checked={selectedAddressId === address._id}
                                                    onChange={() => setSelectedAddressId(address._id)}
                                                    className="mt-1 accent-emerald-600 cursor-pointer"
                                                />
                                                <div className="flex-1 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-foreground">{address.name}</span>
                                                        {address.isDefault && (
                                                            <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground mt-0.5">{address.phone}</p>
                                                    <p className="text-foreground/90 mt-0.5 leading-snug">
                                                        {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Address Form (or manual entry) */}
                            {(useNewAddress || !user || savedAddresses.length === 0) && (
                                <div className="bg-card-fill border border-card-edge rounded-xl p-4 sm:p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            Delivery Address
                                        </h2>
                                        {user && savedAddresses.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setUseNewAddress(false)}
                                                className="text-xs font-medium text-emerald-600 hover:underline"
                                            >
                                                Back to Saved Addresses
                                            </button>
                                        )}
                                    </div>

                                    {/* Auto-detect Location Button */}
                                    <button
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        disabled={locating}
                                        className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all disabled:opacity-50"
                                    >
                                        <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                                        {locating ? 'Detecting current GPS location...' : '📍 Use Current Location'}
                                    </button>

                                    {locationError && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {locationError}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.customerName}
                                                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                                placeholder="e.g. Rahul Sharma"
                                                className="input-field text-xs sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.customerPhone}
                                                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                                placeholder="10-digit mobile number"
                                                className="input-field text-xs sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                                            Delivery Address (House/Shop, Street, Landmark, Banarhat) *
                                        </label>
                                        <textarea
                                            rows="2"
                                            value={formData.customerAddress}
                                            onChange={e => setFormData({ ...formData, customerAddress: e.target.value })}
                                            placeholder="Enter complete delivery address with landmark"
                                            className="input-field text-xs sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Delivery Instructions & Landmark */}
                            <div className="bg-card-fill border border-card-edge rounded-xl p-4 sm:p-5 space-y-2.5">
                                <label className="text-xs sm:text-sm font-semibold text-foreground block">
                                    Delivery Instructions / Landmark (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.deliveryInstructions}
                                    onChange={e => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                                    placeholder="e.g. Opposite High School / Green gate / Call before arriving"
                                    className="input-field text-xs sm:text-sm"
                                />
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {['Leave at door', 'Call upon arrival', 'Near Santimore', 'Ring doorbell'].map(chip => (
                                        <button
                                            key={chip}
                                            type="button"
                                            onClick={() => handleQuickInstruction(chip)}
                                            className="text-[11px] font-medium px-2 py-1 rounded-md bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            + {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Proceed to Payment Button */}
                            <button
                                type="button"
                                onClick={handleDeliverHere}
                                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-md transition-all active:scale-[0.99]"
                            >
                                <span>Proceed to Payment</span>
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: PAYMENT METHOD & REVIEW */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            {/* Confirmed Delivery Address Card */}
                            <div className="bg-card-fill border border-card-edge rounded-xl p-4 flex items-start justify-between gap-3 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs sm:text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-foreground">{lockedAddress?.customerName}</span>
                                            <span className="text-muted-foreground">• {lockedAddress?.customerPhone}</span>
                                        </div>
                                        <p className="text-muted-foreground mt-0.5 leading-snug">
                                            {lockedAddress?.customerAddress}
                                        </p>
                                        {lockedAddress?.deliveryInstructions && (
                                            <p className="text-emerald-600 dark:text-emerald-400 text-[11px] mt-1 font-medium">
                                                Note: {lockedAddress.deliveryInstructions}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                                            <Clock className="w-3 h-3 text-emerald-500" />
                                            {selectedSlot === 'express' ? 'Express (30–45 mins)' : 'Evening Slot (5–8 PM)'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleChangeAddress}
                                    className="text-xs font-semibold text-emerald-600 hover:underline flex-shrink-0"
                                >
                                    Change
                                </button>
                            </div>

                            {/* Streamlined Payment Options */}
                            <div className="bg-card-fill border border-card-edge rounded-xl p-4 sm:p-5 space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm sm:text-base font-bold text-foreground">
                                        Select Payment Method
                                    </h2>
                                    <span className="text-xs text-muted-foreground">
                                        2 options available
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {paymentMethods.map(method => {
                                        const isSelected = selectedPaymentMethod === method.id;
                                        return (
                                            <div
                                                key={method.id}
                                                onClick={() => {
                                                    setSelectedPaymentMethod(method.id);
                                                    setPaymentError(null);
                                                }}
                                                className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500 shadow-sm'
                                                        : 'border-card-edge hover:border-card-edge-hover bg-background/50'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            setSelectedPaymentMethod(method.id);
                                                            setPaymentError(null);
                                                        }}
                                                        className="mt-1 accent-emerald-600 w-4 h-4 cursor-pointer"
                                                    />
                                                    <div className="text-2xl">{method.icon}</div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-sm sm:text-base text-foreground">
                                                                {method.name}
                                                            </span>
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                method.id === 'razorpay'
                                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                            }`}>
                                                                {method.badge}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                                            {method.description}
                                                        </p>
                                                        <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" />
                                                            {method.perk}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Error Alert if Payment Failed or Cancelled */}
                            {paymentError && (
                                <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium">{paymentError}</p>
                                        <p className="text-[11px] text-red-500/80 mt-0.5">
                                            You can retry now or choose another payment method.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Final Order Action Button */}
                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.99] ${
                                    selectedPaymentMethod === 'razorpay'
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-neutral-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {selectedPaymentMethod === 'razorpay' ? 'Opening Razorpay...' : 'Placing Order...'}
                                    </span>
                                ) : selectedPaymentMethod === 'razorpay' ? (
                                    <>
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>Pay ₹{charges.totalAmount} Securely with Razorpay</span>
                                    </>
                                ) : (
                                    <span>Confirm Cash on Delivery Order (₹{charges.totalAmount})</span>
                                )}
                            </button>

                            {/* Payment Security Footer */}
                            <div className="text-center text-xs text-muted-foreground space-y-1">
                                {selectedPaymentMethod === 'razorpay' ? (
                                    <p className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>256-Bit Encrypted Payment • Powered by Razorpay Standard Checkout</span>
                                    </p>
                                ) : (
                                    <p className="text-amber-600 dark:text-amber-400">
                                        💡 Keep exact cash of ₹{charges.totalAmount} ready upon delivery
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary & Breakdown (Right Column) */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Collapsible Items Preview */}
                    <div className="bg-card-fill border border-card-edge rounded-xl p-4 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setShowItemsPreview(!showItemsPreview)}
                            className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-foreground"
                        >
                            <span className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                                Cart Items ({cart.length})
                            </span>
                            {showItemsPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showItemsPreview && (
                            <div className="mt-3 divide-y divide-card-edge max-h-60 overflow-y-auto pr-1">
                                {cart.map(item => {
                                    const product = item.product || item;
                                    const price = item.sellingPrice || item.price || product.sellingPrice || product.price || 0;
                                    return (
                                        <div key={item._id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-9 h-9 rounded-md bg-muted/30 p-1 flex items-center justify-center flex-shrink-0">
                                                    <img
                                                        src={product.image?.url || product.image || '/src/public/images/logo.png'}
                                                        alt={product.title}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground truncate">{product.title}</p>
                                                    <p className="text-muted-foreground text-[11px]">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-semibold text-foreground flex-shrink-0">
                                                ₹{price * item.quantity}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Price Breakdown Card */}
                    <div className="bg-card-fill border border-card-edge rounded-xl p-4 sm:p-5 shadow-sm space-y-3.5">
                        <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-wide uppercase border-b border-card-edge pb-2.5">
                            Bill Details
                        </h3>

                        <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Items Total</span>
                                <span className="font-medium text-foreground">₹{charges.itemsTotal}</span>
                            </div>

                            {/* Delivery Charges */}
                            <div className="flex justify-between text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    Delivery Charges
                                    {charges.itemsTotal < 300 && (
                                        <span className="text-[10px] text-amber-600">(Under ₹300)</span>
                                    )}
                                </span>
                                {charges.deliveryCharges > 0 ? (
                                    <span className="font-medium text-amber-600">₹{charges.deliveryCharges}</span>
                                ) : (
                                    <span className="font-semibold text-emerald-600">FREE</span>
                                )}
                            </div>

                            {/* Handling Charge */}
                            <div className="flex justify-between text-muted-foreground">
                                <span>Handling Fee</span>
                                <span className="font-medium text-foreground">₹{charges.handlingCharge}</span>
                            </div>

                            {/* Refrigeration Charges */}
                            {charges.refrigerationCharges > 0 && (
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Refrigeration Fee (Cold drinks)</span>
                                    <span className="font-medium text-blue-600">₹{charges.refrigerationCharges}</span>
                                </div>
                            )}

                            {/* COD Risk Fee */}
                            {selectedPaymentMethod === 'cod' && (
                                <div className="flex justify-between text-amber-600 font-medium">
                                    <span>COD Handling Fee</span>
                                    <span>₹{charges.codRiskFee}</span>
                                </div>
                            )}

                            {/* Online Payment Benefit Highlight */}
                            {selectedPaymentMethod === 'razorpay' && (
                                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
                                    <span className="font-medium flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        COD Risk Fee Waived
                                    </span>
                                    <span className="font-bold">Saved ₹20</span>
                                </div>
                            )}

                            {/* Free delivery encouragement */}
                            {charges.itemsTotal < 300 && (
                                <div className="p-2.5 rounded-lg bg-muted/40 border border-card-edge text-[11px] text-muted-foreground">
                                    Add <strong className="text-foreground">₹{(300 - charges.itemsTotal).toFixed(0)}</strong> more to get <strong>FREE delivery</strong>
                                </div>
                            )}

                            {/* Total Amount */}
                            <div className="pt-3 border-t border-card-edge flex justify-between items-baseline">
                                <div>
                                    <span className="font-bold text-sm sm:text-base text-foreground">Total to Pay</span>
                                    <p className="text-[10px] text-muted-foreground">Includes all taxes and fees</p>
                                </div>
                                <span className="font-montserrat text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    ₹{charges.totalAmount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
