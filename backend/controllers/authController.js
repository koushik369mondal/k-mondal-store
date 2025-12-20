import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get current user
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
            user.email = email;
        }

        // Update name if provided
        if (name) {
            user.name = name;
        }

        // Handle password change
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is required to change password'
                });
            }

            // Verify current password
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            user.password = newPassword;
        }

        await user.save();

        // Return user without password
        const updatedUser = await User.findById(user._id).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user addresses
export const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('addresses');
        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add new address
export const addAddress = async (req, res) => {
    try {
        const { name, phone, addressLine, city, state, pincode, isDefault } = req.body;

        const user = await User.findById(req.user.id);

        // If this is the first address or marked as default, make it default
        if (user.addresses.length === 0 || isDefault) {
            // Remove default from all other addresses
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push({
            name,
            phone,
            addressLine,
            city,
            state,
            pincode,
            isDefault: user.addresses.length === 0 || isDefault
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update address
export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { name, phone, addressLine, city, state, pincode, isDefault } = req.body;

        const user = await User.findById(req.user.id);
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // If marking as default, remove default from others
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        address.name = name;
        address.phone = phone;
        address.addressLine = addressLine;
        address.city = city;
        address.state = state;
        address.pincode = pincode;
        address.isDefault = isDefault;

        await user.save();

        res.json({
            success: true,
            message: 'Address updated successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete address
export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.user.id);
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        const wasDefault = address.isDefault;
        address.deleteOne();

        // If deleted address was default and there are other addresses, make first one default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Address deleted successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.user.id);
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // Remove default from all addresses
        user.addresses.forEach(addr => addr.isDefault = false);

        // Set this address as default
        address.isDefault = true;

        await user.save();

        res.json({
            success: true,
            message: 'Default address updated successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
