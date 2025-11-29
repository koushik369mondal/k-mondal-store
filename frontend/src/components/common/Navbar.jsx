import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-primary text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold" onClick={closeMenu}>
                        K Mondal Store
                    </Link>

                    {/* Hamburger Menu Button */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="hover:text-gray-200">Home</Link>

                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="hover:text-gray-200">Admin</Link>
                        )}

                        <div className="relative">
                            <button className="hover:text-gray-200">
                                Cart ({cart.length})
                            </button>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span>Hello, {user.name}</span>
                                <button onClick={logout} className="hover:text-gray-200">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="hover:text-gray-200">Login</Link>
                                <Link to="/signup" className="hover:text-gray-200">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                    <div className="flex flex-col gap-4 py-4 border-t border-white/20">
                        <Link to="/" className="hover:text-gray-200" onClick={closeMenu}>Home</Link>

                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="hover:text-gray-200" onClick={closeMenu}>Admin</Link>
                        )}

                        <button className="hover:text-gray-200 text-left" onClick={closeMenu}>
                            Cart ({cart.length})
                        </button>

                        {user ? (
                            <>
                                <span className="text-gray-200">Hello, {user.name}</span>
                                <button
                                    onClick={() => {
                                        logout();
                                        closeMenu();
                                    }}
                                    className="hover:text-gray-200 text-left"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-gray-200" onClick={closeMenu}>Login</Link>
                                <Link to="/signup" className="hover:text-gray-200" onClick={closeMenu}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
