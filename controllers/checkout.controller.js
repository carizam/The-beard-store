const Order = require('../models/Order');
const Product = require('../models/Products');

// Renderizar la vista de checkout
exports.renderCheckout = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('checkout', { product: product.toObject() });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Procesar la compra y crear una orden
exports.processOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        const totalAmount = product.price * quantity;

        const order = new Order({
            user: req.user._id,
            products: [{ product: productId, quantity }],
            totalAmount,
        });

        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(500).send(error);
    }
};
