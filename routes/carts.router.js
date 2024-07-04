const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const authenticateJWT = require('../middleware/authenticateJWT');

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Añadir un producto al carrito
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Producto añadido al carrito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al añadir el producto al carrito
 */
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

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtener el carrito del usuario
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Carrito del usuario
 *       401:
 *         description: Usuario no autenticado
 */
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

/**
 * @swagger
 * /cart/remove/{productId}:
 *   post:
 *     summary: Eliminar un producto del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Producto no encontrado en el carrito
 */
router.post('/remove/:productId', authenticateJWT, (req, res) => {
    const { productId } = req.params;
    req.session.cart = req.session.cart.filter(item => item.product._id.toString() !== productId);
    req.flash('success_msg', 'Producto eliminado del carrito.');
    res.redirect('/cart');
});

/**
 * @swagger
 * /cart/empty:
 *   post:
 *     summary: Vaciar el carrito
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: El carrito ha sido vaciado
 *       401:
 *         description: Usuario no autenticado
 */
router.post('/empty', authenticateJWT, (req, res) => {
    // Vaciar el carrito
    req.session.cart = [];
    req.flash('success_msg', 'El carrito ha sido vaciado.');
    res.redirect('/cart');
});

module.exports = router;
