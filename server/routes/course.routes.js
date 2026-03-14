import express from 'express'
import {
  getAllCourses,
  getCourseBySlug,
  enrollInCourse,
} from '../controllers/course.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllCourses)
router.get('/:slug', getCourseBySlug)

// Protected routes — must be logged in
router.post('/:id/enroll', protect, enrollInCourse)

export default router