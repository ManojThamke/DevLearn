import Certificate from '../models/Certificate.model.js'
import Progress from '../models/Progress.model.js'
import Score from '../models/Score.model.js'
import Module from '../models/Module.model.js'
import { v4 as uuidv4 } from 'uuid'

// ── Check if user qualifies for certificate ──────────────────
const checkCertificateEligibility = async (userId, courseId) => {
  const progress = await Progress.findOne({ student: userId, course: courseId })
  if (!progress) return { eligible: false, type: null }

  const completedModules = progress.completedModules?.length || 0
  const scores = await Score.find({ student: userId })

  const avgScore = scores.length > 0
    ? scores.reduce((t, s) => t + (s.scores?.final || 0), 0) / scores.length
    : 0

  // Expert — all 8 modules + capstone + avg 80+
  if (completedModules >= 8 && avgScore >= 80) {
    return { eligible: true, type: 'expert', completedModules, avgScore }
  }

  // Developer — all 8 modules
  if (completedModules >= 8) {
    return { eligible: true, type: 'developer', completedModules, avgScore }
  }

  // Fundamentals — first 4 modules
  if (completedModules >= 4) {
    return { eligible: true, type: 'fundamentals', completedModules, avgScore }
  }

  return { eligible: false, type: null, completedModules, avgScore }
}

// ── Get certificate titles ───────────────────────────────────
const getCertificateTitle = (type, courseName) => {
  const titles = {
    fundamentals: courseName + ' — Fundamentals',
    developer: courseName + ' — Developer',
    expert: courseName + ' — Expert',
  }
  return titles[type] || courseName
}

// ── Check and issue certificate ──────────────────────────────
export const checkAndIssueCertificate = async (userId, courseId) => {
  try {
    const { eligible, type, completedModules, avgScore } = await checkCertificateEligibility(userId, courseId)

    if (!eligible) return null

    // Check if certificate of this type already issued
    const existing = await Certificate.findOne({ user: userId, course: courseId, type })
    if (existing) return existing

    // Get course name
    const Course = (await import('../models/Course.model.js')).default
    const course = await Course.findById(courseId)

    const certificateId = 'DL-' + uuidv4().split('-')[0].toUpperCase()
    const verifyUrl = process.env.CLIENT_URL + '/verify/' + certificateId

    const certificate = await Certificate.create({
      user: userId,
      course: courseId,
      type,
      title: getCertificateTitle(type, course?.title || 'React Course'),
      certificateId,
      averageScore: Math.round(avgScore),
      completedModules,
      verifyUrl,
    })

    console.log('📜 Certificate issued:', certificate.title, 'to user:', userId)
    return certificate
  } catch (err) {
    console.error('Certificate issue error:', err.message)
    return null
  }
}

// ── Get my certificates ──────────────────────────────────────
export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('course', 'title slug thumbnail')
      .sort({ issuedAt: -1 })

    res.json({ success: true, certificates })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── Get certificate by ID (public — for verification) ────────
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId
    })
      .populate('user', 'name avatarUrl')
      .populate('course', 'title thumbnail')

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' })
    }

    res.json({ success: true, certificate })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── Check eligibility without issuing ───────────────────────
export const checkEligibility = async (req, res) => {
  try {
    const { courseId } = req.params
    const result = await checkCertificateEligibility(req.user._id, courseId)
    res.json({ success: true, ...result })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}