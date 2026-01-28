import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { Search, X, Menu } from 'lucide-react';
import SearchBar from './SearchBar';
import groceryIcon from '../../public/images/cart.png';
import logo from '../../public/images/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // Close search when opening menu
        if (!isMenuOpen) {
            setIsSearchOpen(false);
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const closeUserDropdown = () => {
        setIsUserDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeUserDropdown();
        closeMenu();
    };

    // Search functions
    const openSearch = () => {
        setIsSearchOpen(true);
        setIsMenuOpen(false);
        // Focus input after state updates
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
    };

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

    // Initialize search query from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        setSearchQuery(q);
    }, [location.search]);

    return (
        <nav className="bg-primary text-cream shadow-premium-lg sticky top-0 z-50">
            {/* Top Navbar Section */}
            <div className="container mx-auto px-4 py-3">
                {isSearchOpen ? (
                    /* Search Mode - Full Width Search Bar */
                    <div className="flex items-center gap-3 animate-fadeIn">
                        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border-2 border-primary shadow-lg">
                            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search for products, brands, categories..."
                                className="flex-1 outline-none text-sm md:text-base text-gray-700 placeholder-gray-400 bg-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        handleSearch('');
                                        searchInputRef.current?.focus();
                                    }}
                                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={closeSearch}
                            className="p-2 hover:bg-primary-light rounded-full transition-colors"
                            aria-label="Close search"
                        >
                            <X className="w-6 h-6 text-cream" />
                        </button>
                    </div>
                ) : (
                    /* Normal Mode - Logo, Brand, Search Icon, Hamburger */
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-1 min-w-0" onClick={closeMenu}>
                            <img src={logo} alt="K Mondal Store Logo" className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg flex-shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-lg md:text-xl font-bold text-secondary hover:text-secondary-light transition-colors leading-tight truncate">
                                    K Mondal Store
                                </span>
                                <span className="text-[9px] md:text-[10px] text-cream/70 font-normal leading-tight truncate">
                                    Owned by Kamakhya Mandal
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Desktop Search Bar */}
                            <SearchBar className="w-96" />

                            <Link to="/" className="text-cream hover:text-secondary transition-colors font-medium whitespace-nowrap">Home</Link>

                            {user && user.role === 'admin' && (
                                <Link to="/admin" className="text-cream hover:text-secondary transition-colors font-medium whitespace-nowrap">Admin</Link>
                            )}

                            <Link to="/cart" className="relative hover:scale-110 transition-transform flex items-center gap-1">
                                <img src={groceryIcon} alt="Cart" className="w-8 h-8 drop-shadow-lg" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={toggleUserDropdown}
                                        className="flex items-center gap-2 bg-primary-light hover:bg-primary text-cream px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg whitespace-nowrap"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{user.name}</span>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-premium-lg border-2 border-cream-dark z-50">
                                            <div className="py-2">
                                                <Link
                                                    to="/orders"
                                                    onClick={closeUserDropdown}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors text-charcoal font-medium"
                                                >
                                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    My Orders
                                                </Link>
                                                <Link
                                                    to="/profile"
                                                    onClick={closeUserDropdown}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors text-charcoal font-medium"
                                                >
                                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/addresses"
                                                    onClick={closeUserDropdown}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors text-charcoal font-medium"
                                                >
                                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Saved Addresses
                                                </Link>
                                                <Link
                                                    to="/support"
                                                    onClick={closeUserDropdown}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors text-charcoal font-medium"
                                                >
                                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                    Support
                                                </Link>
                                                <div className="border-t border-cream-dark my-2"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 font-medium w-full text-left"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="bg-secondary hover:bg-secondary-light px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg whitespace-nowrap">Login</Link>
                                    <Link to="/signup" className="bg-cream hover:bg-cream-dark text-primary px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg whitespace-nowrap">Sign Up</Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Icons - Search Icon + Hamburger Menu */}
                        <div className="md:hidden flex items-center gap-3">
                            {/* Search Icon */}
                            <button
                                onClick={openSearch}
                                className="p-2 hover:bg-primary-light rounded-full transition-colors"
                                aria-label="Open search"
                            >
                                <Search className="w-5 h-5 text-cream" />
                            </button>

                            {/* Hamburger Menu */}
                            <button
                                className="p-2 hover:bg-primary-light rounded-full transition-colors"
                                onClick={toggleMenu}
                                aria-label="Toggle menu"
                            >
                                <Menu className="w-6 h-6 text-cream" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-3 py-4 border-t border-cream/20">
                        <Link to="/" className="text-cream hover:text-secondary transition-colors font-medium px-3 py-2 hover:bg-primary-light rounded-lg" onClick={closeMenu}>Home</Link>

                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="text-cream hover:text-secondary transition-colors font-medium px-3 py-2 hover:bg-primary-light rounded-lg" onClick={closeMenu}>Admin</Link>
                        )}

                        <Link to="/cart" className="hover:text-secondary transition-colors text-left flex items-center gap-2 px-3 py-2 font-medium text-cream hover:bg-primary-light rounded-lg" onClick={closeMenu}>
                            <img src={groceryIcon} alt="Cart" className="w-6 h-6" />
                            Cart ({cart.length})
                        </Link>

                        {user ? (
                            <>
                                <div className="text-secondary font-semibold px-3 py-2 border-b border-cream/20 mt-2">
                                    Hello, {user.name}
                                </div>
                                <Link to="/orders" className="text-cream hover:text-secondary transition-colors font-medium px-3 py-2 flex items-center gap-2 hover:bg-primary-light rounded-lg" onClick={closeMenu}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    My Orders
                                </Link>
                                <Link to="/profile" className="text-cream hover:text-secondary transition-colors font-medium px-3 py-2 flex items-center gap-2 hover:bg-primary-light rounded-lg" onClick={closeMenu}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    My Profile
                                </Link>
                                <Link to="/addresses" className="text-cream hover:text-secondary transition-colors font-medium px-3 py-2 flex items-center gap-2 hover:bg-primary-light rounded-lg" onClick={closeMenu}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Saved Addresses
                                </Link>
                                <Link to="/support" className="text-cream hover:text-secondary transition-colors font-medium px-3 py-2 flex items-center gap-2 hover:bg-primary-light rounded-lg" onClick={closeMenu}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Support
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-xl transition-all duration-300 text-center font-semibold shadow-md flex items-center justify-center gap-2 mt-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="bg-secondary hover:bg-secondary-light px-4 py-2.5 rounded-xl transition-all duration-300 text-center font-semibold shadow-md mt-2" onClick={closeMenu}>Login</Link>
                                <Link to="/signup" className="bg-cream hover:bg-cream-dark text-primary px-4 py-2.5 rounded-xl transition-all duration-300 text-center font-semibold shadow-md" onClick={closeMenu}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
