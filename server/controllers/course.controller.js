import Course from '../models/Course.model.js'
import Module from '../models/Module.model.js'
import Lesson from '../models/Lesson.model.js'
import Progress from '../models/Progress.model.js'
import Enrollment from '../models/Enrollment.model.js'

// GET /api/courses
// Public — anyone can see published courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .select('title slug description thumbnail level tags totalModules totalLessons enrolledCount createdAt')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: courses.length,
      courses,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}

// GET /api/courses/:slug
// Public — get single course with all modules
export const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    // Find course by slug
    const course = await Course.findOne({ slug, published: true })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    // Get all modules for this course
    const modules = await Module.find({ course: course._id })
      .select('title description order totalLessons isPublished')
      .sort({ order: 1 })

    // Get all lessons for each module
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await Lesson.find({ module: module._id })
          .select('title order duration isFree thumbnail isPublished')
          .sort({ order: 1 })

        return {
          ...module.toObject(),
          lessons,
        }
      })
    )

    // Check if requesting user is enrolled (if logged in)
    let isEnrolled = false
    let progress = null

    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id,
      })
      isEnrolled = !!enrollment

      if (isEnrolled) {
        progress = await Progress.findOne({
          student: req.user._id,
          course: course._id,
        })
      }
    }

    res.json({
      success: true,
      course: {
        ...course.toObject(),
        modules: modulesWithLessons,
      },
      isEnrolled,
      progress,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}

// POST /api/courses/:id/enroll
// Protected — student must be logged in
export const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params
    const studentId = req.user._id

    // Check course exists
    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: id,
    })

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      })
    }

    // Create enrollment
    await Enrollment.create({
      student: studentId,
      course: id,
    })

    // Create progress record
    await Progress.create({
      student: studentId,
      course: id,
      completedLessons: [],
      completedModules: [],
      percentComplete: 0,
    })

    // Increment enrolled count on course
    await Course.findByIdAndUpdate(id, {
      $inc: { enrolledCount: 1 },
    })

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in ' + course.title,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}

// GET /api/courses/id/:id
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.findById(id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    const modules = await Module.find({ course: course._id })
      .select('title description order totalLessons isPublished')
      .sort({ order: 1 })

    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await Lesson.find({ module: module._id })
          .select('title order duration isFree thumbnail isPublished')
          .sort({ order: 1 })
        return { ...module.toObject(), lessons }
      })
    )

    let isEnrolled = false
    let progress = null

    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id,
      })
      isEnrolled = !!enrollment
      if (isEnrolled) {
        progress = await Progress.findOne({
          student: req.user._id,
          course: course._id,
        })
      }
    }

    res.json({
      success: true,
      course: {
        ...course.toObject(),
        modules: modulesWithLessons,
      },
      isEnrolled,
      progress,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}