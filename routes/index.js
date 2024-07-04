const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const authenticateJWT = require('../middleware/authenticateJWT');

// Ruta principal de la aplicación
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
        if (req.user.role === 'admin') {
            res.render('adminDashboard', { 
                products: products.map(product => product.toObject()),
                isAdmin: true
            });
        } else {
            res.render('dashboard', { 
                products: products.map(product => product.toObject()),
                isAdmin: false
            });
        }
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
 *         description: Sesión cerrada y redirección al login
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/login');
});

module.exports = router;
