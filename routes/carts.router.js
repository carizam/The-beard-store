const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts.controllers');

router.get('/', cartsController.getAllCarts);
router.post('/', cartsController.createCart);

module.exports = router;
