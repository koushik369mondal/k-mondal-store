import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="card hover:shadow-xl transition-shadow duration-300">
            <img
                src={product.image.url}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
            <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                <button
                    onClick={() => addToCart(product)}
                    className="btn-primary"
                    disabled={!product.isAvailable}
                >
                    {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
            {product.stock < 10 && product.stock > 0 && (
                <p className="text-orange-500 text-sm mt-2">Only {product.stock} left!</p>
            )}
        </div>
    );
};

export default ProductCard;
