import React, { useState } from 'react';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('add');

    return (
        <div>
            <div className="bg-white shadow-md mb-6">
                <div className="container mx-auto px-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('add')}
                            className={`py-4 px-6 font-semibold ${activeTab === 'add' ? 'border-b-4 border-primary text-primary' : 'text-gray-600'
                                }`}
                        >
                            Add Product
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`py-4 px-6 font-semibold ${activeTab === 'products' ? 'border-b-4 border-primary text-primary' : 'text-gray-600'
                                }`}
                        >
                            Product List
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-4 px-6 font-semibold ${activeTab === 'orders' ? 'border-b-4 border-primary text-primary' : 'text-gray-600'
                                }`}
                        >
                            Orders
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {activeTab === 'add' && <AddProduct onSuccess={() => setActiveTab('products')} />}
                {activeTab === 'products' && <ProductList />}
                {activeTab === 'orders' && <OrderManagement />}
            </div>
        </div>
    );
};

export default AdminDashboard;
