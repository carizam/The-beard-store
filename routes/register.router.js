const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    const { name, last_name, email, password } = req.body;

    console.log(req.body); 

    // Validar que todos los campos están presentes
    if (!name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('register-error');
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const newUser = new User({
            nombre: name,
            apellido: last_name,
            email,
            password: hashedPassword,
        });

        // Guardar usuario en la base de datos
        await newUser.save();

        // Renderizar la vista de registro exitoso
        res.status(201).render('register-success');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
