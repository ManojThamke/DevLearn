import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Routes
import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/course.routes.js'
import lessonRoutes from './routes/lesson.routes.js'
import progressRoutes from './routes/progress.routes.js'
import aiRoutes from './routes/ai.routes.js'
import profileRoutes from './routes/profile.routes.js'
import submissionRoutes from './routes/submission.routes.js'
import projectRoutes from './routes/project.routes.js'
import badgeRoutes from './routes/badge.routes.js'
import certificateRoutes from './routes/certificate.routes.js'

// Workers
import { startWorker } from './workers/evaluation.worker.js'



dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// ─── Security Middleware ───────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// ─── Body Parsing Middleware ───────────────────────────────────────
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use(cookieParser())

// ─── Static Files ──────────────────────────────────────────────────
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// ─── API Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/badges', badgeRoutes)
app.use('/api/certificates', certificateRoutes)

// ─── Health Check ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DevLearn API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    routes: [
      '/api/auth',
      '/api/courses',
      '/api/lessons',
      '/api/progress',
      '/api/ai',
      '/api/profile',
      '/api/submissions',
      '/api/projects',
      '/api/badges',
      '/api/certificates',
    ],
  })
})

// ─── 404 Handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route ' + req.originalUrl + ' not found',
  })
})

// ─── Global Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR] ' + err.message)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

// ─── Start Server ──────────────────────────────────────────────────
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // Start evaluation queue worker
    try {
      startWorker()
      console.log('✅ Evaluation queue worker started')
    } catch (workerErr) {
      console.error('⚠️ Evaluation worker failed to start (Redis may be down):', workerErr.message)
    }

    app.listen(PORT, () => {
      console.log('🚀 Server running on http://localhost:' + PORT)
      console.log('🌍 Environment: ' + (process.env.NODE_ENV || 'development'))
    })
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }
}

startServer()
