const passport = require('passport');


exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'Sesión cerrada.');
  res.redirect('/login');
};
