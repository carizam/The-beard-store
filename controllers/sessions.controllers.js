const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

/**
 * User login
 * @route POST /api/sessions/login
 * @access Public
 */
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password); // Uso de bcryptjs
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
