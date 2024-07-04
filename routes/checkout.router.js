const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const authenticateJWT = require('../middleware/authenticateJWT');

/**
 * @swagger
 * /checkout/{productId}:
 *   get:
 *     summary: Renderizar la página de checkout para un producto específico
 *     tags: [Checkout]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Página de checkout renderizada
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:productId', authenticateJWT, checkoutController.renderCheckout);

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Procesar la orden de checkout
 *     tags: [Checkout]
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
 *               quantity:
 *                 type: integer
 *                 example: 1
 *               paymentMethod:
 *                 type: string
 *                 example: "credit_card"
 *     responses:
 *       200:
 *         description: Orden procesada exitosamente
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al procesar la orden
 */
router.post('/', authenticateJWT, checkoutController.processOrder);

/**
 * @swagger
 * /checkout/order-success/{orderId}:
 *   get:
 *     summary: Renderizar la página de éxito de la orden
 *     tags: [Checkout]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Página de éxito de la orden renderizada
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Orden no encontrada
 */
router.get('/order-success/:orderId', authenticateJWT, checkoutController.orderSuccess);

module.exports = router;
