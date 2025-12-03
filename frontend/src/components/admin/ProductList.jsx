import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                            <tr key={product._id} className="border-b border-cream-dark hover:bg-cream transition-colors">
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
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 font-bold transition-all duration-300 px-4 py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
