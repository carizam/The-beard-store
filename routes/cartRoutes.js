const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const authenticateJWT = require('../middleware/authenticateJWT');

// el carrito se guarda en la sesión del usuario
router.post('/add', authenticateJWT, async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    }

    // el carrito está en req.session.cart
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push(product);

    // Respond with JSON including the cart count
    res.json({ success: true, cartCount: req.session.cart.length, message: 'Producto añadido al carrito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al añadir el producto al carrito.' });
  }
});

router.get('/', authenticateJWT, (req, res) => {
  // el carrito está en req.session.cart
  res.render('cart', { cart: req.session.cart || [] });
});

router.post('/remove/:productId', authenticateJWT, (req, res) => {
  const { productId } = req.params;
  req.session.cart = req.session.cart.filter(product => product.id !== productId);
  res.json({ success: true, cartCount: req.session.cart.length, message: 'Producto eliminado del carrito.' });
});

router.post('/empty', authenticateJWT, (req, res) => {
  // Vaciar el carrito
  req.session.cart = [];
  res.json({ success: true, cartCount: 0, message: 'El carrito ha sido vaciado.' });
});

module.exports = router;
