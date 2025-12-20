import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { cache } from '../utils/cache';

export const AuthContext = createContext();

const USER_CACHE_KEY = 'user_profile';
const TOKEN_CACHE_KEY = 'auth_token';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        // Try to hydrate from cache first for instant UI
        const cachedUser = cache.get(USER_CACHE_KEY);
        const token = localStorage.getItem('token');

        if (cachedUser && token) {
            // Hydrate UI immediately with cached data
            setUser(cachedUser.data);
            setLoading(false);

            // Silently revalidate in background
            setIsValidating(true);
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.user);
                cache.set(USER_CACHE_KEY, data.user);
            } catch (error) {
                console.error('Silent auth revalidation failed:', error);
                // Only clear on 401/403, keep cached data on network errors
                if (error.response?.status === 401 || error.response?.status === 403) {
                    handleAuthFailure();
                }
            } finally {
                setIsValidating(false);
            }
        } else if (token) {
            // No cache, fetch from server
            await checkAuth();
        } else {
            setLoading(false);
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.user);
                cache.set(USER_CACHE_KEY, data.user);
            } catch (error) {
                handleAuthFailure();
            }
        }
        setLoading(false);
    };

    const handleAuthFailure = () => {
        localStorage.removeItem('token');
        cache.remove(USER_CACHE_KEY);
        cache.remove('cart_data');
        cache.remove('cart_count');
        setUser(null);
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        cache.set(USER_CACHE_KEY, data.user);
        return data;
    };

    const signup = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        cache.set(USER_CACHE_KEY, data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        cache.clearAll(); // Clear all cached data on logout
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        const { data } = await api.put('/auth/me', profileData);
        setUser(data.user);
        cache.set(USER_CACHE_KEY, data.user);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, isValidating, login, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
