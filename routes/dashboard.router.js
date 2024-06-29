const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

// Ruta del dashboard, accesible solo para usuarios con rol "user"
router.get('/', isLoggedIn, checkRole('user'), (req, res) => {
    console.log("Accediendo al dashboard");
    const products = []; 
    res.render('dashboard', { user: req.user, products });
});

module.exports = router;
