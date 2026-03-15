import express from 'express'
import {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
} from '../controllers/profile.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// All profile routes are protected
router.get('/', protect, getProfile)
router.put('/update', protect, updateProfile)
router.put('/change-password', protect, changePassword)
router.put('/avatar', protect, updateAvatar)

export default router