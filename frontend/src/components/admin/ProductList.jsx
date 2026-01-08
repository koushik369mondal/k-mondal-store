import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../utils/api';
import PRODUCT_CATEGORIES from '../../utils/categories';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        mrp: '',
        sellingPrice: '',
        category: '',
        stock: ''
    });
    const [newImage, setNewImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get('/products');
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Memoized filtered products for better performance
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;

        const query = searchQuery.toLowerCase();
        return products.filter(product =>
            product.title?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query) ||
            product._id?.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    const handleEdit = useCallback((product) => {
        setEditingProduct(product._id);
        setEditForm({
            title: product.title || '',
            description: product.description || '',
            mrp: product.mrp || '',
            sellingPrice: product.sellingPrice || product.price || '',
            category: product.category || '',
            stock: product.stock || 0
        });
        setNewImage(null);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingProduct(null);
        setEditForm({
            title: '',
            description: '',
            mrp: '',
            sellingPrice: '',
            category: '',
            stock: ''
        });
        setNewImage(null);
    }, []);

    const handleUpdate = async (id) => {
        try {
            // Validation
            if (!editForm.title.trim()) {
                alert('Product title is required');
                return;
            }
            if (!editForm.sellingPrice || Number(editForm.sellingPrice) <= 0) {
                alert('Selling Price is required and must be greater than 0');
                return;
            }
            if (!editForm.category) {
                alert('Please select a category');
                return;
            }
            if (editForm.stock < 0) {
                alert('Stock cannot be negative');
                return;
            }
            // Validate MRP vs Selling Price if MRP is provided
            if (editForm.mrp && editForm.mrp > 0 && Number(editForm.mrp) <= Number(editForm.sellingPrice)) {
                alert('MRP must be greater than Selling Price');
                return;
            }

            const formData = new FormData();
            formData.append('title', editForm.title.trim());
            formData.append('description', editForm.description.trim());
            if (editForm.mrp && editForm.mrp > 0) {
                formData.append('mrp', editForm.mrp);
            }
            formData.append('sellingPrice', editForm.sellingPrice);
            formData.append('category', editForm.category);
            formData.append('stock', editForm.stock);

            if (newImage) {
                formData.append('image', newImage);
            }

            await api.put(`/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Product updated successfully!');
            handleCancelEdit();
            fetchProducts();
        } catch (error) {
            console.error('Update error:', error);
            alert('Error updating product: ' + (error.response?.data?.message || 'Please try again'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting product: ' + (error.response?.data?.message || 'Please try again'));
        }
    };

    const calculateDiscount = (mrp, price) => {
        if (!mrp || !price || mrp <= price) return null;
        return Math.round(((mrp - price) / mrp) * 100);
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate image file
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPG, PNG, or WebP)');
                e.target.value = '';
                return;
            }
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should not exceed 5MB');
                e.target.value = '';
                return;
            }
            setNewImage(file);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12 text-xl font-semibold text-charcoal">
                Loading products...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-xl font-semibold mb-4">{error}</p>
                <button
                    onClick={fetchProducts}
                    className="btn-primary px-6 py-2"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="card border border-cream-dark">
            {/* Header with Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 pb-4 border-b-2 border-secondary">
                <h2 className="text-3xl font-bold text-charcoal">
                    Product List
                </h2>

                {/* Search Bar */}
                <div className="lg:max-w-md w-full">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products by name, category, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12 pr-4 w-full"
                            aria-label="Search products"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="text-sm text-gray-600 mt-2">
                            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-cream-dark">
                <table className="w-full">
                    <thead className="bg-primary text-cream">
                        <tr>
                            <th className="px-4 py-4 text-center font-bold w-16">SL</th>
                            <th className="px-6 py-4 text-left font-bold">Image</th>
                            <th className="px-6 py-4 text-left font-bold">Title</th>
                            <th className="px-6 py-4 text-left font-bold">MRP</th>
                            <th className="px-6 py-4 text-left font-bold">Selling Price</th>
                            <th className="px-6 py-4 text-left font-bold">Stock</th>
                            <th className="px-6 py-4 text-left font-bold">Category</th>
                            <th className="px-6 py-4 text-left font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                    {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product, index) => {
                                const finalPrice = product.finalPrice || product.sellingPrice || product.price;
                                const discount = calculateDiscount(product.mrp, finalPrice);

                                return (
                                    <React.Fragment key={product._id}>
                                        <tr className="border-b border-cream-dark hover:bg-cream transition-colors">
                                            <td className="px-4 py-4 text-center font-semibold text-charcoal">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-cream-dark shadow-sm">
                                                    <img
                                                        src={product.image?.url}
                                                        alt={product.title}
                                                        className="w-full h-full object-contain rounded-xl p-2"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-charcoal font-semibold">
                                                {product.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.mrp ? (
                                                    <span className="text-gray-500 line-through">₹{product.mrp}</span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-secondary font-bold text-lg">
                                                        ₹{finalPrice}
                                                    </span>
                                                    {discount && (
                                                        <span className="text-xs text-green-600 font-semibold">
                                                            {discount}% off
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-semibold ${product.stock > 0 ? 'text-charcoal' : 'text-red-600'}`}>
                                                    {product.stock}
                                                    {product.stock === 0 && ' (Out of Stock)'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-charcoal">{product.category}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="text-primary hover:text-white bg-primary/10 hover:bg-primary font-bold transition-all duration-300 px-4 py-2 rounded-lg"
                                                        disabled={editingProduct !== null}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 font-bold transition-all duration-300 px-4 py-2 rounded-lg"
                                                        disabled={editingProduct !== null}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {editingProduct === product._id && (
                                            <tr className="bg-cream/50">
                                                <td colSpan="8" className="px-6 py-6">
                                                    <div className="bg-white rounded-xl p-6 border-2 border-primary shadow-lg">
                                                        <h3 className="text-xl font-bold text-charcoal mb-4 border-b-2 border-secondary pb-2">
                                                            Edit Product
                                                        </h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2 text-charcoal">
                                                                    Product Title <span className="text-red-600">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="input-field"
                                                                    value={editForm.title}
                                                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2 text-charcoal">
                                                                    Category <span className="text-red-600">*</span>
                                                                </label>
                                                                <select
                                                                    className="input-field cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%230F3D2E%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12"
                                                                    value={editForm.category}
                                                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                                                    required
                                                                >
                                                                    <option value="">Select Category</option>
                                                                    {PRODUCT_CATEGORIES.map((category) => (
                                                                        <option key={category} value={category}>
                                                                            {category}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2 text-charcoal">
                                                                    MRP (₹) <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="input-field"
                                                                    value={editForm.mrp}
                                                                    onChange={(e) => handleInputChange('mrp', e.target.value)}
                                                                    placeholder="Leave empty if no discount"
                                                                    min="0"
                                                                    step="0.01"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2 text-charcoal">
                                                                    Selling Price (₹) <span className="text-red-600">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="input-field"
                                                                    value={editForm.sellingPrice}
                                                                    onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                                                                    required
                                                                    min="0"
                                                                    step="0.01"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2 text-charcoal">
                                                                    Stock <span className="text-red-600">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="input-field"
                                                                    value={editForm.stock}
                                                                    onChange={(e) => handleInputChange('stock', e.target.value)}
                                                                    required
                                                                    min="0"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <label className="block text-sm font-semibold mb-2 text-charcoal">
                                                                Description
                                                            </label>
                                                            <textarea
                                                                className="input-field"
                                                                rows="3"
                                                                value={editForm.description}
                                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                                placeholder="Enter product description..."
                                                            />
                                                        </div>

                                                        <div className="mb-4">
                                                            <label className="block text-sm font-semibold mb-2 text-charcoal">
                                                                Update Image (Optional)
                                                            </label>
                                                            <input
                                                                type="file"
                                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                                className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light file:cursor-pointer"
                                                                onChange={handleImageChange}
                                                            />
                                                            {newImage && (
                                                                <p className="text-sm text-green-600 mt-2">
                                                                    Selected: {newImage.name}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => handleUpdate(product._id)}
                                                                className="btn-primary px-6 py-2"
                                                            >
                                                                Save Changes
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="bg-gray-200 hover:bg-gray-300 text-charcoal font-semibold px-6 py-2 rounded-xl transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
