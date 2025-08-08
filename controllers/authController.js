const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    // Validate input
    if (!name || !email || !phone || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser  = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser ) {
        return res.status(400).json({ message: 'User  already exists' });
    }

    // Create new user
    const user = new User({ name, email, phone, password, role });
    await user.save();

    // Return user object without password
    res.status(201).json({ user: { name: user.name, email: user.email, phone: user.phone, role: user.role }, message: 'User  registered successfully' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return user data and token
    res.status(200).json({ user: { name: user.name, email: user.email, phone: user.phone, role: user.role }, token });
};
