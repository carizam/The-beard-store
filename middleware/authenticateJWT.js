const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Token no válido o expirado
      }

      req.user = decoded;
      res.locals.isAuthenticated = true; 
      next();
    });
  } else {
    res.locals.isAuthenticated = false;
    res.sendStatus(401); // No se ha proporcionado token
  }
};

module.exports = authenticateJWT;
