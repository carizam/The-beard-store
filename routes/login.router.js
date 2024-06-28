const express = require('express');
const router = express.Router();
const passport = require('passport');

// Ruta de login para mostrar el formulario
router.get('/', (req, res) => {
    res.render('login');
});

// Ruta de login para manejar la autenticación
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;
