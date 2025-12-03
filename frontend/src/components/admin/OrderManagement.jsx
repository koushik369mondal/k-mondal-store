import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            alert('Error updating order status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
            delivered: 'bg-green-100 text-green-800 border-green-300',
            cancelled: 'bg-red-100 text-red-800 border-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    if (loading) return <div className="text-center py-12 text-xl font-semibold text-charcoal">Loading...</div>;

    return (
        <div className="card border border-cream-dark">
            <h2 className="text-3xl font-bold mb-8 text-charcoal border-b-2 border-secondary pb-4">Order Management</h2>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order._id} className="border-2 border-cream-dark rounded-2xl p-6 hover:border-secondary transition-colors bg-cream/30 shadow-premium">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h3 className="font-bold text-xl text-charcoal mb-1">{order.customerName}</h3>
                                <p className="text-base text-gray-600 font-medium">{order.customerPhone}</p>
                                <p className="text-sm text-gray-600 mt-1">{order.customerAddress}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-2xl text-secondary">₹{order.totalAmount}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 bg-white rounded-xl p-4 border border-cream-dark">
                            <h4 className="font-bold mb-3 text-charcoal text-lg">Items:</h4>
                            <ul className="space-y-2">
                                {order.items.map((item, index) => (
                                    <li key={index} className="text-base text-charcoal flex justify-between">
                                        <span>{item.title} - Qty: {item.quantity}</span>
                                        <span className="font-semibold text-primary">₹{item.price * item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <span className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                            </span>

                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                className="input-field text-base font-semibold cursor-pointer"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderManagement;
