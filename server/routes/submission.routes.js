import express from 'express'
import {
  createSubmission,
  getProjectSubmissions,
  getSubmissionById,
  getMySubmissions,
  handleZipUpload,
} from '../controllers/submission.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { uploadZip } from '../middleware/upload.middleware.js'

const router = express.Router()

router.post('/', protect, createSubmission)

router.post('/upload-zip', protect, (req, res, next) => {
  uploadZip(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      })
    }
    next()
  })
}, handleZipUpload)

router.get('/my', protect, getMySubmissions)
router.get('/project/:projectId', protect, getProjectSubmissions)
router.get('/:id', protect, getSubmissionById)

export default router