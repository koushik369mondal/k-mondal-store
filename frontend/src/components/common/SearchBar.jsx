import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

    // Debounced search query
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        setSearchQuery(q);
    }, [location.search]);

    const handleSearch = (value) => {
        setSearchQuery(value);

        // Update URL with search query
        if (value.trim()) {
            const newParams = new URLSearchParams({ q: value.trim() });
            if (location.pathname === '/search') {
                navigate(`/search?${newParams.toString()}`, { replace: true });
            } else {
                navigate(`/?${newParams.toString()}`, { replace: true });
            }
        } else {
            // Clear search if empty
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
        // On mobile, navigate to search page when clicking search bar
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
                flex items-center gap-2 px-4 py-2.5 md:py-2
                bg-white rounded-full border-2 transition-all duration-200
                ${isFocused ? 'border-primary shadow-lg' : 'border-gray-200 shadow-sm'}
            `}>
                {/* Search Icon */}
                <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>

                {/* Search Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Search for products, brands, categories"
                    className="flex-1 outline-none text-sm md:text-base text-gray-700 placeholder-gray-400 bg-transparent"
                />

                {/* Clear Button */}
                {searchQuery && (
                    <button
                        onClick={handleClear}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Clear search"
                    >
                        <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
