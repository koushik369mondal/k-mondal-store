import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const MyProfilePage = () => {
    const { user, loading, updateProfile } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleEdit = () => {
        setFormData({
            name: user.name,
            email: user.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsEditing(true);
        setError('');
        setSuccess('');
        setShowPasswordSection(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccess('');
        setShowPasswordSection(false);
        setFormData({
            name: '',
            email: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (showPasswordSection) {
            if (!formData.newPassword) {
                setError('New password is required');
                return false;
            }

            if (formData.newPassword.length < 6) {
                setError('New password must be at least 6 characters');
                return false;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }

            if (!formData.currentPassword) {
                setError('Current password is required to change password');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setIsSaving(true);

        try {
            const updateData = {
                name: formData.name,
                email: formData.email
            };

            if (showPasswordSection && formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const response = await updateProfile(updateData);
            setSuccess(response.message || 'Profile updated successfully!');
            setIsEditing(false);
            setShowPasswordSection(false);
            setFormData({
                name: '',
                email: '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="card max-w-3xl mx-auto border border-cream-dark">
                <div className="flex justify-between items-center mb-8 border-b-2 border-secondary pb-4">
                    <h1 className="text-4xl font-bold text-charcoal">
                        My Profile
                    </h1>
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="btn-secondary px-6 py-2 text-sm"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6">
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-2 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-6">
                        <p className="font-semibold">{success}</p>
                    </div>
                )}

                {!isEditing ? (
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
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary transition-colors"
                                placeholder="Enter your full name"
                                disabled={isSaving}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary transition-colors"
                                placeholder="Enter your email"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="border-t-2 border-gray-200 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                                className="text-secondary font-semibold hover:text-primary transition-colors mb-4"
                            >
                                {showPasswordSection ? '− Hide' : '+ Change'} Password
                            </button>

                            {showPasswordSection && (
                                <div className="space-y-4 bg-cream rounded-xl p-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Current Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary transition-colors"
                                            placeholder="Enter current password"
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            New Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary transition-colors"
                                            placeholder="Enter new password (min. 6 characters)"
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Confirm New Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary transition-colors"
                                            placeholder="Confirm new password"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MyProfilePage;
