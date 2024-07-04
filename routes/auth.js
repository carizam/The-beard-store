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

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Autenticación con GitHub
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirección a GitHub para autenticación
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: Callback de GitHub
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirección después de autenticación con GitHub
 */
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }),
  async (req, res) => {
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

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: Mostrar formulario de registro
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Formulario de registro
 */
router.get('/register', (req, res) => {
  res.render('register');
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Procesar registro de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       302:
 *         description: Redirección al formulario de inicio de sesión
 *       500:
 *         description: Error del servidor durante el registro
 */
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password during registration:', hashedPassword);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    console.log('New user registered:', newUser);
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).send('Error del servidor durante el registro');
  }
});

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Mostrar formulario de inicio de sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Formulario de inicio de sesión
 */
router.get('/login', (req, res) => {
  res.render('login');
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Procesar inicio de sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       302:
 *         description: Redirección al dashboard
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err);
    }
    if (!user) {
      console.warn('Authentication failed:', info.message);
      req.flash('error_msg', info.message);
      return res.redirect('/auth/login');
    }

    // Añade un log para verificar las contraseñas
    console.log('Password provided:', req.body.password);
    console.log('Stored hashed password:', user.password);

    // Aquí realizamos la comparación nuevamente como validación adicional
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      console.warn('Incorrect password for user:', req.body.email);
      req.flash('error_msg', 'Contraseña incorrecta');
      return res.redirect('/auth/login');
    }

    req.login(user, { session: false }, async (loginErr) => {
      if (loginErr) {
        console.error('Error during login:', loginErr);
        return next(loginErr);
      }

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

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Cerrar sesión del usuario
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirección al formulario de inicio de sesión
 */
router.get('/logout', (req, res) => {
  if (req.user) {
    try {
      req.user.last_connection = new Date();
      req.user.save();
    } catch (updateError) {
      console.error('Error actualizando last_connection:', updateError);
    }
  }

  req.logout(function(err) {
    if (err) { return next(err); }
    res.clearCookie('connect.sid', { path: '/' });
    res.clearCookie('token', { path: '/' });
    res.redirect('/auth/login');
  });
});

module.exports = router;
