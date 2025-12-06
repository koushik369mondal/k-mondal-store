import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import Loader from '../components/common/Loader';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

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
        addToCart(product);
        // Optional: Show success message or redirect to cart
    };

    if (loading) return <Loader />;

    if (!product) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-charcoal mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/')} className="btn-primary">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-cream/30 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="text-primary hover:text-primary-light font-semibold mb-6 flex items-center gap-2 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back
                </button>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column - Product Image */}
                    <div className="card border border-cream-dark bg-white">
                        <div className="w-full aspect-square bg-cream rounded-xl flex items-center justify-center overflow-hidden">
                            <img
                                src={product.image.url}
                                alt={product.title}
                                className="w-full h-full object-contain p-6"
                            />
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="flex flex-col gap-6">
                        {/* Title & Category */}
                        <div className="card border border-cream-dark bg-white">
                            <div className="mb-3">
                                <span className="inline-block bg-cream text-charcoal text-xs px-3 py-1.5 rounded-md font-semibold border border-cream-dark uppercase tracking-wide">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-charcoal mb-3 leading-tight">{product.title}</h1>
                            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                        </div>

                        {/* Price & Stock */}
                        <div className="card border border-cream-dark bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Price</p>
                                    <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                                </div>
                                <div className="text-right">
                                    {product.isAvailable ? (
                                        <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm border border-green-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                            </svg>
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg font-semibold text-sm border border-red-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                            </svg>
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {product.stock < 10 && product.stock > 0 && (
                                <div className="bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-3">
                                    <p className="text-secondary text-sm font-bold text-center">
                                        ⚡ Hurry! Only {product.stock} left in stock
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Availability Details */}
                        <div className="card border border-cream-dark bg-white">
                            <h3 className="text-sm font-semibold text-charcoal mb-3 uppercase tracking-wide">Product Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-2 border-b border-cream-dark">
                                    <span className="text-gray-600">Availability</span>
                                    <span className="font-semibold text-charcoal">
                                        {product.isAvailable ? `${product.stock} units` : 'Unavailable'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-cream-dark">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-semibold text-charcoal">{product.category}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`font-semibold ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.isAvailable ? 'Available' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="card border border-cream-dark bg-white">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.isAvailable}
                                    className="btn-primary flex-1 py-3"
                                >
                                    {product.isAvailable ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                            </svg>
                                            Add to Cart
                                        </span>
                                    ) : 'Out of Stock'}
                                </button>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="btn-secondary py-3 px-6"
                                >
                                    View Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
