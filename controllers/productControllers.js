// controllers/productController.js

const Product = require('../models/Products');
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

// Eliminar producto
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);

        if (product) {
            const user = await User.findById(product.owner);

            if (user && user.role === 'premium') {
                // Enviar correo de notificación
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Producto eliminado',
                    text: `Hola ${user.name}, tu producto ${product.name} ha sido eliminado.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`Error al enviar correo: ${error.message}`);
                    } else {
                        console.log(`Correo enviado: ${info.response}`);
                    }
                });
            }

            res.json({ message: 'Producto eliminado y usuario notificado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
