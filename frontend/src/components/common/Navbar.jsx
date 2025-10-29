import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    return (
        <nav className="bg-primary text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold">
                        K Mondal Store
                    </Link>

                    <div className="flex items-center gap-6">
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
                            <Link to="/login" className="hover:text-gray-200">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
