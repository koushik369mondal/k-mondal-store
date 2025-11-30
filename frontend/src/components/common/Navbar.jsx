import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import groceryIcon from '../../public/images/grocery-store.png';

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
                        <Link to="/" className="hover:text-soft-gold transition-colors">Home</Link>

                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="hover:text-soft-gold transition-colors">Admin</Link>
                        )}

                        <Link to="/cart" className="relative hover:opacity-80 transition-opacity flex items-center gap-1">
                            <img src={groceryIcon} alt="Cart" className="w-7 h-7" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span>Hello, {user.name}</span>
                                <button onClick={logout} className="bg-secondary hover:bg-soft-gold px-4 py-2 rounded-lg transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="bg-secondary hover:bg-soft-gold px-4 py-2 rounded-lg transition-colors">Login</Link>
                                <Link to="/signup" className="bg-secondary hover:bg-soft-gold px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                    <div className="flex flex-col gap-4 py-4 border-t border-white/20">
                        <Link to="/" className="hover:text-soft-gold transition-colors" onClick={closeMenu}>Home</Link>

                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="hover:text-soft-gold transition-colors" onClick={closeMenu}>Admin</Link>
                        )}

                        <Link to="/cart" className="hover:opacity-80 transition-opacity text-left flex items-center gap-2" onClick={closeMenu}>
                            <img src={groceryIcon} alt="Cart" className="w-6 h-6" />
                            Cart ({cart.length})
                        </Link>

                        {user ? (
                            <>
                                <span className="text-soft-gold">Hello, {user.name}</span>
                                <button
                                    onClick={() => {
                                        logout();
                                        closeMenu();
                                    }}
                                    className="hover:text-soft-gold transition-colors text-left"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="bg-secondary hover:bg-soft-gold px-4 py-2 rounded-lg transition-colors text-center" onClick={closeMenu}>Login</Link>
                                <Link to="/signup" className="bg-secondary hover:bg-soft-gold px-4 py-2 rounded-lg transition-colors text-center" onClick={closeMenu}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
