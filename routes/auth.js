const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const router = express.Router();
const saltRounds = 10;

// GET route for the registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// POST route for user registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); 

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect('/login'); // Redirect to login after successful registration
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error during registration');
    }
});

// GET route for the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST route for user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id; // Setting the user's session
            res.redirect('/dashboard'); // Redirect to dashboard after successful login
        } else {
            res.status(401).send('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error during login');
    }
});

// GET route for logging out
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            res.send('Error logging out');
        } else {
            res.redirect('/login');
        }
    });
});

module.exports = router;