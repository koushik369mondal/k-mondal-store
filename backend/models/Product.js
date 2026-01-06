import mongoose from 'mongoose';
import PRODUCT_CATEGORIES from '../config/categories.js';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    mrp: {
        type: Number,
        min: 0,
        default: null
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        min: 0
        // Kept for backward compatibility - synced with sellingPrice
    },
    image: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        enum: PRODUCT_CATEGORIES,
        default: 'Others'
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
