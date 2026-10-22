import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import AddressMapPicker from '../components/common/AddressMapPicker';
import api from '../utils/api';
import { MapPin, Plus, Check, Trash2, Edit3, ArrowUpRight } from 'lucide-react';

const SavedAddressesPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/auth/addresses');
            setAddresses(data.addresses || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/auth/addresses/${editingId}`, formData);
            } else {
                await api.post('/auth/addresses', formData);
            }
            fetchAddresses();
            resetForm();
        } catch (error) {
            alert('Failed to save address: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (address) => {
        setFormData({
            name: address.name,
            phone: address.phone,
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            isDefault: address.isDefault || false
        });
        setEditingId(address._id);
        setShowForm(true);
    };

    const handleDelete = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/auth/addresses/${addressId}`);
            setAddresses(prev => prev.filter(a => a._id !== addressId));
        } catch (error) {
            alert('Failed to delete address: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await api.patch(`/auth/addresses/${addressId}/default`);
            fetchAddresses();
        } catch (error) {
            alert('Failed to set default address: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleLocationSelect = (locationData) => {
        if (locationData) {
            setFormData(prev => ({
                ...prev,
                addressLine: locationData.address || prev.addressLine,
                city: locationData.city || prev.city,
                state: locationData.state || prev.state,
                pincode: locationData.pincode || prev.pincode
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            addressLine: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: false
        });
        setEditingId(null);
        setShowForm(false);
        setShowMap(false);
    };

    if (authLoading || loading) return <Loader />;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-edge pb-4">
                <div>
                    <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                        Saved addresses
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Manage delivery destinations in Banarhat and Jalpaiguri
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>{showForm ? 'Close form' : 'Add address'}</span>
                </button>
            </div>

            {/* Address Form Card */}
            {showForm && (
                <div className="card-chai p-6 sm:p-8 space-y-6">
                    <h2 className="font-montserrat text-lg font-semibold text-foreground">
                        {editingId ? 'Edit address' : 'Add new address'}
                    </h2>

                    {/* Map Toggle */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowMap(!showMap)}
                            className="inline-flex items-center gap-2 text-xs font-medium text-brand hover:underline"
                        >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{showMap ? 'Hide map' : 'Select location on map'}</span>
                        </button>

                        {showMap && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-card-edge">
                                <AddressMapPicker onLocationSelect={handleLocationSelect} />
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-foreground">
                                    Recipient name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-foreground">
                                    Phone number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="10-digit number"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-foreground">
                                Address line
                            </label>
                            <textarea
                                required
                                rows="3"
                                className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                value={formData.addressLine}
                                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                                placeholder="House / Flat no., Street, Landmark, Area"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-foreground">
                                    City / Town
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Banarhat"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-foreground">
                                    State
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    placeholder="West Bengal"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-foreground">
                                    PIN code
                                </label>
                                <input
                                    type="text"
                                    required
                                    pattern="[0-9]{6}"
                                    className="w-full px-3.5 py-2 rounded-lg border border-card-edge bg-card-fill text-sm text-foreground focus:outline-none focus:border-brand/70"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    placeholder="735202"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                className="rounded border-card-edge text-brand focus:ring-brand/40"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            />
                            <label htmlFor="isDefault" className="text-xs font-medium text-foreground cursor-pointer">
                                Set as default delivery address
                            </label>
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                            <button
                                type="submit"
                                className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                            >
                                <span>{editingId ? 'Update address' : 'Save address'}</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-asym-mirror inline-flex h-9 items-center px-4 text-sm font-medium border border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
                <div className="card-chai max-w-md mx-auto p-10 text-center space-y-3">
                    <MapPin className="w-10 h-10 text-muted-foreground mx-auto stroke-1" />
                    <h3 className="font-montserrat text-lg font-semibold text-foreground">
                        No saved addresses
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Save your home or work address for quick one-click checkouts.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className={`card-chai p-5 space-y-4 relative ${
                                address.isDefault ? 'border-card-edge-hover' : ''
                            }`}
                        >
                            {address.isDefault && (
                                <span className="absolute top-4 right-4 text-[10px] font-medium text-brand border border-brand/30 bg-brand/10 px-2 py-0.5 rounded">
                                    Default
                                </span>
                            )}

                            <div>
                                <h3 className="font-montserrat text-base font-semibold text-foreground">
                                    {address.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">{address.phone}</p>
                            </div>

                            <div className="text-xs sm:text-sm text-muted-foreground space-y-0.5">
                                <p>{address.addressLine}</p>
                                <p>{address.city}, {address.state} - {address.pincode}</p>
                            </div>

                            <div className="pt-2 border-t border-card-edge flex items-center gap-2">
                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(address._id)}
                                        className="text-xs font-medium text-foreground hover:text-brand px-2.5 py-1 rounded border border-card-edge bg-muted/30 transition-colors"
                                    >
                                        Set as default
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="text-xs font-medium text-foreground hover:text-brand px-2.5 py-1 rounded border border-card-edge bg-muted/30 transition-colors inline-flex items-center gap-1"
                                >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(address._id)}
                                    className="text-xs font-medium text-rose-500 hover:text-rose-400 px-2.5 py-1 rounded border border-rose-500/20 bg-rose-500/10 transition-colors inline-flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedAddressesPage;
