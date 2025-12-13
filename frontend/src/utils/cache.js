// Cache utility with stale-while-revalidate strategy
const CACHE_VERSION = 'v1';
const CACHE_EXPIRY = {
    short: 2 * 60 * 1000,      // 2 minutes for volatile data
    medium: 10 * 60 * 1000,    // 10 minutes for semi-static data
    long: 60 * 60 * 1000       // 1 hour for static data
};

class CacheManager {
    constructor() {
        this.prefix = 'k_mondal_cache_';
    }

    // Get cache key with version
    getKey(key) {
        return `${this.prefix}${CACHE_VERSION}_${key}`;
    }

    // Set cache with expiry
    set(key, data, ttl = CACHE_EXPIRY.medium) {
        try {
            const cacheItem = {
                data,
                timestamp: Date.now(),
                expiry: Date.now() + ttl
            };
            localStorage.setItem(this.getKey(key), JSON.stringify(cacheItem));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    // Get cache if valid
    get(key) {
        try {
            const cached = localStorage.getItem(this.getKey(key));
            if (!cached) return null;

            const cacheItem = JSON.parse(cached);

            // Return data even if expired (stale-while-revalidate)
            return {
                data: cacheItem.data,
                isStale: Date.now() > cacheItem.expiry,
                timestamp: cacheItem.timestamp
            };
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    // Check if cache is fresh
    isFresh(key) {
        const cached = this.get(key);
        return cached && !cached.isStale;
    }

    // Remove specific cache
    remove(key) {
        try {
            localStorage.removeItem(this.getKey(key));
        } catch (error) {
            console.error('Cache remove error:', error);
        }
    }

    // Clear all cache for this app
    clearAll() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }

    // Clear old versions
    clearOldVersions() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix) && !key.includes(CACHE_VERSION)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Cache version clear error:', error);
        }
    }
}

export const cache = new CacheManager();
export { CACHE_EXPIRY };
