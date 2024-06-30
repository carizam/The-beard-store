const Cart = require('../models/Cart');
const Product = require('../models/Products');

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('Producto ID recibido:', productId);

    const product = await Product.findById(productId);
    if (!product) {
      req.flash('error_msg', 'Producto no encontrado.');
      return res.redirect('/dashboard');
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, products: [] });
    }

    cart.products.push({ productId: product._id, quantity: 1 });
    await cart.save();

    req.session.cartCount = cart.products.length;

    console.log('Producto añadido al carrito:', product);
    req.flash('success_msg', 'Producto añadido al carrito.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error al añadir el producto al carrito:', error);
    req.flash('error_msg', 'Error al añadir el producto al carrito.');
    res.redirect('/dashboard');
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      req.flash('error_msg', 'Carrito no encontrado.');
      return res.redirect('/cart');
    }

    cart.products = cart.products.filter(product => product.productId.toString() !== productId);
    await cart.save();

    req.session.cartCount = cart.products.length;
    req.flash('success_msg', 'Producto eliminado del carrito.');
    res.redirect('/cart');
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    req.flash('error_msg', 'Error al eliminar el producto del carrito.');
    res.redirect('/cart');
  }
};

exports.emptyCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      req.flash('error_msg', 'Carrito no encontrado.');
      return res.redirect('/cart');
    }

    cart.products = [];
    await cart.save();

    req.session.cartCount = 0;
    req.flash('success_msg', 'El carrito ha sido vaciado.');
    res.redirect('/cart');
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    req.flash('error_msg', 'Error al vaciar el carrito.');
    res.redirect('/cart');
  }
};
