import express from 'express'
import Project from '../models/Project.model.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// GET /api/projects/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json({ success: true, project })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/projects/module/:moduleId
router.get('/module/:moduleId', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ module: req.params.moduleId })
    if (!project) {
      return res.status(404).json({ success: false, message: 'No project for this module' })
    }
    res.json({ success: true, project })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router