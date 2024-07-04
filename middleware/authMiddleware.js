// Middleware para verificar si el usuario es administrador
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Acceso denegado');
    }
};
