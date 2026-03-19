export const module5Lessons = [
  {
    order: 1,
    title: 'Axios & HTTP Requests',
    duration: 30,
    isFree: true,
    content: `# Axios & HTTP Requests

## What is Axios?

Axios is a popular HTTP client library for JavaScript. It is cleaner and more powerful than the built-in fetch API.

\`\`\`bash
npm install axios
\`\`\`

## Axios vs Fetch

\`\`\`javascript
// Fetch — verbose
const res = await fetch('/api/users')
if (!res.ok) throw new Error('Failed')
const data = await res.json()

// Axios — cleaner
const { data } = await axios.get('/api/users')
\`\`\`

## Basic Axios Requests

\`\`\`javascript
import axios from 'axios'

// GET
const { data } = await axios.get('/api/courses')

// POST
const { data } = await axios.post('/api/courses', {
  title: 'React Course',
  level: 'beginner'
})

// PUT
const { data } = await axios.put('/api/courses/123', {
  title: 'Updated Title'
})

// DELETE
await axios.delete('/api/courses/123')

// PATCH
const { data } = await axios.patch('/api/courses/123', {
  published: true
})
\`\`\`

## Axios Instance — Base URL Setup

\`\`\`javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
\`\`\`

\`\`\`javascript
// Now use api everywhere
import api from './services/api'

const { data } = await api.get('/courses')
const { data } = await api.post('/auth/login', { email, password })
\`\`\`

## Request and Response Interceptors

Interceptors run before every request or after every response:

\`\`\`javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Request interceptor — add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
\`\`\`

## Error Handling with Axios

\`\`\`javascript
try {
  const { data } = await api.get('/courses')
  setCourses(data.courses)
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error('Status:', error.response.status)
    console.error('Message:', error.response.data.message)

    if (error.response.status === 404) setError('Not found')
    if (error.response.status === 500) setError('Server error')

  } else if (error.request) {
    // Request made but no response
    setError('No internet connection')

  } else {
    // Something else went wrong
    setError(error.message)
  }
}
\`\`\`

## Sending Files with Axios

\`\`\`javascript
const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const { data } = await api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      setProgress(percent)
    },
  })

  return data
}
\`\`\`

## Cancelling Requests

\`\`\`javascript
useEffect(() => {
  const controller = new AbortController()

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses', {
        signal: controller.signal
      })
      setCourses(data.courses)
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled')
      } else {
        setError(err.message)
      }
    }
  }

  fetchCourses()
  return () => controller.abort()
}, [])
\`\`\`

## Interview Questions

**Q1. Why use Axios over fetch?**
Axios automatically parses JSON, throws errors for non-2xx status codes, supports interceptors, has better timeout handling, and works consistently across browsers.

**Q2. What is an Axios instance?**
A pre-configured Axios object with a base URL, headers and interceptors. Lets you avoid repeating config on every request.

**Q3. What are interceptors?**
Functions that run before every request (request interceptor) or after every response (response interceptor). Used for adding auth tokens, logging, and global error handling.

**Q4. How do you handle errors in Axios?**
Check error.response for server errors, error.request for network errors, and error.message for setup errors.

**Q5. How do you cancel an Axios request?**
Use AbortController and pass its signal to the request config. Call controller.abort() in the useEffect cleanup function.

**Q6. How do you upload files with Axios?**
Create a FormData object, append the file, and set Content-Type to multipart/form-data in the request headers.

## Exercises

**Exercise 1 — Easy:** Create an Axios instance with base URL and use it to fetch a list of posts from JSONPlaceholder API.

**Exercise 2 — Medium:** Add request interceptor to attach JWT token and response interceptor to handle 401 errors with redirect to login.

**Exercise 3 — Hard:** Build a file upload component with progress bar using Axios onUploadProgress and FormData.

## Summary

- Axios is cleaner and more powerful than fetch
- Create an instance with base URL for reuse
- Use interceptors for auth tokens and global error handling
- Always handle network errors, server errors and cancellations
- Use AbortController to cancel requests on unmount
- Use FormData for file uploads`
  },

  {
    order: 2,
    title: 'React Query & Data Fetching',
    duration: 35,
    isFree: false,
    content: `# React Query & Data Fetching

## What is React Query?

React Query (now TanStack Query) is a powerful data fetching library. It handles caching, background updates, loading states and much more automatically.

\`\`\`bash
npm install @tanstack/react-query
\`\`\`

## Setup

\`\`\`jsx
// main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes
      retry: 2,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
\`\`\`

## useQuery — Fetching Data

\`\`\`jsx
import { useQuery } from '@tanstack/react-query'
import api from './services/api'

function CourseList() {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await api.get('/courses')
      return data
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error: {error.message}</p>

  return (
    <div>
      {isFetching && <p>Refreshing...</p>}
      <button onClick={refetch}>Refresh</button>
      <ul>
        {data.courses.map(course => (
          <li key={course._id}>{course.title}</li>
        ))}
      </ul>
    </div>
  )
}
\`\`\`

## Query with Parameters

\`\`\`jsx
function CourseDetail({ slug }) {
  const { data, isLoading } = useQuery({
    queryKey: ['course', slug],    // unique key per slug
    queryFn: async () => {
      const { data } = await api.get(\`/courses/\${slug}\`)
      return data.course
    },
    enabled: !!slug,               // only run when slug exists
  })

  if (isLoading) return <p>Loading...</p>
  return <h1>{data?.title}</h1>
}
\`\`\`

## useMutation — Creating and Updating Data

\`\`\`jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateCourse() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (courseData) => {
      const { data } = await api.post('/courses', courseData)
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch courses list
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: (error) => {
      console.error('Failed:', error.response?.data?.message)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      title: 'New Course',
      level: 'beginner',
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Course'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Course created!</p>}
    </form>
  )
}
\`\`\`

## Pagination with React Query

\`\`\`jsx
function PaginatedCourses() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['courses', page],
    queryFn: async () => {
      const { data } = await api.get(\`/courses?page=\${page}&limit=10\`)
      return data
    },
    placeholderData: (prev) => prev,  // keep old data while loading new
  })

  return (
    <div>
      {isLoading ? <p>Loading...</p> : (
        <ul>
          {data.courses.map(course => (
            <li key={course._id}>{course.title}</li>
          ))}
        </ul>
      )}
      <div>
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={isPlaceholderData || !data?.hasMore}
        >
          Next
        </button>
      </div>
    </div>
  )
}
\`\`\`

## Custom Query Hooks

\`\`\`jsx
// hooks/useCourses.js
export function useCourses(filters = {}) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const { data } = await api.get('/courses', { params: filters })
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCourse(slug) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data } = await api.get(\`/courses/\${slug}\`)
      return data.course
    },
    enabled: !!slug,
  })
}

// Usage
function CourseCatalog() {
  const { data, isLoading } = useCourses({ level: 'beginner' })
  if (isLoading) return <Spinner />
  return <CourseList courses={data?.courses} />
}
\`\`\`

## Interview Questions

**Q1. What is React Query?**
A data fetching and state management library for server state. It handles caching, background refetching, loading and error states automatically.

**Q2. What is the difference between client state and server state?**
Client state is UI state like modals and filters managed with useState. Server state is data from an API that needs to be fetched, cached and synchronized.

**Q3. What is a query key?**
A unique identifier for each query used for caching. When the key changes React Query refetches. Arrays like ['courses', id] allow parametric queries.

**Q4. What does invalidateQueries do?**
Marks cached data as stale and triggers a background refetch. Used after mutations to keep the UI in sync with the server.

**Q5. What is staleTime?**
How long data is considered fresh before React Query refetches it. Default is 0 meaning data is immediately stale. Set higher values to reduce unnecessary requests.

**Q6. When should you use React Query vs useEffect for data fetching?**
Use React Query for server data — it handles caching, deduplication, background updates and retries automatically. useEffect is fine for simple one-off fetches in small apps.

## Exercises

**Exercise 1 — Easy:** Use useQuery to fetch a list of posts and display loading and error states.

**Exercise 2 — Medium:** Add useMutation to create a new post. Invalidate the posts query on success to refresh the list.

**Exercise 3 — Hard:** Build a paginated data table with React Query. Prefetch the next page while the user is on the current page.

## Summary

- React Query manages server state automatically
- useQuery for reading data — handles loading, error, caching
- useMutation for creating, updating, deleting data
- queryKey uniquely identifies each query for caching
- invalidateQueries refetches data after mutations
- Create custom hooks like useCourses for reusable queries`
  },

  {
    order: 3,
    title: 'Loading, Error & Empty States',
    duration: 25,
    isFree: false,
    content: `# Loading, Error & Empty States

## Why These States Matter

Every API call has three possible states. Handling all three is what separates professional apps from amateur ones.

\`\`\`
Loading  → data is being fetched
Error    → something went wrong
Empty    → fetch succeeded but no data
Success  → data is ready to display
\`\`\`

## Skeleton Loading

Skeleton screens look better than spinners for content-heavy pages:

\`\`\`jsx
function SkeletonCard() {
  return (
    <div className="skeleton-card animate-pulse">
      <div className="h-48 bg-gray-200 rounded-xl mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  )
}

function CourseGrid({ loading, courses }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  )
}
\`\`\`

## Error States

\`\`\`jsx
function ErrorState({ error, onRetry }) {
  const getErrorMessage = (error) => {
    if (!navigator.onLine) return 'No internet connection'
    if (error?.response?.status === 404) return 'Page not found'
    if (error?.response?.status === 403) return 'You do not have permission'
    if (error?.response?.status >= 500) return 'Server error — try again'
    return error?.message || 'Something went wrong'
  }

  return (
    <div className="error-state text-center py-16">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold mb-2">Oops!</h2>
      <p className="text-gray-500 mb-6">{getErrorMessage(error)}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
\`\`\`

## Empty States

\`\`\`jsx
function EmptyState({ title, description, actionLabel, onAction, icon = '📭' }) {
  return (
    <div className="empty-state text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// Usage
function MySubmissions({ submissions }) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="No submissions yet"
        description="Complete a module and submit your project"
        actionLabel="Browse Courses"
        onAction={() => navigate('/courses')}
      />
    )
  }
  return <SubmissionList submissions={submissions} />
}
\`\`\`

## Complete Data Component Pattern

\`\`\`jsx
function DataComponent({ queryKey, queryFn, renderData, emptyMessage }) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />
  }

  if (!data || data.length === 0) {
    return <EmptyState title="Nothing here" description={emptyMessage} />
  }

  return renderData(data)
}

// Usage
<DataComponent
  queryKey={['courses']}
  queryFn={() => api.get('/courses').then(r => r.data.courses)}
  emptyMessage="No courses available yet"
  renderData={(courses) => (
    <div className="grid grid-cols-3 gap-6">
      {courses.map(c => <CourseCard key={c._id} course={c} />)}
    </div>
  )}
/>
\`\`\`

## Toast Notifications

\`\`\`bash
npm install react-hot-toast
\`\`\`

\`\`\`jsx
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

// In App.jsx
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>...</Routes>
    </>
  )
}

// In any component
const handleDelete = async (id) => {
  try {
    await api.delete(\`/courses/\${id}\`)
    toast.success('Course deleted!')
    refetch()
  } catch (err) {
    toast.error('Failed to delete course')
  }
}

const handleSave = async (data) => {
  const toastId = toast.loading('Saving...')
  try {
    await api.post('/courses', data)
    toast.success('Saved!', { id: toastId })
  } catch (err) {
    toast.error('Failed to save', { id: toastId })
  }
}
\`\`\`

## Interview Questions

**Q1. Why are loading states important?**
They give users feedback that something is happening. Without them users think the app is broken and click multiple times causing duplicate requests.

**Q2. What is a skeleton screen?**
A placeholder UI that mimics the layout of content while it loads. It feels faster than a spinner because users can see the structure before data arrives.

**Q3. What is the difference between loading and fetching states?**
Loading means no data exists yet — first load. Fetching means data exists but is being refreshed in the background. React Query provides both isLoading and isFetching.

**Q4. Why do empty states matter?**
They guide users when there is no data. A blank screen is confusing. A good empty state explains why it is empty and what to do next.

**Q5. What is optimistic UI?**
Updating the UI immediately before the server confirms the action. If it fails roll back. Makes the app feel instant — used in likes, follows, and deletes.

## Exercises

**Exercise 1 — Easy:** Create a SkeletonCard component and use it while a list of items is loading.

**Exercise 2 — Medium:** Build a reusable ErrorState component with retry button and different messages per HTTP status code.

**Exercise 3 — Hard:** Implement optimistic UI for a like button — update count immediately, revert if the API call fails.

## Summary

- Always handle loading, error and empty states
- Skeleton screens feel faster than spinners for content
- Error states should explain what went wrong and allow retry
- Empty states should guide users on what to do next
- Toast notifications for action feedback
- Optimistic UI makes apps feel instant`
  },

  {
    order: 4,
    title: 'Pagination & Infinite Scroll',
    duration: 30,
    isFree: false,
    content: `# Pagination & Infinite Scroll

## Why Pagination Matters

Never load all data at once — it kills performance. Pagination and infinite scroll are the two main patterns for handling large datasets.

## Standard Pagination

\`\`\`jsx
function usePaginatedCourses(page, limit = 10) {
  return useQuery({
    queryKey: ['courses', page, limit],
    queryFn: async () => {
      const { data } = await api.get(\`/courses?page=\${page}&limit=\${limit}\`)
      return data
    },
    placeholderData: prev => prev,
  })
}

function CoursePagination() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isPlaceholderData } = usePaginatedCourses(page)

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {data?.courses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-white border rounded-xl disabled:opacity-40"
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={\`w-10 h-10 rounded-xl \${
                p === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border text-gray-600'
              }\`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={isPlaceholderData || page >= (data?.totalPages || 1)}
          className="px-4 py-2 bg-white border rounded-xl disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Page {page} of {data?.totalPages} — {data?.total} total courses
      </p>
    </div>
  )
}
\`\`\`

## Infinite Scroll with useInfiniteQuery

\`\`\`jsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useEffect } from 'react'

function useInfiniteCourses() {
  return useInfiniteQuery({
    queryKey: ['courses', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get(\`/courses?page=\${pageParam}&limit=9\`)
      return data
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
  })
}

function InfiniteCourseList() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteCourses()

  // Intersection Observer for auto-load
  const loaderRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) return <SkeletonGrid />

  const allCourses = data.pages.flatMap(page => page.courses)

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {allCourses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Trigger element — when visible loads next page */}
      <div ref={loaderRef} className="py-8 text-center">
        {isFetchingNextPage && (
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        )}
        {!hasNextPage && allCourses.length > 0 && (
          <p className="text-gray-400">You have seen all courses!</p>
        )}
      </div>
    </div>
  )
}
\`\`\`

## Backend — Pagination API

Your Express API should support pagination:

\`\`\`javascript
// server/controllers/course.controller.js
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await Course.countDocuments({ published: true })
    const courses = await Course.find({ published: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      success: true,
      courses,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      hasMore: page < Math.ceil(total / limit),
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
\`\`\`

## Load More Button Pattern

Simple alternative to infinite scroll:

\`\`\`jsx
function LoadMoreCourses() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteCourses()

  const allCourses = data?.pages.flatMap(p => p.courses) || []

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {allCourses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More Courses'}
          </button>
        </div>
      )}
    </div>
  )
}
\`\`\`

## Interview Questions

**Q1. What is the difference between pagination and infinite scroll?**
Pagination shows data in pages with next/previous controls. Infinite scroll automatically loads more data as the user scrolls down.

**Q2. When should you use pagination vs infinite scroll?**
Use pagination for data-heavy tables and search results where users need to navigate to specific pages. Use infinite scroll for feeds and content discovery where users browse continuously.

**Q3. What is useInfiniteQuery?**
A React Query hook for fetching paginated data incrementally. It manages multiple pages of data and provides fetchNextPage and hasNextPage automatically.

**Q4. What is IntersectionObserver?**
A browser API that detects when an element enters or exits the viewport. Used to trigger infinite scroll loading when the user reaches the bottom of the list.

**Q5. How does the backend support pagination?**
By accepting page and limit query parameters, using skip and limit in the database query, and returning total count and totalPages in the response.

## Exercises

**Exercise 1 — Easy:** Add pagination controls to a list of items — previous, next and page number buttons.

**Exercise 2 — Medium:** Implement infinite scroll using IntersectionObserver that loads more items when the user reaches the bottom.

**Exercise 3 — Hard:** Build a full paginated data table with sorting, filtering and pagination. Sync all params with URL using useSearchParams.

## Summary

- Always paginate large datasets — never load everything
- Standard pagination for tables and search results
- Infinite scroll for feeds and content browsing
- useInfiniteQuery manages multiple pages automatically
- IntersectionObserver triggers loading when user scrolls near bottom
- Backend needs page, limit, total and totalPages in response
- Load More button is simpler than auto infinite scroll

Congratulations on finishing Module 5 — API Integration! Next: State Management!`
  }
]