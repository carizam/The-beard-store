const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const productController = require('../controllers/products.controllers');

// Rutas para ver productos (accesible para todos los usuarios)
router.get('/', productController.getAllProducts);

// Rutas para agregar productos (accesible solo para administradores)
router.post('/add', isLoggedIn, checkRole('admin'), productController.addProduct);

// Rutas para borrar productos (accesible solo para administradores)
router.post('/delete/:id', isLoggedIn, checkRole('admin'), productController.deleteProduct);

module.exports = router;
