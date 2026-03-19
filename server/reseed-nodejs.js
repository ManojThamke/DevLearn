import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'
import Project from './models/Project.model.js'

dotenv.config()

const reseed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // Delete existing Node.js course
    const deleted = await Course.deleteOne({ slug: 'nodejs-complete-guide' })
    if (deleted.deletedCount) {
      console.log('🗑️  Removed old Node.js course')
      // Also delete related modules, lessons, projects
      await Module.deleteMany({ course: { $exists: true } })
      await Lesson.deleteMany({ course: { $exists: true } })
      await Project.deleteMany({ course: { $exists: true } })
    }

    console.log('✨ Now run: node seed-nodejs.js')
    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

reseed()
