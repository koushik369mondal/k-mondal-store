import React, { useState } from 'react';
import ProductGrid from '../components/customer/ProductGrid';
import Cart from '../components/customer/Cart';
import Checkout from '../components/customer/Checkout';

const HomePage = () => {
    const [showCheckout, setShowCheckout] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const handleCheckoutSuccess = (order) => {
        alert(`Order placed successfully! Order ID: ${order._id}`);
        setShowCheckout(false);
        setShowCart(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-dark mb-4">
                    Welcome to K Mondal Store
                </h1>
                <p className="text-lg text-gray-600">
                    Your trusted local kirana store in Banarhat
                </p>
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="btn-primary mt-4"
                >
                    {showCart ? 'Browse Products' : 'View Cart'}
                </button>
            </div>

            {showCheckout ? (
                <Checkout onSuccess={handleCheckoutSuccess} />
            ) : showCart ? (
                <Cart onCheckout={() => setShowCheckout(true)} />
            ) : (
                <ProductGrid />
            )}
        </div>
    );
};

export default HomePage;
