const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Registrar nuevo usuario
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'El correo electrónico ya está registrado.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        req.flash('success', 'Registro exitoso. Ahora puedes iniciar sesión.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        req.flash('error', 'Ocurrió un error al registrar el usuario.');
        res.redirect('/register');
    }
};

// Autenticar usuario
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Inicio de sesión exitoso.');
            return res.redirect('/dashboard');
        });
    })(req, res, next);
};

// Obtener información del usuario
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error al obtener el usuario.' });
    }
};
