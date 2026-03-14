import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request (without password)
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

export { protect, adminOnly }