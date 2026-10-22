import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/customer/ProductGrid';
import AnimatedBadge from '../components/common/AnimatedBadge';
import api from '../utils/api';
import { CACHE_EXPIRY } from '../utils/cache';
import { ArrowUpRight, ChevronsDown, Sparkles, Clock, ShieldCheck, Truck } from 'lucide-react';

const POPULAR_FILTERS = [
    'All',
    'Snacks & Namkeen',
    'Dairy & Eggs',
    'Masala & Spices',
    'Rice & Grains',
    'Atta, Flours & Sooji',
    'Tea & Coffee',
    'Cleaning Supplies',
    'Oral Care',
];

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        fetchProducts();
    }, []);

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

    // Filter products based on search query AND active category filter
    const displayedProducts = useMemo(() => {
        let list = products;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            list = list.filter(p => (
                p.title?.toLowerCase().includes(query) ||
                p.brand?.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query)
            ));
        }

        if (activeFilter !== 'All') {
            list = list.filter(p => p.category?.toLowerCase() === activeFilter.toLowerCase());
        }

        return list;
    }, [products, searchQuery, activeFilter]);

    const scrollToProducts = () => {
        const el = document.getElementById('products-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen">
            {/* ChaiUI Hero Section */}
            {!searchQuery && (
                <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-card-edge/50">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        {/* Left Column: Headlines & CTA */}
                        <div className="flex-1 flex flex-col items-start gap-4 sm:gap-5">
                            {/* Animated Badge with Orange Glint */}
                            <AnimatedBadge>
                                <Sparkles className="w-3.5 h-3.5 text-brand" />
                                <span>Instant kirana delivery in Banarhat</span>
                            </AnimatedBadge>

                            {/* Hero Headline */}
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.12]">
                                Your trusted neighbourhood kirana store
                            </h1>

                            {/* Lead with Highlight Phrase (strictly one per paragraph) */}
                            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                                Serving Santimore and Kalabari Road with authentic spices, staples and <span className="highlight">daily fresh groceries</span> delivered right to your doorstep.
                            </p>

                            {/* Action Buttons: One Solid Asymmetric + One Outline Asymmetric */}
                            <div className="mt-2 flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={scrollToProducts}
                                    className="btn-asym inline-flex h-10 items-center gap-2 bg-neutral-900 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    Shop groceries <ArrowUpRight className="w-4 h-4 -ml-0.5" aria-hidden="true" />
                                </button>

                                <a
                                    href="#category-filters"
                                    className="btn-asym-mirror inline-flex h-10 items-center gap-2 border border-border bg-transparent px-5 text-sm font-medium text-foreground transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
                                >
                                    Browse categories <ChevronsDown className="w-4 h-4 -ml-0.5" aria-hidden="true" />
                                </a>
                            </div>
                        </div>

                        {/* Right Column: Featured Store Card (Fills what was empty space) */}
                        <div className="w-full lg:w-5/12">
                            <div className="card-chai p-6 sm:p-7 space-y-5">
                                <div className="flex items-center justify-between pb-3 border-b border-card-edge">
                                    <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Store open today
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">Santimore · Banarhat</span>
                                </div>

                                <div className="space-y-1.5">
                                    <h3 className="font-montserrat text-lg font-semibold text-foreground">
                                        Instant local delivery
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Handpacked with care by Kamakhya Mandal. Free delivery on all orders over ₹199 across Banarhat and tea garden areas.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 pt-1">
                                    <div className="p-3 rounded-lg border border-card-edge bg-muted/20">
                                        <span className="font-montserrat text-base sm:text-lg font-bold text-foreground block">15-30m</span>
                                        <span className="text-[11px] text-muted-foreground">Doorstep drop</span>
                                    </div>
                                    <div className="p-3 rounded-lg border border-card-edge bg-muted/20">
                                        <span className="font-montserrat text-base sm:text-lg font-bold text-foreground block">₹0 Fee</span>
                                        <span className="text-[11px] text-muted-foreground">Above ₹199</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* StatStrip in ChaiUI style - Stretches across the full width */}
                    <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-card-edge">
                        <div className="card-chai p-4 sm:p-5 flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-card-fill border border-card-edge flex items-center justify-center text-foreground flex-shrink-0">
                                <Clock className="w-5 h-5 text-brand" />
                            </div>
                            <div>
                                <h3 className="font-montserrat text-sm font-semibold text-foreground">15 to 30 mins</h3>
                                <p className="text-xs text-muted-foreground">Fast delivery in Banarhat</p>
                            </div>
                        </div>

                        <div className="card-chai p-4 sm:p-5 flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-card-fill border border-card-edge flex items-center justify-center text-foreground flex-shrink-0">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-montserrat text-sm font-semibold text-foreground">100% genuine</h3>
                                <p className="text-xs text-muted-foreground">Handpicked local inventory</p>
                            </div>
                        </div>

                        <div className="card-chai p-4 sm:p-5 flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-card-fill border border-card-edge flex items-center justify-center text-foreground flex-shrink-0">
                                <Truck className="w-5 h-5 text-brand" />
                            </div>
                            <div>
                                <h3 className="font-montserrat text-sm font-semibold text-foreground">Free delivery</h3>
                                <p className="text-xs text-muted-foreground">On orders over ₹199</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Products Section - Full Wide Canvas */}
            <main id="products-section" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
                {/* Search Feedback */}
                {searchQuery && (
                    <div className="mb-6 flex items-center justify-between gap-4 border-b border-card-edge pb-4">
                        <p className="text-sm text-muted-foreground">
                            Found <span className="font-semibold text-foreground">{displayedProducts.length}</span> {displayedProducts.length === 1 ? 'product' : 'products'} for "{searchQuery}"
                        </p>
                    </div>
                )}

                {/* Category Pills / Segmented Controls */}
                {!searchQuery && (
                    <div id="category-filters" className="mb-8 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Quick filter by category</span>
                            {activeFilter !== 'All' && (
                                <button
                                    onClick={() => setActiveFilter('All')}
                                    className="text-xs text-brand hover:underline font-medium"
                                >
                                    Reset filter
                                </button>
                            )}
                        </div>
                        <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
                            {POPULAR_FILTERS.map(filter => {
                                const isActive = activeFilter === filter;
                                return (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200 border ${
                                            isActive
                                                ? 'bg-orange-100 text-orange-950 border-orange-200 dark:bg-orange-900/40 dark:text-orange-100 dark:border-orange-500/30'
                                                : 'bg-card-fill border-card-edge text-muted-foreground hover:text-foreground hover:border-card-edge-hover'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <ProductGrid
                    products={displayedProducts}
                    loading={loading}
                    searchQuery={searchQuery}
                />
            </main>
        </div>
    );
};

export default HomePage;
