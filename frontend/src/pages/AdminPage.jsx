import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-secondary"></div></div>;

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="py-12 min-h-screen">
            <div className="container mx-auto px-6 mb-10">
                <div className="bg-gradient-to-r from-primary to-primary-light text-cream rounded-2xl shadow-premium-lg p-8 border-b-4 border-secondary">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <p className="text-cream/90 mt-2 text-lg">Manage your store products and orders</p>
                </div>
            </div>
            <AdminDashboard />
        </div>
    );
};

export default AdminPage;
