import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'

dotenv.config()

const update = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // Delete JavaScript course
    const jsC = await Course.findOne({ slug: 'javascript-advanced' })
    if (jsC) {
      await Module.deleteMany({ course: jsC._id })
      await Lesson.deleteMany({ course: jsC._id })
      await Course.deleteOne({ _id: jsC._id })
      console.log('🗑️  Removed JavaScript Advanced course')
    }

    // Delete TypeScript course
    const tsC = await Course.findOne({ slug: 'typescript-mastery' })
    if (tsC) {
      await Module.deleteMany({ course: tsC._id })
      await Lesson.deleteMany({ course: tsC._id })
      await Course.deleteOne({ _id: tsC._id })
      console.log('🗑️  Removed TypeScript Mastery course')
    }

    // Delete Next.js course
    const njsC = await Course.findOne({ slug: 'nextjs-full-stack' })
    if (njsC) {
      await Module.deleteMany({ course: njsC._id })
      await Lesson.deleteMany({ course: njsC._id })
      await Course.deleteOne({ _id: njsC._id })
      console.log('🗑️  Removed Next.js Full Stack course')
    }

    console.log('\n✨ Now run:')
    console.log('  node seed-javascript.js')
    console.log('  node seed-typescript.js')
    console.log('  node seed-nextjs.js')

    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

update()
