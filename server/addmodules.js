import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'
import Project from './models/Project.model.js'
import { module5Lessons } from './data/module5.lessons.js'
import { module6Lessons } from './data/module6.lessons.js'
import { module7Lessons } from './data/module7.lessons.js'
import { module8Lessons } from './data/module8.lessons.js'

dotenv.config()

const API_IMG = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
const STATE_IMG = 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80'
const AUTH_IMG = 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80'
const DEPLOY_IMG = 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80'

const ECOMMERCE_IMG = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'
const DASHBOARD_IMG = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
const CHAT_IMG = 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80'
const FULLSTACK_IMG = 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80'

const addModules = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // Find existing course
    const course = await Course.findOne({ slug: 'react-complete-guide' })
    if (!course) {
      console.error('❌ Course not found! Run seed.js first.')
      process.exit(1)
    }
    console.log('📚 Found course: ' + course.title)

    let newLessons = 0

    // ════════════════════════════════════════════════════════════
    // MODULE 5 — API Integration
    // ════════════════════════════════════════════════════════════
    const mod5 = await Module.create({
      title: 'API Integration',
      description: 'Learn Axios, React Query, loading states and pagination for real-world data fetching.',
      order: 5,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 5: API Integration')

    for (const lessonData of module5Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: API_IMG,
        module: mod5._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      newLessons++
    }

    await Project.create({
      title: 'GitHub Profile Finder',
      description: 'Build a GitHub profile search app using Axios and React Query.',
      thumbnail: API_IMG,
      difficulty: 'medium',
      estimatedHours: 5,
      techStack: ['React', 'Axios', 'React Query', 'TailwindCSS', 'GitHub API'],
      requirements: [
        'Search GitHub users by username',
        'Display user avatar, bio, followers and following',
        'Show list of public repositories',
        'Sort repos by stars or last updated',
        'Paginate through repositories',
        'Handle loading and error states',
        'Cache results with React Query',
        'Debounce search input',
      ],
      module: mod5._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Search input exists', description: 'Username input is in DOM' },
          { name: 'Profile displays', description: 'User data shown after search' },
          { name: 'Repos list renders', description: 'Repository cards rendered' },
          { name: 'Loading state works', description: 'Skeleton shown during fetch' },
          { name: 'Error handled', description: 'Error message for invalid username' },
        ],
      },
    })
    console.log('  🚀 Project: GitHub Profile Finder')

    // ════════════════════════════════════════════════════════════
    // MODULE 6 — State Management
    // ════════════════════════════════════════════════════════════
    const mod6 = await Module.create({
      title: 'State Management',
      description: 'Master Redux Toolkit, Zustand and state management patterns for large React apps.',
      order: 6,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 6: State Management')

    for (const lessonData of module6Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: STATE_IMG,
        module: mod6._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      newLessons++
    }

    await Project.create({
      title: 'E-Commerce Cart',
      description: 'Build a full e-commerce product listing and cart using Redux Toolkit.',
      thumbnail: ECOMMERCE_IMG,
      difficulty: 'medium',
      estimatedHours: 6,
      techStack: ['React', 'Redux Toolkit', 'React Query', 'TailwindCSS'],
      requirements: [
        'Product listing with search and filter',
        'Add to cart and remove from cart',
        'Update product quantity in cart',
        'Show cart total and item count in navbar',
        'Persist cart to localStorage',
        'Checkout summary page',
        'Empty cart state',
        'Responsive design',
      ],
      module: mod6._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Products render', description: 'Product cards displayed' },
          { name: 'Add to cart works', description: 'Item added to cart' },
          { name: 'Cart count updates', description: 'Navbar badge shows correct count' },
          { name: 'Remove works', description: 'Item removed from cart' },
          { name: 'Total calculated', description: 'Cart total is correct' },
        ],
      },
    })
    console.log('  🚀 Project: E-Commerce Cart')

    // ════════════════════════════════════════════════════════════
    // MODULE 7 — Authentication
    // ════════════════════════════════════════════════════════════
    const mod7 = await Module.create({
      title: 'Authentication',
      description: 'Implement JWT authentication, protected routes, role based access and OAuth.',
      order: 7,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 7: Authentication')

    for (const lessonData of module7Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: AUTH_IMG,
        module: mod7._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      newLessons++
    }

    await Project.create({
      title: 'Auth Dashboard',
      description: 'Build a full authentication system with JWT, protected routes and role based access.',
      thumbnail: DASHBOARD_IMG,
      difficulty: 'hard',
      estimatedHours: 7,
      techStack: ['React', 'React Router', 'JWT', 'Axios', 'TailwindCSS'],
      requirements: [
        'Register with name, email and password',
        'Login with JWT stored in localStorage',
        'Protected dashboard route',
        'Role based navigation (admin vs student)',
        'Auto refresh expired tokens',
        'Logout clears all tokens',
        'Redirect to intended page after login',
        'Show user avatar and name in navbar',
      ],
      module: mod7._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Register works', description: 'New user created' },
          { name: 'Login works', description: 'Token stored after login' },
          { name: 'Protected route works', description: 'Redirect to login if not auth' },
          { name: 'Logout works', description: 'Token removed on logout' },
          { name: 'Role check works', description: 'Admin sees different UI' },
        ],
      },
    })
    console.log('  🚀 Project: Auth Dashboard')

    // ════════════════════════════════════════════════════════════
    // MODULE 8 — Production React
    // ════════════════════════════════════════════════════════════
    const mod8 = await Module.create({
      title: 'Production React',
      description: 'TypeScript, testing, performance optimization and deploying to Vercel and Railway.',
      order: 8,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 8: Production React')

    for (const lessonData of module8Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: DEPLOY_IMG,
        module: mod8._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: lessonData.content,
      })
      console.log('  ✅ Lesson ' + lessonData.order + ': ' + lessonData.title)
      newLessons++
    }

    await Project.create({
      title: 'Full Stack React App',
      description: 'Build and deploy a complete full stack React application with TypeScript and tests.',
      thumbnail: FULLSTACK_IMG,
      difficulty: 'hard',
      estimatedHours: 10,
      techStack: ['React', 'TypeScript', 'Vitest', 'React Query', 'Redux Toolkit', 'TailwindCSS', 'Vercel'],
      requirements: [
        'TypeScript throughout entire codebase',
        'At least 10 unit and integration tests',
        'All routes code split with lazy loading',
        'Lighthouse performance score above 90',
        'Deployed to Vercel with custom domain',
        'API deployed to Railway',
        'Environment variables configured',
        'README with setup instructions',
        'CI/CD pipeline working',
        'All Core Web Vitals in green',
      ],
      module: mod8._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'playwright',
        tests: [
          { name: 'App loads', description: 'Homepage renders without errors' },
          { name: 'Auth flow works', description: 'Login and logout functional' },
          { name: 'Data fetches', description: 'API calls work in production' },
          { name: 'Routes work', description: 'All pages accessible' },
          { name: 'TypeScript compiles', description: 'No type errors in build' },
        ],
      },
    })
    console.log('  🚀 Project: Full Stack React App')

    // ── Update course totals ─────────────────────────────────────
    const totalLessons = await Lesson.countDocuments({ course: course._id })
    const totalModules = await Module.countDocuments({ course: course._id })

    await Course.findByIdAndUpdate(course._id, {
      totalModules,
      totalLessons,
      title: 'React Developer Complete Course',
      slug: 'react-complete-guide',
      description: 'Master React.js from beginner to production. Learn JavaScript, React hooks, routing, state management, API integration, authentication, TypeScript and deployment. Build 8 real-world projects with AI-powered code evaluation.',
    })

    console.log('\n════════════════════════════════════════════')
    console.log('✅ Modules 5-8 added successfully!')
    console.log('📦 New modules: 4')
    console.log('📖 New lessons: ' + newLessons)
    console.log('🚀 New projects: 4')
    console.log('📚 Total modules: ' + totalModules)
    console.log('📖 Total lessons: ' + totalLessons)
    console.log('════════════════════════════════════════════')

    process.exit(0)
  } catch (err) {
    console.error('❌ Failed: ' + err.message)
    console.error(err)
    process.exit(1)
  }
}

addModules()