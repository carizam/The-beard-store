module.exports = (req, res, next) => {
  console.log('Usuario autenticado:', req.isAuthenticated());
  console.log('Usuario:', req.user);
  if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
      return next();
  }
  res.redirect('/login');
};
