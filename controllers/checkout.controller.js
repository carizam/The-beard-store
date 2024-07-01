const Product = require('../models/Products');
const Order = require('../models/Order');

exports.renderCheckout = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error_msg', 'Producto no encontrado.');
            return res.redirect('/cart');
        }
        res.render('checkout', { product });
    } catch (error) {
        console.error('Error al cargar el producto:', error);
        req.flash('error_msg', 'Error al cargar el producto.');
        res.redirect('/cart');
    }
};

exports.processOrder = async (req, res) => {
    console.log('Entrando a processOrder');
    try {
        console.log('Usuario autenticado:', req.user); // Mensaje de depuración
        const cart = req.session.cart || [];
        if (cart.length === 0) {
            req.flash('error_msg', 'El carrito está vacío.');
            return res.redirect('/cart');
        }

        if (!req.user) {
            req.flash('error_msg', 'User not authenticated');
            return res.redirect('/cart');
        }

        console.log('ID de usuario:', req.user.sub); // Cambiado de req.user.id a req.user.sub

        const newOrder = new Order({
            user: req.user.sub, // Cambiado de req.user.id a req.user.sub
            products: cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: cart.reduce((total, item) => total + item.quantity * item.product.price, 0)
        });

        await newOrder.save();
        console.log('Pedido creado:', newOrder);

        req.session.cart = [];

        res.redirect(`/checkout/order-success/${newOrder._id}`);
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        req.flash('error_msg', 'Error al procesar la compra.');
        res.redirect('/cart');
    }
};

exports.orderSuccess = (req, res) => {
    const orderId = req.params.orderId;
    res.render('order-success', { orderId });
};
