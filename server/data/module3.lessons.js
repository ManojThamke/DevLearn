export const module3Lessons = [
  {
    order: 1,
    title: 'useState & useEffect',
    duration: 30,
    isFree: true,
    content: `# useState & useEffect

## Quick Recap — useState

\`\`\`jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}
\`\`\`

## What is useEffect?

useEffect lets you perform side effects — operations that affect something outside the component like fetching data, updating the document title, or setting up subscriptions.

\`\`\`jsx
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = \`Count: \${count}\`
  })

  return (
    <button onClick={() => setCount(count + 1)}>
      Click me ({count})
    </button>
  )
}
\`\`\`

## useEffect Syntax

\`\`\`jsx
useEffect(() => {
  // side effect code here

  return () => {
    // cleanup function (optional)
  }
}, [dependencies])
\`\`\`

## Dependency Array

\`\`\`jsx
// Runs after EVERY render
useEffect(() => {
  console.log('Runs every render')
})

// Runs only ONCE on mount
useEffect(() => {
  console.log('Runs once on mount')
}, [])

// Runs when count or name changes
useEffect(() => {
  console.log('count or name changed')
}, [count, name])
\`\`\`

## Fetching Data with useEffect

\`\`\`jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await fetch(\`/api/users/\${userId}\`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setUser(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!user) return null

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
\`\`\`

## Cleanup Function

Prevent memory leaks by cleaning up subscriptions and timers:

\`\`\`jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)  // cleanup
  }, [])

  return <p>Timer: {seconds}s</p>
}
\`\`\`

\`\`\`jsx
// Cancel fetch on unmount
function SearchResults({ query }) {
  const [results, setResults] = useState([])

  useEffect(() => {
    let cancelled = false

    const search = async () => {
      const data = await fetchResults(query)
      if (!cancelled) setResults(data)
    }

    search()
    return () => { cancelled = true }
  }, [query])

  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
}
\`\`\`

## Common useEffect Patterns

### Document title

\`\`\`jsx
useEffect(() => {
  document.title = \`\${unreadCount} messages — DevLearn\`
}, [unreadCount])
\`\`\`

### Window resize

\`\`\`jsx
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <p>{size.width} x {size.height}</p>
}
\`\`\`

### Local storage sync

\`\`\`jsx
function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  )

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      {theme} mode
    </button>
  )
}
\`\`\`

## Interview Questions

**Q1. What is useEffect used for?**
Performing side effects — data fetching, DOM manipulation, subscriptions, timers. Anything that interacts with the outside world.

**Q2. What does the dependency array do?**
Controls when the effect runs. Empty array runs once on mount. With dependencies runs when those values change. No array runs after every render.

**Q3. Why do you return a cleanup function from useEffect?**
To prevent memory leaks. The cleanup runs before the next effect and when the component unmounts. Used for clearing timers, cancelling requests, removing listeners.

**Q4. Why can you not make useEffect async directly?**
useEffect must return either nothing or a cleanup function. Async functions return a Promise which React cannot use as cleanup.

**Q5. What happens if you forget a dependency in the array?**
The effect runs with stale values — a common bug. React with strict mode warns about missing dependencies.

**Q6. What is the difference between componentDidMount and useEffect with empty array?**
They are similar but useEffect with empty array runs after the first render. componentDidMount is the class component equivalent.

## Exercises

**Exercise 1 — Easy:** Use useEffect to update the document title to show the current count from a counter component.

**Exercise 2 — Medium:** Build a component that fetches a list of users from an API on mount, shows loading and error states.

**Exercise 3 — Hard:** Build a live search component that debounces input, fetches results from API, cancels stale requests and shows loading state.

## Summary

- useState manages local component state
- useEffect runs side effects after render
- Empty array — run once on mount
- With dependencies — run when those values change
- No array — run after every render
- Return cleanup function to avoid memory leaks
- Never make useEffect itself async — use inner function`
  },

  {
    order: 2,
    title: 'useRef & useMemo',
    duration: 25,
    isFree: false,
    content: `# useRef & useMemo

## useRef Hook

useRef returns a mutable object whose .current property persists across renders without causing re-renders.

Two main uses:
1. Access DOM elements directly
2. Store mutable values that do not trigger re-renders

\`\`\`jsx
import { useRef } from 'react'

function TextInput() {
  const inputRef = useRef(null)

  const focusInput = () => {
    inputRef.current.focus()
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Click button to focus" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  )
}
\`\`\`

## DOM Manipulation with useRef

\`\`\`jsx
function VideoPlayer() {
  const videoRef = useRef(null)

  const play = () => videoRef.current.play()
  const pause = () => videoRef.current.pause()

  return (
    <div>
      <video ref={videoRef} src="/video.mp4" />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  )
}
\`\`\`

## Storing Previous Values

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef(0)

  useEffect(() => {
    prevCountRef.current = count
  })

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
\`\`\`

## Storing Timers with useRef

\`\`\`jsx
function Timer() {
  const [time, setTime] = useState(0)
  const intervalRef = useRef(null)

  const start = () => {
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 1)
    }, 1000)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setTime(0)
  }

  return (
    <div>
      <p>{time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
\`\`\`

## useMemo Hook

useMemo memoizes the result of a calculation so it only recalculates when dependencies change.

\`\`\`jsx
import { useMemo } from 'react'

function ExpensiveList({ items, filter }) {
  const filteredItems = useMemo(() => {
    console.log('Filtering items...')
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [items, filter])

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
\`\`\`

## When to Use useMemo

\`\`\`jsx
function Dashboard({ data }) {
  const [sortBy, setSortBy] = useState('name')
  const [theme, setTheme] = useState('light')

  // Only recalculates when data or sortBy changes
  // Theme changes will NOT trigger recalculation
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date)
      return b.score - a.score
    })
  }, [data, sortBy])

  return (
    <div>
      <select onChange={e => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="score">Score</option>
      </select>
      <ul>
        {sortedData.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  )
}
\`\`\`

## useRef vs useState vs useMemo

\`\`\`
useState  → triggers re-render    → UI state users see
useRef    → no re-render          → DOM access, timers, previous values
useMemo   → no re-render (cached) → expensive calculations
\`\`\`

## Interview Questions

**Q1. What is useRef used for?**
Two main uses: accessing DOM elements directly and storing mutable values that should not trigger re-renders like timers, previous values, and interval IDs.

**Q2. Difference between useRef and useState?**
Both persist values across renders. useState triggers a re-render when updated. useRef does not trigger re-renders — it is invisible to React.

**Q3. What is useMemo?**
A hook that memoizes the result of an expensive calculation. It only recalculates when its dependencies change, preventing unnecessary computation on every render.

**Q4. When should you use useMemo?**
Only for genuinely expensive computations — filtering or sorting large arrays, complex calculations. Do not use it for simple values — the overhead is not worth it.

**Q5. Difference between useMemo and useCallback?**
useMemo memoizes a computed value. useCallback memoizes a function reference. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).

**Q6. Can you store a DOM node in useRef?**
Yes. Pass the ref as the ref prop to a JSX element and ref.current will point to the actual DOM node after mount.

## Exercises

**Exercise 1 — Easy:** Use useRef to create a button that focuses an input field when clicked.

**Exercise 2 — Medium:** Build a stopwatch with start, stop and reset using useRef for the interval.

**Exercise 3 — Hard:** Build a search component with useMemo that filters and sorts a large list of 1000 items efficiently.

## Summary

- useRef accesses DOM elements without re-rendering
- useRef stores mutable values like timers and previous state
- useMemo caches expensive calculation results
- useMemo only recalculates when dependencies change
- Do not overuse useMemo — only for expensive operations
- useRef is perfect for timers, intervals and previous values`
  },

  {
    order: 3,
    title: 'Custom Hooks',
    duration: 30,
    isFree: false,
    content: `# Custom Hooks

## What are Custom Hooks?

Custom hooks are JavaScript functions starting with use that can call other hooks. They extract and reuse stateful logic across multiple components.

\`\`\`jsx
// Without custom hook — repeated in every component
function ComponentA() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return <p>Width: {width}</p>
}

// With custom hook — reusable!
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

function ComponentA() {
  const width = useWindowWidth()
  return <p>Width: {width}</p>
}

function ComponentB() {
  const width = useWindowWidth()
  return <div style={{ width: width > 768 ? '50%' : '100%' }}>...</div>
}
\`\`\`

## useFetch — Data Fetching Hook

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(url)
        if (!res.ok) throw new Error('Request failed')
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}

// Usage — clean and simple
function UserProfile({ id }) {
  const { data: user, loading, error } = useFetch(\`/api/users/\${id}\`)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return <h1>{user.name}</h1>
}
\`\`\`

## useLocalStorage Hook

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = (newValue) => {
    try {
      const valueToStore = newValue instanceof Function
        ? newValue(value)
        : newValue
      setValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.error(err)
    }
  }

  return [value, setStoredValue]
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16)

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Theme: {theme}
      </button>
      <input
        type="range" min="12" max="24"
        value={fontSize}
        onChange={e => setFontSize(Number(e.target.value))}
      />
    </div>
  )
}
\`\`\`

## useDebounce Hook

\`\`\`jsx
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Usage — only fires search after user stops typing for 500ms
function SearchBar() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Searching for:', debouncedQuery)
    }
  }, [debouncedQuery])

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
\`\`\`

## useToggle Hook

\`\`\`jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  const toggle = () => setValue(v => !v)
  const setTrue = () => setValue(true)
  const setFalse = () => setValue(false)
  return [value, toggle, setTrue, setFalse]
}

// Usage
function Modal() {
  const [isOpen, toggleModal, openModal, closeModal] = useToggle(false)

  return (
    <div>
      <button onClick={openModal}>Open</button>
      {isOpen && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  )
}
\`\`\`

## useForm Hook

\`\`\`jsx
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  return { values, errors, setErrors, handleChange, reset }
}

// Usage
function LoginForm() {
  const { values, errors, setErrors, handleChange, reset } = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!values.email) newErrors.email = 'Email is required'
    if (!values.password) newErrors.password = 'Password is required'
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }
    console.log('Submit:', values)
    reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <p className="error">{errors.email}</p>}
      <input name="password" type="password" value={values.password} onChange={handleChange} />
      {errors.password && <p className="error">{errors.password}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
\`\`\`

## Interview Questions

**Q1. What is a custom hook?**
A JavaScript function starting with use that can call React hooks. It extracts reusable stateful logic from components.

**Q2. Why use custom hooks?**
To avoid duplicating logic across components. Instead of copying useState and useEffect into every component extract them into a custom hook and reuse it.

**Q3. Does each component get its own state from a custom hook?**
Yes. Each component that calls the hook gets its own isolated state. Custom hooks share logic not state.

**Q4. What is the naming rule for custom hooks?**
Must start with use. This is required so React can enforce the rules of hooks — hooks can only be called at the top level of a component or hook.

**Q5. Can a custom hook call other custom hooks?**
Yes. Custom hooks can call built-in hooks and other custom hooks freely.

**Q6. What is the difference between a custom hook and a utility function?**
Custom hooks can use React hooks like useState and useEffect. Utility functions cannot — they are pure JavaScript.

## Exercises

**Exercise 1 — Easy:** Create a useToggle hook and use it for a show/hide password button.

**Exercise 2 — Medium:** Create a useFetch hook and use it to load a list of GitHub repositories.

**Exercise 3 — Hard:** Create a useForm hook with validation, touched fields tracking and submit handling. Use it in a registration form.

## Summary

- Custom hooks extract and reuse stateful logic
- Always start with use prefix
- Each component gets its own isolated state
- Can use any built-in hooks inside
- Great for data fetching, forms, local storage, debounce
- Share logic not state`
  },

  {
    order: 4,
    title: 'Context API & useContext',
    duration: 25,
    isFree: false,
    content: `# Context API & useContext

## The Problem — Prop Drilling

When data needs to pass through many levels it becomes messy:

\`\`\`jsx
// Prop drilling — passing user through every level
function App() {
  const [user, setUser] = useState({ name: 'Manoj' })
  return <Dashboard user={user} setUser={setUser} />
}

function Dashboard({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />
}

function Sidebar({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />
}

function UserMenu({ user }) {
  return <p>{user.name}</p>  // Finally used here!
}
\`\`\`

## Context Solves Prop Drilling

\`\`\`jsx
import { createContext, useContext, useState } from 'react'

// 1. Create context
const UserContext = createContext(null)

// 2. Provide context
function App() {
  const [user, setUser] = useState({ name: 'Manoj' })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </UserContext.Provider>
  )
}

// 3. Consume anywhere in the tree — no prop drilling!
function UserMenu() {
  const { user } = useContext(UserContext)
  return <p>{user.name}</p>
}
\`\`\`

## Theme Context Example

\`\`\`jsx
const ThemeContext = createContext('light')

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook for cleaner API
function useTheme() {
  return useContext(ThemeContext)
}

// Usage in any component
function Header() {
  const { theme, toggleTheme } = useTheme()
  return (
    <header className={\`header \${theme}\`}>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  )
}
\`\`\`

## Auth Context Pattern

\`\`\`jsx
const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCurrentUser(token)
        .then(setUser)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await loginAPI(email, password)
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

// Usage
function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav>
      {user ? (
        <>
          <span>Hi, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  )
}
\`\`\`

## Multiple Contexts

\`\`\`jsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
\`\`\`

## Context vs Props

\`\`\`
Use Props when:               Use Context when:
- Parent to direct child      - Deeply nested components
- Simple data flow            - Global state (auth, theme)
- Component is reusable       - Many components need same data
- Few levels deep             - Avoiding prop drilling
\`\`\`

## Performance Tip

Split contexts by update frequency to avoid unnecessary re-renders:

\`\`\`jsx
// Bad — one context for everything re-renders all consumers
const AppContext = createContext()

// Good — separate by how often they change
const AuthContext = createContext()    // Changes rarely
const ThemeContext = createContext()   // Changes sometimes
const CartContext = createContext()    // Changes often
\`\`\`

## Interview Questions

**Q1. What is the Context API?**
A way to share data across components without passing props at every level. It creates a global store accessible by any component in the tree.

**Q2. When should you use Context?**
When data needs to be accessible by many components at different nesting levels — auth state, theme, language, cart.

**Q3. What is a Provider?**
The component that wraps part of the tree and provides the context value. Any component inside it can access the value.

**Q4. Does Context replace Redux?**
For simple global state like auth and theme yes. For complex state with many actions and reducers Redux or Zustand is better.

**Q5. Why does Context cause unnecessary re-renders?**
All consumers re-render when the context value changes. If the value object is recreated on every render all consumers re-render even if the data they need did not change.

**Q6. How do you fix unnecessary re-renders from Context?**
Memoize the value with useMemo, split into multiple contexts by update frequency, or use useReducer to stabilize the value.

## Exercises

**Exercise 1 — Easy:** Create a ThemeContext with light and dark modes. Add a toggle button in the navbar that changes the app theme.

**Exercise 2 — Medium:** Create an AuthContext with login, logout and user state. Show different navbar links based on auth state.

**Exercise 3 — Hard:** Build a shopping cart with CartContext using useReducer. Support add, remove, update quantity and clear cart from any component.

## Summary

- Context shares data without prop drilling
- Create with createContext()
- Wrap components with Provider
- Consume with useContext()
- Create custom hooks like useAuth() for cleaner API
- Split contexts by update frequency for performance
- Context is not a replacement for all state — local state is still fine

Congratulations on finishing Module 3 — React Hooks! Next: Advanced React!`
  }
]