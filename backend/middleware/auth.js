import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

export const isUser = (req, res, next) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'User access required' });
  next();
};

export const isClient = (req, res, next) => {
  if (req.user.role !== 'client') return res.status(403).json({ message: 'Client access required' });
  next();
};

export function isUserOrAdmin(req, res, next) {
  // req.user is set by verifyToken
  if (req.user.role === "user" || req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

