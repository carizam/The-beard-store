const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/checkout/:productId', authenticateJWT, checkoutController.renderCheckout);
router.post('/checkout', authenticateJWT, checkoutController.processOrder);

module.exports = router;
