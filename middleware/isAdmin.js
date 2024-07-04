module.exports = function(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'No autorizado');
  res.redirect('/auth/login');
};
