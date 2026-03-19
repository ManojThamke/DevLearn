import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'
import Project from './models/Project.model.js'
import { nextjsModule1Lessons, nextjsModule2Lessons, nextjsModule3Lessons } from './data/nextjs-modules.lessons.js'

dotenv.config()

const NEXTJS_THUMBNAIL = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    const existingCourse = await Course.findOne({ slug: 'nextjs-fullstack' })
    if (existingCourse) {
      console.log('⚠️  Next.js course already exists. Skipping...')
      process.exit(0)
    }

    const course = await Course.create({
      title: 'Next.js Full Stack Development',
      slug: 'nextjs-fullstack',
      description: 'Master Next.js 14 App Router for building production-ready full-stack applications. Learn server components, API routes, database integration, authentication, and deployment.',
      thumbnail: NEXTJS_THUMBNAIL,
      level: 'intermediate',
      tags: ['nextjs', 'fullstack', 'react', 'api', 'deployment'],
      published: true,
      instructor: new mongoose.Types.ObjectId(),
    })
    console.log('\n📚 Course created: ' + course.title)

    let totalLessons = 0

    // MODULE 1
    const mod1 = await Module.create({
      title: 'Next.js Fundamentals with App Router',
      description: 'Learn Next.js 14, App Router, file-based routing, and layouts.',
      order: 1,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 1: Next.js Fundamentals with App Router')

    for (const lessonData of nextjsModule1Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: NEXTJS_THUMBNAIL,
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
      title: 'Portfolio Website',
      description: 'Build a beautiful, SEO-optimized portfolio website using Next.js and Tailwind.',
      thumbnail: NEXTJS_THUMBNAIL,
      difficulty: 'easy',
      estimatedHours: 6,
      techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
      requirements: [
        'Home, about, projects pages',
        'Dynamic project cards',
        'Contact form',
        'SEO optimization',
        'Responsive design',
        'Dark mode toggle',
      ],
      module: mod1._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Pages render', description: 'All pages load correctly' },
          { name: 'Routing works', description: 'Navigation functional' },
          { name: 'Responsive', description: 'Works on mobile' },
          { name: 'SEO tags', description: 'Meta tags present' },
          { name: 'Performance', description: 'Fast page loads' },
        ],
      },
    })
    console.log('  🚀 Project: Portfolio Website')

    // MODULE 2
    const mod2 = await Module.create({
      title: 'Backend Development with Next.js',
      description: 'Build APIs, connect databases, and implement server actions.',
      order: 2,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 2: Backend Development with Next.js')

    for (const lessonData of nextjsModule2Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: NEXTJS_THUMBNAIL,
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
      title: 'Blog Platform with CMS',
      description: 'Build a full blog platform with admin dashboard, database, and API.',
      thumbnail: NEXTJS_THUMBNAIL,
      difficulty: 'medium',
      estimatedHours: 10,
      techStack: ['Next.js', 'MongoDB', 'Prisma', 'NextAuth', 'TailwindCSS'],
      requirements: [
        'Public blog listing',
        'Single post page',
        'Admin dashboard',
        'Create/edit posts',
        'User authentication',
        'Comments system',
        'Search functionality',
      ],
      module: mod2._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'API endpoints', description: 'All endpoints working' },
          { name: 'Database', description: 'Data persisted correctly' },
          { name: 'Auth', description: 'Authentication functional' },
          { name: 'Forms', description: 'Form submission works' },
          { name: 'CRUD', description: 'Create, read, update, delete' },
        ],
      },
    })
    console.log('  🚀 Project: Blog Platform with CMS')

    // MODULE 3
    const mod3 = await Module.create({
      title: 'Advanced Patterns & Deployment',
      description: 'Advanced patterns, authentication, optimization, and production deployment.',
      order: 3,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 3: Advanced Patterns & Deployment')

    for (const lessonData of nextjsModule3Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: NEXTJS_THUMBNAIL,
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
      title: 'SaaS Application',
      description: 'Build a complete SaaS application with authentication, payments, and deployment.',
      thumbnail: NEXTJS_THUMBNAIL,
      difficulty: 'hard',
      estimatedHours: 20,
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'Vercel', 'PostgreSQL'],
      requirements: [
        'User registration and login',
        'Subscription plans',
        'Payment processing',
        'Admin dashboard',
        'Team collaboration',
        'Email notifications',
        'Analytics',
        'Production deployment',
      ],
      module: mod3._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Auth flow', description: 'Registration and login' },
          { name: 'Payments', description: 'Stripe integration' },
          { name: 'Subscriptions', description: 'Plan management' },
          { name: 'Dashboard', description: 'Admin features' },
          { name: 'Deployment', description: 'Deployed to production' },
        ],
      },
    })
    console.log('  🚀 Project: SaaS Application')

    const totalModules = await Module.countDocuments({ course: course._id })
    await Course.findByIdAndUpdate(course._id, {
      totalModules,
      totalLessons,
    })

    console.log('\n════════════════════════════════════════════════')
    console.log('✅ Next.js Course Seeding Complete!')
    console.log('📚 Course:    Next.js Full Stack Development')
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
