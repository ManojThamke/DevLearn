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
const EXPRESS_IMG = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
const DATABASE_IMG = 'https://images.unsplash.com/photo-1624027034763-b4ae2f5c1ad9?w=800&q=80'
const AUTH_IMG = 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80'
const BLOG_API_IMG = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'
const ECOMMERCE_API_IMG = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'
const SOCIAL_API_IMG = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // ── Check if course already exists ───────────────────────────────
    const existingCourse = await Course.findOne({ slug: 'nodejs-complete-guide' })
    if (existingCourse) {
      console.log('⚠️  Node.js course already exists. Skipping...')
      process.exit(0)
    }

    // ── Create Node.js Course ────────────────────────────────────────
    const course = await Course.create({
      title: 'Node.js Backend Developer Complete Course',
      slug: 'nodejs-complete-guide',
      description: 'Master Node.js and build production-ready backend applications. Learn Express.js, REST APIs, databases, authentication, security, testing and deployment. Build 5 real-world projects with AI-powered code evaluation.',
      thumbnail: NODE_THUMBNAIL,
      level: 'intermediate',
      tags: ['nodejs', 'backend', 'express', 'javascript', 'database', 'api'],
      published: true,
      instructor: new mongoose.Types.ObjectId(),
    })
    console.log('\n📚 Course created: ' + course.title)

    let totalLessons = 0

    // ════════════════════════════════════════════════════════════
    // MODULE 1 — Node.js Fundamentals
    // ════════════════════════════════════════════════════════════
    const mod1 = await Module.create({
      title: 'Node.js Fundamentals',
      description: 'Learn Node.js runtime, modules, npm, file system and async programming with promises and async/await.',
      order: 1,
      course: course._id,
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
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    await Project.create({
      title: 'File Processing CLI Tool',
      description: 'Build a CLI tool that processes CSV/JSON files and generates reports using Node.js file system.',
      thumbnail: NODE_THUMBNAIL,
      difficulty: 'easy',
      estimatedHours: 4,
      techStack: ['Node.js', 'File System', 'CLI', 'Lodash'],
      requirements: [
        'Read CSV and JSON files',
        'Parse and validate data',
        'Generate summary reports',
        'Export results in multiple formats',
        'Handle errors gracefully',
        'Add command-line arguments',
        'Proper error logging',
      ],
      module: mod1._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'File parsing', description: 'Correctly parse CSV/JSON' },
          { name: 'Validation works', description: 'Invalid data rejected' },
          { name: 'Report generation', description: 'Report created successfully' },
          { name: 'Export formats', description: 'Multiple export formats work' },
          { name: 'Error handling', description: 'Errors handled gracefully' },
        ],
      },
    })
    console.log('  🚀 Project: File Processing CLI Tool')

    // ════════════════════════════════════════════════════════════
    // MODULE 2 — Express & REST APIs
    // ════════════════════════════════════════════════════════════
    const mod2 = await Module.create({
      title: 'Express & REST APIs',
      description: 'Build production-ready REST APIs with Express. Learn routing, middleware, validation, error handling and best practices.',
      order: 2,
      course: course._id,
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
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      totalLessons++
    }

    await Project.create({
      title: 'Blog API Backend',
      description: 'Build a complete Blog API with authentication, comments and tags using Express and MongoDB.',
      thumbnail: BLOG_API_IMG,
      difficulty: 'medium',
      estimatedHours: 8,
      techStack: ['Express', 'MongoDB', 'JWT', 'Joi Validation', 'Multer'],
      requirements: [
        'User authentication with JWT',
        'Create, read, update, delete blog posts',
        'Blog post categories and tags',
        'Comments on posts',
        'Pagination and filtering',
        'File upload for post images',
        'Input validation with Joi',
        'Error handling middleware',
        'Rate limiting',
        'API documentation with Swagger',
      ],
      module: mod2._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Auth API works', description: 'Login/register functional' },
          { name: 'CRUD posts', description: 'Create, read, update, delete posts' },
          { name: 'Comments work', description: 'Add and retrieve comments' },
          { name: 'Validation works', description: 'Invalid data rejected' },
          { name: 'Pagination works', description: 'Posts paginated correctly' },
        ],
      },
    })
    console.log('  🚀 Project: Blog API Backend')

    // ════════════════════════════════════════════════════════════
    // MODULE 3 — Database (MongoDB, Relationships, Optimization)
    // ════════════════════════════════════════════════════════════
    const mod3 = await Module.create({
      title: 'Database Design & MongoDB',
      description: 'Master MongoDB schema design, relationships, indexing, transactions and performance optimization.',
      order: 3,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })

    for (const lessonData of nodeModule3Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: DATABASE_IMG,
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
      title: 'E-Commerce API',
      description: 'Build a scalable e-commerce API with products, cart, orders and inventory using advanced MongoDB features.',
      thumbnail: ECOMMERCE_API_IMG,
      difficulty: 'hard',
      estimatedHours: 10,
      techStack: ['Express', 'MongoDB', 'Aggregation Pipeline', 'Transactions', 'Stripe API'],
      requirements: [
        'Product catalog with search and filters',
        'Shopping cart management',
        'Order processing with transactions',
        'Inventory management',
        'Payment integration (Stripe)',
        'Order history and tracking',
        'Admin endpoints',
        'Advanced MongoDB queries',
        'Database optimization',
        'Comprehensive error handling',
      ],
      module: mod3._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Product search', description: 'Search and filter products' },
          { name: 'Cart operations', description: 'Add, remove, update cart' },
          { name: 'Order checkout', description: 'Complete order creation' },
          { name: 'Inventory tracking', description: 'Stock levels updated' },
          { name: 'Payment processing', description: 'Stripe integration works' },
        ],
      },
    })
    console.log('  🚀 Project: E-Commerce API')

    // ════════════════════════════════════════════════════════════
    // MODULE 4 — Authentication & Security
    // ════════════════════════════════════════════════════════════
    const mod4 = await Module.create({
      title: 'Authentication & Security',
      description: 'Implement secure authentication, authorization, encryption and follow security best practices.',
      order: 4,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 4: Authentication & Security')

    const mod4LessonsContent = [
      {
        order: 1,
        title: 'JWT Authentication',
        duration: 25,
        isFree: true,
        content: 'Implement JWT-based authentication, tokens, refresh tokens and token expiration.',
      },
      {
        order: 2,
        title: 'Password Security & Encryption',
        duration: 20,
        isFree: false,
        content: 'Hash passwords with bcrypt, encryption/decryption, secure storage practices.',
      },
      {
        order: 3,
        title: 'Authorization & Role-Based Access',
        duration: 25,
        isFree: false,
        content: 'Implement role-based access control, permissions and authorization middleware.',
      },
      {
        order: 4,
        title: 'Security Best Practices',
        duration: 30,
        isFree: false,
        content: 'SQL injection prevention, CORS, rate limiting, helmet middleware and more.',
      },
    ]

    for (const lessonData of mod4LessonsContent) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: AUTH_IMG,
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
      title: 'Social API Platform',
      description: 'Build a social media API with authentication, friend requests, posts, likes and comments.',
      thumbnail: SOCIAL_API_IMG,
      difficulty: 'hard',
      estimatedHours: 12,
      techStack: ['Express', 'MongoDB', 'JWT', 'Bcrypt', 'Helmet', 'Rate Limiting'],
      requirements: [
        'User registration and secure login',
        'JWT token management',
        'Friend request system',
        'Post creation with likes and comments',
        'User profiles with avatars',
        'Follow/unfollow users',
        'Feed generation',
        'Notification system',
        'Email verification',
        'Admin panel',
      ],
      module: mod4._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Auth flow', description: 'Register and login work' },
          { name: 'Passwords hashed', description: 'Passwords stored securely' },
          { name: 'Friend requests', description: 'Send and accept requests' },
          { name: 'Posts and likes', description: 'Create posts and add likes' },
          { name: 'Permissions', description: 'Only owner can delete own posts' },
        ],
      },
    })
    console.log('  🚀 Project: Social API Platform')

    // ── Update course totals ─────────────────────────────────────
    const totalModules = await Module.countDocuments({ course: course._id })
    await Course.findByIdAndUpdate(course._id, {
      totalModules,
      totalLessons,
    })

    console.log('\n════════════════════════════════════════════════')
    console.log('✅ Node.js Course Seeding Complete!')
    console.log('📚 Course:    Node.js Backend Developer Complete Course')
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
