import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart, cart } = useContext(CartContext);
    const [isAdding, setIsAdding] = useState(false);

    // Get final price with fallback for backward compatibility
    const finalPrice = product.finalPrice || product.sellingPrice || product.price;
    const mrp = product.mrp;

    // Check if product is already in cart
    const cartItem = cart?.find(item => item.product?._id === product._id);
    const quantity = cartItem?.quantity || 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 300);
    };

    return (
        <Link
            to={`/product/${product._id}`}
            className="bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer"
        >
            {/* Product Image - Square aspect ratio */}
            <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden p-3">
                <img
                    src={product.image.url}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-md font-semibold">
                        {product.stock} left
                    </div>
                )}
                {!product.isAvailable && (
                    <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-md font-semibold">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Product Info - Compact */}
            <div className="p-3 flex flex-col gap-2">
                {/* Product Name - Max 2 lines with ellipsis */}
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {product.title}
                </h3>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col gap-1">
                        {mrp && mrp > finalPrice ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
                                    <span className="text-[10px] font-semibold bg-green-500 text-white px-1.5 py-0.5 rounded">
                                        {Math.round(((mrp - finalPrice) / mrp) * 100)}% OFF
                                    </span>
                                </div>
                                <span className="text-base font-bold text-gray-900">₹{finalPrice}</span>
                            </>
                        ) : (
                            finalPrice && <span className="text-base font-bold text-gray-900">₹{finalPrice}</span>
                        )}
                    </div>

                    {/* Blinkit-style Add Button */}
                    {product.isAvailable ? (
                        <button
                            onClick={handleAddToCart}
                            className={`
                                px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200
                                ${quantity > 0
                                    ? 'bg-primary text-white border-2 border-primary'
                                    : 'bg-white text-primary border-2 border-primary hover:bg-primary/5'
                                }
                                ${isAdding ? 'scale-90' : 'scale-100'}
                                active:scale-95
                            `}
                        >
                            {quantity > 0 ? `Added (${quantity})` : 'ADD'}
                        </button>
                    ) : (
                        <span className="px-3 py-1.5 text-xs font-semibold text-gray-400 border border-gray-300 rounded-md">
                            Unavailable
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
