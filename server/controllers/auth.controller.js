import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import User from '../models/User.model.js'

// Helper: generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Check if user exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      })
    }

    // Hash password directly here
    const salt = await bcryptjs.genSalt(12)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
    })

    const { accessToken, refreshToken } = generateTokens(user._id)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xpTotal: user.xpTotal,
      },
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Compare password
    const isMatch = await bcryptjs.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const { accessToken, refreshToken } = generateTokens(user._id)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xpTotal: user.xpTotal,
      },
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    })
  }
}

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('refreshToken')
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        xpTotal: req.user.xpTotal,
        avatarUrl: req.user.avatarUrl,
      },
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    })
  }
}