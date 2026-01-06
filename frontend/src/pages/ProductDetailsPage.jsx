import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import Loader from '../components/common/Loader';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cart, removeFromCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Get final price with fallback for backward compatibility
    const finalPrice = product?.finalPrice || product?.sellingPrice || product?.price;
    const mrp = product?.mrp;

    // Get current cart quantity for this product
    const cartItem = cart?.find(item => item.product?._id === id);
    const cartQuantity = cartItem?.quantity || 0;

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data.product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const handleIncrement = () => {
        if (quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (loading) return <Loader />;

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-2 rounded-lg">
                    Back to Home
                </button>
            </div>
        );
    }

    // Image carousel - for now single image, but structured for multiple
    const images = [product.image];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header with Back Button */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800 truncate">Product Details</h1>
                </div>
            </div>

            {/* Main Content - Responsive Layout */}
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                {/* Desktop: Two-column layout, Mobile: Vertical stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white rounded-lg shadow-sm overflow-hidden">

                    {/* Left Column: Product Image */}
                    <div className="md:sticky md:top-24 md:h-fit">
                        <div className="relative bg-white">
                            {/* Image Container - Fixed aspect ratio */}
                            <div className="relative w-full aspect-square max-w-md mx-auto p-4 md:p-8">
                                <img
                                    src={images[currentImageIndex].url}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />

                                {/* Stock Badge */}
                                {!product.isAvailable && (
                                    <div className="absolute top-6 left-6 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold shadow-lg">
                                        Out of Stock
                                    </div>
                                )}
                                {product.stock < 10 && product.stock > 0 && (
                                    <div className="absolute top-6 left-6 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold shadow-lg">
                                        Only {product.stock} left!
                                    </div>
                                )}
                            </div>

                            {/* Image indicators (if multiple images) */}
                            {images.length > 1 && (
                                <div className="flex justify-center gap-2 pb-4">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-primary w-6' : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="p-6 md:p-8 md:pb-24">
                        {/* Category Badge */}
                        <div className="mb-4">
                            <span className="inline-block bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-md font-semibold uppercase tracking-wide">
                                {product.category}
                            </span>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            {product.title}
                        </h1>

                        {/* Price Section with MRP and Discount */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            {mrp && finalPrice && mrp > finalPrice ? (
                                <>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-lg text-gray-400 line-through">₹{mrp}</span>
                                        <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-md">
                                            {Math.round(((mrp - finalPrice) / mrp) * 100)}% OFF
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-4xl font-bold text-gray-900">₹{finalPrice}</span>
                                        <span className="text-sm text-gray-500">MRP (incl. of all taxes)</span>
                                    </div>
                                    <div className="text-sm text-green-600 font-medium">
                                        You save ₹{(mrp - finalPrice).toFixed(2)}
                                    </div>
                                </>
                            ) : (
                                finalPrice && (
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-gray-900">₹{finalPrice}</span>
                                        <span className="text-sm text-gray-500">MRP (incl. of all taxes)</span>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Availability Info */}
                        <div className="mb-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600 w-24">Availability:</span>
                                <span className={`text-sm font-semibold ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600 w-24">Stock:</span>
                                <span className="text-sm font-semibold text-gray-900">{product.stock} units available</span>
                            </div>
                        </div>

                        {/* Delivery Info - Premium style */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-blue-900 text-sm mb-1">Fast Delivery Available</p>
                                    <p className="text-xs text-blue-700">Order now and get it delivered soon</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        {product.isAvailable && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-gray-900 mb-3">Select Quantity</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-primary rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={handleDecrement}
                                            disabled={quantity <= 1}
                                            className="px-5 py-3 text-primary font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="px-8 py-3 font-bold text-xl text-gray-900 min-w-[80px] text-center border-x-2 border-gray-200">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={handleIncrement}
                                            disabled={quantity >= product.stock}
                                            className="px-5 py-3 text-primary font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {cartQuantity > 0 && (
                                    <p className="text-sm text-green-600 mt-3 font-medium flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                        </svg>
                                        {cartQuantity} already in cart
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action Buttons - Desktop inline, Mobile stacked */}
                        <div className="mb-8 flex flex-col sm:flex-row gap-3">
                            {product.isAvailable ? (
                                <>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        Add {quantity > 1 ? `${quantity} items` : 'to Cart'}
                                    </button>
                                    <button
                                        onClick={() => navigate('/cart')}
                                        className="sm:w-auto bg-white border-2 border-primary text-primary font-bold py-4 px-8 rounded-lg hover:bg-primary/5 transition-all duration-200 active:scale-98"
                                    >
                                        View Cart {cartQuantity > 0 && `(${cartQuantity})`}
                                    </button>
                                </>
                            ) : (
                                <button
                                    disabled
                                    className="flex-1 bg-gray-300 text-gray-600 font-bold py-4 px-8 rounded-lg cursor-not-allowed"
                                >
                                    Out of Stock
                                </button>
                            )}
                        </div>

                        {/* Product Description */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Product Details</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
