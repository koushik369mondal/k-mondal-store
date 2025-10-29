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
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>

            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">{order.customerName}</h3>
                                <p className="text-sm text-gray-600">{order.customerPhone}</p>
                                <p className="text-sm text-gray-600">{order.customerAddress}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-lg">₹{order.totalAmount}</p>
                                <p className="text-sm text-gray-600">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Items:</h4>
                            <ul className="space-y-1">
                                {order.items.map((item, index) => (
                                    <li key={index} className="text-sm">
                                        {item.title} - Qty: {item.quantity} - ₹{item.price * item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                            </span>

                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                className="input-field text-sm"
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
