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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-dark">Product List</h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-neutral-white">
                        <tr>
                            <th className="px-4 py-2 text-left text-dark">Image</th>
                            <th className="px-4 py-2 text-left text-dark">Title</th>
                            <th className="px-4 py-2 text-left text-dark">Price</th>
                            <th className="px-4 py-2 text-left text-dark">Stock</th>
                            <th className="px-4 py-2 text-left text-dark">Category</th>
                            <th className="px-4 py-2 text-left text-dark">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} className="border-b">
                                <td className="px-4 py-2">
                                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                                        <img src={product.image.url} alt={product.title} className="w-full h-full object-contain rounded" />
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-dark">{product.title}</td>
                                <td className="px-4 py-2 text-primary font-semibold">₹{product.price}</td>
                                <td className="px-4 py-2 text-dark">{product.stock}</td>
                                <td className="px-4 py-2 text-dark">{product.category}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="text-red-600 hover:text-red-800 font-semibold transition-colors"
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
