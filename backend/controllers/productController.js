import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
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
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
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
            price,
            category,
            stock,
            image: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });

        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock, isAvailable } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
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

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : product.stock;
        product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;

        await product.save();
        res.json({ success: true, product });
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
