import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'
import Project from './models/Project.model.js'
import Enrollment from './models/Enrollment.model.js'
import Progress from './models/Progress.model.js'
import Submission from './models/Submission.model.js'
import Score from './models/Score.model.js'
import Badge from './models/Badge.model.js'
import UserBadge from './models/UserBadge.model.js'
import Certificate from './models/Certificate.model.js'
import { module1Lessons } from './data/module1.lessons.js'
import { module2Lessons } from './data/module2.lessons.js'
import { module3Lessons } from './data/module3.lessons.js'
import { module4Lessons } from './data/module4.lessons.js'
import { module5Lessons } from './data/module5.lessons.js'
import { module6Lessons } from './data/module6.lessons.js'
import { module7Lessons } from './data/module7.lessons.js'
import { module8Lessons } from './data/module8.lessons.js'
import { badgeDefinitions } from './data/badgeDefinitions.js'

dotenv.config()

const REACT_THUMBNAIL = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
const JS_LESSON_IMG = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'
const REACT_LESSON_IMG = 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80'
const HOOKS_LESSON_IMG = 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80'
const ADV_LESSON_IMG = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
const API_IMG = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
const STATE_IMG = 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80'
const AUTH_IMG = 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80'
const DEPLOY_IMG = 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80'
const MOVIE_IMG = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'
const TODO_IMG = 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80'
const WEATHER_IMG = 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80'
const BLOG_IMG = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'
const GITHUB_IMG = 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80'
const ECOMMERCE_IMG = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'
const DASHBOARD_IMG = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
const FULLSTACK_IMG = 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80'
const DEVCONNECT_IMG = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'
const SHOPEASE_IMG = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // ── Clear all data ───────────────────────────────────────────
    await Course.deleteMany({})
    await Module.deleteMany({})
    await Lesson.deleteMany({})
    await Project.deleteMany({})
    await Enrollment.deleteMany({})
    await Progress.deleteMany({})
    await Submission.deleteMany({})
    await Score.deleteMany({})
    await Badge.deleteMany({})
    await UserBadge.deleteMany({})
    await Certificate.deleteMany({})
    console.log('🗑️  Cleared all existing data')

    // ── Seed Badges ──────────────────────────────────────────────
    for (const badge of badgeDefinitions) {
      await Badge.create(badge)
    }
    console.log('🏅 Badges seeded: ' + badgeDefinitions.length)

    // ── Create Course ────────────────────────────────────────────
    const course = await Course.create({
      title: 'React Developer Complete Course',
      slug: 'react-complete-guide',
      description: 'Master React.js from beginner to production. Learn JavaScript, React hooks, routing, state management, API integration, authentication, TypeScript and deployment. Build 10 real-world projects with AI-powered code evaluation.',
      thumbnail: REACT_THUMBNAIL,
      level: 'beginner',
      tags: ['react', 'javascript', 'frontend', 'hooks', 'tailwindcss', 'typescript', 'redux'],
      published: true,
      instructor: new mongoose.Types.ObjectId(),
    })
    console.log('\n📚 Course created: ' + course.title)

    let totalLessons = 0

    // ════════════════════════════════════════════════════════════
    // MODULE 1 — JavaScript for React
    // ════════════════════════════════════════════════════════════
    const mod1 = await Module.create({
      title: 'JavaScript for React',
      description: 'Master modern JavaScript features you will use every day as a React developer.',
      order: 1,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 1: JavaScript for React')

    for (const lessonData of module1Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: JS_LESSON_IMG,
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
      title: 'Movie Search App',
      description: 'Build a movie search app using OMDB API with async/await.',
      thumbnail: MOVIE_IMG,
      difficulty: 'easy',
      estimatedHours: 3,
      techStack: ['HTML', 'CSS', 'JavaScript', 'Fetch API'],
      requirements: [
        'Create a search input and button',
        'Fetch movie data from OMDB API using async/await',
        'Display movie title, year, poster and plot',
        'Show a loading spinner while fetching',
        'Handle errors when movie is not found',
        'Display at least 5 search results',
        'Use map to render movie cards',
        'Make it fully responsive',
      ],
      module: mod1._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Search input exists', description: 'Page has a search input field' },
          { name: 'Fetch called on search', description: 'API call made when search clicked' },
          { name: 'Movie cards rendered', description: 'Movie cards appear in DOM' },
          { name: 'Loading state works', description: 'Spinner shown during fetch' },
          { name: 'Error shown on failure', description: 'Error message shown when not found' },
        ],
      },
    })
    console.log('  🚀 Project: Movie Search App')

    // ════════════════════════════════════════════════════════════
    // MODULE 2 — React Fundamentals
    // ════════════════════════════════════════════════════════════
    const mod2 = await Module.create({
      title: 'React Fundamentals',
      description: 'Learn the core building blocks of React — components, props, state and events.',
      order: 2,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 2: React Fundamentals')

    for (const lessonData of module2Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: REACT_LESSON_IMG,
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
      title: 'Todo List App',
      description: 'Build a fully functional Todo List using React fundamentals.',
      thumbnail: TODO_IMG,
      difficulty: 'easy',
      estimatedHours: 4,
      techStack: ['React', 'TailwindCSS', 'localStorage'],
      requirements: [
        'Add new todos using input and button',
        'Display all todos in a styled list',
        'Mark todos as complete with checkbox',
        'Delete todos with delete button',
        'Show count of remaining todos',
        'Filter todos: All, Active, Completed',
        'Store todos in localStorage',
        'Fully responsive with TailwindCSS',
      ],
      module: mod2._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Input exists', description: 'Todo input is in DOM' },
          { name: 'Can add todo', description: 'New todo appears after submit' },
          { name: 'Can delete todo', description: 'Todo removed after delete' },
          { name: 'Can complete todo', description: 'Todo marked done after checkbox' },
          { name: 'Filter works', description: 'Filter buttons show correct todos' },
        ],
      },
    })
    console.log('  🚀 Project: Todo List App')

    // ════════════════════════════════════════════════════════════
    // MODULE 3 — React Hooks
    // ════════════════════════════════════════════════════════════
    const mod3 = await Module.create({
      title: 'React Hooks',
      description: 'Master React Hooks — useState, useEffect, useRef, useMemo, custom hooks and Context API.',
      order: 3,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 3: React Hooks')

    for (const lessonData of module3Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: HOOKS_LESSON_IMG,
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
      title: 'Weather Dashboard',
      description: 'Build a weather dashboard using custom hooks and Context API.',
      thumbnail: WEATHER_IMG,
      difficulty: 'medium',
      estimatedHours: 5,
      techStack: ['React', 'Custom Hooks', 'Context API', 'OpenWeatherMap API', 'TailwindCSS'],
      requirements: [
        'Search weather by city name',
        'Display temperature humidity and wind speed',
        'Show 5-day forecast',
        'Create useFetch custom hook',
        'Store recent searches in Context',
        'Show loading spinner while fetching',
        'Handle errors gracefully',
        'Toggle Celsius and Fahrenheit',
      ],
      module: mod3._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'jest',
        tests: [
          { name: 'Search renders', description: 'City input exists in DOM' },
          { name: 'Weather shows', description: 'Temperature displayed after search' },
          { name: 'Loading works', description: 'Spinner shown during fetch' },
          { name: 'Error works', description: 'Error shown for invalid city' },
          { name: 'Forecast renders', description: '5 forecast cards shown' },
        ],
      },
    })
    console.log('  🚀 Project: Weather Dashboard')

    // ════════════════════════════════════════════════════════════
    // MODULE 4 — Advanced React
    // ════════════════════════════════════════════════════════════
    const mod4 = await Module.create({
      title: 'Advanced React',
      description: 'React Router, performance optimization, state management patterns and building a complete app.',
      order: 4,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('\n📦 Module 4: Advanced React')

    for (const lessonData of module4Lessons) {
      await Lesson.create({
        title: lessonData.title,
        order: lessonData.order,
        duration: lessonData.duration,
        isFree: lessonData.isFree,
        thumbnail: ADV_LESSON_IMG,
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
      title: 'Full Blog Platform',
      description: 'Build a complete blog platform with routing, CRUD and TailwindCSS.',
      thumbnail: BLOG_IMG,
      difficulty: 'hard',
      estimatedHours: 8,
      techStack: ['React', 'React Router v6', 'TailwindCSS', 'Context API', 'Framer Motion'],
      requirements: [
        'Home page showing all blog posts',
        'Single post page with React Router',
        'Create new post with form',
        'Edit existing post',
        'Delete post with confirmation',
        'Search posts by title',
        'Filter by category',
        'Dark mode with Context API',
        'Fully responsive TailwindCSS',
        '404 Not Found page',
      ],
      module: mod4._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'playwright',
        tests: [
          { name: 'Home loads', description: 'Blog posts list renders' },
          { name: 'Navigation works', description: 'Click post opens detail' },
          { name: 'Create works', description: 'New post appears after creation' },
          { name: 'Delete works', description: 'Post removed after deletion' },
          { name: 'Search works', description: 'Posts filtered by search term' },
        ],
      },
    })
    console.log('  🚀 Project: Full Blog Platform')

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
      totalLessons++
    }

    await Project.create({
      title: 'GitHub Profile Finder',
      description: 'Build a GitHub profile search app using Axios and React Query.',
      thumbnail: GITHUB_IMG,
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
      totalLessons++
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
      totalLessons++
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
      totalLessons++
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
        'Deployed to Vercel',
        'API deployed to Railway',
        'Environment variables configured',
        'README with setup instructions',
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

    // ════════════════════════════════════════════════════════════
    // CAPSTONE MODULE
    // ════════════════════════════════════════════════════════════
    const capstoneModule = await Module.create({
      title: 'Capstone Projects',
      description: 'Apply everything you have learned by building two major real-world projects.',
      order: 9,
      course: course._id,
      totalLessons: 0,
      isPublished: true,
    })
    console.log('\n🏆 Capstone Module')

    await Project.create({
      title: 'DevConnect — Developer Job Board',
      description: 'Build a full-featured developer job board and portfolio platform.',
      thumbnail: DEVCONNECT_IMG,
      difficulty: 'hard',
      estimatedHours: 12,
      isCapstone: true,
      techStack: ['React', 'React Router v6', 'Redux Toolkit', 'React Query', 'Axios', 'JWT', 'TailwindCSS'],
      requirements: [
        'User registration and login with JWT',
        'Two roles — developer and company',
        'Protected routes based on role',
        'Developer profile with bio, skills and avatar',
        'Add portfolio projects with GitHub links',
        'Browse and search job listings',
        'Apply for jobs with one click',
        'Track application status',
        'Company profile with logo and description',
        'Post new job listings',
        'View and manage applicants',
        'Search and filter jobs',
        'Pagination for job listings',
        'Responsive design for all screen sizes',
        'Toast notifications for all actions',
      ],
      module: capstoneModule._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'playwright',
        tests: [
          { name: 'Register as developer', description: 'Developer account created' },
          { name: 'Register as company', description: 'Company account created' },
          { name: 'Post a job', description: 'Company can post job listing' },
          { name: 'Apply for job', description: 'Developer can apply for job' },
          { name: 'Search jobs', description: 'Filter jobs by keyword' },
          { name: 'View applications', description: 'Company sees applicants' },
          { name: 'Profile page loads', description: 'Developer profile renders' },
          { name: 'Protected routes work', description: 'Redirect if not logged in' },
          { name: 'Pagination works', description: 'Load more jobs works' },
          { name: 'Responsive layout', description: 'Works on mobile screen' },
        ],
      },
    })
    console.log('  🚀 Capstone 1: DevConnect')

    await Project.create({
      title: 'ShopEase — E-Commerce Platform',
      description: 'Build a complete e-commerce platform with product listings, cart, checkout and admin dashboard.',
      thumbnail: SHOPEASE_IMG,
      difficulty: 'hard',
      estimatedHours: 15,
      isCapstone: true,
      techStack: ['React', 'TypeScript', 'Redux Toolkit', 'React Query', 'React Router v6', 'JWT', 'TailwindCSS', 'React Hook Form'],
      requirements: [
        'Register, login and logout with JWT',
        'User profile with avatar and address book',
        'Admin role with separate dashboard',
        'Product listing with grid and list view',
        'Search products by name',
        'Filter by category, price range and rating',
        'Sort by price, rating and newest',
        'Infinite scroll or pagination',
        'Product detail page with image gallery',
        'Product reviews and ratings',
        'Add to cart with quantity selector',
        'Persist cart in localStorage',
        'Wishlist — save products for later',
        'Multi-step checkout flow',
        'Order history and status tracking',
        'Admin product management',
        'Admin order management',
        'TypeScript throughout entire codebase',
        'Fully responsive design',
        'Loading skeletons for all data',
      ],
      module: capstoneModule._id,
      course: course._id,
      isPublished: true,
      testSuite: {
        framework: 'playwright',
        tests: [
          { name: 'Products load', description: 'Product grid renders on home' },
          { name: 'Search works', description: 'Products filtered by search term' },
          { name: 'Filter works', description: 'Products filtered by category' },
          { name: 'Add to cart', description: 'Item added and cart count updates' },
          { name: 'Cart persists', description: 'Cart survives page refresh' },
          { name: 'Checkout flow', description: 'Complete checkout without errors' },
          { name: 'Order placed', description: 'Order confirmation page shows' },
          { name: 'Order history', description: 'Previous orders listed' },
          { name: 'Admin can add product', description: 'New product appears in listing' },
          { name: 'TypeScript compiles', description: 'No type errors in build' },
        ],
      },
    })
    console.log('  🚀 Capstone 2: ShopEase')

    // ── Update course totals ─────────────────────────────────────
    const totalModules = await Module.countDocuments({ course: course._id })
    await Course.findByIdAndUpdate(course._id, {
      totalModules,
      totalLessons,
    })

    console.log('\n════════════════════════════════════════════════')
    console.log('✅ Seeding complete!')
    console.log('📚 Course:    React Developer Complete Course')
    console.log('📦 Modules:   ' + totalModules)
    console.log('📖 Lessons:   ' + totalLessons)
    console.log('🚀 Projects:  10 (8 module + 2 capstone)')
    console.log('🏅 Badges:    ' + badgeDefinitions.length)
    console.log('════════════════════════════════════════════════')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed: ' + err.message)
    console.error(err)
    process.exit(1)
  }
}

seed()