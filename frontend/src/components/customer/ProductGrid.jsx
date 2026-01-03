import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CACHE_EXPIRY } from '../../utils/cache';
import ProductCard from './ProductCard';
import ProductGridSkeleton from '../common/ProductGridSkeleton';

const ProductGrid = ({ products: externalProducts, loading: externalLoading, searchQuery }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isStale, setIsStale] = useState(false);

    // Use external products if provided, otherwise fetch internally
    const displayProducts = externalProducts !== undefined ? externalProducts : products;
    const isLoading = externalLoading !== undefined ? externalLoading : loading;

    useEffect(() => {
        // Only fetch if no external products provided
        if (externalProducts === undefined) {
            fetchProducts();
        }
    }, [externalProducts]);

    const fetchProducts = async () => {
        try {
            // Use cached API with stale-while-revalidate
            const response = await api.getCached('/products', {
                cacheTTL: CACHE_EXPIRY.long // Products are relatively static
            });

            setProducts(response.data.products);
            setIsStale(response.isStale);

            // Show loading only on first load, not on background revalidation
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

    // Show empty state if search query exists but no results
    if (searchQuery && displayProducts.length === 0) {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {displayProducts.map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
