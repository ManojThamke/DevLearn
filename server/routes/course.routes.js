import express from 'express'
import {
  getAllCourses,
  getCourseBySlug,
  getCourseById,
  enrollInCourse,
  getPlatformStats,
} from '../controllers/course.controller.js'
import { protect, optionalAuth } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/stats', getPlatformStats)
router.get('/', getAllCourses)
router.get('/id/:id', optionalAuth, getCourseById)  // ← new route
router.get('/:slug', optionalAuth, getCourseBySlug)
router.post('/:id/enroll', protect, enrollInCourse)

export default router