import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CACHE_EXPIRY } from '../utils/cache';
import ProductCard from '../components/customer/ProductCard';
import ProductGridSkeleton from '../components/common/ProductGridSkeleton';
import SearchBar from '../components/common/SearchBar';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

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

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-4">
                    <ProductGridSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Back Button for Mobile */}
            <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <SearchBar className="flex-1" />
                </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:block bg-white border-b border-gray-200 px-4 py-4">
                <div className="container mx-auto max-w-2xl">
                    <SearchBar />
                </div>
            </div>

            {/* Search Results */}
            <div className="container mx-auto px-4 py-4 md:py-6">
                {/* Results Count */}
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

                {/* Product Grid or Empty State */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : searchQuery ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-500 text-center max-w-md">
                            We couldn't find any products matching "{searchQuery}". Try searching with different keywords.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Start searching</h3>
                        <p className="text-gray-500 text-center max-w-md">
                            Search for products, brands, or categories to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
