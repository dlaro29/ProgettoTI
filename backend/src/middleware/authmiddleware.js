const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// middleware per verificare token JWT
function authRequired(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // normalizzo in un formato semplice
    req.user = {
      id: decoded.userId,   // userId preso dal token
      role: decoded.role    // ruolo (customer/admin)
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido' });
  }
}

function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accesso negato' });
  }
  next();
}

module.exports = { authRequired, adminRequired };
