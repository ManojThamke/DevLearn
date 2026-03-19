import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'
import Project from './models/Project.model.js'
import { jsAdvModule2Lessons, jsAdvModule3Lessons, jsAdvModule4Lessons } from './data/js-adv-module2-4.lessons.js'

// Import module1 separately
import {
  jsAdvModule1Lessons as mod1Lessons
} from './data/js-adv-module1.lessons.js'

dotenv.config()

const JS_THUMBNAIL = 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db5a?w=800&q=80'

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    const existingCourse = await Course.findOne({ slug: 'javascript-advanced' })
    if (existingCourse) {
      console.log('⚠️  JavaScript Advanced course already exists. Skipping...')
      process.exit(0)
    }

    const course = await Course.create({
      title: 'JavaScript Advanced Concepts',
      slug: 'javascript-advanced',
      description: 'Master advanced JavaScript concepts including closures, prototypes, async/await, functional programming and design patterns. Take your JavaScript skills from intermediate to expert level.',
      thumbnail: JS_THUMBNAIL,
      level: 'advanced',
      tags: ['javascript', 'advanced', 'closures', 'prototypes', 'async', 'functional'],
      published: true,
      instructor: new mongoose.Types.ObjectId(),
    })
    console.log('\n📚 Course created: ' + course.title)

    let totalLessons = 0

    // MODULE 1
    const mod1 = await Module.create({
      title: 'Functions, Scope & Closures',
      description: 'Deep dive into JavaScript functions, lexical scope, closures, and the this keyword.',
      order: 1,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 1: Functions, Scope & Closures')

    for (const lessonData of mod1Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: JS_THUMBNAIL,
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
      title: 'Functional Calculator Library',
      description: 'Build a calculator library using closures, higher-order functions and functional programming patterns.',
      thumbnail: JS_THUMBNAIL,
      difficulty: 'medium',
      estimatedHours: 6,
      techStack: ['JavaScript', 'Functional Programming', 'Jest'],
      requirements: [
        'Create calculator with closures',
        'Implement curry and compose utilities',
        'Support chain operations',
        'Add memory functionality',
        'Write comprehensive tests',
        'Document API',
      ],
      module: mod1._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Basic operations', description: 'Add, subtract, multiply, divide' },
          { name: 'Chaining', description: 'Operations can be chained' },
          { name: 'Memory functions', description: 'Memory store and recall' },
          { name: 'Currying', description: 'Partial application works' },
          { name: 'Composing', description: 'Function composition works' },
        ],
      },
    })
    console.log('  🚀 Project: Functional Calculator Library')

    // MODULE 2
    const mod2 = await Module.create({
      title: 'Prototypes, OOP & Design Patterns',
      description: 'Master JavaScript prototypes, object-oriented programming, and essential design patterns.',
      order: 2,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 2: Prototypes, OOP & Design Patterns')

    for (const lessonData of jsAdvModule2Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: JS_THUMBNAIL,
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
      title: 'Game Engine Architecture',
      description: 'Build a game engine using OOP principles, design patterns, and prototypal inheritance.',
      thumbnail: JS_THUMBNAIL,
      difficulty: 'hard',
      estimatedHours: 10,
      techStack: ['JavaScript', 'OOP', 'Design Patterns', 'Canvas API'],
      requirements: [
        'Implement game object hierarchy',
        'Use factory pattern for entities',
        'Observer pattern for events',
        'Renderer system',
        'Physics simulation',
        'Save/load system',
      ],
      module: mod2._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Entity creation', description: 'Entities created correctly' },
          { name: 'Inheritance works', description: 'Prototype inheritance functional' },
          { name: 'Event system', description: 'Observer pattern works' },
          { name: 'Physics', description: 'Collision detection' },
          { name: 'Persistence', description: 'Save/load functionality' },
        ],
      },
    })
    console.log('  🚀 Project: Game Engine Architecture')

    // MODULE 3
    const mod3 = await Module.create({
      title: 'Promises, Async/Await & Event Loop',
      description: 'Master asynchronous JavaScript, promises, async/await, and the event loop.',
      order: 3,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 3: Promises, Async/Await & Event Loop')

    for (const lessonData of jsAdvModule3Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: JS_THUMBNAIL,
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
      title: 'Web Scraper with Rate Limiting',
      description: 'Build a web scraper that efficiently manages async operations with queuing and rate limiting.',
      thumbnail: JS_THUMBNAIL,
      difficulty: 'medium',
      estimatedHours: 8,
      techStack: ['JavaScript', 'Async/Await', 'Generators', 'Node.js'],
      requirements: [
        'Fetch multiple URLs asynchronously',
        'Parse and extract data',
        'Queue-based rate limiting',
        'Error handling and retries',
        'Progress tracking',
        'Export results to JSON',
      ],
      module: mod3._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Fetching', description: 'URLs fetched correctly' },
          { name: 'Parsing', description: 'Data extracted accurately' },
          { name: 'Rate limiting', description: 'Respects rate limits' },
          { name: 'Error handling', description: 'Handles failures gracefully' },
          { name: 'Progress', description: 'Progress tracking works' },
        ],
      },
    })
    console.log('  🚀 Project: Web Scraper with Rate Limiting')

    // MODULE 4
    const mod4 = await Module.create({
      title: 'Functional Programming Mastery',
      description: 'Master functional programming techniques, composition, and optimization.',
      order: 4,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 4: Functional Programming Mastery')

    for (const lessonData of jsAdvModule4Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: JS_THUMBNAIL,
        module: mod4._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    await Project.create({
      title: 'Functional Data Processing Pipeline',
      description: 'Build a data pipeline using pure functions, composition, and immutability patterns.',
      thumbnail: JS_THUMBNAIL,
      difficulty: 'hard',
      estimatedHours: 12,
      techStack: ['JavaScript', 'Functional Programming', 'Immutability', 'Lodash'],
      requirements: [
        'Pure function implementation',
        'Data transformation pipeline',
        'Memoization for optimization',
        'Compose and pipe utilities',
        'Handle large datasets',
        'Performance benchmarking',
      ],
      module: mod4._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Pure functions', description: 'No side effects' },
          { name: 'Composition', description: 'Function composition works' },
          { name: 'Immutability', description: 'Data never mutated' },
          { name: 'Memoization', description: 'Performance improved' },
          { name: 'Large data', description: 'Handles millions of records' },
        ],
      },
    })
    console.log('  🚀 Project: Functional Data Processing Pipeline')

    const totalModules = await Module.countDocuments({ course: course._id })
    await Course.findByIdAndUpdate(course._id, {
      totalModules,
      totalLessons,
    })

    console.log('\n════════════════════════════════════════════════')
    console.log('✅ JavaScript Advanced Course Seeding Complete!')
    console.log('📚 Course:    JavaScript Advanced Concepts')
    console.log('📦 Modules:   ' + totalModules)
    console.log('📖 Lessons:   ' + totalLessons)
    console.log('🚀 Projects:  4')
    console.log('════════════════════════════════════════════════')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed: ' + err.message)
    console.error(err)
    process.exit(1)
  }
}

seed()
