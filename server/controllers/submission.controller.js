import Submission from '../models/Submission.model.js'
import Project from '../models/Project.model.js'
import Score from '../models/Score.model.js'

// POST /api/submissions
export const createSubmission = async (req, res) => {
  try {
    const { projectId, method, repoUrl, code } = req.body
    const studentId = req.user._id

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (!['github', 'zip', 'editor'].includes(method)) {
      return res.status(400).json({ success: false, message: 'Invalid submission method' })
    }

    if (method === 'github' && !repoUrl) {
      return res.status(400).json({ success: false, message: 'GitHub repository URL is required' })
    }

    if (method === 'editor' && !code) {
      return res.status(400).json({ success: false, message: 'Code is required for editor submission' })
    }

    const previousCount = await Submission.countDocuments({
      student: studentId,
      project: projectId,
    })

    const submission = await Submission.create({
      student: studentId,
      project: projectId,
      course: project.course,
      module: project.module,
      method,
      repoUrl: repoUrl || '',
      code: code || '',
      status: 'pending',
      attemptNumber: previousCount + 1,
    })

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      submission,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message })
  }
}

// POST /api/submissions/upload-zip
export const handleZipUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const { projectId } = req.body
    const studentId = req.user._id

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const previousCount = await Submission.countDocuments({
      student: studentId,
      project: projectId,
    })

    const submission = await Submission.create({
      student: studentId,
      project: projectId,
      course: project.course,
      module: project.module,
      method: 'zip',
      fileKey: req.file.filename,
      repoUrl: '',
      code: '',
      status: 'pending',
      attemptNumber: previousCount + 1,
    })

    res.status(201).json({
      success: true,
      message: 'ZIP file uploaded successfully',
      submission,
      fileName: req.file.filename,
      fileSize: req.file.size,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message })
  }
}

// GET /api/submissions/my
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('project', 'title difficulty')
      .populate('course', 'title slug thumbnail')
      .populate('module', 'title order')
      .sort({ createdAt: -1 })

    const submissionsWithScores = await Promise.all(
      submissions.map(async (sub) => {
        const score = await Score.findOne({ submission: sub._id })
        return { ...sub.toObject(), score: score || null }
      })
    )

    res.json({
      success: true,
      count: submissionsWithScores.length,
      submissions: submissionsWithScores,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message })
  }
}

// GET /api/submissions/project/:projectId
export const getProjectSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.user._id,
      project: req.params.projectId,
    }).sort({ createdAt: -1 })

    const submissionsWithScores = await Promise.all(
      submissions.map(async (sub) => {
        const score = await Score.findOne({ submission: sub._id })
        return { ...sub.toObject(), score: score || null }
      })
    )

    res.json({ success: true, submissions: submissionsWithScores })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message })
  }
}

// GET /api/submissions/:id
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('project', 'title description requirements techStack')
      .populate('course', 'title slug')
      .populate('module', 'title order')

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' })
    }

    if (submission.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const score = await Score.findOne({ submission: submission._id })

    res.json({ success: true, submission, score: score || null })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message })
  }
}
