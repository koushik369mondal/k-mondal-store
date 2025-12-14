import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Get user orders (for logged-in users)
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('Fetching orders for user:', userId);

        const orders = await Order.find({ user: userId })
            .populate('items.product')
            .sort({ createdAt: -1 });

        console.log(`Found ${orders.length} orders for user ${userId}`);

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new order
export const createOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, customerAddress, items } = req.body;
        const userId = req.user?._id; // Get userId if user is authenticated

        console.log('Creating order - User ID:', userId);
        console.log('User authenticated:', !!req.user);

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in cart' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
            }

            orderItems.push({
                product: product._id,
                title: product.title,
                price: product.price,
                quantity: item.quantity
            });

            totalAmount += product.price * item.quantity;
        }

        const orderData = {
            customerName,
            customerPhone,
            customerAddress,
            items: orderItems,
            totalAmount
        };

        // Add userId if user is authenticated
        if (userId) {
            orderData.user = userId;
            console.log('Order will be linked to user:', userId);
        } else {
            console.log('Order created as guest order (no user)');
        }

        const order = await Order.create(orderData);
        console.log('Order created:', order._id);

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single order
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Ensure user can only view their own orders (unless admin)
        if (req.user.role !== 'admin' && order.user && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel order (User can cancel their own orders)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Ensure user can only cancel their own orders (unless admin)
        if (req.user.role !== 'admin' && order.user && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
        }

        // Check if order can be cancelled (only pending and confirmed orders)
        if (order.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Order is already cancelled' });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({ success: false, message: 'Cannot cancel delivered orders' });
        }

        order.status = 'cancelled';
        await order.save();

        res.json({ success: true, message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete order (Admin only)
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        await order.deleteOne();
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
