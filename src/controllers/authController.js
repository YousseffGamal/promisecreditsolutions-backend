const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
exports.registerUser = async (req, res) => {
    const { fullName, email, password, confirmPassword, role } = req.body; // Include role

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with the uploaded profile image path
    const user = await User.create({
        fullName,
        email,
        password, // Password will be hashed in the user model
        profileImage: req.file ? req.file.path : null, // Store the uploaded file path
        role: role || 'user', // Pass the role, defaulting to 'user' if none provided
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    // Respond with user data and token
    res.status(201).json({ user, token });
};


// User login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    // Respond with user data and token
    res.json({ user, token });
};