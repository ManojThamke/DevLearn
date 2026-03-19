export const module6Lessons = [
  {
    order: 1,
    title: 'Redux Toolkit Basics',
    duration: 35,
    isFree: true,
    content: `# Redux Toolkit Basics

## What is Redux?

Redux is a predictable state container for JavaScript apps. Redux Toolkit (RTK) is the official recommended way to use Redux — it removes boilerplate and makes Redux much simpler.

\`\`\`bash
npm install @reduxjs/toolkit react-redux
\`\`\`

## Core Concepts

\`\`\`
Store     → single source of truth for all state
Slice     → a piece of state with its reducers and actions
Action    → describes what happened
Reducer   → pure function that updates state based on action
Dispatch  → send an action to the store
Selector  → read state from the store
\`\`\`

## Creating a Store

\`\`\`javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import coursesReducer from './slices/coursesSlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    cart: cartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
\`\`\`

\`\`\`jsx
// main.jsx
import { Provider } from 'react-redux'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
\`\`\`

## Creating a Slice

\`\`\`javascript
// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isOpen: false,
  },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) item.quantity = quantity
    },
    clearCart: (state) => {
      state.items = []
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, toggleCart } = cartSlice.actions
export default cartSlice.reducer
\`\`\`

## Using Redux in Components

\`\`\`jsx
import { useSelector, useDispatch } from 'react-redux'
import { addItem, removeItem, clearCart } from '../store/slices/cartSlice'

function CartButton({ product }) {
  const dispatch = useDispatch()

  return (
    <button onClick={() => dispatch(addItem(product))}>
      Add to Cart
    </button>
  )
}

function Cart() {
  const dispatch = useDispatch()
  const items = useSelector(state => state.cart.items)
  const isOpen = useSelector(state => state.cart.isOpen)

  const total = items.reduce((t, i) => t + i.price * i.quantity, 0)

  return (
    <div className={isOpen ? 'cart open' : 'cart'}>
      <h2>Cart ({items.length})</h2>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name} x{item.quantity}</span>
          <button onClick={() => dispatch(removeItem(item.id))}>
            Remove
          </button>
        </div>
      ))}
      <p>Total: ₹{total}</p>
      <button onClick={() => dispatch(clearCart())}>Clear</button>
    </div>
  )
}
\`\`\`

## Selectors — Reading State Efficiently

\`\`\`javascript
// src/store/slices/cartSlice.js — add selectors

// Simple selectors
export const selectCartItems = state => state.cart.items
export const selectCartIsOpen = state => state.cart.isOpen

// Computed selectors
export const selectCartTotal = state =>
  state.cart.items.reduce((t, i) => t + i.price * i.quantity, 0)

export const selectCartCount = state =>
  state.cart.items.reduce((t, i) => t + i.quantity, 0)

export const selectIsInCart = (id) => state =>
  state.cart.items.some(i => i.id === id)
\`\`\`

\`\`\`jsx
// Using selectors in components
function CartBadge() {
  const count = useSelector(selectCartCount)
  return count > 0 ? <span className="badge">{count}</span> : null
}

function ProductCard({ product }) {
  const inCart = useSelector(selectIsInCart(product.id))
  const dispatch = useDispatch()

  return (
    <div>
      <h3>{product.name}</h3>
      <button
        onClick={() => dispatch(addItem(product))}
        className={inCart ? 'btn-added' : 'btn-add'}
      >
        {inCart ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  )
}
\`\`\`

## Auth Slice Example

\`\`\`javascript
// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isLoggedIn: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoggedIn = true
      state.error = null
      localStorage.setItem('token', action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isLoggedIn = false
      localStorage.removeItem('token')
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setCredentials, logout, setUser, setError } = authSlice.actions
export const selectUser = state => state.auth.user
export const selectIsLoggedIn = state => state.auth.isLoggedIn
export const selectToken = state => state.auth.token
export default authSlice.reducer
\`\`\`

## Interview Questions

**Q1. What is Redux and why use it?**
Redux is a predictable state container. Use it when multiple components need access to the same state, state logic is complex, or you need time-travel debugging and Redux DevTools.

**Q2. What is Redux Toolkit?**
The official recommended way to write Redux. It eliminates boilerplate, includes immer for immutable updates, and has createSlice, createAsyncThunk and configureStore built in.

**Q3. What is a slice?**
A collection of reducer logic and actions for a single feature. createSlice generates action creators and action types automatically.

**Q4. How does Redux Toolkit handle immutability?**
RTK uses Immer under the hood which lets you write mutating logic like state.items.push() and automatically converts it to immutable updates.

**Q5. Difference between useSelector and useDispatch?**
useSelector reads state from the store — re-renders when selected value changes. useDispatch returns the dispatch function to send actions to the store.

**Q6. When should you NOT use Redux?**
When your app is small, when state is local to one component, or when Context API is sufficient. Redux adds complexity — only use it when needed.

## Exercises

**Exercise 1 — Easy:** Create a counter slice with increment, decrement and reset actions. Display the counter value in two different components.

**Exercise 2 — Medium:** Build a shopping cart with Redux Toolkit. Add items from a product list, show cart count in navbar, and display cart total.

**Exercise 3 — Hard:** Create an auth slice that stores user, token and isLoggedIn. Persist token in localStorage. Use it to protect routes.

## Summary

- Redux is predictable global state management
- Redux Toolkit removes Redux boilerplate
- createSlice generates actions and reducers together
- useSelector reads state — useDispatch sends actions
- Selectors keep component logic clean
- RTK uses Immer so you can write mutating code safely
- Only use Redux when Context is not enough`
  },

  {
    order: 2,
    title: 'Async Redux with createAsyncThunk',
    duration: 35,
    isFree: false,
    content: `# Async Redux with createAsyncThunk

## The Problem with Async in Redux

Regular reducers are synchronous pure functions. For API calls we need a way to dispatch actions before, during and after the async operation.

## createAsyncThunk

\`\`\`javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

// Create async thunk
export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/courses', { params })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch')
    }
  }
)

export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/courses', courseData)
      return data.course
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create')
    }
  }
)

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (courseId, { rejectWithValue }) => {
    try {
      await api.delete(\`/courses/\${courseId}\`)
      return courseId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete')
    }
  }
)
\`\`\`

## Handling Thunk States in Slice

\`\`\`javascript
const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    items: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    // fetchCourses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.courses
        state.total = action.payload.total
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // createCourse
    builder
      .addCase(createCourse.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.total += 1
      })

    // deleteCourse
    builder
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload)
        state.total -= 1
      })
  },
})

export const { clearError } = coursesSlice.actions
export const selectCourses = state => state.courses.items
export const selectCoursesLoading = state => state.courses.loading
export const selectCoursesError = state => state.courses.error
export default coursesSlice.reducer
\`\`\`

## Using Async Thunks in Components

\`\`\`jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, deleteCourse, selectCourses, selectCoursesLoading, selectCoursesError } from '../store/slices/coursesSlice'

function CoursesPage() {
  const dispatch = useDispatch()
  const courses = useSelector(selectCourses)
  const loading = useSelector(selectCoursesLoading)
  const error = useSelector(selectCoursesError)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCourse(id)).unwrap()
      toast.success('Deleted!')
    } catch (err) {
      toast.error(err)
    }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorState error={error} onRetry={() => dispatch(fetchCourses())} />

  return (
    <div>
      {courses.map(course => (
        <div key={course._id}>
          <h3>{course.title}</h3>
          <button onClick={() => handleDelete(course._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
\`\`\`

## Auth Thunks

\`\`\`javascript
// src/store/slices/authSlice.js
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me')
      return data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

// In extraReducers
builder
  .addCase(loginUser.pending, (state) => {
    state.loading = true
    state.error = null
  })
  .addCase(loginUser.fulfilled, (state, action) => {
    state.loading = false
    state.user = action.payload.user
    state.token = action.payload.token
    state.isLoggedIn = true
  })
  .addCase(loginUser.rejected, (state, action) => {
    state.loading = false
    state.error = action.payload
  })
  .addCase(fetchCurrentUser.fulfilled, (state, action) => {
    state.user = action.payload
    state.isLoggedIn = true
  })
\`\`\`

## RTK Query — API Layer in Redux

\`\`\`javascript
// src/store/api/coursesApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', \`Bearer \${token}\`)
      return headers
    },
  }),
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: (params) => ({ url: '/courses', params }),
      providesTags: ['Course'],
    }),
    getCourseBySlug: builder.query({
      query: (slug) => \`/courses/\${slug}\`,
      providesTags: (result, error, slug) => [{ type: 'Course', id: slug }],
    }),
    createCourse: builder.mutation({
      query: (body) => ({ url: '/courses', method: 'POST', body }),
      invalidatesTags: ['Course'],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({ url: \`/courses/\${id}\`, method: 'DELETE' }),
      invalidatesTags: ['Course'],
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetCourseBySlugQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi
\`\`\`

## Interview Questions

**Q1. What is createAsyncThunk?**
A Redux Toolkit utility that generates action creators for async operations. It automatically dispatches pending, fulfilled and rejected actions.

**Q2. What are the three states of a thunk?**
pending — request started, fulfilled — request succeeded, rejected — request failed. Each generates a separate action that extraReducers can handle.

**Q3. What is unwrap()?**
A method on the thunk dispatch result that returns the fulfilled value or throws the rejection value. Useful for handling errors locally in components.

**Q4. What is RTK Query?**
A powerful data fetching and caching tool built into Redux Toolkit. It auto-generates hooks for fetching and mutating data and handles caching automatically.

**Q5. Difference between createAsyncThunk and RTK Query?**
createAsyncThunk gives you full control over async logic. RTK Query is higher-level — it auto-generates hooks and handles caching, invalidation and re-fetching automatically.

## Exercises

**Exercise 1 — Easy:** Create a thunk that fetches users from an API. Handle pending, fulfilled and rejected states in the slice.

**Exercise 2 — Medium:** Add login and logout thunks to an auth slice. Show loading spinner during login and error message on failure.

**Exercise 3 — Hard:** Build a full CRUD slice using createAsyncThunk for create, read, update and delete. Use optimistic updates for delete.

## Summary

- createAsyncThunk handles async operations in Redux
- Three states: pending, fulfilled, rejected
- extraReducers handles thunk lifecycle actions
- unwrap() lets you handle errors locally in components
- RTK Query is a higher-level alternative for API calls
- Always use rejectWithValue for meaningful error messages`
  },

  {
    order: 3,
    title: 'Zustand — Simple State Management',
    duration: 25,
    isFree: false,
    content: `# Zustand — Simple State Management

## What is Zustand?

Zustand is a small, fast state management library. It is much simpler than Redux but more powerful than Context API. Many developers prefer it for medium-sized apps.

\`\`\`bash
npm install zustand
\`\`\`

## Why Zustand?

\`\`\`
Redux          → powerful but complex — lots of boilerplate
Context API    → simple but causes unnecessary re-renders
Zustand        → simple API, no providers needed, fast
\`\`\`

## Creating a Store

\`\`\`javascript
// src/stores/useCartStore.js
import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  // Actions
  addItem: (product) => {
    const items = get().items
    const existing = items.find(i => i.id === product.id)

    if (existing) {
      set({
        items: items.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      })
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] })
    }
  },

  removeItem: (id) => {
    set({ items: get().items.filter(i => i.id !== id) })
  },

  updateQuantity: (id, quantity) => {
    set({
      items: get().items.map(i =>
        i.id === id ? { ...i, quantity } : i
      )
    })
  },

  clearCart: () => set({ items: [] }),
  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

  // Computed values
  get total() {
    return get().items.reduce((t, i) => t + i.price * i.quantity, 0)
  },

  get count() {
    return get().items.reduce((t, i) => t + i.quantity, 0)
  },
}))

export default useCartStore
\`\`\`

## Using Zustand in Components

\`\`\`jsx
// No Provider needed — just import and use!

function CartBadge() {
  const count = useCartStore(state => state.count)
  return count > 0 ? <span className="badge">{count}</span> : null
}

function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem)
  const items = useCartStore(state => state.items)
  const inCart = items.some(i => i.id === product.id)

  return (
    <div>
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={() => addItem(product)}>
        {inCart ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  )
}

function Cart() {
  const { items, total, isOpen, removeItem, clearCart, toggleCart } = useCartStore()

  if (!isOpen) return null

  return (
    <div className="cart-drawer">
      <div className="cart-header">
        <h2>Your Cart ({items.length})</h2>
        <button onClick={toggleCart}>✕</button>
      </div>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}
          <div className="cart-footer">
            <p>Total: ₹{total}</p>
            <button onClick={clearCart}>Clear Cart</button>
            <button className="btn-checkout">Checkout</button>
          </div>
        </>
      )}
    </div>
  )
}
\`\`\`

## Persisting State with Zustand

\`\`\`javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        // same as before
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',       // localStorage key
      partialize: (state) => ({   // only persist items not UI state
        items: state.items,
      }),
    }
  )
)
\`\`\`

## Auth Store with Zustand

\`\`\`javascript
// src/stores/useAuthStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({
            user: data.user,
            token: data.token,
            isLoggedIn: true,
            loading: false,
          })
          return true
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Login failed',
            loading: false,
          })
          return false
        }
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false })
      },

      updateUser: (updates) => {
        set(state => ({ user: { ...state.user, ...updates } }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)

export default useAuthStore
\`\`\`

## Redux vs Zustand vs Context

\`\`\`
Feature           Redux Toolkit    Zustand      Context API
Setup             Complex          Simple       Simple
Boilerplate       Medium           Minimal      Minimal
Performance       Excellent        Excellent    Can be poor
DevTools          Excellent        Good         Basic
Bundle size       ~50kb            ~1kb         0kb
Best for          Large apps       Medium apps  Small apps
Learning curve    High             Low          Low
\`\`\`

## Interview Questions

**Q1. What is Zustand?**
A lightweight state management library for React. It uses hooks and does not require providers or boilerplate. The store is created outside React and accessed with a custom hook.

**Q2. How does Zustand differ from Redux?**
Zustand has minimal boilerplate, no providers, smaller bundle size and simpler API. Redux has better DevTools and is more suitable for very large complex apps.

**Q3. How does Zustand prevent unnecessary re-renders?**
By selecting only the specific state you need. Components only re-render when their selected slice changes — not when unrelated state changes.

**Q4. What is the persist middleware in Zustand?**
A middleware that automatically saves selected state to localStorage and hydrates it on page reload.

**Q5. Do you need a Provider for Zustand?**
No. Zustand stores live outside of React and are accessed directly via the hook anywhere in the app without wrapping in a Provider.

## Exercises

**Exercise 1 — Easy:** Create a Zustand store for a todo list with add, remove and toggle actions.

**Exercise 2 — Medium:** Build a shopping cart with Zustand that persists to localStorage. Show cart count in the navbar.

**Exercise 3 — Hard:** Migrate a Context API auth system to Zustand with persist middleware. Compare the code complexity.

## Summary

- Zustand is simpler than Redux with minimal boilerplate
- No Provider needed — just import and use the hook
- Select only the state you need to prevent re-renders
- persist middleware saves state to localStorage automatically
- Great alternative to Redux for medium-sized apps
- Actions are defined directly in the store alongside state`
  },

  {
    order: 4,
    title: 'State Management Best Practices',
    duration: 25,
    isFree: false,
    content: `# State Management Best Practices

## Choosing the Right Tool

\`\`\`
Question 1: Is this state local to one component?
  → YES: Use useState
  → NO: Continue to Question 2

Question 2: Is it shared between 2-3 nearby components?
  → YES: Lift state up or use Context
  → NO: Continue to Question 3

Question 3: Is it global state used across many pages?
  → Small app:    Context API + useReducer
  → Medium app:   Zustand
  → Large app:    Redux Toolkit

Question 4: Is it server data (from an API)?
  → Use React Query or RTK Query
  → NOT useState + useEffect
\`\`\`

## State Categories

\`\`\`javascript
// 1. Local UI State — useState
const [isOpen, setIsOpen] = useState(false)
const [inputValue, setInputValue] = useState('')

// 2. Shared UI State — Context or Zustand
const { theme, toggleTheme } = useTheme()
const { sidebarOpen } = useLayoutStore()

// 3. Server State — React Query
const { data: courses } = useQuery(['courses'], fetchCourses)

// 4. Global App State — Redux or Zustand
const { user, isLoggedIn } = useAuthStore()
const { items } = useCartStore()

// 5. URL State — useSearchParams
const [searchParams, setSearchParams] = useSearchParams()
const filter = searchParams.get('filter') || 'all'
\`\`\`

## Colocation — Keep State Close to Where It Is Used

\`\`\`jsx
// Bad — storing local state globally
const useAppStore = create(set => ({
  // These are local UI states — don't put in global store!
  isModalOpen: false,
  formInputValue: '',
  activeTab: 'home',
  tooltipVisible: false,
}))

// Good — keep local state local
function Modal() {
  const [isOpen, setIsOpen] = useState(false)  // local
  return ...
}

// Good — only truly global state in global store
const useAppStore = create(set => ({
  user: null,
  theme: 'light',
  notifications: [],
}))
\`\`\`

## Normalizing State

\`\`\`javascript
// Bad — nested data is hard to update
const state = {
  courses: [
    {
      id: 1,
      title: 'React Course',
      lessons: [
        { id: 101, title: 'JSX' },
        { id: 102, title: 'Components' },
      ]
    }
  ]
}

// Good — normalized flat data
const state = {
  courses: {
    byId: {
      1: { id: 1, title: 'React Course', lessonIds: [101, 102] }
    },
    allIds: [1]
  },
  lessons: {
    byId: {
      101: { id: 101, title: 'JSX', courseId: 1 },
      102: { id: 102, title: 'Components', courseId: 1 },
    },
    allIds: [101, 102]
  }
}
\`\`\`

## Avoiding Common Mistakes

\`\`\`jsx
// Mistake 1 — Storing derived values in state
// Bad
const [total, setTotal] = useState(0)
const [items, setItems] = useState([])
useEffect(() => {
  setTotal(items.reduce((t, i) => t + i.price, 0))
}, [items])

// Good — compute total directly
const [items, setItems] = useState([])
const total = items.reduce((t, i) => t + i.price, 0)

// Mistake 2 — Over-fetching by not caching
// Bad — fetches every time component mounts
useEffect(() => {
  fetchCourses().then(setCourses)
}, [])

// Good — React Query caches automatically
const { data } = useQuery(['courses'], fetchCourses, {
  staleTime: 5 * 60 * 1000  // fresh for 5 minutes
})

// Mistake 3 — Storing entire API response
// Bad — stores everything including metadata
setState(apiResponse)

// Good — store only what you need
setState(apiResponse.data.courses)
\`\`\`

## Performance Tips

\`\`\`jsx
// Tip 1 — Select minimal state in Zustand
// Bad — re-renders on ANY store change
const store = useCartStore()

// Good — only re-renders when count changes
const count = useCartStore(state => state.count)

// Tip 2 — Memoize selectors in Redux
import { createSelector } from '@reduxjs/toolkit'

const selectExpensiveCourses = createSelector(
  state => state.courses.items,
  (items) => items.filter(c => c.price > 1000)
)

// Tip 3 — Split your stores
// Bad — one huge store
const useAppStore = create(...)

// Good — separate stores by feature
const useAuthStore = create(...)
const useCartStore = create(...)
const useNotificationStore = create(...)
\`\`\`

## DevTools for Debugging

\`\`\`javascript
// Redux DevTools — automatic with RTK
// Install Redux DevTools browser extension

// Zustand DevTools
import { devtools } from 'zustand/middleware'

const useCartStore = create(
  devtools(
    (set, get) => ({
      items: [],
      addItem: (item) => set(
        state => ({ items: [...state.items, item] }),
        false,
        'cart/addItem'  // action name in DevTools
      ),
    }),
    { name: 'CartStore' }
  )
)
\`\`\`

## Interview Questions

**Q1. How do you decide which state management tool to use?**
Based on scope and complexity. Local state uses useState. Shared state between a few components uses Context. App-wide state uses Zustand or Redux. Server data uses React Query.

**Q2. What is state colocation?**
Keeping state as close as possible to where it is used. Avoids putting local component state in global stores which adds complexity and reduces reusability.

**Q3. What is state normalization?**
Structuring state as flat objects with IDs as keys instead of nested arrays. Makes updates simpler and avoids data duplication.

**Q4. What is derived state?**
Values computed from existing state. Should not be stored separately — compute them on the fly to keep state minimal and always in sync.

**Q5. What is the single source of truth?**
Having one authoritative location for each piece of data. If courses come from the API they should only be in the server state cache — not copied into multiple useState variables.

## Exercises

**Exercise 1 — Easy:** Audit a component and move all derived state out of useState into computed variables.

**Exercise 2 — Medium:** Refactor a component that uses useEffect for data fetching to use React Query instead. Compare the code.

**Exercise 3 — Hard:** Design the state architecture for a social media app — identify what is local, shared, server and URL state for each feature.

## Summary

- Match the tool to the scope of the state
- Server state belongs in React Query not useState
- Keep local state local — do not over-globalize
- Compute derived values instead of storing them
- Normalize complex nested state for easier updates
- Split stores by feature for better performance
- Use DevTools to debug state changes

Congratulations on finishing Module 6 — State Management! Next: Authentication!`
  }
]