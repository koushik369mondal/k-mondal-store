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
        <div className="card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-dark">Checkout</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-dark">Full Name</label>
                    <input
                        type="text"
                        required
                        className="input-field"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-dark">Phone Number</label>
                    <input
                        type="tel"
                        required
                        className="input-field"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-dark">Delivery Address</label>
                    <textarea
                        required
                        rows="3"
                        className="input-field"
                        value={formData.customerAddress}
                        onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    />
                </div>

                <div className="bg-neutral-white p-4 rounded-lg border-2 border-primary">
                    <div className="flex justify-between font-semibold text-lg">
                        <span className="text-dark">Total Amount:</span>
                        <span className="text-primary">₹{getTotal()}</span>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
