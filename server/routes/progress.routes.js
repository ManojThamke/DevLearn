import express from 'express'
import {
  getCourseProgress,
  getAllProgress,
} from '../controllers/progress.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', protect, getAllProgress)
router.get('/:courseId', protect, getCourseProgress)

export default router