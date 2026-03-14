import Progress from '../models/Progress.model.js'
import Enrollment from '../models/Enrollment.model.js'
import Course from '../models/Course.model.js'

// GET /api/progress/:courseId
// Protected — get student progress for a course
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params
    const studentId = req.user._id

    const progress = await Progress.findOne({
      student: studentId,
      course: courseId,
    })

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found for this course',
      })
    }

    res.json({
      success: true,
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

// GET /api/progress
// Protected — get all enrolled courses with progress
export const getAllProgress = async (req, res) => {
  try {
    const studentId = req.user._id

    const enrollments = await Enrollment.find({ student: studentId })
      .populate('course', 'title slug thumbnail level totalLessons totalModules')

    const progressList = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await Progress.findOne({
          student: studentId,
          course: enrollment.course._id,
        })
        return {
          course: enrollment.course,
          enrolledAt: enrollment.enrolledAt,
          percentComplete: progress?.percentComplete || 0,
          completedLessons: progress?.completedLessons?.length || 0,
          isCompleted: progress?.isCompleted || false,
          lastAccessedAt: progress?.lastAccessedAt || null,
        }
      })
    )

    res.json({
      success: true,
      count: progressList.length,
      enrollments: progressList,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    })
  }
}