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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let orderAddress = formData;

            // If using saved address, format it properly
            if (!useNewAddress && selectedAddressId) {
                const selectedAddr = savedAddresses.find(addr => addr._id === selectedAddressId);
                if (selectedAddr) {
                    orderAddress = {
                        customerName: selectedAddr.name,
                        customerPhone: selectedAddr.phone,
                        customerAddress: `${selectedAddr.addressLine}, ${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}`
                    };
                }
            }

            const orderData = {
                ...orderAddress,
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

    return (
        <div className="card max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-charcoal border-b-2 border-secondary pb-4">Checkout</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Saved Addresses Section */}
                {user && savedAddresses.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-charcoal">Select Delivery Address</h3>
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
                            <h3 className="text-xl font-bold text-charcoal">Enter New Address</h3>
                        )}

                        <div>
                            <label className="block text-base font-semibold mb-2 text-charcoal">Full Name</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-base font-semibold mb-2 text-charcoal">Phone Number</label>
                            <input
                                type="tel"
                                required
                                className="input-field"
                                value={formData.customerPhone}
                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-base font-semibold mb-2 text-charcoal">Delivery Address</label>
                            <textarea
                                required
                                rows="4"
                                className="input-field"
                                value={formData.customerAddress}
                                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                                placeholder="Enter your complete delivery address"
                            />
                        </div>
                    </div>
                )}

                <div className="bg-cream border-2 border-secondary p-6 rounded-2xl shadow-premium">
                    <div className="flex justify-between font-bold text-xl">
                        <span className="text-charcoal">Total Amount:</span>
                        <span className="text-secondary text-2xl">₹{getTotal()}</span>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn-secondary w-full text-lg py-4">
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
