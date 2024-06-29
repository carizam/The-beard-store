const Product = require('../models/Product');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('dashboard', { user: req.user, products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        req.flash('error', 'Ocurrió un error al obtener los productos.');
        res.redirect('/dashboard');
    }
};

// Agregar un nuevo producto
exports.addProduct = async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const newProduct = new Product({ name, price, description });
        await newProduct.save();
        req.flash('success', 'Producto agregado exitosamente.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        req.flash('error', 'Ocurrió un error al agregar el producto.');
        res.redirect('/dashboard');
    }
};

// Borrar un producto
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        req.flash('success', 'Producto borrado exitosamente.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error al borrar el producto:', error);
        req.flash('error', 'Ocurrió un error al borrar el producto.');
        res.redirect('/dashboard');
    }
};
