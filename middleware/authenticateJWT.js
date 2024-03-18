const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Token no válido o expirado
      }

      req.user = user; 
      next();
    });
  } else {
    res.sendStatus(401); // No se ha proporcionado token
  }
};

module.exports = authenticateJWT;
