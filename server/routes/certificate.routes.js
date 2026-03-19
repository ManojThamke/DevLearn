import express from 'express'
import {
  getMyCertificates,
  getCertificateById,
  checkEligibility,
} from '../controllers/certificate.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/my', protect, getMyCertificates)
router.get('/verify/:certificateId', getCertificateById)
router.get('/check/:courseId', protect, checkEligibility)

export default router