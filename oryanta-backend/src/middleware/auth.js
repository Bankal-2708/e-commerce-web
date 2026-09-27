import jwt from 'jsonwebtoken';
import  {User}  from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from cookie or Authorization header
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in to continue.',
      });
    }

     const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.',
      });
    }

     const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.name, '-', error.message);

    // Token expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Session expired. Please log in again.',
      });
    }

    // Invalid token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        message: 'Invalid token. Please log in again.',
      });
    }

     return next(error);
  }
};