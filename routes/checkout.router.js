const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/:productId', authenticateJWT, checkoutController.renderCheckout);
router.post('/', authenticateJWT, checkoutController.processOrder);
router.get('/order-success/:orderId', authenticateJWT, checkoutController.orderSuccess);

module.exports = router;
