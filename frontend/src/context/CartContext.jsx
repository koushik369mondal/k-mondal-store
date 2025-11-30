import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch cart from MongoDB when user logs in
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            // Clear cart when user logs out
            setCart([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/cart');
            // Transform MongoDB cart format to match frontend format
            const cartItems = data.cart.items.map(item => ({
                _id: item.product._id,
                title: item.product.title,
                description: item.product.description,
                price: item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                isAvailable: item.product.isAvailable,
                quantity: item.quantity
            }));
            setCart(cartItems);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
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
                price: item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                isAvailable: item.product.isAvailable,
                quantity: item.quantity
            }));
            setCart(cartItems);
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
                price: item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                isAvailable: item.product.isAvailable,
                quantity: item.quantity
            }));
            setCart(cartItems);
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
                price: item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                isAvailable: item.product.isAvailable,
                quantity: item.quantity
            }));
            setCart(cartItems);
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity');
        }
    };

    const clearCart = async () => {
        if (!user) {
            setCart([]);
            return;
        }

        try {
            await api.delete('/cart/clear');
            setCart([]);
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
