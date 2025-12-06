import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="card hover:shadow-premium-lg transition-all duration-300 border border-cream-dark hover:border-secondary flex flex-col h-full">
            <div className="w-full h-64 bg-cream rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-cream-dark flex-shrink-0">
                <img
                    src={product.image.url}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                />
            </div>
            <h3 className="text-xl font-bold mb-2 text-charcoal">{product.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{product.description}</p>
            <div className="mt-auto">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                    <button
                        onClick={() => addToCart(product)}
                        className="btn-primary text-sm py-2 px-5"
                        disabled={!product.isAvailable}
                    >
                        {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
                {product.stock < 10 && product.stock > 0 && (
                    <p className="text-secondary text-sm font-bold bg-secondary/10 px-3 py-1.5 rounded-lg text-center">Only {product.stock} left!</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
