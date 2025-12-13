import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CACHE_EXPIRY } from '../../utils/cache';
import ProductCard from './ProductCard';
import ProductGridSkeleton from '../common/ProductGridSkeleton';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isStale, setIsStale] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

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

    if (loading) return <ProductGridSkeleton />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
