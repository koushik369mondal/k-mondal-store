import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { Search, X, Menu, ShoppingCart, User, Package, MapPin, HelpCircle, LogOut, Shield } from 'lucide-react';
import SearchBar from './SearchBar';
import ThemeSwitcher from './ThemeSwitcher';
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
    const [scrolled, setScrolled] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
        if (!isMenuOpen) setIsSearchOpen(false);
    };

    const closeMenu = () => setIsMenuOpen(false);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(prev => !prev);
    };

    const closeUserDropdown = () => setIsUserDropdownOpen(false);

    const handleLogout = () => {
        logout();
        closeUserDropdown();
        closeMenu();
    };

    const openSearch = () => {
        setIsSearchOpen(true);
        setIsMenuOpen(false);
        setTimeout(() => searchInputRef.current?.focus(), 100);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
    };

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchQuery(params.get('q') || '');
    }, [location.search]);

    const totalCartCount = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

    return (
        <header
            className={`sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
                scrolled
                    ? 'bg-background/80 backdrop-blur-md border-b border-border/40'
                    : 'bg-transparent border-b border-transparent'
            }`}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
                {isSearchOpen ? (
                    /* Mobile Search Mode */
                    <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-card-edge bg-background/90 backdrop-blur-md">
                            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search products, brands, categories..."
                                className="flex-1 outline-none text-sm text-foreground placeholder:text-muted-foreground bg-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        handleSearch('');
                                        searchInputRef.current?.focus();
                                    }}
                                    className="p-1 text-muted-foreground hover:text-foreground"
                                    aria-label="Clear search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={closeSearch}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Close search"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    /* Normal Header Bar */
                    <nav className="flex items-center justify-between gap-4 sm:gap-6">
                        {/* Brand Logo & Name */}
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 group hover:opacity-95 transition-opacity flex-shrink-0"
                            onClick={closeMenu}
                        >
                            <img
                                src={logo}
                                alt="K Mondal Store"
                                className="w-8 h-8 sm:w-9 sm:h-9 object-contain flex-shrink-0 rounded-md"
                            />
                            <div className="flex flex-col">
                                <span className="font-brand font-medium text-base sm:text-lg tracking-tight text-foreground group-hover:text-brand transition-colors">
                                    K Mondal Store
                                </span>
                                <span className="text-[10px] sm:text-[11px] text-muted-foreground font-normal -mt-0.5">
                                    Owned by Kamakhya Mandal
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Search Bar - Fills the space nicely */}
                        <div className="hidden md:block flex-1 max-w-xl lg:max-w-3xl xl:max-w-4xl mx-4 lg:mx-8">
                            <SearchBar />
                        </div>

                        {/* Desktop Navigation Links & Actions */}
                        <div className="hidden md:flex items-center gap-5">
                            <Link
                                to="/"
                                className={`text-sm font-medium transition-colors hover:text-brand ${
                                    location.pathname === '/' ? 'text-foreground font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                Home
                            </Link>

                            {user && user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand transition-colors"
                                >
                                    <Shield className="w-4 h-4" />
                                    Admin
                                </Link>
                            )}

                            {/* Cart Link */}
                            <Link
                                to="/cart"
                                aria-label="View cart"
                                className="relative inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-brand transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {totalCartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 px-1.5 min-w-[1.125rem] h-4.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center border border-card-edge">
                                        {totalCartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Theme Switcher */}
                            <ThemeSwitcher />

                            {/* User Profile / Auth */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={toggleUserDropdown}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-card-edge bg-card-fill hover:border-card-edge-hover transition-colors text-foreground"
                                    >
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="max-w-[120px] truncate">{user.name}</span>
                                    </button>

                                    {/* User Dropdown */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-52 rounded-lg border border-gray-400/20 bg-background/95 p-1.5 backdrop-blur-lg dark:border-orange-50/10 z-50">
                                            <div className="px-3 py-2 border-b border-border/40 text-xs text-muted-foreground">
                                                Signed in as <span className="font-semibold text-foreground block truncate">{user.name}</span>
                                            </div>
                                            <Link
                                                to="/orders"
                                                onClick={closeUserDropdown}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:text-brand transition-colors rounded-md hover:bg-muted/50"
                                            >
                                                <Package className="w-4 h-4 text-muted-foreground" />
                                                My orders
                                            </Link>
                                            <Link
                                                to="/profile"
                                                onClick={closeUserDropdown}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:text-brand transition-colors rounded-md hover:bg-muted/50"
                                            >
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                My profile
                                            </Link>
                                            <Link
                                                to="/addresses"
                                                onClick={closeUserDropdown}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:text-brand transition-colors rounded-md hover:bg-muted/50"
                                            >
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                Saved addresses
                                            </Link>
                                            <Link
                                                to="/support"
                                                onClick={closeUserDropdown}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:text-brand transition-colors rounded-md hover:bg-muted/50"
                                            >
                                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                                Support
                                            </Link>
                                            <div className="border-t border-border/40 my-1"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:text-red-400 transition-colors w-full text-left rounded-md hover:bg-red-500/10"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium px-3 py-1.5 rounded-md text-foreground hover:text-brand transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="text-sm font-medium px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Actions: Search, Cart, Theme, Hamburger */}
                        <div className="md:hidden flex items-center gap-1.5">
                            <button
                                onClick={openSearch}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Open search"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            <Link
                                to="/cart"
                                aria-label="View cart"
                                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {totalCartCount > 0 && (
                                    <span className="absolute top-1 right-1 px-1 min-w-[1rem] h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-semibold flex items-center justify-center border border-card-edge">
                                        {totalCartCount}
                                    </span>
                                )}
                            </Link>

                            <ThemeSwitcher />

                            <button
                                onClick={toggleMenu}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Toggle navigation menu"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </nav>
                )}
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-card-edge bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="block text-sm font-medium text-foreground hover:text-brand px-2 py-1.5 rounded-md"
                    >
                        Home
                    </Link>

                    {user && user.role === 'admin' && (
                        <Link
                            to="/admin"
                            onClick={closeMenu}
                            className="block text-sm font-medium text-foreground hover:text-brand px-2 py-1.5 rounded-md"
                        >
                            Admin portal
                        </Link>
                    )}

                    <Link
                        to="/cart"
                        onClick={closeMenu}
                        className="flex items-center justify-between text-sm font-medium text-foreground hover:text-brand px-2 py-1.5 rounded-md"
                    >
                        <span>Cart</span>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-card-edge bg-muted text-foreground">
                            {totalCartCount} items
                        </span>
                    </Link>

                    {user ? (
                        <div className="pt-2 border-t border-border/40 space-y-1">
                            <div className="px-2 py-1 text-xs text-muted-foreground">
                                Signed in as <span className="font-semibold text-foreground">{user.name}</span>
                            </div>
                            <Link
                                to="/orders"
                                onClick={closeMenu}
                                className="flex items-center gap-2 text-sm text-foreground hover:text-brand px-2 py-1.5 rounded-md"
                            >
                                <Package className="w-4 h-4 text-muted-foreground" />
                                My orders
                            </Link>
                            <Link
                                to="/profile"
                                onClick={closeMenu}
                                className="flex items-center gap-2 text-sm text-foreground hover:text-brand px-2 py-1.5 rounded-md"
                            >
                                <User className="w-4 h-4 text-muted-foreground" />
                                My profile
                            </Link>
                            <Link
                                to="/addresses"
                                onClick={closeMenu}
                                className="flex items-center gap-2 text-sm text-foreground hover:text-brand px-2 py-1.5 rounded-md"
                            >
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                Saved addresses
                            </Link>
                            <Link
                                to="/support"
                                onClick={closeMenu}
                                className="flex items-center gap-2 text-sm text-foreground hover:text-brand px-2 py-1.5 rounded-md"
                            >
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                Support
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 px-2 py-1.5 rounded-md w-full text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <div className="pt-2 border-t border-border/40 flex items-center gap-3">
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="flex-1 text-center text-sm font-medium py-2 rounded-md border border-card-edge bg-card-fill text-foreground hover:border-card-edge-hover"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/signup"
                                onClick={closeMenu}
                                className="flex-1 text-center text-sm font-medium py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
