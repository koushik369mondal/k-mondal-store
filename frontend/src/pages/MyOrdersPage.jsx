import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/common/Loader';

const MyOrdersPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            console.log('Fetching orders from /orders/me');
            const { data } = await api.get('/orders/me');
            console.log('Orders fetched:', data);
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            console.error('Error response:', error.response);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            alert('Failed to fetch orders: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');

        if (!confirmCancel) return;

        setCancellingOrderId(orderId);
        try {
            const { data } = await api.patch(`/orders/${orderId}/cancel`);

            // Update the order in the local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: 'cancelled' } : order
                )
            );

            alert('Order cancelled successfully');
        } catch (error) {
            console.error('Error cancelling order:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            alert('Failed to cancel order: ' + errorMsg);
        } finally {
            setCancellingOrderId(null);
        }
    };

    const canCancelOrder = (order) => {
        return order.status === 'pending' || order.status === 'confirmed';
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

    if (authLoading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-charcoal mb-2">My Orders</h1>
                <p className="text-gray-600 text-lg">Track and manage your orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-white rounded-2xl shadow-premium p-12 max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-charcoal mb-3">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start shopping to place your first order!</p>
                        <a href="/" className="btn-primary inline-block">
                            Continue Shopping
                        </a>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="card border border-cream-dark hover:border-secondary transition-colors">
                            {/* Order Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-cream-dark">
                                <div>
                                    <h3 className="text-xl font-bold text-charcoal mb-1">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="mt-3 md:mt-0">
                                    <span className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Delivery Details */}
                            <div className="mb-6 bg-cream rounded-xl p-4">
                                <h4 className="font-bold text-charcoal mb-2">Delivery Details</h4>
                                <p className="text-gray-700 font-semibold">{order.customerName}</p>
                                <p className="text-gray-600 text-sm">{order.customerPhone}</p>
                                <p className="text-gray-600 text-sm mt-1">{order.customerAddress}</p>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h4 className="font-bold text-charcoal mb-3 text-lg">Items Ordered</h4>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-cream-dark">
                                            {item.product?.image?.url && (
                                                <div className="w-20 h-20 flex-shrink-0 bg-cream rounded-lg flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={item.product.image.url}
                                                        alt={item.title}
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-grow">
                                                <h5 className="font-bold text-charcoal">{item.title}</h5>
                                                <p className="text-gray-600 text-sm">
                                                    Quantity: <span className="font-semibold">{item.quantity}</span>
                                                </p>
                                                <p className="text-primary font-bold text-lg">₹{item.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-secondary font-bold text-xl">
                                                    ₹{item.price * item.quantity}
                                                </p>
                                                <p className="text-gray-500 text-xs">Subtotal</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-charcoal font-bold text-xl">Total Amount:</span>
                                    <span className="text-secondary font-bold text-3xl">₹{order.totalAmount}</span>
                                </div>
                            </div>

                            {/* Cancel Order Button */}
                            {canCancelOrder(order) && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        disabled={cancellingOrderId === order._id}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all ${cancellingOrderId === order._id
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                                            }`}
                                    >
                                        {cancellingOrderId === order._id ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Cancelling...
                                            </span>
                                        ) : (
                                            '❌ Cancel Order'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
