import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const SearchBar = ({ className = '', onMobile = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-focus on search page for mobile
    useEffect(() => {
        if (location.pathname === '/search' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [location.pathname]);

    // Debounced search query from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        setSearchQuery(q);
    }, [location.search]);

    const handleSearch = (value) => {
        setSearchQuery(value);

        if (value.trim()) {
            const newParams = new URLSearchParams({ q: value.trim() });
            if (location.pathname === '/search') {
                navigate(`/search?${newParams.toString()}`, { replace: true });
            } else {
                navigate(`/?${newParams.toString()}`, { replace: true });
            }
        } else {
            if (location.pathname === '/search') {
                navigate('/search', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        handleSearch('');
        inputRef.current?.focus();
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (onMobile && location.pathname !== '/search' && window.innerWidth < 768) {
            navigate('/search');
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className={`relative ${className}`}>
            <div className={`
                flex items-center gap-2.5 px-3.5 py-1.5 md:py-2
                rounded-lg border transition-colors duration-200
                bg-background/80 dark:bg-black/30 backdrop-blur-md
                ${isFocused ? 'border-brand/70 ring-1 ring-brand/40' : 'border-card-edge hover:border-card-edge-hover'}
            `}>
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />

                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Search groceries, staples, snacks..."
                    aria-label="Search products"
                    className="flex-1 outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground bg-transparent"
                />

                {searchQuery && (
                    <button
                        onClick={handleClear}
                        type="button"
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
