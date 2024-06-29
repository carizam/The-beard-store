function checkRole(role) {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log(`Usuario autenticado con rol: ${req.user.role}`);
        } else {
            console.log("Usuario no autenticado");
        }

        if (req.isAuthenticated() && req.user.role === role) {
            console.log(`Usuario con rol ${role} autenticado`);
            return next();
        } else {
            console.log(`Usuario sin el rol necesario: ${role}`);
            req.flash('error', `No tienes permisos para acceder a esta página como ${role}.`);
            res.redirect('/login');
        }
    };
}

module.exports = checkRole;
