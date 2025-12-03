import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const MyProfilePage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="card max-w-3xl mx-auto border border-cream-dark">
                <h1 className="text-4xl font-bold text-charcoal mb-8 border-b-2 border-secondary pb-4">
                    My Profile
                </h1>

                <div className="space-y-6">
                    <div className="bg-cream rounded-xl p-6">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                        <p className="text-xl font-bold text-charcoal">{user.name}</p>
                    </div>

                    <div className="bg-cream rounded-xl p-6">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                        <p className="text-xl font-bold text-charcoal">{user.email}</p>
                    </div>

                    <div className="bg-cream rounded-xl p-6">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Account Type</label>
                        <p className="text-xl font-bold text-charcoal capitalize">{user.role}</p>
                    </div>

                    <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-6 text-center">
                        <p className="text-gray-600 text-lg">
                            <strong>Note:</strong> Profile editing feature coming soon!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfilePage;
