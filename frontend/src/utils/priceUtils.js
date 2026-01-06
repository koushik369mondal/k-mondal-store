/**
 * Utility functions for pricing and discount calculations
 */

/**
 * Calculate discount percentage
 * @param {number} mrp - Maximum Retail Price
 * @param {number} sellingPrice - Actual selling price
 * @returns {number} Discount percentage (rounded)
 */
export const calculateDiscountPercent = (mrp, sellingPrice) => {
    if (!mrp || mrp <= sellingPrice) return 0;
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
};

/**
 * Calculate discount amount
 * @param {number} mrp - Maximum Retail Price
 * @param {number} sellingPrice - Actual selling price
 * @returns {number} Discount amount
 */
export const calculateDiscountAmount = (mrp, sellingPrice) => {
    if (!mrp || mrp <= sellingPrice) return 0;
    return mrp - sellingPrice;
};

/**
 * Check if product has a discount
 * @param {number} mrp - Maximum Retail Price
 * @param {number} sellingPrice - Actual selling price
 * @returns {boolean} True if product has discount
 */
export const hasDiscount = (mrp, sellingPrice) => {
    return mrp && mrp > sellingPrice;
};

/**
 * Format price for display
 * @param {number} price - Price to format
 * @returns {string} Formatted price with ₹ symbol
 */
export const formatPrice = (price) => {
    return `₹${price}`;
};
