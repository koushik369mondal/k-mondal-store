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
        <div className="bg-white min-h-screen pb-24 md:pb-8">
            {/* Mobile-optimized layout */}
            <div className="max-w-6xl mx-auto">
                {/* Header with Back Button */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
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

                {/* Product Image Section - Full Width */}
                <div className="bg-white border-b border-gray-200">
                    <div className="relative w-full aspect-square max-w-2xl mx-auto">
                        <img
                            src={images[currentImageIndex].url}
                            alt={product.title}
                            className="w-full h-full object-contain p-6"
                        />

                        {/* Stock Badge */}
                        {!product.isAvailable && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg font-semibold shadow-lg">
                                Out of Stock
                            </div>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                            <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm px-3 py-1.5 rounded-lg font-semibold shadow-lg">
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

                {/* Product Info Section */}
                <div className="px-4 py-5">
                    {/* Category Badge */}
                    <div className="mb-3">
                        <span className="inline-block bg-green-50 text-green-700 text-xs px-3 py-1 rounded-md font-semibold uppercase">
                            {product.category}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                        {product.title}
                    </h2>

                    {/* Price Section */}
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-sm text-gray-500">MRP (incl. of all taxes)</span>
                    </div>

                    {/* Delivery Info - Blinkit style */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <span className="font-semibold text-sm">Fast delivery available</span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1 ml-7">Order now and get it delivered soon</p>
                    </div>

                    {/* Quantity Selector */}
                    {product.isAvailable && (
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Select Quantity</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-primary rounded-lg overflow-hidden">
                                    <button
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1}
                                        className="px-4 py-2 bg-white text-primary font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="px-6 py-2 font-bold text-lg bg-white text-gray-900 min-w-[60px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        disabled={quantity >= product.stock}
                                        className="px-4 py-2 bg-white text-primary font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.stock} available
                                </span>
                            </div>
                            {cartQuantity > 0 && (
                                <p className="text-sm text-green-600 mt-2 font-medium">
                                    ✓ {cartQuantity} already in cart
                                </p>
                            )}
                        </div>
                    )}

                    {/* Product Description */}
                    <div className="border-t border-gray-200 pt-5 mb-6">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Product Details</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Additional Product Info */}
                    <div className="border-t border-gray-200 pt-5">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Category</span>
                                <span className="font-semibold text-gray-900">{product.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Availability</span>
                                <span className={`font-semibold ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Stock</span>
                                <span className="font-semibold text-gray-900">{product.stock} units</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar - Mobile First (Blinkit style) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-3 z-20">
                <div className="max-w-6xl mx-auto flex items-center gap-3">
                    {product.isAvailable ? (
                        <>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                Add {quantity > 1 ? `${quantity} items` : 'to Cart'}
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="bg-white border-2 border-primary text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary/5 transition-all duration-200 active:scale-95"
                            >
                                Cart {cartQuantity > 0 && `(${cartQuantity})`}
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 bg-gray-300 text-gray-600 font-bold py-3 px-6 rounded-lg text-center cursor-not-allowed">
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
