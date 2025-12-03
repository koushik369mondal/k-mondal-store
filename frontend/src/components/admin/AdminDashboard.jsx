import React, { useState } from 'react';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('add');

    return (
        <div>
            <div className="bg-white shadow-premium-lg mb-8 border-b-4 border-secondary">
                <div className="container mx-auto px-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('add')}
                            className={`py-5 px-8 font-bold text-base transition-all duration-300 rounded-t-xl ${activeTab === 'add'
                                    ? 'bg-primary text-cream shadow-lg transform -translate-y-1'
                                    : 'text-gray-600 hover:text-primary hover:bg-cream'
                                }`}
                        >
                            Add Product
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`py-5 px-8 font-bold text-base transition-all duration-300 rounded-t-xl ${activeTab === 'products'
                                    ? 'bg-primary text-cream shadow-lg transform -translate-y-1'
                                    : 'text-gray-600 hover:text-primary hover:bg-cream'
                                }`}
                        >
                            Product List
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-5 px-8 font-bold text-base transition-all duration-300 rounded-t-xl ${activeTab === 'orders'
                                    ? 'bg-primary text-cream shadow-lg transform -translate-y-1'
                                    : 'text-gray-600 hover:text-primary hover:bg-cream'
                                }`}
                        >
                            Orders
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                {activeTab === 'add' && <AddProduct onSuccess={() => setActiveTab('products')} />}
                {activeTab === 'products' && <ProductList />}
                {activeTab === 'orders' && <OrderManagement />}
            </div>
        </div>
    );
};

export default AdminDashboard;
