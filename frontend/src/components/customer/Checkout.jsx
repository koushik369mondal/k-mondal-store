import React, { useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import api from '../../utils/api';

const Checkout = ({ onSuccess }) => {
    const { cart, getTotal, clearCart } = useContext(CartContext);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerAddress: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: cart.map(item => ({
                    product: item.product?._id || item._id, // Handle both MongoDB and legacy formats
                    quantity: item.quantity
                }))
            };

            const { data } = await api.post('/orders', orderData);
            await clearCart(); // Wait for cart to be cleared in MongoDB
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
