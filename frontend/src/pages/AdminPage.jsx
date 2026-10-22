import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import Loader from '../components/common/Loader';

const AdminPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <Loader label="Loading admin dashboard..." />;

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="py-8 sm:py-12 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                <div className="card-chai p-6 sm:p-8">
                    <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                        Admin dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Manage inventory, prices, product categories and customer orders
                    </p>
                </div>
            </div>
            <AdminDashboard />
        </div>
    );
};

export default AdminPage;
