import axios from 'axios';
import { cache, CACHE_EXPIRY } from './cache';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for caching
api.interceptors.response.use(
    (response) => {
        // Cache GET requests that are cacheable
        if (response.config.method === 'get' && response.config.cache) {
            const cacheKey = `${response.config.url}_${JSON.stringify(response.config.params || {})}`;
            cache.set(cacheKey, response.data, response.config.cacheTTL || CACHE_EXPIRY.medium);
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Enhanced GET with cache support
api.getCached = async (url, config = {}) => {
    const cacheKey = `${url}_${JSON.stringify(config.params || {})}`;
    const cached = cache.get(cacheKey);

    // Return cached data immediately if available
    if (cached) {
        // If stale, revalidate in background
        if (cached.isStale) {
            api.get(url, { ...config, cache: true, cacheTTL: config.cacheTTL })
                .catch(err => console.error('Background revalidation failed:', err));
        }

        return {
            data: cached.data,
            fromCache: true,
            isStale: cached.isStale
        };
    }

    // No cache, fetch from server
    try {
        const response = await api.get(url, { ...config, cache: true, cacheTTL: config.cacheTTL });
        return {
            data: response.data,
            fromCache: false,
            isStale: false
        };
    } catch (error) {
        throw error;
    }
};

export default api;
