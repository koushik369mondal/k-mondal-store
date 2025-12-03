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
        <div className="card max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-charcoal border-b-2 border-secondary pb-4">Shopping Cart</h2>

            <div className="space-y-5">
                {cart.map(item => (
                    <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border border-cream-dark rounded-xl p-5 hover:border-secondary transition-colors bg-cream/30">
                        <div className="w-24 h-24 flex-shrink-0 bg-white rounded-xl flex items-center justify-center border border-cream-dark shadow-sm">
                            <img
                                src={item.image.url}
                                alt={item.title}
                                className="w-full h-full object-contain rounded-xl p-2"
                            />
                        </div>
                        <div className="flex-grow w-full sm:w-auto">
                            <h3 className="font-bold text-charcoal text-lg sm:text-xl mb-1">{item.title}</h3>
                            <p className="text-gray-600 text-base sm:text-lg font-semibold">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-3">
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-light transition-all duration-300 text-xl font-bold shadow-md hover:shadow-lg"
                            >
                                −
                            </button>
                            <span className="px-3 sm:px-5 text-charcoal font-bold min-w-[2.5rem] text-center text-lg">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-light transition-all duration-300 text-xl font-bold shadow-md hover:shadow-lg"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                            <div className="text-lg sm:text-xl font-bold text-primary">
                                ₹{item.price * item.quantity}
                            </div>
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="text-red-600 hover:text-red-800 font-bold transition-colors text-sm sm:text-base bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t-2 border-cream-dark">
                <div className="flex justify-between items-center text-xl sm:text-2xl font-bold mb-6 bg-cream rounded-xl p-6">
                    <span className="text-charcoal">Total:</span>
                    <span className="text-secondary text-3xl">₹{getTotal()}</span>
                </div>
                <button onClick={onCheckout} className="btn-secondary w-full text-lg py-4">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
