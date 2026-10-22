import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Plus, Minus, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart, updateQuantity, cart } = useContext(CartContext);
    const [isAdding, setIsAdding] = useState(false);
    const [showAdded, setShowAdded] = useState(false);

    // Get final price with fallback
    const finalPrice = product.finalPrice || product.sellingPrice || product.price;
    const mrp = product.mrp;

    // Check if product is already in cart
    const cartItem = cart?.find(item => item._id === product._id);
    const quantity = cartItem?.quantity || 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);

        await addToCart(product);

        setShowAdded(true);
        setTimeout(() => {
            setIsAdding(false);
            setShowAdded(false);
        }, 800);
    };

    const handleIncrement = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await updateQuantity(product._id, quantity + 1);
    };

    const handleDecrement = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity > 1) {
            await updateQuantity(product._id, quantity - 1);
        } else {
            await updateQuantity(product._id, 0);
        }
    };

    const discountPercentage = mrp && mrp > finalPrice ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;

    return (
        <article className="card-chai group flex flex-col overflow-hidden sm:opacity-95 sm:hover:opacity-100 h-full">
            <Link to={`/product/${product._id}`} className="flex flex-col flex-1">
                {/* Product Image Media */}
                <div className="relative w-full aspect-square bg-muted/20 flex items-center justify-center overflow-hidden p-3 border-b border-card-edge/50">
                    <img
                        src={product.image?.url || product.image}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />

                    {/* Meta Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {discountPercentage > 0 && (
                            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                {discountPercentage}% off
                            </span>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                            <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                {product.stock} left
                            </span>
                        )}
                        {!product.isAvailable && (
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted/80 border border-border px-1.5 py-0.5 rounded">
                                Out of stock
                            </span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
                    <div>
                        {product.category && (
                            <span className="text-[11px] text-muted-foreground font-medium block capitalize mb-0.5">
                                {product.category}
                            </span>
                        )}
                        <h3 className="font-montserrat text-xs sm:text-sm font-semibold leading-snug text-foreground line-clamp-2">
                            {product.title}
                        </h3>
                    </div>

                    {/* Price and Add Control */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-card-edge/40">
                        <div className="flex flex-col">
                            {mrp && mrp > finalPrice && (
                                <span className="text-[11px] text-muted-foreground line-through">
                                    ₹{mrp}
                                </span>
                            )}
                            <span className="font-montserrat text-sm sm:text-base font-bold text-foreground">
                                ₹{finalPrice}
                            </span>
                        </div>

                        {/* ChaiUI Action: Soft Button or Stepper */}
                        {product.isAvailable ? (
                            quantity > 0 ? (
                                <div
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    className="inline-flex h-8 items-center rounded-md border border-card-edge bg-muted/40 backdrop-blur-sm"
                                >
                                    <button
                                        onClick={handleDecrement}
                                        aria-label="Decrease quantity"
                                        className="h-full px-2 text-foreground hover:text-brand transition-colors flex items-center justify-center"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="font-montserrat font-semibold text-xs px-2 min-w-[20px] text-center text-foreground">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        aria-label="Increase quantity"
                                        className="h-full px-2 text-foreground hover:text-brand transition-colors flex items-center justify-center"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    className="inline-flex h-8 items-center justify-center gap-1 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors active:scale-95 disabled:opacity-70"
                                >
                                    {showAdded ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>Added</span>
                                        </>
                                    ) : (
                                        'Add'
                                    )}
                                </button>
                            )
                        ) : (
                            <span className="text-[11px] font-medium text-muted-foreground border border-card-edge px-2 py-1 rounded">
                                Unavailable
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default ProductCard;
