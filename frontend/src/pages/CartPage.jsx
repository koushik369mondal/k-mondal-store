import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from '../components/customer/Cart';
import Checkout from '../components/customer/Checkout';

const CartPage = () => {
    const [showCheckout, setShowCheckout] = useState(false);
    const navigate = useNavigate();

    const handleCheckoutSuccess = (order) => {
        alert(`Order placed successfully! Order ID: ${order._id}`);
        setShowCheckout(false);
        navigate('/');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {showCheckout ? (
                <Checkout onSuccess={handleCheckoutSuccess} />
            ) : (
                <Cart onCheckout={() => setShowCheckout(true)} />
            )}
        </div>
    );
};

export default CartPage;
