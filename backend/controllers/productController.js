import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import PRODUCT_CATEGORIES from '../config/categories.js';

// Helper function to normalize product price for frontend
const normalizeProduct = (product) => {
    const productObj = product.toObject ? product.toObject() : product;
    // Add finalPrice for frontend consumption (backward compatibility)
    productObj.finalPrice = productObj.sellingPrice || productObj.price;
    return productObj;
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        res.json({ success: true, categories: PRODUCT_CATEGORIES });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const { groupByCategory } = req.query;

        // Fetch all products sorted by createdAt
        const products = await Product.find().sort({ createdAt: -1 });

        // Normalize all products with finalPrice
        const normalizedProducts = products.map(normalizeProduct);

        // If groupByCategory query param is provided, group products by category
        if (groupByCategory === 'true') {
            const groupedProducts = {};

            normalizedProducts.forEach(product => {
                const category = product.category || 'Others';

                // Initialize category array if it doesn't exist
                if (!groupedProducts[category]) {
                    groupedProducts[category] = [];
                }

                groupedProducts[category].push(product);
            });

            // Remove 'Select' category if it exists (placeholder only)
            delete groupedProducts['Select'];

            return res.json({ success: true, groupedProducts });
        }

        // Default: return flat array for admin panel and backward compatibility
        res.json({ success: true, products: normalizedProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single product
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product: normalizeProduct(product) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
    try {
        const { title, description, mrp, sellingPrice, category, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        // Validation: if MRP is provided, it must be greater than selling price
        if (mrp && Number(mrp) <= Number(sellingPrice)) {
            return res.status(400).json({
                success: false,
                message: 'MRP must be greater than Selling Price'
            });
        }

        // Upload image to Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'k-mondal-store',
            resource_type: 'auto'
        });

        const product = await Product.create({
            title,
            description,
            mrp: mrp || null,
            sellingPrice,
            price: sellingPrice, // For backward compatibility
            category,
            stock,
            image: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });

        res.status(201).json({ success: true, product: normalizeProduct(product) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
    try {
        const { title, description, mrp, sellingPrice, category, stock, isAvailable } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Validation: if MRP is provided, it must be greater than selling price
        const finalMrp = mrp !== undefined && mrp !== '' ? Number(mrp) : product.mrp;
        const finalSellingPrice = sellingPrice !== undefined && sellingPrice !== '' ? Number(sellingPrice) : product.sellingPrice;

        if (finalMrp && finalMrp <= finalSellingPrice) {
            return res.status(400).json({
                success: false,
                message: 'MRP must be greater than Selling Price'
            });
        }

        // If new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(product.image.publicId);

            // Upload new image
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'k-mondal-store'
            });

            product.image = {
                url: result.secure_url,
                publicId: result.public_id
            };
        }

        // Update fields with exact values provided (no auto-increment)
        // Only update if value is provided, otherwise keep existing
        if (title !== undefined && title !== '') product.title = title;
        if (description !== undefined && description !== '') product.description = description;
        if (mrp !== undefined && mrp !== '') product.mrp = Number(mrp) || null;
        if (sellingPrice !== undefined && sellingPrice !== '') {
            product.sellingPrice = Number(sellingPrice);
            product.price = Number(sellingPrice); // Keep price in sync for backward compatibility
        }
        if (category !== undefined && category !== '') product.category = category;
        if (stock !== undefined && stock !== '') product.stock = Number(stock);
        if (isAvailable !== undefined) product.isAvailable = isAvailable;

        await product.save();
        res.json({ success: true, product: normalizeProduct(product) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(product.image.publicId);

        await product.deleteOne();
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
