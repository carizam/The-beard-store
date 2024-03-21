const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función para firmar el token
function jwtSignUser(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Ruta de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Procesamiento de registro
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
    console.error('Error durante el registro:', error);
    res.status(500).send('Error del servidor durante el registro');
  }
});

// Ruta de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

// Procesamiento de inicio de sesión
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, { session: false }, (loginErr) => {
      if (loginErr) return next(loginErr);
      const token = jwtSignUser({ id: user._id });
      return res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
      }).redirect('/dashboard');
    });
  })(req, res, next);
});

// Redirección a GitHub para autenticación
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// URL de callback de GitHub
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    const token = jwtSignUser({ id: req.user._id });
    res.cookie('token', token, { httpOnly: true, secure: true }).redirect('/dashboard');
  }
);

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid', { path: '/' }); 
      res.clearCookie('token', { path: '/' }).redirect('/login');
    });
  } else {
    res.clearCookie('token', { path: '/' }).redirect('/login');
  }
});


module.exports = router;
