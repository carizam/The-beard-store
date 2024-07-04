const Product = require('../models/Products');

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect('/adminDashboard');
    } catch (error) {
        res.status(500).send('Error al crear el producto');
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect('/adminDashboard');
    } catch (error) {
        res.status(500).send('Error al actualizar el producto');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/adminDashboard');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto');
    }
};
