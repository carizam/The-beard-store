const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.flash('error_msg', 'No token provided');
    return res.redirect('/auth/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.flash('error_msg', 'Failed to authenticate token');
      return res.redirect('/auth/login');
    }

    req.user = decoded;
    next();
  });
};
