import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <AdminDashboard />
        </div>
    );
};

export default AdminPage;
