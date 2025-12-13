import { useEffect } from 'react';
import { cache } from '../../utils/cache';

/**
 * CacheWarmer component - Runs on app initialization to:
 * 1. Clear old cache versions
 * 2. Validate token expiry
 * 3. Prepare app for offline-first experience
 */
const CacheWarmer = () => {
    useEffect(() => {
        // Clear old cache versions on mount
        cache.clearOldVersions();

        // Check for expired tokens
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode JWT to check expiry (simple check without library)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const isExpired = payload.exp * 1000 < Date.now();

                if (isExpired) {
                    console.log('Token expired, clearing cache');
                    localStorage.removeItem('token');
                    cache.clearAll();
                }
            } catch (error) {
                console.error('Token validation error:', error);
            }
        }
    }, []);

    return null; // This component doesn't render anything
};

export default CacheWarmer;
