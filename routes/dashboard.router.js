const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.get('/', isLoggedIn, checkRole('user'), (req, res) => {
    res.render('dashboard', { user: req.user });
});

module.exports = router;
