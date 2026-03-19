export const module4Lessons = [
  {
    order: 1,
    title: 'React Router v6',
    duration: 30,
    isFree: true,
    content: `# React Router v6

## What is React Router?

React Router is the standard routing library for React. It lets you build single-page applications with multiple views without full page reloads.

\`\`\`bash
npm install react-router-dom
\`\`\`

## Basic Setup

\`\`\`jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
\`\`\`

## Link and NavLink

\`\`\`jsx
import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      {/* Link — basic navigation */}
      <Link to="/">Home</Link>
      <Link to="/courses">Courses</Link>

      {/* NavLink — adds active class automatically */}
      <NavLink
        to="/courses"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        Courses
      </NavLink>
    </nav>
  )
}
\`\`\`

## useNavigate Hook

\`\`\`jsx
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    await loginAPI()
    navigate('/dashboard')                     // go to page
    navigate(-1)                               // go back
    navigate('/login', { replace: true })      // replace history
  }

  return <button onClick={handleLogin}>Login</button>
}
\`\`\`

## URL Parameters

\`\`\`jsx
// Route definition
<Route path="/courses/:slug" element={<CourseDetail />} />
<Route path="/users/:id/posts/:postId" element={<Post />} />

// Reading params
import { useParams } from 'react-router-dom'

function CourseDetail() {
  const { slug } = useParams()

  useEffect(() => {
    fetchCourse(slug)
  }, [slug])

  return <div>Course: {slug}</div>
}
\`\`\`

## Nested Routes

\`\`\`jsx
function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

// Layout uses Outlet to render child routes
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
\`\`\`

## Protected Routes

\`\`\`jsx
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login', { replace: true })
    }
  }, [isLoggedIn, loading])

  if (loading) return <Spinner />
  if (!isLoggedIn) return null
  return children
}

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
\`\`\`

## useSearchParams

\`\`\`jsx
import { useSearchParams, useLocation } from 'react-router-dom'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const query = searchParams.get('q') || ''
  const page = Number(searchParams.get('page')) || 1

  const handleSearch = (value) => {
    setSearchParams({ q: value, page: 1 })
  }

  return (
    <div>
      <p>Path: {location.pathname}</p>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      <p>Page: {page}</p>
    </div>
  )
}
\`\`\`

## Passing State via Navigation

\`\`\`jsx
// Send state
navigate('/confirmation', {
  state: { orderId: 123, total: 499 }
})

// Receive state
function Confirmation() {
  const { state } = useLocation()
  return <p>Order {state?.orderId} — Total: {state?.total}</p>
}
\`\`\`

## Interview Questions

**Q1. What is client-side routing?**
Navigation handled by JavaScript without making requests to the server. The URL changes and components swap without a full page reload — making apps feel faster.

**Q2. Difference between Link and NavLink?**
Both navigate without page reload. NavLink adds an active class automatically when its path matches the current URL — useful for styling active nav items.

**Q3. What is useNavigate used for?**
Programmatic navigation — redirecting after form submit, login, or any action. Replaces the old useHistory hook from v5.

**Q4. What is the Outlet component?**
A placeholder in a layout component where child routes render. Used with nested routes so layouts like sidebars stay mounted while content changes.

**Q5. How do you protect routes in React Router?**
Create a ProtectedRoute wrapper component that checks auth state. If not logged in redirect to login. If loading show a spinner.

**Q6. Difference between navigate and Link?**
Link is a component for user-clicked navigation rendered as an anchor tag. navigate is a function for programmatic navigation triggered by code.

## Exercises

**Exercise 1 — Easy:** Create a 3-page app with Home, About and Contact pages. Add a navbar with NavLink and highlight the active page.

**Exercise 2 — Medium:** Build a blog with a list page and detail page. Use useParams to fetch the correct post. Add a 404 page for unknown routes.

**Exercise 3 — Hard:** Build a dashboard with nested routes for Overview, Settings and Profile tabs. Protect all dashboard routes with a ProtectedRoute component.

## Summary

- BrowserRouter wraps your app
- Routes and Route define your pages
- Link and NavLink for navigation
- useNavigate for programmatic navigation
- useParams for URL parameters
- Outlet renders nested routes
- useSearchParams for query strings
- Protect routes by checking auth before rendering`
  },

  {
    order: 2,
    title: 'Performance Optimization',
    duration: 30,
    isFree: false,
    content: `# Performance Optimization

## Why Optimize?

React is fast by default but as apps grow you might see:
- Unnecessary re-renders slowing things down
- Large bundle sizes increasing load time
- Laggy UI when handling complex data

## React.memo

Prevents a component from re-rendering if its props have not changed:

\`\`\`jsx
import { memo } from 'react'

// Without memo — re-renders every time parent renders
function ExpensiveCard({ title, description }) {
  console.log('Rendered:', title)
  return <div><h2>{title}</h2><p>{description}</p></div>
}

// With memo — only re-renders when props change
const ExpensiveCard = memo(function ExpensiveCard({ title, description }) {
  console.log('Rendered:', title)
  return <div><h2>{title}</h2><p>{description}</p></div>
})
\`\`\`

## useCallback Hook

Memoizes a function so it does not get recreated on every render:

\`\`\`jsx
import { useCallback, memo } from 'react'

function Parent() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // Without useCallback — new function every render
  // Child re-renders even when only text changes
  const handleClick = () => console.log('clicked')

  // With useCallback — same reference if deps unchanged
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>+{count}</button>
      <Child onClick={handleClick} />
    </div>
  )
}

const Child = memo(({ onClick }) => {
  console.log('Child rendered')
  return <button onClick={onClick}>Click</button>
})
\`\`\`

## useMemo for Expensive Calculations

\`\`\`jsx
function DataTable({ data, sortKey, filterText }) {
  const processedData = useMemo(() => {
    return data
      .filter(item =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      )
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name)
        return b[sortKey] - a[sortKey]
      })
  }, [data, sortKey, filterText])

  return (
    <table>
      <tbody>
        {processedData.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
\`\`\`

## Code Splitting with lazy and Suspense

Load components only when needed — reduces initial bundle size:

\`\`\`jsx
import { lazy, Suspense } from 'react'

// Dynamically imported — not in initial bundle
const Dashboard = lazy(() => import('./Dashboard'))
const Profile = lazy(() => import('./Profile'))
const Settings = lazy(() => import('./Settings'))

function App() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
\`\`\`

## Virtualization for Long Lists

Only render visible items from huge lists:

\`\`\`bash
npm install react-window
\`\`\`

\`\`\`jsx
import { FixedSizeList } from 'react-window'

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      {items[index].name}
    </div>
  )

  return (
    <FixedSizeList
      height={500}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
\`\`\`

## Key Performance Rules

\`\`\`jsx
// 1. Never create objects or arrays inline when using memo
// Bad — new object every render breaks memo
<Child style={{ color: 'red' }} data={[1,2,3]} />

// Good — stable reference
const STYLE = { color: 'red' }
const DATA = [1, 2, 3]
<Child style={STYLE} data={DATA} />

// 2. Stable keys prevent unnecessary re-renders
// Bad
items.map((item, i) => <Item key={i} {...item} />)

// Good
items.map(item => <Item key={item.id} {...item} />)

// 3. Avoid anonymous functions with memoized components
// Bad
<Button onClick={() => handleClick(id)} />

// Good
const handleItemClick = useCallback(() => handleClick(id), [id])
<Button onClick={handleItemClick} />
\`\`\`

## When NOT to Optimize

\`\`\`
Do NOT use memo, useMemo, useCallback:
- On simple components that render fast
- When props change almost every render
- Prematurely — profile first then optimize

The overhead of memoization can be worse
than just re-rendering a simple component.
\`\`\`

## Interview Questions

**Q1. What is React.memo?**
A higher-order component that wraps a component and prevents it from re-rendering if its props have not changed using shallow comparison.

**Q2. Difference between useMemo and useCallback?**
useMemo memoizes a computed value. useCallback memoizes a function reference. Both prevent unnecessary recalculation or recreation on each render.

**Q3. What is code splitting?**
Breaking the JavaScript bundle into smaller chunks that load on demand. React.lazy and Suspense enable component-level code splitting.

**Q4. When should you use React.memo?**
When a component renders the same output for the same props and re-renders frequently with the same props. Profile first to confirm it is a bottleneck.

**Q5. What is virtualization?**
Only rendering the visible portion of a large list. Libraries like react-window render only the items currently in the viewport instead of all items.

**Q6. What is the React DevTools Profiler?**
A browser extension tab that records which components rendered and how long they took. Use it to find performance bottlenecks before optimizing.

## Exercises

**Exercise 1 — Easy:** Wrap an expensive component with React.memo and verify it stops re-rendering when parent state changes.

**Exercise 2 — Medium:** Use lazy and Suspense to code split a large page component. Verify the chunk loads separately in the network tab.

**Exercise 3 — Hard:** Build a list of 10000 items using react-window virtualization. Compare performance with and without virtualization in DevTools.

## Summary

- React.memo prevents re-renders when props unchanged
- useCallback memoizes functions
- useMemo memoizes expensive calculations
- lazy and Suspense split code into chunks
- Virtualize long lists with react-window
- Stable keys prevent unnecessary DOM updates
- Profile first — do not optimize prematurely`
  },

  {
    order: 3,
    title: 'State Management Patterns',
    duration: 35,
    isFree: false,
    content: `# State Management Patterns

## Types of State

\`\`\`
Local State    — useState — lives in one component
Shared State   — Context  — shared between components
Server State   — fetched from API, cached, synchronized
URL State      — lives in URL — shareable and bookmarkable
\`\`\`

## useReducer — Complex State Logic

When state logic becomes complex useReducer is cleaner than multiple useState:

\`\`\`jsx
import { useReducer } from 'react'

const initialState = {
  count: 0,
  step: 1,
  history: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, state.count + state.step],
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - state.step,
        history: [...state.history, state.count - state.step],
      }
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <p>Count: {state.count} | Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'SET_STEP', payload: Number(e.target.value) })}
      />
      <p>History: {state.history.join(', ')}</p>
    </div>
  )
}
\`\`\`

## Context + useReducer — Global State

\`\`\`jsx
const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  const total = state.items.reduce((t, i) => t + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, total, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

function useCart() {
  return useContext(CartContext)
}
\`\`\`

## useState vs useReducer

\`\`\`
Use useState when:                Use useReducer when:
- Simple toggle or counter        - Complex object with many fields
- Independent state values        - Multiple values change together
- Few state transitions           - Next state depends on previous
                                  - State has business logic
\`\`\`

## Lifting State Up

When two components need the same state lift it to their common parent:

\`\`\`jsx
function App() {
  const [query, setQuery] = useState('')  // Lifted here

  return (
    <div>
      <SearchBar query={query} onQueryChange={setQuery} />
      <SearchResults query={query} />
    </div>
  )
}

function SearchBar({ query, onQueryChange }) {
  return (
    <input
      value={query}
      onChange={e => onQueryChange(e.target.value)}
    />
  )
}

function SearchResults({ query }) {
  const results = useSearchResults(query)
  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
}
\`\`\`

## Derived State

Compute values from existing state instead of storing them separately:

\`\`\`jsx
function ShoppingCart() {
  const [items, setItems] = useState([])

  // Derived — computed from items state
  // Do NOT store these in separate useState
  const itemCount = items.length
  const total = items.reduce((t, item) => t + item.price * item.qty, 0)
  const isEmpty = items.length === 0
  const hasExpensive = items.some(item => item.price > 1000)

  return (
    <div>
      <p>{itemCount} items — Total: ₹{total}</p>
      {isEmpty && <p>Your cart is empty</p>}
    </div>
  )
}
\`\`\`

## Interview Questions

**Q1. What is useReducer?**
A hook for managing complex state with a reducer function. Takes current state and an action and returns new state. Similar to Redux but built into React.

**Q2. When should you use useReducer over useState?**
When state has multiple sub-values that change together, when the next state depends on the previous state, or when state transitions have complex business logic.

**Q3. What is derived state?**
Values computed from existing state rather than stored in separate state variables. Avoids state synchronization bugs — always in sync with the source state.

**Q4. What is lifting state up?**
Moving state to the nearest common ancestor of components that need it. Allows sibling components to share and sync state through their parent.

**Q5. What is the reducer pattern?**
A pure function that takes previous state and an action object and returns new state. Predictable and testable — same inputs always produce same output.

**Q6. What is the difference between Context + useReducer and Redux?**
Context + useReducer is built into React and good for simple global state. Redux adds middleware, devtools, time-travel debugging and is better for very complex state.

## Exercises

**Exercise 1 — Easy:** Convert a component with 3 related useState calls into a single useReducer.

**Exercise 2 — Medium:** Build a shopping cart with useReducer supporting add, remove, update quantity and clear actions.

**Exercise 3 — Hard:** Build a multi-step form wizard with useReducer tracking current step, form values, validation errors and submitted state.

## Summary

- Use useState for simple independent state
- Use useReducer for complex state with multiple transitions
- Combine Context and useReducer for global state
- Lift state up when multiple components need the same data
- Compute derived values instead of storing them separately
- Separate state by type: local, shared, server, URL`
  },

  {
    order: 4,
    title: 'Building a Complete React App',
    duration: 40,
    isFree: false,
    content: `# Building a Complete React App

## What We Are Building

A complete Notes App using everything from all 4 modules:

\`\`\`
Module 1 — JavaScript: array methods, async, destructuring
Module 2 — Components, props, state, events
Module 3 — useEffect, custom hooks, Context API
Module 4 — React Router, performance, useReducer
\`\`\`

## Project Structure

\`\`\`
notes-app/
├── src/
│   ├── components/
│   │   ├── NoteCard.jsx       ← memo + useCallback
│   │   ├── SearchBar.jsx      ← useDebounce custom hook
│   │   └── Navbar.jsx         ← NavLink + useAuth
│   ├── context/
│   │   └── NotesContext.jsx   ← Context + useReducer
│   ├── hooks/
│   │   ├── useLocalStorage.js ← custom hook
│   │   └── useDebounce.js     ← custom hook
│   ├── pages/
│   │   ├── Home.jsx           ← useMemo filtering
│   │   ├── NoteDetail.jsx     ← useParams
│   │   └── NewNote.jsx        ← useNavigate
│   └── App.jsx                ← lazy + Suspense + Routes
\`\`\`

## Step 1 — Notes Context with useReducer

\`\`\`jsx
import { createContext, useContext, useReducer, useEffect } from 'react'

const NotesContext = createContext()

const notesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return { ...state, notes: action.payload }
    case 'ADD':
      return { ...state, notes: [action.payload, ...state.notes] }
    case 'UPDATE':
      return {
        ...state,
        notes: state.notes.map(n =>
          n.id === action.payload.id ? action.payload : n
        )
      }
    case 'DELETE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    default:
      return state
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    filter: 'all',
  })

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notes')
    if (saved) dispatch({ type: 'LOAD', payload: JSON.parse(saved) })
  }, [])

  // Save to localStorage when notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(state.notes))
  }, [state.notes])

  const addNote = (title, content, category) => {
    dispatch({
      type: 'ADD',
      payload: {
        id: Date.now().toString(),
        title, content, category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })
  }

  const updateNote = (id, updates) => {
    const note = state.notes.find(n => n.id === id)
    dispatch({
      type: 'UPDATE',
      payload: { ...note, ...updates, updatedAt: new Date().toISOString() }
    })
  }

  const deleteNote = (id) => dispatch({ type: 'DELETE', payload: id })

  return (
    <NotesContext.Provider value={{
      notes: state.notes,
      filter: state.filter,
      addNote, updateNote, deleteNote,
      setFilter: (f) => dispatch({ type: 'SET_FILTER', payload: f }),
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => useContext(NotesContext)
\`\`\`

## Step 2 — NoteCard with memo and useCallback

\`\`\`jsx
import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'

const NoteCard = memo(({ note }) => {
  const navigate = useNavigate()
  const { deleteNote } = useNotes()

  const handleDelete = useCallback((e) => {
    e.stopPropagation()
    if (window.confirm('Delete this note?')) deleteNote(note.id)
  }, [note.id, deleteNote])

  const colors = {
    personal: '#6366f1',
    work: '#0891b2',
    learning: '#22c55e',
    ideas: '#f59e0b',
  }

  return (
    <div className="note-card" onClick={() => navigate(\`/notes/\${note.id}\`)}>
      <span style={{ background: colors[note.category] }} className="badge">
        {note.category}
      </span>
      <h3>{note.title}</h3>
      <p>{note.content.slice(0, 100)}...</p>
      <div className="note-footer">
        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
})

export default NoteCard
\`\`\`

## Step 3 — Home Page with useMemo

\`\`\`jsx
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'
import NoteCard from '../components/NoteCard'
import { useDebounce } from '../hooks/useDebounce'

function Home() {
  const { notes, filter, setFilter } = useNotes()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => filter === 'all' || note.category === filter)
      .filter(note =>
        note.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        note.content.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
  }, [notes, filter, debouncedSearch])

  const categories = ['all', 'personal', 'work', 'learning', 'ideas']

  return (
    <div className="home">
      <div className="home-header">
        <h1>My Notes ({notes.length})</h1>
        <Link to="/new" className="btn-primary">+ New Note</Link>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search notes..."
      />

      <div className="filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={\`filter \${filter === cat ? 'active' : ''}\`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredNotes.length === 0 ? (
        <div className="empty">
          <p>No notes found</p>
          <Link to="/new">Create your first note</Link>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
\`\`\`

## Step 4 — App.jsx with lazy loading

\`\`\`jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { NotesProvider } from './context/NotesContext'
import Navbar from './components/Navbar'

const Home = lazy(() => import('./pages/Home'))
const NewNote = lazy(() => import('./pages/NewNote'))
const NoteDetail = lazy(() => import('./pages/NoteDetail'))

function App() {
  return (
    <NotesProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<NewNote />} />
              <Route path="/notes/:id" element={<NoteDetail />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </NotesProvider>
  )
}

export default App
\`\`\`

## Everything Used in This App

\`\`\`
From Module 1:
  ✅ Array methods — filter, map, find, reduce
  ✅ Destructuring and spread in state updates
  ✅ Async/await in data fetching
  ✅ Optional chaining for safe access

From Module 2:
  ✅ Components and props throughout
  ✅ useState for search and form inputs
  ✅ Event handling — onClick, onChange, onSubmit
  ✅ Conditional rendering — empty state, loading

From Module 3:
  ✅ useEffect for localStorage sync
  ✅ useRef in custom hooks
  ✅ useMemo for filtered notes
  ✅ Custom hooks — useDebounce, useLocalStorage
  ✅ Context API — NotesContext

From Module 4:
  ✅ React Router — Routes, Link, useParams, useNavigate
  ✅ useReducer for notes state management
  ✅ React.memo on NoteCard
  ✅ useCallback on delete handler
  ✅ lazy and Suspense for code splitting
\`\`\`

## Interview Questions

**Q1. How do you structure a large React application?**
Separate by feature or type — components, pages, hooks, context, services, utils. Keep related files together. Use index files for clean imports.

**Q2. How do you handle global state in React?**
Context API with useReducer for most apps. For very complex state with many actions use Zustand or Redux Toolkit.

**Q3. How do you optimize a React app?**
Profile first with React DevTools. Then apply memo for unnecessary re-renders, lazy loading for bundle size, virtualization for long lists.

**Q4. How do you persist state across page refreshes?**
Store in localStorage with useEffect. Initialize state lazily from localStorage using the function form of useState.

**Q5. What is the best way to fetch data in React?**
useEffect with async function inside, proper loading and error states, and cleanup with AbortController. For complex cases use React Query.

**Q6. How do you share logic between components?**
Extract into custom hooks. Custom hooks can use any React hooks and are called per component so each gets its own state.

## Exercises

**Exercise 1 — Easy:** Add a character count to the note content textarea that updates live.

**Exercise 2 — Medium:** Add a pin feature to notes using useReducer. Pinned notes appear at the top of the list.

**Exercise 3 — Hard:** Add tags to notes. Filter by multiple tags. Use useMemo for the filtered result. Save tags to localStorage.

## Summary

You have completed the React.js Complete Guide!

\`\`\`
Module 1 — JavaScript ES6+, async, array methods
Module 2 — Components, props, state, events, lists
Module 3 — Hooks, custom hooks, Context API
Module 4 — Router, performance, state patterns, full app
\`\`\`

You are now ready to build production React applications. Submit your final project — the Full Blog Platform — for AI evaluation and get detailed feedback on your code!`
  }
]