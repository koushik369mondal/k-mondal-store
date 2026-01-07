import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const Cart = ({ onCheckout }) => {
    const { cart, removeFromCart, updateQuantity, getTotal } = useContext(CartContext);

    if (cart.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-premium p-12 max-w-md mx-auto">
                    <h2 className="text-3xl font-bold text-charcoal mb-3">Your cart is empty</h2>
                    <p className="text-gray-500">Start shopping to add items to your cart!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-2 pt-2 pb-4 md:max-w-5xl md:mx-auto md:px-6 md:py-6">
            <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-8 text-gray-800 border-b border-gray-200 pb-2 md:pb-4">Shopping Cart</h2>

            <div className="space-y-2 md:space-y-4">
                {cart.map(item => (
                    <div key={item._id} className="flex items-center gap-3 md:gap-4 border border-gray-200 rounded-lg p-2 md:p-4 hover:shadow-sm transition-all bg-gray-50">
                        {/* Product Image - Left */}
                        <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                            <img
                                src={item.image.url}
                                alt={item.title}
                                className="w-full h-full object-contain rounded-lg p-1 md:p-2"
                            />
                        </div>

                        {/* Product Details - Middle */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-700 text-sm md:text-lg leading-tight line-clamp-2 mb-0.5 md:mb-1">{item.title}</h3>
                            <p className="text-gray-600 text-xs md:text-base font-semibold">₹{item.price}</p>
                        </div>

                        {/* Quantity Controls & Actions - Right */}
                        <div className="flex flex-col items-end gap-2 md:gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-light transition-all text-base md:text-lg font-semibold shadow-sm"
                                >
                                    −
                                </button>
                                <span className="px-2 md:px-3 text-gray-700 font-semibold min-w-[1.75rem] md:min-w-[2.5rem] text-center text-sm md:text-base">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-light transition-all text-base md:text-lg font-semibold shadow-sm"
                                >
                                    +
                                </button>
                            </div>

                            {/* Total & Remove */}
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="text-sm md:text-lg font-semibold text-gray-800 whitespace-nowrap">
                                    ₹{item.price * item.quantity}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors text-base md:text-lg"
                                    aria-label="Remove item"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
                {/* Calculate refrigeration charges */}
                {(() => {
                    const refrigerationCharges = cart.reduce((total, item) => {
                        if (item.category === 'Soft Drinks' || item.category === 'Juices & Cold Drinks') {
                            return total + (5 * item.quantity);
                        }
                        return total;
                    }, 0);

                    return refrigerationCharges > 0 ? (
                        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                            <div className="flex justify-between items-center text-sm md:text-base text-blue-800">
                                <span className="flex items-center gap-1 md:gap-2">
                                    ❄️ Refrigeration Charges
                                    <span className="text-xs text-blue-600">(₹5 per bottle)</span>
                                </span>
                                <span className="font-semibold">₹{refrigerationCharges}</span>
                            </div>
                        </div>
                    ) : null;
                })()}

                <div className="flex justify-between items-center text-lg md:text-2xl font-semibold mb-4 md:mb-6 bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                    <span className="text-gray-700">Items Total:</span>
                    <span className="text-secondary text-xl md:text-3xl font-bold">₹{getTotal()}</span>
                </div>
                <button onClick={onCheckout} className="btn-secondary w-full text-base md:text-lg py-3 md:py-4">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
