import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import Loader from '../components/common/Loader';
import { ArrowLeft, ArrowUpRight, Check, ShoppingBag, Truck, ShieldCheck, Plus, Minus } from 'lucide-react';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [showAdded, setShowAdded] = useState(false);

    const finalPrice = product?.finalPrice || product?.sellingPrice || product?.price;
    const mrp = product?.mrp;

    const cartItem = cart?.find(item => item._id === id);
    const cartQuantity = cartItem?.quantity || 0;

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data.product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        setIsAdding(true);
        for (let i = 0; i < quantity; i++) {
            await addToCart(product);
        }
        setShowAdded(true);
        setTimeout(() => {
            setIsAdding(false);
            setShowAdded(false);
        }, 900);
    };

    const handleIncrement = () => {
        if (quantity < (product?.stock || 99)) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (loading) return <Loader />;

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                <div className="card-chai max-w-md mx-auto p-8 space-y-4">
                    <h2 className="font-montserrat text-xl font-semibold text-foreground">Product not found</h2>
                    <p className="text-sm text-muted-foreground">The item you are looking for is unavailable or has been removed.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        Back to home
                    </button>
                </div>
            </div>
        );
    }

    const discountPercentage = mrp && mrp > finalPrice ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
            {/* Breadcrumb / Back Navigation */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-xs sm:text-sm text-muted-foreground capitalize">
                    {product.category || 'Groceries'}
                </span>
            </div>

            {/* Product Card Container */}
            <div className="card-chai p-6 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Media Column */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative w-full aspect-square max-w-lg bg-muted/20 rounded-xl border border-card-edge p-8 flex items-center justify-center overflow-hidden group">
                            <img
                                src={product.image?.url || product.image}
                                alt={product.title}
                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                            />

                            {/* Status Chips */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                {discountPercentage > 0 && (
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded backdrop-blur-sm">
                                        {discountPercentage}% off
                                    </span>
                                )}
                                {!product.isAvailable ? (
                                    <span className="text-xs font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                                        Out of stock
                                    </span>
                                ) : product.stock < 10 && product.stock > 0 ? (
                                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                        Only {product.stock} left
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col justify-between space-y-6">
                        <div>
                            {product.category && (
                                <span className="text-xs font-medium text-muted-foreground capitalize tracking-wide block mb-1">
                                    {product.category}
                                </span>
                            )}
                            <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight leading-snug">
                                {product.title}
                            </h1>

                            {/* Price Block */}
                            <div className="mt-4 pb-6 border-b border-card-edge">
                                <div className="flex items-baseline gap-3">
                                    <span className="font-montserrat text-3xl sm:text-4xl font-bold text-foreground">
                                        ₹{finalPrice}
                                    </span>
                                    {mrp && mrp > finalPrice && (
                                        <span className="text-base text-muted-foreground line-through">
                                            ₹{mrp}
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        Inclusive of all taxes
                                    </span>
                                </div>
                                {mrp && mrp > finalPrice && (
                                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                                        You save ₹{(mrp - finalPrice).toFixed(2)}
                                    </p>
                                )}
                            </div>

                            {/* Delivery & Authenticity Cards */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg border border-card-edge bg-card-fill flex items-center gap-3">
                                    <Truck className="w-5 h-5 text-brand flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Express delivery</p>
                                        <p className="text-[11px] text-muted-foreground">15 to 30 mins in Banarhat</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border border-card-edge bg-card-fill flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Genuine kirana</p>
                                        <p className="text-[11px] text-muted-foreground">Fresh packaging guaranteed</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Controls */}
                            {product.isAvailable && (
                                <div className="mt-6">
                                    <label className="text-xs font-medium text-muted-foreground block mb-2">
                                        Quantity
                                    </label>
                                    <div className="inline-flex h-9 items-center rounded-lg border border-card-edge bg-muted/40">
                                        <button
                                            onClick={handleDecrement}
                                            disabled={quantity <= 1}
                                            aria-label="Decrease quantity"
                                            className="h-full px-3 text-foreground hover:text-brand disabled:opacity-40 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-montserrat font-semibold text-sm px-4 min-w-[36px] text-center text-foreground">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={handleIncrement}
                                            disabled={quantity >= product.stock}
                                            aria-label="Increase quantity"
                                            className="h-full px-3 text-foreground hover:text-brand disabled:opacity-40 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {cartQuantity > 0 && (
                                        <span className="text-xs text-muted-foreground ml-3 inline-block">
                                            ({cartQuantity} already in cart)
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                {product.isAvailable ? (
                                    <>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isAdding}
                                            className="btn-asym inline-flex h-10 items-center justify-center gap-2 bg-neutral-900 px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 active:scale-95 disabled:opacity-70"
                                        >
                                            {showAdded ? (
                                                <>
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                    <span>Added to cart</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="w-4 h-4" />
                                                    <span>Add to cart</span>
                                                    <ArrowUpRight className="w-4 h-4 -ml-0.5" />
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => navigate('/cart')}
                                            className="btn-asym-mirror inline-flex h-10 items-center gap-2 border border-border bg-transparent px-5 text-sm font-medium text-foreground transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
                                        >
                                            <span>View cart</span>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        disabled
                                        className="h-10 px-6 rounded-md bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed"
                                    >
                                        Currently out of stock
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Product Description */}
                        {product.description && (
                            <div className="pt-6 border-t border-card-edge">
                                <h3 className="font-montserrat text-sm font-semibold text-foreground mb-2">
                                    Product description
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
