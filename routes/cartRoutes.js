const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const authenticateJWT = require('../middleware/authenticateJWT');

// Ruta para agregar productos al carrito
router.post('/add', authenticateJWT, async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('Producto ID recibido:', productId);

    const product = await Product.findById(productId);
    if (!product) {
      req.flash('error_msg', 'Producto no encontrado.');
      return res.redirect('/dashboard');
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Agregar el producto al carrito
    req.session.cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    req.session.cartCount = req.session.cart.length;

    console.log('Producto añadido al carrito:', product);
    req.flash('success_msg', 'Producto añadido al carrito.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error al añadir el producto al carrito:', error);
    req.flash('error_msg', 'Error al añadir el producto al carrito.');
    res.redirect('/dashboard');
  }
});

// Ruta para mostrar el carrito
router.get('/', authenticateJWT, (req, res) => {
  res.render('cart', { cart: req.session.cart || [] });
});

// Ruta para eliminar un producto del carrito
router.post('/remove/:productId', authenticateJWT, (req, res) => {
  const { productId } = req.params;
  req.session.cart = req.session.cart.filter(product => product.productId.toString() !== productId);
  req.session.cartCount = req.session.cart.length;
  req.flash('success_msg', 'Producto eliminado del carrito.');
  res.redirect('/cart');
});

// Ruta para vaciar el carrito
router.post('/empty', authenticateJWT, (req, res) => {
  req.session.cart = [];
  req.session.cartCount = 0;
  req.flash('success_msg', 'El carrito ha sido vaciado.');
  res.redirect('/cart');
});

module.exports = router;
