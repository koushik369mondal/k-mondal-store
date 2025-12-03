import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const SavedAddressesPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="card max-w-4xl mx-auto border border-cream-dark">
                <h1 className="text-4xl font-bold text-charcoal mb-8 border-b-2 border-secondary pb-4">
                    Saved Addresses
                </h1>

                <div className="text-center py-16">
                    <div className="bg-cream rounded-2xl p-12">
                        <svg className="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h2 className="text-3xl font-bold text-charcoal mb-3">No Saved Addresses</h2>
                        <p className="text-gray-600 text-lg mb-6">
                            Save your delivery addresses for faster checkout
                        </p>
                        <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-6">
                            <p className="text-gray-600 text-lg">
                                <strong>Note:</strong> Address management feature coming soon!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedAddressesPage;
