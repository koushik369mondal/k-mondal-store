import React from 'react';

const ProductSkeleton = () => (
    <div className="card border border-cream-dark animate-pulse">
        <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
    </div>
);

const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(count)].map((_, i) => (
            <ProductSkeleton key={i} />
        ))}
    </div>
);

export default ProductGridSkeleton;
