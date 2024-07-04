const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controllers');
const isAdmin = require('../middleware/isAdmin');
const Product = require('../models/Products'); // 

router.post('/', isAdmin, productController.createProduct);
router.get('/', productController.getProducts);
router.get('/new', isAdmin, (req, res) => {
    res.render('createProduct.handlebars');
});
router.get('/edit/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.render('editProduct.handlebars', { product: product.toObject() });
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar el producto', error });
    }
});
router.put('/:id', isAdmin, productController.updateProduct);
router.post('/delete/:id', isAdmin, productController.deleteProduct);

module.exports = router;
