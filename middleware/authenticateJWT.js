const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.flash('error_msg', 'No token provided');
    return res.redirect('/auth/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      req.flash('error_msg', 'Failed to authenticate token');
      return res.redirect('/auth/login');
    }

    req.user = decoded;
    console.log('Usuario autenticado:', req.user); // Mensaje de depuración

    // Verificación adicional para asegurarse de que req.user tiene un sub
    if (!req.user.sub) {
      req.flash('error_msg', 'User ID is missing in the token');
      return res.redirect('/auth/login');
    }

    try {
      const user = await User.findById(req.user.sub);
      if (!user) {
        req.flash('error_msg', 'User not found');
        return res.redirect('/auth/login');
      }

      // Verificación y asignación de valores predeterminados a los campos requeridos
      if (!user.first_name) user.first_name = 'DefaultFirstName';
      if (!user.last_name) user.last_name = 'DefaultLastName';
      if (!user.email) user.email = 'defaultemail@example.com';
      if (!user.password) user.password = await bcrypt.hash('defaultpassword', 10);

      user.last_connection = Date.now();
      await user.save();

      next();
    } catch (error) {
      console.error('Error actualizando last_connection:', error);
      req.flash('error_msg', 'Error actualizando last_connection');
      return res.redirect('/auth/login');
    }
  });
};
