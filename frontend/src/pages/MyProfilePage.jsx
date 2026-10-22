import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import { User, Mail, Shield, KeyRound, ArrowUpRight } from 'lucide-react';

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

    if (loading) return <Loader />;
    if (!user) return <Navigate to="/login" />;

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
            if (!formData.currentPassword) {
                setError('Current password is required to change password');
                return false;
            }

            if (!formData.newPassword) {
                setError('New password is required');
                return false;
            }

            if (formData.newPassword.length < 6) {
                setError('New password must be at least 6 characters');
                return false;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                setError('New passwords do not match');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const updateData = {
                name: formData.name.trim(),
                email: formData.email.trim()
            };

            if (showPasswordSection && formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            await updateProfile(updateData);
            setSuccess('Profile updated successfully');
            setIsEditing(false);
            setShowPasswordSection(false);
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
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
            <div className="flex items-center justify-between border-b border-card-edge pb-4">
                <div>
                    <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                        My profile
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Manage your account settings and credentials
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        Edit profile
                    </button>
                )}
            </div>

            {error && (
                <div className="p-3.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs sm:text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                    {success}
                </div>
            )}

            {!isEditing ? (
                <div className="card-chai p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" /> Full name
                            </span>
                            <p className="font-montserrat text-base font-semibold text-foreground">{user.name}</p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> Email address
                            </span>
                            <p className="font-montserrat text-base font-semibold text-foreground">{user.email}</p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5" /> Role
                            </span>
                            <p className="font-montserrat text-base font-semibold text-foreground capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card-chai p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-foreground">
                                Full name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                placeholder="Enter full name"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-foreground">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                placeholder="Enter email"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="pt-2 border-t border-card-edge">
                            <button
                                type="button"
                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                                className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1.5"
                            >
                                <KeyRound className="w-3.5 h-3.5" />
                                {showPasswordSection ? 'Hide password change' : 'Change password'}
                            </button>

                            {showPasswordSection && (
                                <div className="mt-4 p-4 rounded-lg border border-card-edge bg-muted/20 space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-foreground">
                                            Current password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                            placeholder="Current password"
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-foreground">
                                            New password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                            placeholder="Min. 6 characters"
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-foreground">
                                            Confirm new password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                            placeholder="Confirm new password"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn-asym inline-flex h-9 items-center justify-center gap-2 bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-50"
                            >
                                <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="btn-asym-mirror inline-flex h-9 items-center justify-center px-5 text-sm font-medium border border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyProfilePage;
