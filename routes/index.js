const express = require('express');
const router = express.Router();
const Product = require('../models/Products'); 
const authenticateJWT = require('../middleware/authenticateJWT');

// Ruta principal de la aplicación
router.get('/', (req, res) => {
    res.render('login'); 
});

// Ruta del dashboard
router.get('/dashboard', authenticateJWT, (req, res) => {

    // Recupera productos de la base de datos y los muestra
    Product.find().then(products => {
        res.render('dashboard', { user: req.user.user, products });
    }).catch(err => {
        console.error('Error loading products', err);
        res.status(500).send('Error loading products');
    });
});
// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.redirect('/login');
    });
  });
  

module.exports = router;
