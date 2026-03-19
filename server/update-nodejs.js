import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'
import Project from './models/Project.model.js'
import { nodeModule1Lessons } from './data/nodejs-module1.lessons.js'
import { nodeModule2Lessons } from './data/nodejs-module2.lessons.js'
import { nodeModule3Lessons } from './data/nodejs-module3.lessons.js'

dotenv.config()

const NODE_THUMBNAIL = 'https://images.unsplash.com/photo-1627398242454-45a570e2c9b4?w=500&fit=crop'
const EXPRESS_IMG = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&fit=crop'
const DATABASE_IMG = 'https://images.unsplash.com/photo-1624027034763-b4ae2f5c1ad9?w=500&fit=crop'

const update = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // Delete existing course
    const course = await Course.findOne({ slug: 'nodejs-complete-guide' })
    if (course) {
      await Module.deleteMany({ course: course._id })
      await Lesson.deleteMany({ course: course._id })
      await Project.deleteMany({ course: course._id })
      await Course.deleteOne({ _id: course._id })
      console.log('🗑️  Removed old Node.js course')
    }

    // Create fresh course
    const newCourse = await Course.create({
      title: 'Node.js Backend Developer Complete Course',
      slug: 'nodejs-complete-guide',
      description: 'Master Node.js and build production-ready backend applications. Learn Express.js, REST APIs, MongoDB, authentication, security, testing and deployment.',
      thumbnail: NODE_THUMBNAIL,
      level: 'intermediate',
      tags: ['nodejs', 'backend', 'express', 'javascript', 'database', 'api'],
      published: true,
      instructor: new mongoose.Types.ObjectId(),
    })
    console.log('\n📚 Course created: ' + newCourse.title)

    let totalLessons = 0

    // MODULE 1
    const mod1 = await Module.create({
      title: 'Node.js Fundamentals',
      description: 'Learn Node.js runtime, V8 engine, modules, async JavaScript, and event-driven architecture.',
      order: 1,
      course: newCourse._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 1: Node.js Fundamentals')

    for (const lessonData of nodeModule1Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: NODE_THUMBNAIL,
        module: mod1._id,
        course: newCourse._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    // MODULE 2
    const mod2 = await Module.create({
      title: 'Express & REST APIs',
      description: 'Build production-ready REST APIs with Express.js, routing, middleware, and error handling.',
      order: 2,
      course: newCourse._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 2: Express & REST APIs')

    for (const lessonData of nodeModule2Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: EXPRESS_IMG,
        module: mod2._id,
        course: newCourse._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    // MODULE 3
    const mod3 = await Module.create({
      title: 'MongoDB & Database Design',
      description: 'Master MongoDB schema design, aggregations, indexing, transactions, and performance optimization.',
      order: 3,
      course: newCourse._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 3: MongoDB & Database Design')

    for (const lessonData of nodeModule3Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: DATABASE_IMG,
        module: mod3._id,
        course: newCourse._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    console.log('\n════════════════════════════════════════════════')
    console.log('✅ Node.js Course Updated Successfully!')
    console.log('📚 Course:    Node.js Backend Developer Complete Course')
    console.log('📦 Modules:   3')
    console.log('📖 Lessons:   ' + totalLessons)
    console.log('════════════════════════════════════════════════')

    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

update()
