import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Plus, Minus, Trash2, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ onCheckout }) => {
    const { cart, removeFromCart, updateQuantity, getTotal } = useContext(CartContext);

    if (cart.length === 0) {
        return (
            <div className="max-w-lg mx-auto py-16 px-4 text-center">
                <div className="card-chai p-10 space-y-4">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto stroke-1" />
                    <h2 className="font-montserrat text-xl sm:text-2xl font-semibold text-foreground">
                        Your cart is empty
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Browse our fresh kirana groceries and add items to your cart.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/"
                            className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            Start shopping <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const total = getTotal();

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
            <div className="flex items-baseline justify-between border-b border-card-edge pb-3">
                <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                    Shopping cart
                </h1>
                <span className="text-xs sm:text-sm text-muted-foreground">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
                {cart.map(item => (
                    <div
                        key={item._id}
                        className="card-chai p-3 sm:p-4 flex items-center justify-between gap-4"
                    >
                        {/* Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted/20 border border-card-edge flex-shrink-0 p-1.5 flex items-center justify-center">
                            <img
                                src={item.image?.url || item.image}
                                alt={item.title}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Title and Unit Price */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-montserrat text-xs sm:text-sm font-semibold text-foreground line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="font-montserrat text-xs sm:text-sm text-muted-foreground mt-0.5">
                                ₹{item.price} each
                            </p>
                        </div>

                        {/* Stepper & Subtotal */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                            <div className="inline-flex h-8 items-center rounded-md border border-card-edge bg-muted/40">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    aria-label="Decrease quantity"
                                    className="h-full px-2 text-foreground hover:text-brand transition-colors"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-montserrat font-semibold text-xs px-2.5 min-w-[24px] text-center text-foreground">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                    className="h-full px-2 text-foreground hover:text-brand transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="text-right min-w-[70px]">
                                <span className="font-montserrat text-sm sm:text-base font-bold text-foreground block">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors rounded"
                                aria-label="Remove item"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total and Checkout */}
            <div className="card-chai p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-card-edge pb-3">
                    <span className="text-sm sm:text-base text-muted-foreground">Order subtotal</span>
                    <span className="font-montserrat text-xl sm:text-2xl font-bold text-foreground">
                        ₹{total.toFixed(2)}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <p className="text-xs text-muted-foreground">
                        Taxes and local Banarhat delivery fee calculated at checkout
                    </p>
                    <button
                        onClick={onCheckout}
                        className="btn-asym inline-flex h-10 sm:h-11 w-full sm:w-auto items-center justify-center gap-2 bg-neutral-900 px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 active:scale-95"
                    >
                        <span>Proceed to checkout</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
