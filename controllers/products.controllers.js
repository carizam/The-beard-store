const productService = require('../services/productService');

exports.createProduct = async (req, res) => {
    try {
        await productService.createProduct(req.body);
        res.redirect('/adminDashboard');
    } catch (error) {
        res.status(500).send('Error al crear el producto');
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        await productService.updateProduct(req.params.id, req.body);
        res.redirect('/adminDashboard');
    } catch (error) {
        res.status(500).send('Error al actualizar el producto');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.redirect('/adminDashboard');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto');
    }
};
