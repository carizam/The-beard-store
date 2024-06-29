const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');

// Ruta para obtener la información del usuario
router.get('/profile', userController.getUser);

module.exports = router;
