import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/customer/ProductGrid';
import api from '../utils/api';
import { CACHE_EXPIRY } from '../utils/cache';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Get search query from URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // Filter products whenever search query changes
        if (searchQuery.trim()) {
            const filtered = products.filter(product => {
                const query = searchQuery.toLowerCase();
                return (
                    product.title.toLowerCase().includes(query) ||
                    product.brand?.toLowerCase().includes(query) ||
                    product.category?.toLowerCase().includes(query)
                );
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const response = await api.getCached('/products', {
                cacheTTL: CACHE_EXPIRY.long
            });
            setProducts(response.data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Product Grid with minimal padding */}
            <div className="container mx-auto px-4 py-4 md:py-6">
                {/* Search Results Count */}
                {searchQuery && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            {filteredProducts.length > 0 ? (
                                <>
                                    Found <span className="font-semibold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'} for "{searchQuery}"
                                </>
                            ) : (
                                <>No products found for "{searchQuery}"</>
                            )}
                        </p>
                    </div>
                )}

                <ProductGrid products={filteredProducts} loading={loading} searchQuery={searchQuery} />
            </div>
        </div>
    );
};

export default HomePage;
