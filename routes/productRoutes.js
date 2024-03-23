const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const authenticateJWT = require('../middleware/authenticateJWT');
``


// Mostrar formulario para agregar un producto
router.get('/add', (req, res) => {
  res.render('addProduct');
});

// Ruta para procesar el formulario de añadir producto
router.post('/add', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al guardar el producto.');
  }
});

router.get('/dashboard', authenticateJWT, async (req, res) => {
  try {
    const products = await Product.find(); // Recuperar todos los productos de la base de datos
    res.render('dashboard', { products }); // Pasar los productos a la vista dashboard
  } catch (err) {
    console.error('Error al cargar los productos:', err);
    res.status(500).send('Error al cargar los productos');
  }
});

module.exports = router;
