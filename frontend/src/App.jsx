import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CacheWarmer from './components/common/CacheWarmer';
import Chatbot from './components/common/Chatbot';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import MyProfilePage from './pages/MyProfilePage';
import SavedAddressesPage from './pages/SavedAddressesPage';
import SupportPage from './pages/SupportPage';

function App() {
    // Auto-refresh functionality - triggers once on initial page load
    useEffect(() => {
        const hasRefreshed = sessionStorage.getItem('hasRefreshed');

        if (!hasRefreshed) {
            // Mark as refreshed to prevent continuous loops
            sessionStorage.setItem('hasRefreshed', 'true');
            // Reload the page
            window.location.reload();
        }
    }, []);

    return (
        <Router>
            <CacheWarmer />
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/product/:id" element={<ProductDetailsPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/orders" element={<MyOrdersPage />} />
                        <Route path="/profile" element={<MyProfilePage />} />
                        <Route path="/addresses" element={<SavedAddressesPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        {/* Catch-all route: redirect any unknown routes to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
                <Chatbot />
            </div>
        </Router>
    );
}

export default App;
