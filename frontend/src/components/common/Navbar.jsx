import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import groceryIcon from '../../public/images/grocery-store.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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

    return (
        <nav className="bg-primary text-cream shadow-premium-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-5">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-3xl font-bold text-secondary hover:text-secondary-light transition-colors" onClick={closeMenu}>
                        K Mondal Store
                    </Link>

                    {/* Hamburger Menu Button */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-primary-light rounded-lg transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={`w-7 h-0.5 bg-cream transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-7 h-0.5 bg-cream transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-7 h-0.5 bg-cream transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-cream hover:text-secondary transition-colors font-medium">Home</Link>

                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="text-cream hover:text-secondary transition-colors font-medium">Admin</Link>
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
                                    className="flex items-center gap-2 bg-primary-light hover:bg-primary text-cream px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
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
                                <Link to="/login" className="bg-secondary hover:bg-secondary-light px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg">Login</Link>
                                <Link to="/signup" className="bg-cream hover:bg-cream-dark text-primary px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 mt-6' : 'max-h-0'}`}>
                    <div className="flex flex-col gap-4 py-4 border-t border-cream/20">
                        <Link to="/" className="text-cream hover:text-secondary transition-colors font-medium px-2" onClick={closeMenu}>Home</Link>

                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="text-cream hover:text-secondary transition-colors font-medium px-2" onClick={closeMenu}>Admin</Link>
                        )}

                        <Link to="/cart" className="hover:text-secondary transition-colors text-left flex items-center gap-2 px-2 font-medium text-cream" onClick={closeMenu}>
                            <img src={groceryIcon} alt="Cart" className="w-6 h-6" />
                            Cart ({cart.length})
                        </Link>

                        {user ? (
                            <>
                                <div className="text-secondary font-semibold px-2 py-2 border-b border-cream/20">
                                    Hello, {user.name}
                                </div>
                                <Link to="/orders" className="text-cream hover:text-secondary transition-colors font-medium px-2 flex items-center gap-2" onClick={closeMenu}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    My Orders
                                </Link>
                                <Link to="/profile" className="text-cream hover:text-secondary transition-colors font-medium px-2 flex items-center gap-2" onClick={closeMenu}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    My Profile
                                </Link>
                                <Link to="/addresses" className="text-cream hover:text-secondary transition-colors font-medium px-2 flex items-center gap-2" onClick={closeMenu}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Saved Addresses
                                </Link>
                                <Link to="/support" className="text-cream hover:text-secondary transition-colors font-medium px-2 flex items-center gap-2" onClick={closeMenu}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Support
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-xl transition-all duration-300 text-center font-semibold shadow-md flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="bg-secondary hover:bg-secondary-light px-4 py-2.5 rounded-xl transition-all duration-300 text-center font-semibold shadow-md" onClick={closeMenu}>Login</Link>
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
