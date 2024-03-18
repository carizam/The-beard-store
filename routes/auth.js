const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función hipotética para firmar el token
function jwtSignUser(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Registration page route
router.get('/register', (req, res) => {
    res.render('register');
});

// Registration route to handle form submission
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

// GET route for the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST route for user login using Passport and JWT
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

// Redirect to GitHub for authentication
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback URL
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    const token = jwtSignUser({ id: req.user._id });
    res.status(200).cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
    }).redirect('/dashboard');
  }
);


// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/login');
  });
  
module.exports = router;
