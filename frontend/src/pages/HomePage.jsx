import React from 'react';
import ProductGrid from '../components/customer/ProductGrid';

const HomePage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Product Grid with minimal padding */}
            <div className="container mx-auto px-4 py-4 md:py-6">
                <ProductGrid />
            </div>
        </div>
    );
};

export default HomePage;
