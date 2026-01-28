import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Plus, Minus, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart, updateQuantity, cart } = useContext(CartContext);
    const [isAdding, setIsAdding] = useState(false);
    const [showAdded, setShowAdded] = useState(false);

    // Get final price with fallback for backward compatibility
    const finalPrice = product.finalPrice || product.sellingPrice || product.price;
    const mrp = product.mrp;

    // Check if product is already in cart
    const cartItem = cart?.find(item => item._id === product._id);
    const quantity = cartItem?.quantity || 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);

        await addToCart(product);

        // Show "Added" feedback
        setShowAdded(true);
        setTimeout(() => {
            setIsAdding(false);
            setShowAdded(false);
        }, 800);
    };

    const handleIncrement = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await updateQuantity(product._id, quantity + 1);
    };

    const handleDecrement = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity > 1) {
            await updateQuantity(product._id, quantity - 1);
        } else {
            await updateQuantity(product._id, 0);
        }
    };

    return (
        <Link
            to={`/product/${product._id}`}
            className="bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer w-full max-w-[180px] mx-auto"
        >
            {/* Product Image - Fixed square size */}
            <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden p-2">
                <img
                    src={product.image.url}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                        {product.stock} left
                    </div>
                )}
                {!product.isAvailable && (
                    <div className="absolute top-1.5 left-1.5 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Product Info - Compact with fixed sizes */}
            <div className="p-2.5 flex flex-col gap-1.5">
                {/* Product Name - Max 2 lines with ellipsis, fixed text size */}
                <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight min-h-[2rem]">
                    {product.title}
                </h3>

                {/* Price and Add Button - Fixed sizes */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col gap-0.5">
                        {mrp && mrp > finalPrice ? (
                            <>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-400 line-through">₹{mrp}</span>
                                    <span className="text-[9px] font-semibold bg-green-500 text-white px-1 py-0.5 rounded">
                                        {Math.round(((mrp - finalPrice) / mrp) * 100)}% OFF
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">₹{finalPrice}</span>
                            </>
                        ) : (
                            finalPrice && <span className="text-sm font-bold text-gray-900">₹{finalPrice}</span>
                        )}
                    </div>

                    {/* Blinkit-style Add Button - Fixed size */}
                    {product.isAvailable ? (
                        quantity > 0 ? (
                            // Quantity Stepper
                            <div className="flex items-center gap-1 bg-primary rounded-md border-2 border-primary">
                                <button
                                    onClick={handleDecrement}
                                    className="text-white hover:bg-primary-light px-2 py-1 rounded-l transition-colors active:scale-90"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-white font-bold text-xs px-2 min-w-[24px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={handleIncrement}
                                    className="text-white hover:bg-primary-light px-2 py-1 rounded-r transition-colors active:scale-90"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            // Add Button
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`
                                    px-3 py-1.5 text-[11px] font-bold rounded-md transition-all duration-200 whitespace-nowrap
                                    flex items-center gap-1.5
                                    ${showAdded
                                        ? 'bg-green-500 text-white border-2 border-green-500'
                                        : 'bg-white text-primary border-2 border-primary hover:bg-primary/5'
                                    }
                                    ${isAdding ? 'scale-95' : 'scale-100'}
                                    active:scale-90
                                    disabled:opacity-70
                                `}
                            >
                                {showAdded ? (
                                    <>
                                        <Check className="w-3 h-3" />
                                        <span>Added</span>
                                    </>
                                ) : (
                                    'ADD'
                                )}
                            </button>
                        )
                    ) : (
                        <span className="px-2 py-1 text-[10px] font-semibold text-gray-400 border border-gray-300 rounded-md">
                            N/A
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
