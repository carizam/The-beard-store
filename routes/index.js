const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

// Main route for the application
router.get('/', (req, res) => {
    // Check if user is logged in
    if (req.session && req.session.userId) {
        res.redirect('/dashboard'); 
    } else {
        res.render('login'); 
    }
});

// Dashboard route
router.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Please log in to view this resource');
        return res.redirect('/login');
    }

    // Fetch products from database and render
    Product.find().then(products => {
        res.render('dashboard', { products });
    }).catch(err => {
        req.flash('error_msg', 'Error loading products');
        res.redirect('/');
    });
});

module.exports = router;
