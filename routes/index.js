const express = require('express');
const router = express.Router();
const Product = require('../models/Products'); 
const authenticateJWT = require('../middleware/authenticateJWT');

// Ruta principal de la aplicación
router.get('/', (req, res) => {
    res.render('login'); 
});

// Ruta del dashboard
router.get('/dashboard', authenticateJWT, async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('dashboard', { products: products.map(product => product.toObject()) });
    } catch (err) {
        console.error('Error loading products', err);
        res.status(500).send('Error loading products');
    }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/login');
});

module.exports = router;
