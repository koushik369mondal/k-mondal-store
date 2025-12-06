import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product._id);
        setEditForm({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock
        });
        setNewImage(null);
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setEditForm({
            title: '',
            description: '',
            price: '',
            category: '',
            stock: ''
        });
        setNewImage(null);
    };

    const handleUpdate = async (id) => {
        try {
            const formData = new FormData();
            formData.append('title', editForm.title);
            formData.append('description', editForm.description);
            formData.append('price', editForm.price);
            formData.append('category', editForm.category);
            formData.append('stock', editForm.stock);
            if (newImage) {
                formData.append('image', newImage);
            }

            await api.put(`/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Product updated successfully!');
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            alert('Error updating product: ' + error.response?.data?.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    if (loading) return <div className="text-center py-12 text-xl font-semibold text-charcoal">Loading...</div>;

    return (
        <div className="card border border-cream-dark">
            <h2 className="text-3xl font-bold mb-8 text-charcoal border-b-2 border-secondary pb-4">Product List</h2>

            <div className="overflow-x-auto rounded-xl border border-cream-dark">
                <table className="w-full">
                    <thead className="bg-primary text-cream">
                        <tr>
                            <th className="px-6 py-4 text-left font-bold">Image</th>
                            <th className="px-6 py-4 text-left font-bold">Title</th>
                            <th className="px-6 py-4 text-left font-bold">Price</th>
                            <th className="px-6 py-4 text-left font-bold">Stock</th>
                            <th className="px-6 py-4 text-left font-bold">Category</th>
                            <th className="px-6 py-4 text-left font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <React.Fragment key={product._id}>
                                <tr className="border-b border-cream-dark hover:bg-cream transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-cream-dark shadow-sm">
                                            <img src={product.image.url} alt={product.title} className="w-full h-full object-contain rounded-xl p-2" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-charcoal font-semibold">{product.title}</td>
                                    <td className="px-6 py-4 text-secondary font-bold text-lg">₹{product.price}</td>
                                    <td className="px-6 py-4 text-charcoal font-semibold">{product.stock}</td>
                                    <td className="px-6 py-4 text-charcoal">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-primary hover:text-white bg-primary/10 hover:bg-primary font-bold transition-all duration-300 px-4 py-2 rounded-lg"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 font-bold transition-all duration-300 px-4 py-2 rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {editingProduct === product._id && (
                                    <tr className="bg-cream/50">
                                        <td colSpan="6" className="px-6 py-6">
                                            <div className="bg-white rounded-xl p-6 border-2 border-primary shadow-lg">
                                                <h3 className="text-xl font-bold text-charcoal mb-4 border-b-2 border-secondary pb-2">Edit Product</h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2 text-charcoal">Product Title</label>
                                                        <input
                                                            type="text"
                                                            className="input-field"
                                                            value={editForm.title}
                                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2 text-charcoal">Price (₹)</label>
                                                        <input
                                                            type="number"
                                                            className="input-field"
                                                            value={editForm.price}
                                                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2 text-charcoal">Category</label>
                                                        <select
                                                            className="input-field cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%230F3D2E%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12"
                                                            value={editForm.category}
                                                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                        >
                                                            <option value="Groceries">Groceries</option>
                                                            <option value="Soft Drink">Soft Drink</option>
                                                            <option value="Cake">Cake</option>
                                                            <option value="Rice">Rice</option>
                                                            <option value="Dal">Dal</option>
                                                            <option value="Oil & Ghee">Oil & Ghee</option>
                                                            <option value="Masala & Spices">Masala & Spices</option>
                                                            <option value="Snacks">Snacks</option>
                                                            <option value="Personal Care">Personal Care</option>
                                                            <option value="Home Care">Home Care</option>
                                                            <option value="Baby Care">Baby Care</option>
                                                            <option value="Pet Care">Pet Care</option>
                                                            <option value="Others">Others</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2 text-charcoal">Stock</label>
                                                        <input
                                                            type="number"
                                                            className="input-field"
                                                            value={editForm.stock}
                                                            onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-semibold mb-2 text-charcoal">Description</label>
                                                    <textarea
                                                        className="input-field"
                                                        rows="3"
                                                        value={editForm.description}
                                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-semibold mb-2 text-charcoal">Update Image (Optional)</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light file:cursor-pointer"
                                                        onChange={(e) => setNewImage(e.target.files[0])}
                                                    />
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
