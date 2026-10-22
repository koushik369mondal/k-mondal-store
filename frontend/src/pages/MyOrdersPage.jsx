import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/common/Loader';
import { Package, ArrowUpRight, Clock, MapPin } from 'lucide-react';

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
            const { data } = await api.get('/orders/me');
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');
        if (!confirmCancel) return;

        setCancellingOrderId(orderId);
        try {
            await api.patch(`/orders/${orderId}/cancel`);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: 'cancelled' } : order
                )
            );
        } catch (error) {
            alert('Failed to cancel order: ' + (error.response?.data?.message || error.message));
        } finally {
            setCancellingOrderId(null);
        }
    };

    const canCancelOrder = (order) => {
        return order.status === 'pending' || order.status === 'confirmed';
    };

    // ChaiUI status rule: text and thin outline only, never filled pills
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'text-amber-500 border border-amber-500/30';
            case 'confirmed':
                return 'text-sky-500 border border-sky-500/30';
            case 'delivered':
                return 'text-emerald-500 border border-emerald-500/30';
            case 'cancelled':
                return 'text-rose-500 border border-rose-500/30';
            default:
                return 'text-muted-foreground border border-card-edge';
        }
    };

    if (authLoading) return <Loader />;
    if (!user) return <Navigate to="/login" />;
    if (loading) return <Loader />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
            <div className="border-b border-card-edge pb-4">
                <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                    My orders
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Track delivery status and view order history
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="card-chai max-w-md mx-auto p-10 text-center space-y-4">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto stroke-1" />
                    <h2 className="font-montserrat text-lg sm:text-xl font-semibold text-foreground">
                        No orders yet
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        You have not placed any orders yet. Browse our inventory to get started.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/"
                            className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            Shop groceries <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="card-chai p-5 sm:p-6 space-y-5">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-card-edge">
                                <div>
                                    <h3 className="font-montserrat text-base sm:text-lg font-semibold text-foreground">
                                        Order #{order._id.slice(-8)}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Delivery Address Details */}
                            <div className="p-3 rounded-lg border border-card-edge bg-muted/20 text-xs sm:text-sm space-y-1">
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
                                    <span>{order.customerName} ({order.customerPhone})</span>
                                </div>
                                <p className="text-muted-foreground pl-6 text-xs leading-relaxed">
                                    {order.customerAddress}
                                </p>
                            </div>

                            {/* Items List */}
                            <div className="space-y-2.5">
                                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Items ordered
                                </h4>
                                <div className="space-y-2">
                                    {order.items?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg border border-card-edge flex items-center justify-between gap-3 bg-card-fill"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {item.product?.image?.url && (
                                                    <div className="w-12 h-12 rounded bg-muted/20 border border-card-edge p-1 flex items-center justify-center flex-shrink-0">
                                                        <img
                                                            src={item.product.image.url}
                                                            alt={item.title}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-montserrat text-xs sm:text-sm font-medium text-foreground truncate">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Qty: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-montserrat text-xs sm:text-sm font-bold text-foreground">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer / Total / Action */}
                            <div className="pt-4 border-t border-card-edge flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-xs text-muted-foreground">Total amount</span>
                                    <span className="font-montserrat text-lg font-bold text-foreground block">
                                        ₹{order.totalAmount?.toFixed(2)}
                                    </span>
                                </div>

                                {canCancelOrder(order) && (
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        disabled={cancellingOrderId === order._id}
                                        className="text-xs font-medium text-rose-500 hover:text-rose-400 border border-rose-500/30 hover:border-rose-500/60 px-3 py-1.5 rounded-md transition-colors"
                                    >
                                        {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel order'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
