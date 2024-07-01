const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const authenticateJWT = require('../middleware/authenticateJWT');

// El carrito se guarda en la sesión del usuario
router.post('/add', authenticateJWT, async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error_msg', 'Producto no encontrado.');
            return res.redirect('/dashboard');
        }

        // El carrito está en req.session.cart
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = req.session.cart.findIndex(item => item.product._id.toString() === productId);
        if (existingProductIndex !== -1) {
            req.session.cart[existingProductIndex].quantity += 1;
        } else {
            req.session.cart.push({ product, quantity: 1 });
        }

        req.flash('success_msg', 'Producto añadido al carrito.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error al añadir el producto al carrito.');
        res.redirect('/dashboard');
    }
});

router.get('/', authenticateJWT, (req, res) => {
    // El carrito está en req.session.cart
    const cart = req.session.cart || [];
    
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.quantity * item.product.price;
    });

    res.render('cart', { 
        cart,
        totalItems,
        totalPrice 
    });
});

router.post('/remove/:productId', authenticateJWT, (req, res) => {
    const { productId } = req.params;
    req.session.cart = req.session.cart.filter(item => item.product._id.toString() !== productId);
    req.flash('success_msg', 'Producto eliminado del carrito.');
    res.redirect('/cart');
});

router.post('/empty', authenticateJWT, (req, res) => {
    // Vaciar el carrito
    req.session.cart = [];
    req.flash('success_msg', 'El carrito ha sido vaciado.');
    res.redirect('/cart');
});

module.exports = router;
