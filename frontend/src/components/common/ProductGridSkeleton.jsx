import React from 'react';

const ProductSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 animate-pulse overflow-hidden w-full max-w-[180px] mx-auto">
        {/* Image skeleton - Fixed square size */}
        <div className="w-full aspect-square bg-gray-200"></div>

        {/* Content skeleton - Compact with fixed sizes */}
        <div className="p-2.5 flex flex-col gap-1.5">
            {/* Title - 2 lines with fixed text size */}
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5 mb-0.5"></div>

            {/* Price and button - Fixed sizes */}
            <div className="flex justify-between items-center mt-0.5">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
        </div>
    </div>
);

const ProductGridSkeleton = ({ count = 12 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2.5 sm:gap-3">
        {[...Array(count)].map((_, i) => (
            <ProductSkeleton key={i} />
        ))}
    </div>
);

export default ProductGridSkeleton;
