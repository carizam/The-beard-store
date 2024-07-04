const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controllers');
const isAdmin = require('../middleware/isAdmin');

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
router.post('/', isAdmin, productController.createProduct);

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
 * /products/new:
 *   get:
 *     summary: Renderizar formulario para crear un nuevo producto
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Formulario renderizado
 *       401:
 *         description: No autorizado
 */
router.get('/new', isAdmin, (req, res) => {
    res.render('createProduct');
});

/**
 * @swagger
 * /products/edit/{id}:
 *   get:
 *     summary: Renderizar formulario para editar un producto
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
 *         description: Formulario renderizado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/edit/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.render('editProduct', { product: product.toObject() });
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar el producto', error });
    }
});

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
router.put('/:id', isAdmin, productController.updateProduct);

/**
 * @swagger
 * /products/delete/{id}:
 *   post:
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
router.post('/delete/:id', isAdmin, productController.deleteProduct);

module.exports = router;
