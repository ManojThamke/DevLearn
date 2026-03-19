import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'
import Project from './models/Project.model.js'
import { tsModule1Lessons, tsModule2Lessons, tsModule3Lessons } from './data/ts-modules.lessons.js'

dotenv.config()

const TS_THUMBNAIL = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    const existingCourse = await Course.findOne({ slug: 'typescript-mastery' })
    if (existingCourse) {
      console.log('⚠️  TypeScript course already exists. Skipping...')
      process.exit(0)
    }

    const course = await Course.create({
      title: 'TypeScript Mastery',
      slug: 'typescript-mastery',
      description: 'Master TypeScript for production applications. Learn types, generics, decorators, and advanced patterns. Build type-safe React and Node.js applications with confidence.',
      thumbnail: TS_THUMBNAIL,
      level: 'intermediate',
      tags: ['typescript', 'types', 'generics', 'react', 'node.js'],
      published: true,
      instructor: new mongoose.Types.ObjectId(),
    })
    console.log('\n📚 Course created: ' + course.title)

    let totalLessons = 0

    // MODULE 1
    const mod1 = await Module.create({
      title: 'TypeScript Fundamentals',
      description: 'Learn TypeScript basics, type annotations, and setup.',
      order: 1,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 1: TypeScript Fundamentals')

    for (const lessonData of tsModule1Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: TS_THUMBNAIL,
        module: mod1._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    await Project.create({
      title: 'Todo App with TypeScript',
      description: 'Build a fully type-safe todo application with TypeScript.',
      thumbnail: TS_THUMBNAIL,
      difficulty: 'easy',
      estimatedHours: 5,
      techStack: ['TypeScript', 'React', 'Node.js'],
      requirements: [
        'Strict type checking enabled',
        'Type-safe components',
        'API integration with types',
        'No any types allowed',
        'Full type coverage',
      ],
      module: mod1._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Types correct', description: 'All types properly defined' },
          { name: 'Compiles', description: 'No TypeScript errors' },
          { name: 'Functions work', description: 'All features functional' },
          { name: 'API typed', description: 'Responses properly typed' },
        ],
      },
    })
    console.log('  🚀 Project: Todo App with TypeScript')

    // MODULE 2
    const mod2 = await Module.create({
      title: 'Advanced Types & Generics',
      description: 'Master interfaces, generics, utility types, and type manipulation.',
      order: 2,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 2: Advanced Types & Generics')

    for (const lessonData of tsModule2Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: TS_THUMBNAIL,
        module: mod2._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    await Project.create({
      title: 'Type-Safe API Client Library',
      description: 'Build a generic, type-safe API client using advanced TypeScript patterns.',
      thumbnail: TS_THUMBNAIL,
      difficulty: 'hard',
      estimatedHours: 10,
      techStack: ['TypeScript', 'Generics', 'Utility Types', 'Axios'],
      requirements: [
        'Generic HTTP client',
        'Auto-typed responses',
        'Request/response interceptors',
        'Error handling types',
        'Middleware support',
        'Cache layer typed',
      ],
      module: mod2._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Generic types', description: 'Generics work correctly' },
          { name: 'API requests', description: 'Requests typed properly' },
          { name: 'Response typing', description: 'Auto-typed responses' },
          { name: 'Error types', description: 'Errors properly typed' },
          { name: 'Composition', description: 'Types compose correctly' },
        ],
      },
    })
    console.log('  🚀 Project: Type-Safe API Client Library')

    // MODULE 3
    const mod3 = await Module.create({
      title: 'TypeScript in Real Projects',
      description: 'Apply TypeScript to React, Node.js, and production applications.',
      order: 3,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 3: TypeScript in Real Projects')

    for (const lessonData of tsModule3Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: TS_THUMBNAIL,
        module: mod3._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    await Project.create({
      title: 'Full Stack TypeScript Application',
      description: 'Build a complete full-stack application with TypeScript frontend and backend.',
      thumbnail: TS_THUMBNAIL,
      difficulty: 'hard',
      estimatedHours: 15,
      techStack: ['TypeScript', 'React', 'Express', 'MongoDB', 'Prisma'],
      requirements: [
        'Shared types between frontend/backend',
        'Type-safe database layer',
        'React hooks typed',
        'API routes typed',
        'Error handling',
        'Deployment ready',
      ],
      module: mod3._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Frontend types', description: 'React components typed' },
          { name: 'Backend types', description: 'API routes typed' },
          { name: 'Shared types', description: 'Types shared correctly' },
          { name: 'Database', description: 'Database queries typed' },
          { name: 'Build', description: 'Builds without errors' },
        ],
      },
    })
    console.log('  🚀 Project: Full Stack TypeScript Application')

    const totalModules = await Module.countDocuments({ course: course._id })
    await Course.findByIdAndUpdate(course._id, {
      totalModules,
      totalLessons,
    })

    console.log('\n════════════════════════════════════════════════')
    console.log('✅ TypeScript Course Seeding Complete!')
    console.log('📚 Course:    TypeScript Mastery')
    console.log('📦 Modules:   ' + totalModules)
    console.log('📖 Lessons:   ' + totalLessons)
    console.log('🚀 Projects:  3')
    console.log('════════════════════════════════════════════════')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed: ' + err.message)
    console.error(err)
    process.exit(1)
  }
}

seed()
