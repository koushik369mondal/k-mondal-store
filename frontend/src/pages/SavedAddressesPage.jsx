import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import AddressMapPicker from '../components/common/AddressMapPicker';
import api from '../utils/api';

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
            alert(editingId ? 'Address updated successfully!' : 'Address added successfully!');
        } catch (error) {
            alert('Error: ' + error.response?.data?.message);
        }
    };

    const handleEdit = (address) => {
        setEditingId(address._id);
        setFormData({
            name: address.name,
            phone: address.phone,
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            isDefault: address.isDefault
        });
        setShowForm(true);
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await api.delete(`/auth/addresses/${addressId}`);
                fetchAddresses();
                alert('Address deleted successfully!');
            } catch (error) {
                alert('Error deleting address');
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await api.patch(`/auth/addresses/${addressId}/default`);
            fetchAddresses();
            alert('Default address updated!');
        } catch (error) {
            alert('Error setting default address');
        }
    };

    const handleLocationSelect = (locationData) => {
        if (locationData) {
            setFormData(prev => ({
                ...prev,
                addressLine: locationData.formattedAddress || prev.addressLine,
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

    if (authLoading || loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="card max-w-5xl mx-auto border border-cream-dark">
                <div className="flex justify-between items-center mb-8 border-b-2 border-secondary pb-4">
                    <h1 className="text-4xl font-bold text-charcoal">Saved Addresses</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary px-6 py-3"
                    >
                        {showForm ? 'Cancel' : '+ Add New Address'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-cream/50 rounded-2xl p-6 mb-8 border-2 border-primary">
                        <h2 className="text-2xl font-bold text-charcoal mb-6">
                            {editingId ? 'Edit Address' : 'Add New Address'}
                        </h2>

                        {/* Map Section */}
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={() => setShowMap(!showMap)}
                                className="flex items-center gap-2 bg-secondary text-white font-semibold px-5 py-3 rounded-xl hover:bg-secondary/90 transition-colors mb-4"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                {showMap ? 'Hide Map' : 'Pick Location on Map'}
                            </button>

                            {showMap && (
                                <AddressMapPicker onLocationSelect={handleLocationSelect} />
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-charcoal">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-charcoal">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="input-field"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-charcoal">Address Line</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="input-field"
                                    value={formData.addressLine}
                                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                                    placeholder="House no., Building name, Street"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-charcoal">City</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-charcoal">State</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        placeholder="State"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-charcoal">Pincode</label>
                                    <input
                                        type="text"
                                        required
                                        pattern="[0-9]{6}"
                                        className="input-field"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        placeholder="6-digit pincode"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-cream-dark">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    className="w-5 h-5 accent-primary cursor-pointer"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                />
                                <label htmlFor="isDefault" className="text-base font-semibold text-charcoal cursor-pointer">
                                    Set as default address
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary px-8 py-3">
                                    {editingId ? 'Update Address' : 'Save Address'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-200 hover:bg-gray-300 text-charcoal font-semibold px-8 py-3 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {addresses.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-cream rounded-2xl p-12">
                            <svg className="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h2 className="text-3xl font-bold text-charcoal mb-3">No Saved Addresses</h2>
                            <p className="text-gray-600 text-lg mb-6">
                                Add your first delivery address for faster checkout
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <div
                                key={address._id}
                                className={`relative bg-white rounded-2xl p-6 border-2 transition-all shadow-lg hover:shadow-xl ${address.isDefault ? 'border-secondary' : 'border-cream-dark'
                                    }`}
                            >
                                {address.isDefault && (
                                    <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                                        DEFAULT
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-charcoal mb-1">{address.name}</h3>
                                    <p className="text-primary font-semibold">{address.phone}</p>
                                </div>

                                <div className="text-gray-700 mb-6 space-y-1">
                                    <p>{address.addressLine}</p>
                                    <p>{address.city}, {address.state}</p>
                                    <p className="font-semibold">Pincode: {address.pincode}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(address._id)}
                                            className="text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address._id)}
                                        className="text-sm bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedAddressesPage;
