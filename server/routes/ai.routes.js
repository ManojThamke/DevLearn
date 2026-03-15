import express from 'express'
import { chat } from '../controllers/ai.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// AI Chat endpoint
router.post('/chat', protect, chat)

export default router
