import User from '../models/User.model.js'
import bcryptjs from 'bcryptjs'
import Enrollment from '../models/Enrollment.model.js'
import Progress from '../models/Progress.model.js'

// GET /api/profile
// Get current user profile with stats
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash')

    // Get enrollment stats
    const enrollments = await Enrollment.find({ student: req.user._id })
    const progressList = await Progress.find({ student: req.user._id })

    const totalLessonsCompleted = progressList.reduce(
      (t, p) => t + (p.completedLessons?.length || 0), 0
    )
    const completedCourses = progressList.filter(p => p.isCompleted).length

    res.json({
      success: true,
      user,
      stats: {
        enrolledCourses: enrollments.length,
        completedCourses,
        totalLessonsCompleted,
        xpTotal: user.xpTotal,
      },
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}

// PUT /api/profile/update
// Update name and email
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      })
    }

    // Check email not taken by another user
    const existing = await User.findOne({
      email,
      _id: { $ne: req.user._id }
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use by another account',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select('-passwordHash')

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}

// PUT /api/profile/change-password
// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      })
    }

    // Get user with password
    const user = await User.findById(req.user._id)

    // Check current password
    const isMatch = await bcryptjs.compare(currentPassword, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(12)
    const hashedPassword = await bcryptjs.hash(newPassword, salt)

    await User.findByIdAndUpdate(req.user._id, {
      passwordHash: hashedPassword,
    })

    res.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}

// PUT /api/profile/avatar
// Update avatar URL
export const updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl },
      { new: true }
    ).select('-passwordHash')

    res.json({
      success: true,
      message: 'Avatar updated',
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}