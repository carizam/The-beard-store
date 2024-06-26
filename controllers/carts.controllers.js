const Cart = require('../models/Cart');

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCart = async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

