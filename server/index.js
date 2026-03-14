import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/course.routes.js'
import lessonRoutes from './routes/lesson.routes.js'
import progressRoutes from './routes/progress.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/progress', progressRoutes)

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DevLearn API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route ' + req.originalUrl + ' not found',
  })
})

app.use((err, req, res, next) => {
  console.error('[ERROR] ' + err.message)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')
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
