import express from 'express'
import {
  getLessonById,
  completeLesson,
} from '../controllers/lesson.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// Get lesson content
router.get('/:id', getLessonById)

// Mark lesson complete — protected
router.post('/:id/complete', protect, completeLesson)

export default router