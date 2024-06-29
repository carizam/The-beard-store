const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta de login para mostrar el formulario
router.get('/', (req, res) => {
    res.render('login', {
        successMessages: req.flash('success'),
        errorMessages: req.flash('error')
    });
});

// Ruta de login para manejar la autenticación
router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log("Error de autenticación:", err);
            return next(err);
        }
        if (!user) {
            console.log("Autenticación fallida:", info.message);
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log("Error en el inicio de sesión:", err);
                return next(err);
            }
            console.log("Inicio de sesión exitoso para el usuario:", user.email);
            req.flash('success', 'Inicio de sesión exitoso.');
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

module.exports = router;
