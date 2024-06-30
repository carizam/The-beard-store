const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Ruta para manejar el inicio de sesión
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

// Ruta para manejar el cierre de sesión
router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/login');
});

module.exports = router;
