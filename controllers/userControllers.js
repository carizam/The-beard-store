// controllers/userController.js

const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar usuarios inactivos
exports.deleteInactiveUsers = async (req, res) => {
    try {
        const now = new Date();
        const twoDaysAgo = new Date(now.setDate(now.getDate() - 2));

        const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });

        for (const user of inactiveUsers) {
            await User.findByIdAndDelete(user._id);

            // Enviar correo de notificación
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: `Hola ${user.name}, tu cuenta ha sido eliminada por inactividad.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Error al enviar correo: ${error.message}`);
                } else {
                    console.log(`Correo enviado: ${info.response}`);
                }
            });
        }

        res.json({ message: 'Usuarios inactivos eliminados y notificados' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

