import express from 'express'
import {
  getAllBadges,
  getUserBadges,
  seedBadges,
} from '../controllers/badge.controller.js'
import { protect, adminOnly, optionalAuth } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', optionalAuth, getAllBadges)
router.get('/my', protect, getUserBadges)
router.post('/seed', protect, adminOnly, seedBadges)

export default router