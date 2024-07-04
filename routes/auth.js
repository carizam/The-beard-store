const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Función para firmar el token
function jwtSignUser(user) {
  const payload = {
    sub: user._id, 
    email: user.email, 
    role: user.role 
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Ruta de autenticación con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }),
  async (req, res) => {
    // Actualizar last_connection
    try {
      req.user.last_connection = new Date();
      await req.user.save();
    } catch (updateError) {
      console.error('Error actualizando last_connection:', updateError);
    }

    const token = jwtSignUser(req.user);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV !== 'development' }).redirect('/dashboard');
  }
);

// Ruta de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Procesamiento de registro
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.redirect('/auth/login');  // Asegúrate de redirigir a /auth/login
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
      req.flash('error_msg', info.message);
      return res.redirect('/auth/login');
    }
    req.login(user, { session: false }, async (loginErr) => {
      if (loginErr) return next(loginErr);
      
      // Actualizar last_connection
      try {
        user.last_connection = new Date();
        await user.save();
      } catch (updateError) {
        console.error('Error actualizando last_connection:', updateError);
      }

      const token = jwtSignUser(user);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV !== 'development' }).redirect('/dashboard');
    });
  })(req, res, next);
});

// Ruta de logout
router.get('/logout', (req, res) => {
  if (req.user) {
    try {
      req.user.last_connection = new Date();
      req.user.save();
    } catch (updateError) {
      console.error('Error actualizando last_connection:', updateError);
    }
  }

  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid', { path: '/' }); 
      res.clearCookie('token', { path: '/' }).redirect('/auth/login');
    });
  } else {
    res.clearCookie('token', { path: '/' }).redirect('/auth/login');
  }
});

module.exports = router;
