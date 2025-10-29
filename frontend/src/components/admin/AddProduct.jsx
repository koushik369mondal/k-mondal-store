import React, { useState } from 'react';
import api from '../../utils/api';

const AddProduct = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);
            data.append('image', image);

            await api.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Product added successfully!');
            setFormData({ title: '', description: '', price: '', category: '', stock: '' });
            setImage(null);
            onSuccess();
        } catch (error) {
            alert('Error adding product: ' + error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Product Title</label>
                    <input
                        type="text"
                        required
                        className="input-field"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        required
                        rows="3"
                        className="input-field"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Price (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="input-field"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Stock</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="input-field"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Product Image</label>
                    <input
                        type="file"
                        required
                        accept="image/*"
                        className="input-field"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
