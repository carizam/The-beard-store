
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      return next();
    } else {
      res.status(403).send('Acceso denegado. Solo para administradores.');
    }
  }
  module.exports = isAdmin;
  