const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, mobile, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        res.json({ message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out successfully' });
    });
};
