import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper to derive product selling price with fallback logic
const deriveSellingPrice = (product) => {
    // Priority: sellingPrice > price > MRP
    if (product.sellingPrice && product.sellingPrice > 0) {
        return product.sellingPrice;
    }
    if (product.price && product.price > 0) {
        return product.price;
    }
    if (product.mrp && product.mrp > 0) {
        return product.mrp;
    }
    return null; // No valid price found
};

// Helper to get product price (backward compatible)
const getProductPrice = (product) => product.sellingPrice || product.price;

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
        const { customerName, customerPhone, customerAddress, items, paymentMethod, deliveryCharges, handlingCharge, codRiskFee, refrigerationCharges } = req.body;
        const userId = req.user?._id; // Get userId if user is authenticated

        console.log('\n=== ORDER CREATION DEBUG ===');
        console.log('Creating order - User ID:', userId);
        console.log('User authenticated:', !!req.user);
        console.log('Request body items:', JSON.stringify(items, null, 2));

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in cart' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            console.log(`\n--- Processing item: ${item.product} ---`);
            console.log('Item data from request:', JSON.stringify(item, null, 2));

            const product = await Product.findById(item.product);
            if (!product) {
                console.error(`Product not found: ${item.product}`);
                return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
            }

            console.log('Product from DB:', {
                _id: product._id,
                title: product.title,
                sellingPrice: product.sellingPrice,
                price: product.price,
                mrp: product.mrp
            });

            // Check if product has enough stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`
                });
            }

            // Derive selling price with fallback logic
            const sellingPrice = deriveSellingPrice(product);
            console.log('Derived sellingPrice:', sellingPrice);

            // Validate that a price exists - if not, return user-friendly error
            if (!sellingPrice) {
                console.error(`No valid price found for product: ${product.title}`);
                console.error('Product pricing:', { sellingPrice: product.sellingPrice, price: product.price, mrp: product.mrp });
                return res.status(400).json({
                    success: false,
                    message: `Product price configuration error for "${product.title}". Please contact support.`
                });
            }

            const orderItem = {
                product: product._id,
                title: product.title,
                price: sellingPrice,
                sellingPrice: sellingPrice,
                quantity: item.quantity
            };

            console.log('Order item to be added:', JSON.stringify(orderItem, null, 2));
            orderItems.push(orderItem);

            totalAmount += sellingPrice * item.quantity;

            // Reduce stock using atomic update to avoid triggering Product validation
            console.log(`Reducing stock for ${product.title}: ${product.stock} -> ${product.stock - item.quantity}`);
            try {
                await Product.updateOne(
                    { _id: product._id },
                    { $inc: { stock: -item.quantity } }
                );
                console.log('✓ Stock updated successfully');
            } catch (stockError) {
                console.error('❌ Stock update failed:', stockError.message);
                throw new Error(`Failed to update stock for ${product.title}`);
            }
        }

        const orderData = {
            customerName,
            customerPhone,
            customerAddress,
            items: orderItems,
            paymentMethod: paymentMethod || 'cod',
            deliveryCharges: deliveryCharges || 0,
            handlingCharge: handlingCharge || 0,
            codRiskFee: codRiskFee || 0,
            refrigerationCharges: refrigerationCharges || 0,
            totalAmount
        };

        console.log('\n--- Final Order Data Before Save ---');
        console.log('Order items count:', orderItems.length);
        console.log('All items have sellingPrice:', orderItems.every(item => item.sellingPrice));
        console.log('Order data:', JSON.stringify(orderData, null, 2));

        // Add userId if user is authenticated
        if (userId) {
            orderData.user = userId;
            console.log('Order will be linked to user:', userId);
        } else {
            console.log('Order created as guest order (no user)');
        }

        console.log('\\n--- Creating Order Document ---');
        console.log('Attempting to save order to database...');

        try {
            const order = await Order.create(orderData);
            console.log('✓ Order created successfully:', order._id);
            console.log('=== ORDER CREATION COMPLETED ===\\n');

            res.status(201).json({ success: true, order });
        } catch (orderSaveError) {
            console.error('\\n❌ ORDER SAVE FAILED ❌');
            console.error('Error name:', orderSaveError.name);
            console.error('Error message:', orderSaveError.message);

            if (orderSaveError.name === 'ValidationError') {
                console.error('Validation errors:', orderSaveError.errors);
                console.error('Failed on model:', orderSaveError.errors[Object.keys(orderSaveError.errors)[0]]?.path);

                const validationMessages = Object.values(orderSaveError.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: `Order validation failed: ${validationMessages.join(', ')}`
                });
            }

            throw orderSaveError; // Re-throw to be caught by outer catch
        }
    } catch (error) {
        console.error('\\n❌ CRITICAL ERROR IN ORDER CREATION ❌');
        console.error('Error type:', error.constructor.name);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Stack trace:', error.stack);

        // Check if it's a mongoose validation error (fallback)
        if (error.name === 'ValidationError') {
            console.error('Model that failed validation:', error.message.split(' ')[0]);
            const validationMessages = Object.values(error.errors || {}).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: `Validation failed: ${validationMessages.join(', ') || error.message}`
            });
        }

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
        const order = await Order.findById(req.params.id).populate('items.product');

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

        // Restore stock for cancelled orders
        for (const item of order.items) {
            if (item.product) {
                const product = await Product.findById(item.product._id || item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
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
