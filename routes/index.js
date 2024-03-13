
const express = require('express');
const router = express.Router();

// Main route for the application
router.get('/', (req, res) => {
    // Check if user is logged in
    if (req.session && req.session.userId) {
        res.redirect('/dashboard'); 
    } else {
        res.render('login'); 
    }
});

module.exports = router;
