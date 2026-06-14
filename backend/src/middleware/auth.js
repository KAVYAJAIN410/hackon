const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'reloop-hackathon-secret-key-2025';

/**
 * Auth middleware — verifies JWT token from Authorization header.
 * Sets req.user with { id, email, role } from the token payload.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

/**
 * Optional auth — if token is present, decode it, otherwise continue without user.
 * Useful for routes that work differently for logged-in vs anonymous users.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    } catch (err) {
      // Invalid token — continue without user
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
}

/**
 * Role-based authorization — restricts to specific roles.
 * Use after authenticate middleware.
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
}

module.exports = { authenticate, optionalAuth, authorize, JWT_SECRET };
