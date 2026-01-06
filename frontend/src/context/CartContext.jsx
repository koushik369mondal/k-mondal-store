import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/api';
import { cache } from '../utils/cache';

export const CartContext = createContext();

const CART_DATA_KEY = 'cart_data';
const CART_COUNT_KEY = 'cart_count';

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch cart from cache or MongoDB when user logs in
    useEffect(() => {
        if (user) {
            initializeCart();
        } else {
            // Clear cart when user logs out
            setCart([]);
            cache.remove(CART_DATA_KEY);
            cache.remove(CART_COUNT_KEY);
        }
    }, [user]);

    const initializeCart = async () => {
        // Try cache first for instant UI
        const cachedCart = cache.get(CART_DATA_KEY);

        if (cachedCart) {
            setCart(cachedCart.data);

            // Silently revalidate in background
            fetchCart(true);
        } else {
            fetchCart(false);
        }
    };

    const fetchCart = async (silent = false) => {
        try {
            if (!silent) setLoading(true);

            const { data } = await api.get('/cart');
            // Transform MongoDB cart format to match frontend format
            const cartItems = data.cart.items.map(item => ({
                _id: item.product._id,
                title: item.product.title,
                description: item.product.description,
                price: item.product.finalPrice || item.product.sellingPrice || item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                isAvailable: item.product.isAvailable,
                quantity: item.quantity
            }));

            setCart(cartItems);
            cache.set(CART_DATA_KEY, cartItems);
            cache.set(CART_COUNT_KEY, cartItems.length);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const updateCartCache = (cartItems) => {
        setCart(cartItems);
        cache.set(CART_DATA_KEY, cartItems);
        cache.set(CART_COUNT_KEY, cartItems.length);
    };

    const addToCart = async (product) => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }

        try {
            const { data } = await api.post('/cart/add', {
                productId: product._id,
                quantity: 1
            });

            // Transform and update cart
            const cartItems = data.cart.items.map(item => ({
                _id: item.product._id,
                title: item.product.title,
                description: item.product.description,
                price: item.product.finalPrice || item.product.sellingPrice || item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                isAvailable: item.product.isAvailable,
                quantity: item.quantity
            }));
            updateCartCache(cartItems);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert(error.response?.data?.message || 'Failed to add item to cart');
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) return;

        try {
            const { data } = await api.delete(`/cart/remove/${productId}`);

            // Transform and update cart
            const cartItems = data.cart.items.map(item => ({
                _id: item.product._id,
                title: item.product.title,
                description: item.product.description,
                price: item.product.finalPrice || item.product.sellingPrice || item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                isAvailable: item.product.isAvailable,
                quantity: item.quantity
            }));
            updateCartCache(cartItems);
        } catch (error) {
            console.error('Error removing from cart:', error);
            alert('Failed to remove item from cart');
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (!user) return;

        try {
            const { data } = await api.put('/cart/update', {
                productId,
                quantity
            });

            // Transform and update cart
            const cartItems = data.cart.items.map(item => ({
                _id: item.product._id,
                title: item.product.title,
                description: item.product.description,
                price: item.product.finalPrice || item.product.sellingPrice || item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                isAvailable: item.product.isAvailable,
                quantity: item.quantity
            }));
            updateCartCache(cartItems);
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity');
        }
    };

    const clearCart = async () => {
        if (!user) {
            setCart([]);
            cache.remove(CART_DATA_KEY);
            cache.remove(CART_COUNT_KEY);
            return;
        }

        try {
            await api.delete('/cart/clear');
            updateCartCache([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

