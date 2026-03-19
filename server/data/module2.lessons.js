export const module2Lessons = [
  {
    order: 1,
    title: 'What is React & JSX',
    duration: 20,
    isFree: true,
    content: `# What is React & JSX

## Introduction

React is a JavaScript library for building user interfaces. Created by Facebook in 2013, it has become the most popular frontend library in the world.

> React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

## Why React?

Before React, developers used vanilla JavaScript or jQuery to manipulate the DOM directly. This became messy and hard to maintain as apps grew larger.

React solves this with three core ideas:

- **Component-based** — Build encapsulated components that manage their own state
- **Declarative** — Describe what the UI should look like, React handles the how
- **Virtual DOM** — React keeps a virtual copy of the DOM for fast updates

## Your First React Component

\`\`\`jsx
function Welcome() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Welcome to React!</p>
    </div>
  )
}

export default Welcome
\`\`\`

## What is JSX?

JSX stands for JavaScript XML. It lets you write HTML-like syntax inside JavaScript.

\`\`\`jsx
const element = <h1>Hello, World!</h1>

// Babel compiles it to:
const element = React.createElement('h1', null, 'Hello, World!')
\`\`\`

## JSX Rules

### 1. Return a single root element

\`\`\`jsx
// Wrong
function Bad() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  )
}

// Correct — Fragment
function Good() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  )
}
\`\`\`

### 2. Close all tags

\`\`\`jsx
<img src="photo.jpg" />
<input type="text" />
\`\`\`

### 3. Use camelCase for attributes

\`\`\`jsx
<div className="container">
<label htmlFor="email">
<button onClick={handleClick}>
\`\`\`

### 4. JavaScript expressions in curly braces

\`\`\`jsx
const name = 'Manoj'
const age = 25

function Profile() {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <p>{age >= 18 ? 'Adult' : 'Minor'}</p>
    </div>
  )
}
\`\`\`

## Embedding Expressions

\`\`\`jsx
function Dashboard() {
  const user = { name: 'Manoj', score: 95 }
  const isLoggedIn = true
  const items = ['React', 'JavaScript', 'CSS']

  return (
    <div>
      {isLoggedIn && <p>Welcome back, {user.name}!</p>}
      {user.score >= 90 ? <span>Excellent!</span> : <span>Good</span>}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
\`\`\`

## Creating a React App

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

## Interview Questions

**Q1. What is React and why use it?**
React is a JavaScript library for building UIs. It uses components, virtual DOM, and one-way data flow to make large applications manageable.

**Q2. What is JSX?**
JSX is syntactic sugar for React.createElement(). It lets you write HTML-like syntax in JavaScript files. Babel compiles it to plain JavaScript.

**Q3. What is the Virtual DOM?**
A lightweight copy of the real DOM. React compares the virtual DOM with the previous version and only updates what changed — making updates fast.

**Q4. Difference between React and a framework like Angular?**
React is a library — it only handles the view layer. Angular is a full framework with routing, forms, and HTTP built in.

**Q5. Why className instead of class in JSX?**
class is a reserved keyword in JavaScript. JSX uses className to avoid conflicts.

## Exercises

**Exercise 1 — Easy:** Create a Profile component that displays your name, age and city using JSX.

**Exercise 2 — Medium:** Create a Card component that shows a title, description and a button. Use className for styling.

**Exercise 3 — Hard:** Create a simple product listing page that maps over an array of products and renders each one with name, price and a buy button.

## Summary

- React is a UI library for component-based applications
- JSX is JavaScript with HTML-like syntax
- Components are functions that return JSX
- Use className instead of class
- Wrap JSX in a single root element or Fragment
- Use curly braces to embed JavaScript expressions`
  },

  {
    order: 2,
    title: 'Components & Props',
    duration: 25,
    isFree: false,
    content: `# Components & Props

## What are Components?

Components are the building blocks of React. Each one is independent, reusable, and can be combined to build complex UIs.

\`\`\`jsx
function Button() {
  return <button>Click me</button>
}

function App() {
  return (
    <div>
      <Button />
      <Button />
      <Button />
    </div>
  )
}
\`\`\`

## What are Props?

Props pass data from parent to child — like function arguments for components.

\`\`\`jsx
function Button({ text, color }) {
  return (
    <button style={{ backgroundColor: color }}>
      {text}
    </button>
  )
}

function App() {
  return (
    <div>
      <Button text="Submit" color="blue" />
      <Button text="Cancel" color="red" />
      <Button text="Save" color="green" />
    </div>
  )
}
\`\`\`

## Default Props

\`\`\`jsx
function Button({ text = 'Click me', color = 'blue', size = 'medium' }) {
  return (
    <button style={{ backgroundColor: color }} className={\`btn btn-\${size}\`}>
      {text}
    </button>
  )
}
\`\`\`

## All Prop Types

\`\`\`jsx
function UserCard({ name, age, isActive, hobbies, address, onClick }) {
  return (
    <div className={isActive ? 'active' : 'inactive'}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <ul>
        {hobbies.map((hobby, i) => <li key={i}>{hobby}</li>)}
      </ul>
      <p>{address.city}, {address.country}</p>
      <button onClick={onClick}>View Profile</button>
    </div>
  )
}

<UserCard
  name="Manoj"
  age={25}
  isActive={true}
  hobbies={['Coding', 'Gaming']}
  address={{ city: 'Mumbai', country: 'India' }}
  onClick={() => console.log('clicked')}
/>
\`\`\`

## Children Prop

\`\`\`jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Card title="Welcome">
      <p>This is card content</p>
      <button>Click me</button>
    </Card>
  )
}
\`\`\`

## Component Composition

\`\`\`jsx
function Avatar({ src, name }) {
  return <img src={src} alt={name} className="avatar" />
}

function UserInfo({ name, role }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  )
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <Avatar src={user.avatar} name={user.name} />
      <UserInfo name={user.name} role={user.role} />
    </div>
  )
}
\`\`\`

## Props are Read Only

\`\`\`jsx
// Wrong — never mutate props
function Bad({ count }) {
  count = count + 1
  return <p>{count}</p>
}

// Correct
function Good({ count }) {
  const displayCount = count + 1
  return <p>{displayCount}</p>
}
\`\`\`

## Interview Questions

**Q1. What are props in React?**
Props are read-only inputs passed from parent to child components. They allow components to be reusable with different data.

**Q2. Difference between props and state?**
Props come from outside the component and are read-only. State lives inside the component and can change over time.

**Q3. What is the children prop?**
A special prop that contains the JSX content passed between opening and closing tags of a component.

**Q4. Can you pass functions as props?**
Yes. Functions are valid prop values. This is how child components communicate back to parents — called lifting state up.

**Q5. What is prop drilling?**
When props are passed through multiple levels of components just to reach a deeply nested component. Context API solves this.

**Q6. What is component composition?**
Building complex UIs by combining smaller, simpler components together. It is the preferred way to reuse code in React.

## Exercises

**Exercise 1 — Easy:** Create a Badge component that accepts text and color props and renders a styled pill.

**Exercise 2 — Medium:** Create a ProductCard component with name, price, image, inStock props. Show different button text based on inStock.

**Exercise 3 — Hard:** Build a Navbar component that accepts a logo, links array and user object. Render links with map, show Login or user name based on auth state.

## Summary

- Components are reusable UI building blocks
- Props pass data from parent to child
- Always destructure props for cleaner code
- Use default values for optional props
- children prop renders nested JSX
- Never mutate props — they are read only`
  },

  {
    order: 3,
    title: 'State & Events',
    duration: 30,
    isFree: false,
    content: `# State & Events

## What is State?

State is data that lives inside a component and can change over time. When state changes, React re-renders the component automatically.

\`\`\`jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
\`\`\`

## useState Syntax

\`\`\`jsx
const [state, setState] = useState(initialValue)

const [name, setName] = useState('')
const [age, setAge] = useState(0)
const [isOpen, setIsOpen] = useState(false)
const [items, setItems] = useState([])
const [user, setUser] = useState(null)
\`\`\`

## State with Arrays

\`\`\`jsx
function TodoList() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, input])
    setInput('')
  }

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index))
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo}
            <button onClick={() => removeTodo(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
\`\`\`

## State with Objects

\`\`\`jsx
function ProfileForm() {
  const [form, setForm] = useState({ name: '', email: '', bio: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <textarea name="bio" value={form.bio} onChange={handleChange} />
    </form>
  )
}
\`\`\`

## Event Handling

\`\`\`jsx
function EventExamples() {
  const handleClick = (e) => console.log('Clicked!', e.target)
  const handleChange = (e) => console.log('Value:', e.target.value)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted!')
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') console.log('Enter pressed!')
  }

  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
\`\`\`

## Functional Updates

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0)

  // Wrong — stale closure issue
  const incrementWrong = () => setCount(count + 1)

  // Correct — always uses latest state
  const increment = () => setCount(prev => prev + 1)

  const incrementThreeTimes = () => {
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={incrementThreeTimes}>+3</button>
    </div>
  )
}
\`\`\`

## Practical — Like Button

\`\`\`jsx
function LikeButton({ initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    setLikes(prev => liked ? prev - 1 : prev + 1)
    setLiked(!liked)
  }

  return (
    <button onClick={handleLike} style={{ color: liked ? 'red' : 'gray' }}>
      {liked ? '❤️' : '🤍'} {likes}
    </button>
  )
}
\`\`\`

## Interview Questions

**Q1. What is the difference between state and props?**
Props come from outside and are read-only. State is managed inside the component and can change triggering re-renders.

**Q2. Why should you never mutate state directly?**
Direct mutation does not trigger a re-render. React only re-renders when setState is called with a new value.

**Q3. What is a controlled component?**
A form element whose value is controlled by React state. The input value is set from state and onChange updates state.

**Q4. What are functional state updates?**
Passing a function to setState instead of a value. The function receives the previous state and returns the new state. Used when new state depends on old state.

**Q5. What happens when you call setState?**
React schedules a re-render. Multiple setState calls in the same event handler are batched together into one re-render.

**Q6. Can you store any value in state?**
Yes — strings, numbers, booleans, arrays, objects, null, undefined. For complex data use objects or arrays.

## Exercises

**Exercise 1 — Easy:** Build a toggle button that switches between Show and Hide and shows/hides a paragraph.

**Exercise 2 — Medium:** Build a shopping cart — add items, remove items, show total count.

**Exercise 3 — Hard:** Build a multi-step form with 3 steps. Each step has different fields. Show progress indicator and validate before next step.

## Summary

- State is local changeable data inside a component
- useState returns current value and setter function
- Always use setState — never mutate directly
- Spread arrays and objects when updating
- Use functional updates when new state depends on old
- Controlled components link input value to state`
  },

  {
    order: 4,
    title: 'Lists & Conditional Rendering',
    duration: 25,
    isFree: false,
    content: `# Lists & Conditional Rendering

## Rendering Lists with map

\`\`\`jsx
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Cherry', 'Mango']
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  )
}
\`\`\`

## The Key Prop

Always use a unique stable value — not index if possible:

\`\`\`jsx
const users = [
  { id: 1, name: 'Manoj', role: 'student' },
  { id: 2, name: 'Priya', role: 'instructor' },
]

function UserList() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.role}</li>
      ))}
    </ul>
  )
}
\`\`\`

## Filtering Lists

\`\`\`jsx
function FilteredCourses({ courses }) {
  const [filter, setFilter] = useState('all')

  const filtered = courses.filter(c =>
    filter === 'all' ? true : c.level === filter
  )

  return (
    <div>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('beginner')}>Beginner</button>
        <button onClick={() => setFilter('advanced')}>Advanced</button>
      </div>
      <ul>
        {filtered.map(course => (
          <li key={course._id}>{course.title}</li>
        ))}
      </ul>
    </div>
  )
}
\`\`\`

## Conditional Rendering — 4 Methods

### Method 1 — if statement

\`\`\`jsx
function UserGreeting({ isLoggedIn, name }) {
  if (!isLoggedIn) return <p>Please log in</p>
  return <h1>Welcome back, {name}!</h1>
}
\`\`\`

### Method 2 — Ternary

\`\`\`jsx
function Status({ isOnline }) {
  return (
    <span style={{ color: isOnline ? 'green' : 'red' }}>
      {isOnline ? 'Online' : 'Offline'}
    </span>
  )
}
\`\`\`

### Method 3 — Short circuit (&&)

\`\`\`jsx
function Notifications({ count }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {count > 0 && <div className="badge">{count} new</div>}
    </div>
  )
}
\`\`\`

### Method 4 — Nullish coalescing (??)

\`\`\`jsx
function UserName({ name }) {
  return <p>{name ?? 'Anonymous User'}</p>
}
\`\`\`

## Loading and Error States

\`\`\`jsx
function DataDisplay({ data, loading, error }) {
  if (loading) return <div className="spinner">Loading...</div>

  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  )

  if (!data || data.length === 0) return <p>No data found</p>

  return (
    <ul>
      {data.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  )
}
\`\`\`

## Dynamic CSS Classes

\`\`\`jsx
function Tab({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={\`tab \${activeTab === tab.id ? 'active' : ''}\`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
\`\`\`

## Interview Questions

**Q1. Why does React need a key prop?**
Keys help React identify which items changed, were added, or removed. They help React optimize re-renders by reusing existing DOM nodes.

**Q2. Why not use array index as key?**
If items are reordered or deleted the indices change causing React to re-render wrong items and lose component state.

**Q3. What is conditional rendering?**
Showing different UI based on conditions. React supports if statements, ternary operators, && short circuit and switch statements.

**Q4. Difference between && and ternary for conditional rendering?**
&& renders something or nothing. Ternary renders one thing or another. Use && when you only need one branch.

**Q5. How do you handle loading and error states?**
Use separate state variables for loading and error. Return early with loading spinner or error message before the main JSX.

**Q6. What is the problem with rendering 0 using &&?**
If count is 0 — a falsy value — React renders the number 0 instead of nothing. Use count > 0 && instead of count &&.

## Exercises

**Exercise 1 — Easy:** Render a list of 5 students with their names and scores. Show Pass or Fail based on score >= 50.

**Exercise 2 — Medium:** Build a course catalog with filter buttons for All, Beginner, Intermediate, Advanced. Show count of results.

**Exercise 3 — Hard:** Build a data table with loading skeleton, error state, empty state and paginated list of items.

## Summary

- Use .map() to render lists in JSX
- Always add a unique key prop — use id not index
- Use .filter() for filtered lists
- Four conditional methods: if, ternary, &&, ??
- Always handle loading error and empty states
- Watch out for rendering 0 with && operator

Congratulations on finishing Module 2! Next up: React Hooks!`
  }
]