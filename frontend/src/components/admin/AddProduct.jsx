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
        <div className="card max-w-4xl mx-auto border border-cream-dark">
            <h2 className="text-3xl font-bold mb-8 text-charcoal border-b-2 border-secondary pb-4">Add New Product</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-base font-semibold mb-2 text-charcoal">Product Title</label>
                    <input
                        type="text"
                        required
                        className="input-field"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label className="block text-base font-semibold mb-2 text-charcoal">Description</label>
                    <textarea
                        required
                        rows="4"
                        className="input-field"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter product description"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">Price (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="input-field"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">Category</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., Groceries"
                        />
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">Stock</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="input-field"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-base font-semibold mb-2 text-charcoal">Product Image</label>
                    <input
                        type="file"
                        required
                        accept="image/*"
                        className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light file:cursor-pointer"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-4">
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
