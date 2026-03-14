import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-passwordHash')
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' })
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ message: 'Admin access only' })
}

// ── Optional Auth ──────────────────────────────────────────────────
// Does NOT block the request if no token
// Just attaches user if token exists
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-passwordHash')
    }
  } catch (err) {
    // Token invalid — just continue without user
    req.user = null
  }
  next()
}

export { protect, adminOnly, optionalAuth }