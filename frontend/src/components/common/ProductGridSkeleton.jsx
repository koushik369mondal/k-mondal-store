import React from 'react';

const ProductSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 animate-pulse overflow-hidden">
        {/* Image skeleton - square aspect ratio */}
        <div className="w-full aspect-square bg-gray-200"></div>

        {/* Content skeleton */}
        <div className="p-3 flex flex-col gap-2">
            {/* Title - 2 lines */}
            <div className="h-3.5 bg-gray-200 rounded w-full"></div>
            <div className="h-3.5 bg-gray-200 rounded w-4/5 mb-1"></div>

            {/* Price and button */}
            <div className="flex justify-between items-center mt-1">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-7 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    </div>
);

const ProductGridSkeleton = ({ count = 12 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(count)].map((_, i) => (
            <ProductSkeleton key={i} />
        ))}
    </div>
);

export default ProductGridSkeleton;
