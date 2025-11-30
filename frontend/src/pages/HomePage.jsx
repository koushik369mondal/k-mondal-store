import React from 'react';
import ProductGrid from '../components/customer/ProductGrid';

const HomePage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-dark mb-4">
                    Welcome to K Mondal Store
                </h1>
                <p className="text-lg text-gray-600">
                    Your trusted local kirana store in Santimore, Banarhat
                </p>
            </div>

            <ProductGrid />
        </div>
    );
};

export default HomePage;
