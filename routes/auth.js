const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, idNumber, birthdate, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ idNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = new User({
            name,
            idNumber,
            birthdate,
            password
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });

    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { idNumber, password } = req.body;

        // Find user
        const user = await User.findOne({ idNumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.json({ message: 'Login successful', user });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;