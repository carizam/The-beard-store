const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("Usuario autenticado");
        return next();
    }
    console.log("Usuario no autenticado");
    req.flash('error', 'Necesitas iniciar sesión para ver esta página.');
    res.redirect('/login');
};

module.exports = {
    isLoggedIn
};
