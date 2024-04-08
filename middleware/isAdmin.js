
module.exports = function (req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    res.status(403).send('Acceso denegado. Solo los administradores pueden realizar esta acción.');
  }
};
