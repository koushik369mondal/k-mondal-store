import React from 'react';
import ProductGrid from '../components/customer/ProductGrid';

const HomePage = () => {
    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-12 text-center bg-white rounded-2xl shadow-premium-lg p-10 border-2 border-cream-dark">
                <h1 className="text-5xl font-bold text-primary mb-4">
                    Welcome to K Mondal Store
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                    Your trusted local kirana store in Santimore, Banarhat
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <span className="inline-block bg-secondary text-white px-6 py-2 rounded-full font-semibold text-sm">Premium Quality</span>
                    <span className="inline-block bg-primary text-cream px-6 py-2 rounded-full font-semibold text-sm">Fast Delivery</span>
                    <span className="inline-block bg-cream text-primary border-2 border-primary px-6 py-2 rounded-full font-semibold text-sm">Best Prices</span>
                </div>
            </div>

            <ProductGrid />
        </div>
    );
};

export default HomePage;
