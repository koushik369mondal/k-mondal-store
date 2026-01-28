import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { ShoppingCart, ArrowRight, Package } from 'lucide-react';

const BottomCartBar = () => {
    const { cart, getTotal } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Calculate total items
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = getTotal();

    // Don't show on cart page
    const isCartPage = location.pathname === '/cart';

    // Handle visibility with animation
    useEffect(() => {
        if (totalItems > 0 && !isCartPage) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                setIsVisible(true);
                setIsAnimating(true);
            }, 100);
        } else {
            setIsAnimating(false);
            // Wait for animation to complete before hiding
            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [totalItems, isCartPage]);

    const handleViewCart = () => {
        navigate('/cart');
    };

    // Don't render if not visible
    if (!isVisible) return null;

    return (
        <>
            {/* Spacer to prevent content overlap */}
            <div className="h-20 md:h-0" />

            {/* Fixed Bottom Cart Bar */}
            <div
                className={`
                    fixed bottom-0 left-0 right-0 z-50
                    bg-gradient-to-r from-primary to-primary-dark
                    shadow-2xl border-t-2 border-white/20
                    transition-all duration-300 ease-out
                    ${isAnimating
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0'
                    }
                `}
            >
                {/* Decorative top border animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 animate-pulse" />

                <div className="container mx-auto px-4 py-3 md:py-4">
                    <div className="flex items-center justify-between gap-3">
                        {/* Left Section - Cart Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Animated Cart Icon */}
                            <div className="relative">
                                <div className="bg-white/20 rounded-full p-2 animate-bounce-slow">
                                    <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                {/* Item count badge */}
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                    {totalItems}
                                </div>
                            </div>

                            {/* Cart Details */}
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-white/90 flex-shrink-0" />
                                    <span className="text-white text-sm md:text-base font-semibold truncate">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                                <span className="text-white/90 text-xs md:text-sm font-medium">
                                    Total: ₹{totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Right Section - CTA Button */}
                        <button
                            onClick={handleViewCart}
                            className="
                                bg-white text-primary
                                px-4 md:px-6 py-2.5 md:py-3
                                rounded-full
                                font-bold text-sm md:text-base
                                flex items-center gap-2
                                hover:bg-gray-100
                                active:scale-95
                                transition-all duration-200
                                shadow-lg
                                whitespace-nowrap
                                group
                            "
                        >
                            <span>View Cart</span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>
                </div>

                {/* Bottom safe area for iOS devices */}
                <div className="h-0 pb-safe bg-gradient-to-r from-primary to-primary-dark" />
            </div>
        </>
    );
};

export default BottomCartBar;
