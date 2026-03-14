import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/Course.model.js'
import Module from './models/Module.model.js'
import Lesson from './models/Lesson.model.js'
import Project from './models/Project.model.js'

dotenv.config()

const REACT_THUMBNAIL = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
const JS_LESSON_IMG = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'
const REACT_LESSON_IMG = 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80'
const HOOKS_LESSON_IMG = 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80'
const ADV_LESSON_IMG = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
const MOVIE_IMG = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'
const TODO_IMG = 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80'
const WEATHER_IMG = 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80'
const BLOG_IMG = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')

    await Course.deleteMany({})
    await Module.deleteMany({})
    await Lesson.deleteMany({})
    await Project.deleteMany({})
    console.log('Cleared existing data')

    // ── Create Course ────────────────────────────────────────────
    const course = await Course.create({
      title: 'React.js Complete Guide',
      slug: 'react-complete-guide',
      description: 'Master React.js from beginner to advanced level. Learn modern JavaScript, React hooks, state management, routing, and build 4 real-world projects with AI-powered evaluation.',
      thumbnail: REACT_THUMBNAIL,
      level: 'beginner',
      tags: ['react', 'javascript', 'frontend', 'hooks', 'tailwindcss'],
      published: true,
      instructor: new mongoose.Types.ObjectId(),
    })
    console.log('Course created: ' + course.title)

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
    console.log('Module 1 created')

    await Lesson.create({
      title: 'ES6+ Basics',
      order: 1,
      duration: 15,
      isFree: true,
      thumbnail: JS_LESSON_IMG,
      module: mod1._id,
      course: course._id,
      isPublished: true,
      videoUrl: '',
      content: [
        '# ES6+ Basics',
        '',
        '## Introduction',
        'Before React, you need modern JavaScript. ES6 was released in 2015 and changed everything.',
        '',
        '## 1. let and const',
        'Rule: never use var. Use const by default. Use let when value changes.',
        '',
        '```javascript',
        'const API_URL = "https://api.devlearn.com"',
        'const MAX_RETRIES = 3',
        'let isLoading = true',
        'let currentPage = 1',
        'isLoading = false',
        '```',
        '',
        '## 2. Arrow Functions',
        '```javascript',
        'const add = (a, b) => a + b',
        'const double = n => n * 2',
        'const sayHello = () => "Hello!"',
        '```',
        '',
        '## 3. Template Literals',
        'Use backticks to embed variables in strings.',
        '```javascript',
        'const name = "Manoj"',
        'const score = 95',
        'console.log("Hello " + name + ", score: " + score)',
        '```',
        '',
        '## 4. Default Parameters',
        '```javascript',
        'const greet = (name = "Student") => "Hello " + name',
        'greet("Manoj") // Hello Manoj',
        'greet()        // Hello Student',
        '```',
        '',
        '## Common Mistakes',
        '1. Using var instead of const/let',
        '2. Trying to reassign a const variable',
        '3. Arrow function returning object without wrapping in ()',
        '4. Using arrow functions when you need the this keyword',
        '',
        '## Pro Tips',
        '1. Always use const first, switch to let only if needed',
        '2. Use arrow functions for callbacks and event handlers',
        '3. const arrays and objects can still be modified',
        '4. Use UPPER_SNAKE_CASE for true constants',
        '',
        '## Interview Questions',
        'Q1. Difference between var, let and const?',
        'Answer: var is function scoped and hoisted. let is block scoped and reassignable. const is block scoped and cannot be reassigned.',
        '',
        'Q2. Difference between regular and arrow functions?',
        'Answer: Arrow functions are shorter and do not have their own this binding.',
        '',
        'Q3. Can you modify a const array or object?',
        'Answer: Yes. const prevents reassignment but not modification.',
        '',
        'Q4. What is a template literal?',
        'Answer: Strings using backticks that allow embedded expressions and multiline text.',
        '',
        'Q5. What is hoisting?',
        'Answer: JavaScript moves declarations to top of scope. var is initialized as undefined. let/const throw ReferenceError before declaration.',
        '',
        '## Exercises',
        'Exercise 1 - Easy: Convert all var to const or let',
        'Exercise 2 - Medium: Convert regular functions to arrow functions',
        'Exercise 3 - Hard: Find and fix 5 bugs in provided code',
        '',
        '## Summary',
        '- Variables: use const by default, let when reassigning',
        '- Functions: arrow functions for modern code',
        '- Strings: template literals instead of concatenation',
        '- Parameters: default values instead of if checks',
      ].join('\n'),
    })
    console.log('  Lesson 1: ES6+ Basics')
    totalLessons++

    await Lesson.create({
      title: 'Destructuring & Spread Operator',
      order: 2,
      duration: 20,
      isFree: true,
      thumbnail: JS_LESSON_IMG,
      module: mod1._id,
      course: course._id,
      isPublished: true,
      videoUrl: '',
      content: [
        '# Destructuring and Spread Operator',
        '',
        '## Introduction',
        'Two features you will use in every React component you write.',
        'Destructuring is like unpacking a suitcase — take everything out and place it where needed.',
        '',
        '## 1. Array Destructuring',
        '```javascript',
        'const colors = ["red", "green", "blue"]',
        'const [first, second, third] = colors',
        '',
        '// Skip elements',
        'const [, second, , fourth] = [1, 2, 3, 4]',
        '',
        '// Default values',
        'const [a = 0, b = 0] = [10]',
        '',
        '// Swap variables',
        'let x = 1, y = 2',
        '[x, y] = [y, x]',
        '```',
        '',
        '## React Connection — useState',
        '```javascript',
        'const [count, setCount] = useState(0)',
        'const [name, setName] = useState("")',
        '```',
        '',
        '## 2. Object Destructuring',
        '```javascript',
        'const user = { name: "Manoj", age: 25, city: "Mumbai" }',
        'const { name, age, city } = user',
        '',
        '// Rename',
        'const { name: userName } = user',
        '',
        '// Default values',
        'const { score = 0 } = user',
        '',
        '// Nested',
        'const { address: { city, state } } = student',
        '```',
        '',
        '## React Connection — Props',
        '```javascript',
        'const CourseCard = ({ title, description, level }) => (',
        '  <div>',
        '    <h2>{title}</h2>',
        '    <p>{description}</p>',
        '  </div>',
        ')',
        '```',
        '',
        '## 3. Rest Operator',
        '```javascript',
        'const [first, ...rest] = [1, 2, 3, 4, 5]',
        'const { name, ...otherDetails } = user',
        'const sum = (...numbers) => numbers.reduce((t, n) => t + n, 0)',
        '```',
        '',
        '## 4. Spread Operator',
        '```javascript',
        'const combined = [...arr1, ...arr2]',
        'const copy = [...original]',
        'const updated = { ...user, age: 26 }',
        'const merged = { ...obj1, ...obj2 }',
        '```',
        '',
        '## React Connection — State Updates',
        '```javascript',
        'setUser({ ...user, age: 26 })',
        'setTodos([...todos, newTodo])',
        'setTodos(todos.filter(t => t.id !== id))',
        '```',
        '',
        '## Common Mistakes',
        '1. Mutating state directly instead of spreading',
        '2. Forgetting spread only does shallow copy',
        '3. Putting rest anywhere except last position',
        '',
        '## Pro Tips',
        '1. Remove sensitive fields: const { password, ...safeUser } = user',
        '2. Pass all props: const Button = ({ label, ...props }) => <button {...props}>',
        '3. Spread into function args: Math.max(...numbers)',
        '',
        '## Interview Questions',
        'Q1. Difference between rest and spread?',
        'Answer: Spread expands into individual items. Rest collects items into one array/object.',
        '',
        'Q2. Deep or shallow copy?',
        'Answer: Shallow only. Nested objects still share reference.',
        '',
        'Q3. How to update one state property?',
        'Answer: setUser({ ...user, age: 26 })',
        '',
        '## Exercises',
        'Exercise 1 - Easy: Destructure object and array',
        'Exercise 2 - Medium: Rewrite component using prop destructuring',
        'Exercise 3 - Hard: Write 4 state update functions',
      ].join('\n'),
    })
    console.log('  Lesson 2: Destructuring and Spread')
    totalLessons++

    await Lesson.create({
      title: 'Array Methods',
      order: 3,
      duration: 25,
      isFree: false,
      thumbnail: JS_LESSON_IMG,
      module: mod1._id,
      course: course._id,
      isPublished: true,
      videoUrl: '',
      content: [
        '# Array Methods — map, filter, reduce',
        '',
        '## Introduction',
        'These three methods are the backbone of React development.',
        'map = transform every item',
        'filter = keep only matching items',
        'reduce = combine everything into one value',
        '',
        '## 1. map',
        '```javascript',
        'const doubled = [1,2,3,4,5].map(n => n * 2)',
        '// [2, 4, 6, 8, 10]',
        '```',
        '',
        '## React — Rendering Lists',
        '```javascript',
        'courses.map(course => (',
        '  <CourseCard key={course._id} title={course.title} />',
        '))',
        '```',
        '',
        '## 2. filter',
        '```javascript',
        'const evens = [1,2,3,4,5,6].filter(n => n % 2 === 0)',
        '// [2, 4, 6]',
        '',
        'const passed = students.filter(s => s.passed)',
        '```',
        '',
        '## React — Deleting from State',
        '```javascript',
        'setTodos(todos.filter(todo => todo.id !== id))',
        '```',
        '',
        '## 3. reduce',
        '```javascript',
        'const sum = [1,2,3,4,5].reduce((total, n) => total + n, 0)',
        '// 15',
        '```',
        '',
        '## 4. Other Methods',
        '```javascript',
        'arr.find(n => n > 4)      // first match',
        'arr.findIndex(n => n > 4) // index of first match',
        'arr.some(n => n > 8)      // at least one matches',
        'arr.every(n => n > 0)     // all match',
        'arr.includes(5)            // contains value',
        '[...arr].sort((a, b) => a - b) // sorted copy',
        '```',
        '',
        '## 5. Method Chaining',
        '```javascript',
        'const result = students',
        '  .filter(s => s.city === "Mumbai")',
        '  .filter(s => s.score >= 50)',
        '  .sort((a, b) => b.score - a.score)',
        '  .map(s => s.name)',
        '```',
        '',
        '## Common Mistakes',
        '1. Forgetting return statement inside map curly braces',
        '2. Mutating array with sort — copy first with spread',
        '3. Missing key prop in React map',
        '4. Missing initial value in reduce',
        '',
        '## Pro Tips',
        '1. map same length, filter shorter, reduce any type',
        '2. Use IDs as keys never index',
        '3. flatMap when map produces nested arrays',
        '4. Chain max 3 methods for readability',
        '',
        '## Interview Questions',
        'Q1. map vs forEach?',
        'Answer: map returns new array. forEach returns undefined.',
        '',
        'Q2. Why not use index as key?',
        'Answer: Indices change on reorder/delete causing incorrect re-renders.',
        '',
        'Q3. What does reduce return?',
        'Answer: Single accumulated value of any type.',
        '',
        '## Exercises',
        'Exercise 1 - Easy: filter evens, square all, sum all, filter > 5',
        'Exercise 2 - Medium: filter in-stock, get electronics names, total value',
        'Exercise 3 - Hard: total revenue, unique customers, most popular course',
      ].join('\n'),
    })
    console.log('  Lesson 3: Array Methods')
    totalLessons++

    await Lesson.create({
      title: 'Async JavaScript',
      order: 4,
      duration: 30,
      isFree: false,
      thumbnail: JS_LESSON_IMG,
      module: mod1._id,
      course: course._id,
      isPublished: true,
      videoUrl: '',
      content: [
        '# Async JavaScript — Promises and Async/Await',
        '',
        '## Introduction',
        'React apps fetch data from APIs constantly. Async JavaScript is essential.',
        'Think of it like a token number system — you can do other things while waiting.',
        '',
        '## 1. The Problem',
        'Synchronous code blocks everything while waiting.',
        'Asynchronous code lets other code run while waiting.',
        '',
        '## 2. Promises',
        '```javascript',
        'fetch("/api/courses")',
        '  .then(response => response.json())',
        '  .then(data => console.log(data))',
        '  .catch(error => console.error(error))',
        '  .finally(() => setLoading(false))',
        '```',
        '',
        '## 3. Async/Await',
        '```javascript',
        'const fetchCourses = async () => {',
        '  try {',
        '    const response = await fetch("/api/courses")',
        '    if (!response.ok) throw new Error("Failed")',
        '    const data = await response.json()',
        '    return data',
        '  } catch (error) {',
        '    console.error(error.message)',
        '  } finally {',
        '    setLoading(false)',
        '  }',
        '}',
        '```',
        '',
        '## 4. Async in React useEffect',
        '```javascript',
        'useEffect(() => {',
        '  const fetchData = async () => {',
        '    try {',
        '      setLoading(true)',
        '      const res = await fetch("/api/courses")',
        '      const data = await res.json()',
        '      setCourses(data)',
        '    } catch (err) {',
        '      setError(err.message)',
        '    } finally {',
        '      setLoading(false)',
        '    }',
        '  }',
        '  fetchData()',
        '}, [])',
        '```',
        '',
        '## 5. Promise.all — Parallel Requests',
        '```javascript',
        'const [users, courses] = await Promise.all([',
        '  fetchUsers(),',
        '  fetchCourses()',
        '])',
        '```',
        '',
        '## Common Mistakes',
        '1. Making useEffect itself async — create inner async function instead',
        '2. Not handling errors with try/catch',
        '3. Running requests sequentially when they could be parallel',
        '',
        '## Pro Tips',
        '1. Always use try/catch with async/await',
        '2. Check response.ok before parsing JSON',
        '3. Use Promise.all for parallel independent requests',
        '4. Use AbortController to cancel requests on unmount',
        '',
        '## Interview Questions',
        'Q1. Difference between sync and async?',
        'Answer: Sync blocks execution line by line. Async lets program continue while waiting.',
        '',
        'Q2. Three states of a Promise?',
        'Answer: Pending, fulfilled, rejected.',
        '',
        'Q3. Why not make useEffect async directly?',
        'Answer: useEffect expects nothing or a cleanup function returned. Async returns a Promise.',
        '',
        'Q4. Promise.all vs Promise.allSettled?',
        'Answer: Promise.all rejects if any fail. allSettled waits for all regardless.',
        '',
        '## Exercises',
        'Exercise 1 - Easy: Convert .then().catch() chain to async/await',
        'Exercise 2 - Medium: Build fetch function with retry on failure',
        'Exercise 3 - Hard: React component fetching user and courses in parallel',
      ].join('\n'),
    })
    console.log('  Lesson 4: Async JavaScript')
    totalLessons++

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
    console.log('  Project: Movie Search App')

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
    console.log('Module 2 created')

    const reactLessons = [
      { title: 'What is React & JSX', order: 1, isFree: true, duration: 20 },
      { title: 'Components & Props', order: 2, isFree: false, duration: 25 },
      { title: 'State & Events', order: 3, isFree: false, duration: 30 },
      { title: 'Lists & Conditional Rendering', order: 4, isFree: false, duration: 25 },
    ]

    for (const lesson of reactLessons) {
      await Lesson.create({
        ...lesson,
        thumbnail: REACT_LESSON_IMG,
        module: mod2._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: 'Full content coming soon for: ' + lesson.title,
      })
      console.log('  Lesson: ' + lesson.title)
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
    console.log('  Project: Todo List App')

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
    console.log('Module 3 created')

    const hooksLessons = [
      { title: 'useState & useEffect', order: 1, isFree: true, duration: 30 },
      { title: 'useRef & useMemo', order: 2, isFree: false, duration: 25 },
      { title: 'Custom Hooks', order: 3, isFree: false, duration: 30 },
      { title: 'Context API & useContext', order: 4, isFree: false, duration: 30 },
    ]

    for (const lesson of hooksLessons) {
      await Lesson.create({
        ...lesson,
        thumbnail: HOOKS_LESSON_IMG,
        module: mod3._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: 'Full content coming soon for: ' + lesson.title,
      })
      console.log('  Lesson: ' + lesson.title)
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
    console.log('  Project: Weather Dashboard')

    // ════════════════════════════════════════════════════════════
    // MODULE 4 — Advanced React
    // ════════════════════════════════════════════════════════════
    const mod4 = await Module.create({
      title: 'Advanced React',
      description: 'React Router, performance optimization, error boundaries and TailwindCSS.',
      order: 4,
      course: course._id,
      totalLessons: 4,
      isPublished: true,
    })
    console.log('Module 4 created')

    const advLessons = [
      { title: 'React Router v6', order: 1, isFree: true, duration: 30 },
      { title: 'Performance Optimization', order: 2, isFree: false, duration: 30 },
      { title: 'Error Boundaries & Suspense', order: 3, isFree: false, duration: 25 },
      { title: 'React with TailwindCSS', order: 4, isFree: false, duration: 35 },
    ]

    for (const lesson of advLessons) {
      await Lesson.create({
        ...lesson,
        thumbnail: ADV_LESSON_IMG,
        module: mod4._id,
        course: course._id,
        isPublished: true,
        videoUrl: '',
        content: 'Full content coming soon for: ' + lesson.title,
      })
      console.log('  Lesson: ' + lesson.title)
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
    console.log('  Project: Full Blog Platform')

    // ── Update course totals ─────────────────────────────────────
    await Course.findByIdAndUpdate(course._id, {
      totalModules: 4,
      totalLessons,
    })

    console.log('')
    console.log('Seeding complete!')
    console.log('Course: React.js Complete Guide')
    console.log('Modules: 4')
    console.log('Lessons: ' + totalLessons)
    console.log('Projects: 4')
    console.log('Images: Unsplash free images loaded')

    process.exit(0)
  } catch (err) {
    console.error('Seeding failed: ' + err.message)
    process.exit(1)
  }
}

seed()