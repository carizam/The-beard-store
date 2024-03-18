const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para manejar el envío del formulario de registro
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error during registration');
    }
});

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para manejar el login, modificada para usar JWT
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.login(user, { session: false }, (error) => {
      if (error) res.send(error);
      const body = { _id: user._id, email: user.email };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1d' });

      return res.json({ token });
    });
  })(req, res, next);
});

// Ruta para iniciar sesión con GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback tras la autenticación con GitHub
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard');
});

// Ruta para cerrar sesión
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router;
