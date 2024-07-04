const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const authenticateJWT = require('../middleware/authenticateJWT');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Renderizar la página de login
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: Página de login renderizada
 */
router.get('/', (req, res) => {
    res.render('login');
});

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Renderizar el dashboard
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: Dashboard renderizado
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al cargar los productos
 */
router.get('/dashboard', authenticateJWT, async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('dashboard', { products: products.map(product => product.toObject()) });
    } catch (err) {
        console.error('Error loading products', err);
        res.status(500).send('Error loading products');
    }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Cerrar sesión
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: Sesión cerrada y redirigido al login
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/login');
});

module.exports = router;
