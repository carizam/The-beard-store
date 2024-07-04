const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /sessions/login:
 *   post:
 *     summary: Manejar el inicio de sesión
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso y redirección al dashboard
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      // Generar el token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      // Configurar el token en una cookie
      res.cookie('token', token, { httpOnly: true });
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

/**
 * @swagger
 * /sessions/logout:
 *   get:
 *     summary: Manejar el cierre de sesión
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Sesión cerrada y redirección al login
 */
router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/login');
});

module.exports = router;
