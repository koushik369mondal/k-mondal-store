import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CACHE_EXPIRY } from '../utils/cache';
import ProductCard from '../components/customer/ProductCard';
import ProductGridSkeleton from '../components/common/ProductGridSkeleton';
import SearchBar from '../components/common/SearchBar';
import { Search, ArrowLeft } from 'lucide-react';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const filtered = products.filter(product => (
                product.title?.toLowerCase().includes(query) ||
                product.brand?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query)
            ));
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const response = await api.getCached('/products', {
                cacheTTL: CACHE_EXPIRY.long,
            });
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
            {/* Header & Search Bar */}
            <div className="mb-8 space-y-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-montserrat text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                            Search store
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Browse groceries, daily staples and spices from K Mondal Store
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl">
                    <SearchBar />
                </div>
            </div>

            {/* Results Toolbar */}
            <div className="flex items-center justify-between border-b border-card-edge pb-3 mb-6">
                <p className="text-xs sm:text-sm text-muted-foreground">
                    {searchQuery ? (
                        <>
                            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> results for "{searchQuery}"
                        </>
                    ) : (
                        <>
                            Showing all <span className="font-semibold text-foreground">{filteredProducts.length}</span> available items
                        </>
                    )}
                </p>
            </div>

            {/* Loading or Results */}
            {loading ? (
                <ProductGridSkeleton />
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
                    {filteredProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="card-chai max-w-md mx-auto p-8 text-center space-y-3 my-12">
                    <Search className="w-10 h-10 text-muted-foreground mx-auto stroke-1" />
                    <h3 className="font-montserrat text-base sm:text-lg font-medium text-foreground">
                        No results found
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        We could not find any products matching "{searchQuery}". Try different keywords or browse categories on the home page.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
