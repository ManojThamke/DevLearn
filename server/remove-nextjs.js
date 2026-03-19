import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'

dotenv.config()

const update = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    const njsC = await Course.findOne({ slug: 'nextjs-full-stack' })
    if (njsC) {
      await Module.deleteMany({ course: njsC._id })
      await Lesson.deleteMany({ course: njsC._id })
      await Course.deleteOne({ _id: njsC._id })
      console.log('🗑️  Removed Next.js course')
    }
    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

update()
