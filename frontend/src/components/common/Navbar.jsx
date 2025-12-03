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
                            <div className="flex items-center gap-4">
                                <span className="text-cream font-medium">Hello, <span className="text-secondary font-semibold">{user.name}</span></span>
                                <button onClick={logout} className="bg-secondary hover:bg-secondary-light px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
                                    Logout
                                </button>
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
                                <span className="text-secondary font-semibold px-2">Hello, {user.name}</span>
                                <button
                                    onClick={() => {
                                        logout();
                                        closeMenu();
                                    }}
                                    className="bg-secondary hover:bg-secondary-light px-4 py-2.5 rounded-xl transition-all duration-300 text-center font-semibold shadow-md"
                                >
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
