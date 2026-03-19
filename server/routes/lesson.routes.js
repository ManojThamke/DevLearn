import express from 'express'
import {
  getLessonById,
  completeLesson,
} from '../controllers/lesson.controller.js'
import { protect, optionalAuth } from '../middleware/auth.middleware.js'

const router = express.Router()

// Get lesson content — optional auth (free lessons viewable, paid need login)
router.get('/:id', optionalAuth, getLessonById)

// Mark lesson complete — protected
router.post('/:id/complete', protect, completeLesson)

export default router