const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controllers');

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nuevo producto"
 *               price:
 *                 type: number
 *                 example: 100
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', productController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *       500:
 *         description: Error en el servidor
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Producto actualizado"
 *               price:
 *                 type: number
 *                 example: 120
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router;
