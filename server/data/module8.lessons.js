export const module8Lessons = [
  {
    order: 1,
    title: 'TypeScript with React',
    duration: 35,
    isFree: true,
    content: `# TypeScript with React

## What is TypeScript?

TypeScript is JavaScript with static type checking. It catches errors at compile time before your code runs — making large apps much easier to maintain.

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
\`\`\`

## Why TypeScript?

\`\`\`typescript
// JavaScript — error only visible at runtime
function greet(user) {
  return 'Hello ' + user.naem  // typo! no error shown
}

// TypeScript — error caught immediately
interface User {
  name: string
  email: string
}

function greet(user: User) {
  return 'Hello ' + user.naem  // Error: Property 'naem' does not exist
}
\`\`\`

## Basic Types

\`\`\`typescript
// Primitives
const name: string = 'Manoj'
const age: number = 25
const isActive: boolean = true

// Arrays
const scores: number[] = [95, 88, 72]
const names: string[] = ['Manoj', 'Priya']
const items: Array<string> = ['a', 'b', 'c']

// Union types
let id: string | number = '123'
id = 456  // also valid

// Optional
let email: string | undefined = undefined
let phone?: string  // shorthand for string | undefined

// Literal types
type Direction = 'north' | 'south' | 'east' | 'west'
type Status = 'pending' | 'completed' | 'failed'
\`\`\`

## Interfaces and Types

\`\`\`typescript
// Interface — for objects and classes
interface User {
  _id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  xpTotal: number
  avatarUrl?: string
  createdAt: string
}

// Type alias — for unions, primitives and complex types
type ID = string | number
type Callback = () => void
type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

// Extending interfaces
interface Course {
  _id: string
  title: string
  slug: string
  level: 'beginner' | 'intermediate' | 'advanced'
  totalLessons: number
}

interface EnrolledCourse extends Course {
  enrolledAt: string
  progress: number
  completedLessons: number
}
\`\`\`

## Typing React Components

\`\`\`tsx
// Function component with props
interface ButtonProps {
  text: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  className?: string
}

function Button({ text, onClick, variant = 'primary', disabled = false, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`btn btn-\${variant} \${className}\`}
    >
      {text}
    </button>
  )
}

// With children
interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={\`card \${className}\`}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
\`\`\`

## Typing useState

\`\`\`tsx
import { useState } from 'react'

interface User {
  _id: string
  name: string
  email: string
  role: string
}

function ProfilePage() {
  // TypeScript infers type from initial value
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  // Explicit type when initial value is null or empty
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      {user && <p>{user.name}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
\`\`\`

## Typing useRef

\`\`\`tsx
import { useRef, useEffect } from 'react'

function TextInput() {
  // Type the DOM element
  const inputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()  // optional chaining for null check
  }, [])

  return <input ref={inputRef} />
}
\`\`\`

## Typing Event Handlers

\`\`\`tsx
function Form() {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value)
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') console.log('Enter pressed')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInputChange} onKeyDown={handleKeyDown} />
      <textarea onChange={handleTextareaChange} />
      <select onChange={handleSelectChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  )
}
\`\`\`

## Typing Custom Hooks

\`\`\`typescript
// useLocalStorage hook with TypeScript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setStoredValue(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue]
}

// Usage — TypeScript infers the generic type
const [theme, setTheme] = useLocalStorage<string>('theme', 'light')
const [count, setCount] = useLocalStorage<number>('count', 0)
const [user, setUser] = useLocalStorage<User | null>('user', null)
\`\`\`

## Typing API Calls

\`\`\`typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface Course {
  _id: string
  title: string
  slug: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  totalLessons: number
  thumbnail: string
  tags: string[]
}

export interface CoursesResponse {
  courses: Course[]
  total: number
  page: number
  totalPages: number
}

// services/api.ts
import api from './axiosInstance'
import type { Course, CoursesResponse } from '../types/api'

export const fetchCourses = async (): Promise<CoursesResponse> => {
  const { data } = await api.get<CoursesResponse>('/courses')
  return data
}

export const fetchCourseBySlug = async (slug: string): Promise<Course> => {
  const { data } = await api.get<{ course: Course }>(\`/courses/\${slug}\`)
  return data.course
}
\`\`\`

## Interview Questions

**Q1. What is TypeScript and why use it?**
TypeScript is a typed superset of JavaScript. It catches type errors at compile time, improves IDE autocomplete, makes refactoring safer and serves as documentation.

**Q2. What is the difference between interface and type in TypeScript?**
Both define object shapes. Interfaces support declaration merging and are better for objects and classes. Types are more flexible — they support unions, intersections and mapped types.

**Q3. What is a generic type?**
A type parameter that lets you write reusable code that works with different types. Like useLocalStorage<T> where T is specified by the caller.

**Q4. What does the ? mean in TypeScript?**
Makes a property optional — it can be the specified type or undefined. For example name?: string means name can be a string or absent.

**Q5. What is type inference?**
TypeScript automatically determining the type from the value. const count = 0 is inferred as number without explicit annotation.

**Q6. Should you always use TypeScript?**
For large apps, team projects or long-term projects yes. For small prototypes or solo projects the overhead may not be worth it. Once you learn it the benefits are hard to give up.

## Exercises

**Exercise 1 — Easy:** Add TypeScript types to a Button component with text, onClick, variant and disabled props.

**Exercise 2 — Medium:** Create a typed useFetch hook that accepts a URL and returns data, loading and error with proper types.

**Exercise 3 — Hard:** Type an entire feature — User type, API service functions, useState hooks, component props and event handlers all fully typed.

## Summary

- TypeScript catches errors at compile time not runtime
- Interface for objects, type for unions and complex types
- Use generics for reusable typed utilities
- Type useState with User | null for nullable values
- Type event handlers with React.ChangeEvent and React.FormEvent
- API responses should have typed interfaces
- TypeScript is an investment that pays off in large apps`
  },

  {
    order: 2,
    title: 'Testing React Applications',
    duration: 35,
    isFree: false,
    content: `# Testing React Applications

## Why Test?

Tests give you confidence that your code works and prevent regressions when you make changes. A good test suite lets you refactor without fear.

\`\`\`bash
# Vitest + React Testing Library (for Vite projects)
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

# Jest + React Testing Library (for CRA projects)
npm install -D jest @testing-library/react @testing-library/user-event @testing-library/jest-dom
\`\`\`

## Types of Tests

\`\`\`
Unit Tests        → test one function or component in isolation
Integration Tests → test multiple components working together
E2E Tests         → test the full user journey in a real browser
\`\`\`

## Vitest Setup

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
\`\`\`

\`\`\`javascript
// src/test/setup.js
import '@testing-library/jest-dom'
\`\`\`

## Your First Test

\`\`\`jsx
// src/components/Button.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button text="Click me" onClick={() => {}} />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button text="Click" onClick={handleClick} />)

    await userEvent.click(screen.getByText('Click'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('is disabled when disabled prop is true', () => {
    render(<Button text="Click" onClick={() => {}} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('applies variant class', () => {
    render(<Button text="Click" onClick={() => {}} variant="danger" />)
    expect(screen.getByRole('button')).toHaveClass('btn-danger')
  })
})
\`\`\`

## Testing Forms

\`\`\`jsx
// src/pages/LoginPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>)
}

describe('LoginPage', () => {
  test('shows validation errors when form is submitted empty', async () => {
    renderWithRouter(<LoginPage />)

    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  test('calls login with correct credentials', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ user: { name: 'Manoj' } })

    renderWithRouter(<LoginPage onLogin={mockLogin} />)

    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      'manoj@test.com'
    )
    await userEvent.type(
      screen.getByPlaceholderText(/password/i),
      'password123'
    )

    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('manoj@test.com', 'password123')
    })
  })
})
\`\`\`

## Testing with Context

\`\`\`jsx
// src/test/utils.jsx
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

export function renderWithProviders(ui, options = {}) {
  const queryClient = createTestQueryClient()

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter>
            {children}
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Usage in tests
import { renderWithProviders } from '../test/utils'

test('renders dashboard', () => {
  renderWithProviders(<Dashboard />)
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
})
\`\`\`

## Mocking API Calls

\`\`\`javascript
// Mock Axios
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

import api from '../services/api'

test('displays courses on load', async () => {
  const mockCourses = [
    { _id: '1', title: 'React Course', level: 'beginner' },
    { _id: '2', title: 'Node Course', level: 'intermediate' },
  ]

  api.get.mockResolvedValueOnce({
    data: { courses: mockCourses, total: 2 }
  })

  renderWithProviders(<CourseCatalog />)

  // Loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  // Data loaded
  await waitFor(() => {
    expect(screen.getByText('React Course')).toBeInTheDocument()
    expect(screen.getByText('Node Course')).toBeInTheDocument()
  })
})
\`\`\`

## Testing Custom Hooks

\`\`\`javascript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '../hooks/useCounter'

describe('useCounter', () => {
  test('initializes with default value', () => {
    const { result } = renderHook(() => useCounter(0))
    expect(result.current.count).toBe(0)
  })

  test('increments count', () => {
    const { result } = renderHook(() => useCounter(0))
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })

  test('decrements count', () => {
    const { result } = renderHook(() => useCounter(10))
    act(() => result.current.decrement())
    expect(result.current.count).toBe(9)
  })

  test('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(5))
    act(() => result.current.increment())
    act(() => result.current.reset())
    expect(result.current.count).toBe(5)
  })
})
\`\`\`

## Interview Questions

**Q1. What is React Testing Library?**
A testing library that renders components and lets you query them as a user would — by text, role, label and placeholder. Encourages testing behavior not implementation.

**Q2. What is the difference between getBy and queryBy and findBy?**
getBy throws if not found. queryBy returns null if not found — use for asserting absence. findBy is async and waits for element to appear.

**Q3. What should you test in React components?**
Test what the user sees and does — rendered output, user interactions and side effects. Do not test implementation details like state values or function names.

**Q4. What is vi.fn()?**
A Vitest mock function that records how it was called. Use it to replace real functions with controlled fakes in tests.

**Q5. Why do you need to wrap components with providers in tests?**
Components that use Context, Router or React Query need their providers to function. Create a custom render function that wraps with all necessary providers.

**Q6. What is the testing pyramid?**
A model suggesting many unit tests, fewer integration tests and even fewer E2E tests. Unit tests are cheap and fast. E2E tests are slow and expensive.

## Exercises

**Exercise 1 — Easy:** Write tests for a Counter component — check initial value, increment and decrement buttons work.

**Exercise 2 — Medium:** Write tests for a login form — validation errors shown, API called with correct values, redirect on success.

**Exercise 3 — Hard:** Test a full component that fetches data — mock the API, test loading state, data displayed and error state.

## Summary

- Test behavior not implementation details
- React Testing Library queries by role, text and label
- getBy throws, queryBy returns null, findBy is async
- Mock API calls with vi.mock and vi.fn
- Create a custom render function with all providers
- renderHook tests custom hooks in isolation
- Test the happy path and error cases`
  },

  {
    order: 3,
    title: 'Performance & Production Build',
    duration: 30,
    isFree: false,
    content: `# Performance & Production Build

## Measuring Performance

Before optimizing measure first. Use these tools:

\`\`\`
React DevTools Profiler  → find slow components
Chrome DevTools          → network, memory, CPU
Lighthouse               → overall page score
Web Vitals               → Core Web Vitals metrics
\`\`\`

## Core Web Vitals

\`\`\`
LCP (Largest Contentful Paint)  → loading performance
                                   target: < 2.5 seconds

FID (First Input Delay)         → interactivity
                                   target: < 100ms

CLS (Cumulative Layout Shift)   → visual stability
                                   target: < 0.1
\`\`\`

## Bundle Analysis

\`\`\`bash
npm install -D rollup-plugin-visualizer
\`\`\`

\`\`\`javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
})
\`\`\`

\`\`\`bash
npm run build
# Opens interactive bundle visualization in browser
\`\`\`

## Code Splitting Strategies

\`\`\`jsx
import { lazy, Suspense } from 'react'

// Route-level splitting — most common
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CourseCatalog = lazy(() => import('./pages/CourseCatalog'))
const LessonPage = lazy(() => import('./pages/LessonPage'))

// Component-level splitting — for heavy components
const RichTextEditor = lazy(() => import('./components/RichTextEditor'))
const Chart = lazy(() => import('./components/Chart'))
const VideoPlayer = lazy(() => import('./components/VideoPlayer'))

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/lessons/:id" element={<LessonPage />} />
      </Routes>
    </Suspense>
  )
}
\`\`\`

## Image Optimization

\`\`\`jsx
// Use modern image formats
// Use correct dimensions
// Lazy load below-the-fold images

function OptimizedImage({ src, alt, width, height }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"              // native lazy loading
      decoding="async"            // non-blocking decode
      style={{ aspectRatio: \`\${width}/\${height}\` }}  // prevent CLS
    />
  )
}

// For thumbnails use query params
const thumbnail = \`\${course.thumbnail}?w=400&q=80\`
\`\`\`

## Environment Variables

\`\`\`bash
# .env.development
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DevLearn

# .env.production
VITE_API_URL=https://api.devlearn.com/api
VITE_APP_NAME=DevLearn

# .env.local (never commit — override for local dev)
VITE_API_URL=http://localhost:5000/api
\`\`\`

\`\`\`javascript
// Access in code — must start with VITE_
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
\`\`\`

## Production Build

\`\`\`bash
# Build
npm run build

# Preview build locally before deploying
npm run preview
\`\`\`

\`\`\`
dist/
├── index.html
├── assets/
│   ├── index-abc123.js      ← main bundle (hashed for cache busting)
│   ├── index-def456.css
│   ├── Dashboard-ghi789.js  ← lazy loaded chunk
│   └── vendor-jkl012.js     ← vendor chunk
\`\`\`

## Vite Production Config

\`\`\`javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendors into separate chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          motion: ['framer-motion'],
        }
      }
    },
    chunkSizeWarningLimit: 500,  // warn if chunk > 500kb
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
\`\`\`

## Performance Checklist

\`\`\`
✅ Code split all routes with lazy()
✅ Images have width and height attributes
✅ Images use loading="lazy" below the fold
✅ No unnecessary re-renders (React DevTools Profiler)
✅ Large lists are virtualized
✅ API responses are cached with React Query
✅ Bundle analyzed — no large unexpected dependencies
✅ Tree shaking removes unused code
✅ Fonts preloaded in index.html
✅ Gzip/Brotli compression on server
\`\`\`

## Interview Questions

**Q1. What are Core Web Vitals?**
Google's metrics for user experience — LCP measures loading, FID measures interactivity and CLS measures visual stability. They affect SEO rankings.

**Q2. What is tree shaking?**
Removing unused code from the final bundle. Modern bundlers like Vite/Rollup analyze imports and exclude code that is never used.

**Q3. What is cache busting?**
Adding a hash to file names so browsers fetch the new version when code changes instead of using the cached old version. Vite does this automatically.

**Q4. What is the difference between npm run dev and npm run build?**
Dev runs a development server with hot module replacement and no minification. Build creates an optimized production bundle — minified, tree-shaken and split into chunks.

**Q5. How do you reduce bundle size?**
Code splitting with lazy, analyzing with bundle visualizer, replacing heavy libraries with lighter ones, tree shaking, and removing unused dependencies.

## Exercises

**Exercise 1 — Easy:** Add a bundle visualizer to your Vite project and identify the three largest dependencies.

**Exercise 2 — Medium:** Code split all routes with lazy and Suspense. Verify in Network tab that chunks load on demand.

**Exercise 3 — Hard:** Audit your app with Lighthouse. Identify all performance issues and fix them to get a score above 90.

## Summary

- Measure with React DevTools Profiler and Lighthouse before optimizing
- Code split routes and heavy components with lazy and Suspense
- Use bundle visualizer to find large dependencies
- Always set image dimensions to prevent layout shift
- Use environment variables for API URLs per environment
- Production build minifies, tree-shakes and splits code automatically`
  },

  {
    order: 4,
    title: 'Deployment — Vercel & Railway',
    duration: 30,
    isFree: false,
    content: `# Deployment — Vercel & Railway

## Deployment Overview

\`\`\`
Frontend (React)  → Vercel  — free tier, global CDN, auto deploy
Backend (Node.js) → Railway — free tier, Docker support, Redis
Database          → MongoDB Atlas — already deployed
\`\`\`

## Deploying Frontend to Vercel

### Step 1 — Push to GitHub

\`\`\`bash
git add .
git commit -m "ready for deployment"
git push origin main
\`\`\`

### Step 2 — Connect to Vercel

\`\`\`
1. Go to vercel.com and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework: Vite
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: dist
5. Add environment variables:
   VITE_API_URL = https://your-railway-url.up.railway.app/api
6. Click Deploy
\`\`\`

### Step 3 — vercel.json for SPA routing

\`\`\`json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
\`\`\`

This file goes in the client folder. It tells Vercel to serve index.html for all routes so React Router works correctly.

## Deploying Backend to Railway

### Step 1 — Prepare server for production

\`\`\`javascript
// server/index.js — add CORS for production
import cors from 'cors'

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
  ],
  credentials: true,
}))
\`\`\`

### Step 2 — Add start script

\`\`\`json
// server/package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
\`\`\`

### Step 3 — Deploy to Railway

\`\`\`
1. Go to railway.app and sign up with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set Root Directory to: server
6. Add environment variables:
   PORT              = 5000
   MONGO_URI         = your_mongodb_atlas_uri
   JWT_SECRET        = your_jwt_secret
   JWT_REFRESH_SECRET = your_refresh_secret
   CLIENT_URL        = https://your-vercel-url.vercel.app
   GEMINI_API_KEY    = your_gemini_key
   NODE_ENV          = production
7. Click Deploy
\`\`\`

### Step 4 — Add Redis on Railway

\`\`\`
1. In your Railway project click "New Service"
2. Select "Redis"
3. Railway automatically sets REDIS_URL env variable
4. Your app can use process.env.REDIS_URL
\`\`\`

## Environment Variables Checklist

\`\`\`bash
# Frontend (Vercel)
VITE_API_URL=https://your-app.up.railway.app/api

# Backend (Railway)
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=super_secret_key_minimum_32_chars
JWT_REFRESH_SECRET=another_secret_key_32_chars
CLIENT_URL=https://your-app.vercel.app
GEMINI_API_KEY_1=AIza...
GEMINI_API_KEY_2=AIza...
REDIS_URL=redis://...  (auto set by Railway Redis plugin)
\`\`\`

## Custom Domain Setup

\`\`\`
Vercel:
1. Go to project Settings → Domains
2. Add your domain: devlearn.com
3. Add CNAME record in your DNS provider:
   www → cname.vercel-dns.com

Railway:
1. Go to service Settings → Domains
2. Add custom domain: api.devlearn.com
3. Add CNAME record in DNS:
   api → your-app.up.railway.app
\`\`\`

## CI/CD — Automatic Deployment

\`\`\`
Both Vercel and Railway auto-deploy on every push to main:

git add .
git commit -m "fix: update lesson content"
git push origin main
→ Vercel detects push → builds → deploys frontend in ~60s
→ Railway detects push → builds → deploys backend in ~2 min
\`\`\`

## Production Checklist

\`\`\`
Before deploying:
✅ All environment variables set
✅ CORS configured for production URLs
✅ JWT secrets are strong (32+ chars)
✅ MongoDB Atlas IP whitelist set to 0.0.0.0/0
✅ vercel.json added for SPA routing
✅ package.json has start script and node engines
✅ No hardcoded localhost URLs in code
✅ .env files are in .gitignore
✅ Build runs without errors locally
✅ All API routes tested

After deploying:
✅ Frontend loads at Vercel URL
✅ API responds at Railway URL
✅ Login and register work
✅ Course catalog loads
✅ Lesson pages work
✅ AI assistant responds
✅ No CORS errors in console
\`\`\`

## Monitoring & Logs

\`\`\`javascript
// Add request logging in production
import morgan from 'morgan'

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

// Error logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
\`\`\`

## Rollback on Failure

\`\`\`
Vercel:
1. Go to project → Deployments
2. Find last working deployment
3. Click three dots → Promote to Production

Railway:
1. Go to service → Deployments
2. Find last working deployment
3. Click Rollback
\`\`\`

## Interview Questions

**Q1. What is a CDN?**
Content Delivery Network — servers distributed globally that cache your static files. Vercel serves your frontend from the nearest server to the user — making it very fast.

**Q2. What is the difference between dev and production environments?**
Dev has hot reload, verbose errors and no minification. Production has minified code, optimized assets, error monitoring and scaled infrastructure.

**Q3. Why do you need vercel.json for React Router?**
React Router handles routing client-side. Without the rewrite rule Vercel returns a 404 for direct URL access to any route other than root.

**Q4. How do you handle secrets in production?**
Use environment variables — never commit secrets to git. Vercel and Railway both have UI to set env vars securely. Use different secrets for dev and production.

**Q5. What is CI/CD?**
Continuous Integration and Continuous Deployment — automatically building, testing and deploying code on every push. Vercel and Railway implement this out of the box.

**Q6. What should you check after deploying?**
Test all critical user flows — login, signup, API calls, protected routes. Check browser console for errors. Verify CORS headers are correct.

## Exercises

**Exercise 1 — Easy:** Deploy your React app to Vercel. Add vercel.json and verify React Router works on direct URL access.

**Exercise 2 — Medium:** Deploy your Node.js backend to Railway. Set all environment variables and verify the API is accessible.

**Exercise 3 — Hard:** Set up a custom domain for both frontend and backend. Add Morgan logging and test all API endpoints in production.

## Summary

- Frontend goes on Vercel — free, fast, auto-deploys from GitHub
- Backend goes on Railway — free tier, supports Node.js and Redis
- Never commit secrets — use environment variables
- Add vercel.json for React Router SPA routing
- Configure CORS for production URLs
- MongoDB Atlas must allow connections from Railway IPs
- CI/CD means every git push auto-deploys both services

Congratulations on completing the Full React Developer Course! You have gone from JavaScript basics to deploying a production full-stack application. Now build amazing things!`
  }
]