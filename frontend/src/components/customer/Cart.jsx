import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const Cart = ({ onCheckout }) => {
    const { cart, removeFromCart, updateQuantity, getTotal } = useContext(CartContext);

    if (cart.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-600">Your cart is empty</h2>
            </div>
        );
    }

    return (
        <div className="card max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-dark">Shopping Cart</h2>

            <div className="space-y-4">
                {cart.map(item => (
                    <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-b pb-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                            <img
                                src={item.image.url}
                                alt={item.title}
                                className="w-full h-full object-contain rounded"
                            />
                        </div>
                        <div className="flex-grow w-full sm:w-auto">
                            <h3 className="font-semibold text-dark text-base sm:text-lg">{item.title}</h3>
                            <p className="text-gray-600 text-sm sm:text-base">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-2">
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-light-green text-white rounded hover:bg-primary transition-colors text-lg font-bold"
                            >
                                −
                            </button>
                            <span className="px-2 sm:px-4 text-dark font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-light-green text-white rounded hover:bg-primary transition-colors text-lg font-bold"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <div className="text-base sm:text-lg font-semibold text-primary">
                                ₹{item.price * item.quantity}
                            </div>
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="text-red-600 hover:text-red-800 font-semibold transition-colors text-sm sm:text-base"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center text-lg sm:text-xl font-bold mb-4">
                    <span className="text-dark">Total:</span>
                    <span className="text-primary">₹{getTotal()}</span>
                </div>
                <button onClick={onCheckout} className="btn-primary w-full">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
