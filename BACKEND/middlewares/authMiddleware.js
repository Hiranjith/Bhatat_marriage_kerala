import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const verifyUserSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // 1. Verify the JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // 2. Check the database to see if the session was invalidated (Force Logout) or Account Banned
    const [users] = await pool.query('SELECT refresh_token, status FROM user_registration WHERE id = ?', [decoded.id]);
    
    if (users.length === 0 || !users[0].refresh_token) {
      return res.status(401).json({ error: 'Session expired or forcefully logged out.' });
    }

    if (users[0].status === 'BANNED' || users[0].status === 'Banned') {
      return res.status(403).json({ error: 'Your account has been banned. Please contact support.' });
    }

    // 3. User is fully authenticated and session is valid
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', isExpired: true });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

export const verifyAdminSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Check if the role is superadmin
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Admin token expired', isExpired: true });
    }
    return res.status(401).json({ error: 'Invalid admin token.' });
  }
};
