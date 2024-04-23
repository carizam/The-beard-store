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
      return res.status(404).send('Producto no encontrado.');
    }

    //  el carrito está en req.session.cart
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push(product);

    res.status(200).send('Producto añadido al carrito.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir el producto al carrito.');
  }
});

router.get('/', authenticateJWT, (req, res) => {
  //el carrito está en req.session.cart
  res.render('cart', { cart: req.session.cart || [] });
});

router.post('/remove/:productId', authenticateJWT, (req, res) => {
  const { productId } = req.params;

  req.session.cart = req.session.cart.filter(product => product.id !== productId);

  res.status(200).send('Producto eliminado del carrito.');
});

router.post('/empty', authenticateJWT, (req, res) => {
  // Vaciar el carrito
  req.session.cart = [];

  res.status(200).send('El carrito ha sido vaciado.');
});

module.exports = router;
