import React from 'react';

const ProductSkeleton = () => (
    <div className="card-chai overflow-hidden animate-pulse flex flex-col h-full">
        {/* Image skeleton */}
        <div className="w-full aspect-square bg-muted/40 border-b border-card-edge/50"></div>

        {/* Content skeleton */}
        <div className="p-3 flex flex-col gap-2.5 flex-1 justify-between">
            <div className="space-y-1.5">
                <div className="h-2.5 bg-muted/50 rounded w-16"></div>
                <div className="h-3.5 bg-muted/60 rounded w-full"></div>
                <div className="h-3.5 bg-muted/40 rounded w-3/4"></div>
            </div>

            {/* Price and button */}
            <div className="flex justify-between items-center pt-2 border-t border-card-edge/40">
                <div className="h-4 bg-muted/60 rounded w-12"></div>
                <div className="h-7 bg-muted/50 rounded-md w-14"></div>
            </div>
        </div>
    </div>
);

const ProductGridSkeleton = ({ count = 14 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
        {[...Array(count)].map((_, i) => (
            <ProductSkeleton key={i} />
        ))}
    </div>
);

export default ProductGridSkeleton;
