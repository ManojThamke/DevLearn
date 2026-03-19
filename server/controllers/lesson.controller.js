import Lesson from '../models/Lesson.model.js'
import Progress from '../models/Progress.model.js'
import Enrollment from '../models/Enrollment.model.js'
import Course from '../models/Course.model.js'
import Module from '../models/Module.model.js'
import { checkLessonBadges, checkModuleBadges } from './badge.controller.js'
import { checkAndIssueCertificate } from './certificate.controller.js'

// GET /api/lessons/:id
// Protected — must be enrolled (except free lessons)
export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params

    const lesson = await Lesson.findById(id)

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      })
    }

    // Free lessons — anyone can view
    if (lesson.isFree) {
      return res.json({
        success: true,
        lesson,
      })
    }

    // Paid lessons — must be logged in and enrolled
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this lesson',
      })
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course,
    })

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Please enroll in this course to access this lesson',
      })
    }

    res.json({
      success: true,
      lesson,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}

// POST /api/lessons/:id/complete
// Protected — mark lesson as completed
export const completeLesson = async (req, res) => {
  try {
    const { id } = req.params
    const studentId = req.user._id

    // Find lesson
    const lesson = await Lesson.findById(id)
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      })
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: lesson.course,
    })

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course',
      })
    }

    // Find or create progress
    let progress = await Progress.findOne({
      student: studentId,
      course: lesson.course,
    })

    if (!progress) {
      progress = await Progress.create({
        student: studentId,
        course: lesson.course,
        completedLessons: [],
        completedModules: [],
        percentComplete: 0,
      })
    }

    // Check if lesson already completed
    const alreadyCompleted = progress.completedLessons.includes(id)
    if (alreadyCompleted) {
      return res.json({
        success: true,
        message: 'Lesson already completed',
        progress,
      })
    }

    // Add lesson to completed list
    progress.completedLessons.push(id)
    progress.lastAccessedAt = new Date()

    // Get total lessons in course to calculate percent
    const course = await Course.findById(lesson.course)
    const totalLessons = course.totalLessons

    // Calculate new percentage
    progress.percentComplete = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    )

    // Check if entire course is completed
    if (progress.percentComplete === 100) {
      progress.isCompleted = true
    }

    // Check if module is completed
    const moduleLessons = await Lesson.find({ module: lesson.module })
    const moduleCompleted = moduleLessons.every(l =>
      progress.completedLessons.map(id => id.toString()).includes(l._id.toString())
    )

    if (moduleCompleted) {
      const alreadyModuleCompleted = progress.completedModules
        .map(id => id.toString())
        .includes(lesson.module.toString())

      if (!alreadyModuleCompleted) {
        progress.completedModules.push(lesson.module)
      }
    }

    await progress.save()

    // Check and award badges
    try {
      await checkLessonBadges(studentId)
      if (moduleCompleted) {
        await checkModuleBadges(studentId, lesson.course)
        await checkAndIssueCertificate(studentId, lesson.course)
      }
    } catch (badgeErr) {
      console.error('Badge/certificate check error:', badgeErr.message)
    }

    res.json({
      success: true,
      message: 'Lesson marked as complete',
      progress: {
        completedLessons: progress.completedLessons,
        completedModules: progress.completedModules,
        percentComplete: progress.percentComplete,
        isCompleted: progress.isCompleted,
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