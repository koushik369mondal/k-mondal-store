import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const BottomCartBar = () => {
    const { cart, getTotal } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = getTotal();

    const isCartPage = location.pathname === '/cart';

    useEffect(() => {
        if (totalItems > 0 && !isCartPage) {
            setTimeout(() => {
                setIsVisible(true);
                setIsAnimating(true);
            }, 100);
        } else {
            setIsAnimating(false);
            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [totalItems, isCartPage]);

    if (!isVisible) return null;

    return (
        <>
            <div className="h-16 md:h-0" />

            <div
                className={`
                    fixed bottom-0 left-0 right-0 z-40
                    bg-background/90 backdrop-blur-xl border-t border-card-edge
                    transition-all duration-300 ease-out
                    ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                `}
            >
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative p-2 rounded-lg bg-card-fill border border-card-edge text-foreground">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                                <span className="absolute -top-1 -right-1 px-1 min-w-[1rem] h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-semibold flex items-center justify-center border border-card-edge">
                                    {totalItems}
                                </span>
                            </div>

                            <div className="flex flex-col min-w-0">
                                <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
                                </span>
                                <span className="font-montserrat text-xs sm:text-sm text-muted-foreground font-medium">
                                    Total: ₹{totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/cart')}
                            className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-4 text-xs sm:text-sm font-medium text-white transition-colors duration-200 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 whitespace-nowrap active:scale-95"
                        >
                            <span>View cart</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BottomCartBar;
