import React, { useState } from 'react';
import api from '../../utils/api';
import PRODUCT_CATEGORIES from '../../utils/categories';

const AddProduct = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mrp: '',
        sellingPrice: '',
        category: '',
        stock: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate MRP vs Selling Price
        if (formData.mrp && Number(formData.mrp) <= Number(formData.sellingPrice)) {
            setError('MRP must be greater than Selling Price');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            if (formData.mrp) data.append('mrp', formData.mrp);
            data.append('sellingPrice', formData.sellingPrice);
            data.append('category', formData.category);
            data.append('stock', formData.stock);
            data.append('image', image);

            await api.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Product added successfully!');
            setFormData({ title: '', description: '', mrp: '', sellingPrice: '', category: '', stock: '' });
            setImage(null);
            setError('');
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || 'Error adding product');
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

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">
                            MRP (₹) <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="input-field"
                            value={formData.mrp}
                            onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                            placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty if no discount</p>
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">
                            Selling Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            className="input-field"
                            value={formData.sellingPrice}
                            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                            placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Actual selling price</p>
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-charcoal">Category</label>
                        <select
                            required
                            className="input-field cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%230F3D2E%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="" className="text-gray-400">Select a category</option>
                            {PRODUCT_CATEGORIES.map((category) => (
                                <option key={category} value={category} className="text-charcoal">
                                    {category}
                                </option>
                            ))}
                        </select>
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
