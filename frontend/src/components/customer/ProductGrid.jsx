import React, { useState } from 'react';
import api from '../../utils/api';
import { CACHE_EXPIRY } from '../../utils/cache';
import ProductCard from './ProductCard';
import ProductGridSkeleton from '../common/ProductGridSkeleton';
import { PRODUCT_CATEGORIES } from '../../utils/categories';
import { PackageOpen, Search } from 'lucide-react';

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

    delete grouped['Select'];
    return grouped;
};

const ProductGrid = ({ products: externalProducts, loading: externalLoading, searchQuery }) => {
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);

    const displayGroupedProducts = externalProducts !== undefined
        ? groupProductsByCategory(externalProducts)
        : groupedProducts;
    const isLoading = externalLoading !== undefined ? externalLoading : loading;

    if (isLoading) return <ProductGridSkeleton />;

    const availableCategories = Object.keys(displayGroupedProducts).filter(
        cat => displayGroupedProducts[cat] && displayGroupedProducts[cat].length > 0
    );

    const sortedCategories = [
        ...PRODUCT_CATEGORIES.filter(cat =>
            availableCategories.includes(cat) && cat !== 'Select'
        ),
        ...availableCategories
            .filter(cat => !PRODUCT_CATEGORIES.includes(cat))
            .sort()
    ];

    if (searchQuery && availableCategories.length === 0) {
        return (
            <div className="card-chai flex flex-col items-center justify-center py-16 px-6 text-center max-w-xl mx-auto my-8">
                <Search className="w-12 h-12 text-muted-foreground mb-4 stroke-1" />
                <h3 className="font-montserrat text-lg sm:text-xl font-medium text-foreground mb-2">
                    No products found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    We could not find any items matching "{searchQuery}". Try searching for groceries, staples, or spices.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-12">
            {sortedCategories.map((category) => {
                const products = displayGroupedProducts[category];
                if (!products || products.length === 0) return null;

                return (
                    <section key={category} className="space-y-4">
                        {/* ChaiUI Section Heading */}
                        <div className="flex items-baseline justify-between border-b border-card-edge pb-2">
                            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground capitalize">
                                {category}
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                {products.length} {products.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {/* Responsive Product Grid - Fills entire screen width */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                );
            })}

            {sortedCategories.length === 0 && !searchQuery && (
                <div className="card-chai flex flex-col items-center justify-center py-16 px-6 text-center max-w-xl mx-auto my-8">
                    <PackageOpen className="w-12 h-12 text-muted-foreground mb-4 stroke-1" />
                    <h3 className="font-montserrat text-lg sm:text-xl font-medium text-foreground mb-2">
                        Inventory updating
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Products are currently being restocked in Banarhat. Please check back shortly.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
