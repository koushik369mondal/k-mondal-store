import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CACHE_EXPIRY } from '../../utils/cache';
import ProductCard from './ProductCard';
import ProductGridSkeleton from '../common/ProductGridSkeleton';
import { PRODUCT_CATEGORIES } from '../../utils/categories';

// Helper function to group products by category
const groupProductsByCategory = (products) => {
    if (!products || !Array.isArray(products)) {
        return {};
    }

    const grouped = {};

    products.forEach(product => {
        const category = product.category || 'Others';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(product);
    });

    // Remove 'Select' category if it exists
    delete grouped['Select'];

    return grouped;
};

const ProductGrid = ({ products: externalProducts, loading: externalLoading, searchQuery }) => {
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [isStale, setIsStale] = useState(false);

    // Use external products if provided, otherwise fetch internally
    const displayGroupedProducts = externalProducts !== undefined
        ? groupProductsByCategory(externalProducts)
        : groupedProducts;
    const isLoading = externalLoading !== undefined ? externalLoading : loading;

    const fetchProducts = async () => {
        try {
            // Fetch products grouped by category
            const response = await api.getCached('/products?groupByCategory=true', {
                cacheTTL: CACHE_EXPIRY.long
            });

            setGroupedProducts(response.data.groupedProducts || {});
            setIsStale(response.isStale);

            if (!response.fromCache) {
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    if (isLoading) return <ProductGridSkeleton />;

    // Get all available categories from the grouped products
    const availableCategories = Object.keys(displayGroupedProducts).filter(
        cat => displayGroupedProducts[cat] && displayGroupedProducts[cat].length > 0
    );

    // Sort categories: first by PRODUCT_CATEGORIES order, then alphabetically for others
    const sortedCategories = [
        // Categories from PRODUCT_CATEGORIES that have products
        ...PRODUCT_CATEGORIES.filter(cat =>
            availableCategories.includes(cat) && cat !== 'Select'
        ),
        // Categories not in PRODUCT_CATEGORIES (sorted alphabetically)
        ...availableCategories
            .filter(cat => !PRODUCT_CATEGORIES.includes(cat))
            .sort()
    ];

    // Show empty state if search query exists but no results
    if (searchQuery && availableCategories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-center max-w-md">
                    We couldn't find any products matching "{searchQuery}". Try searching with different keywords.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Category-based product display */}
            {sortedCategories.map((category) => {
                const products = displayGroupedProducts[category];

                if (!products || products.length === 0) return null;

                return (
                    <div
                        key={category}
                        className="mb-8"
                    >
                        {/* Category Heading */}
                        <div className="mb-4 px-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-green-600 pl-3">
                                {category}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 pl-3">
                                {products.length} {products.length === 1 ? 'product' : 'products'}
                            </p>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Empty state if no categories */}
            {sortedCategories.length === 0 && !searchQuery && (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No products available</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        There are currently no products in the store. Please check back later.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
