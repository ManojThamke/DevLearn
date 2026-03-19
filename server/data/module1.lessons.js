export const module1Lessons = [
  {
    order: 1,
    title: 'ES6+ Basics',
    duration: 15,
    isFree: true,
    content: `# ES6+ Basics

## Introduction

Before React, you need modern JavaScript. ES6 was released in 2015 and changed everything.

## 1. let and const

Rule: never use var. Use const by default. Use let when value changes.

\`\`\`javascript
const API_URL = "https://api.devlearn.com"
const MAX_RETRIES = 3
let isLoading = true
let currentPage = 1
isLoading = false
\`\`\`

## 2. Arrow Functions

Arrow functions are shorter and cleaner than regular functions:

\`\`\`javascript
// Regular function
function add(a, b) {
  return a + b
}

// Arrow function
const add = (a, b) => a + b

// Single param — no brackets needed
const double = n => n * 2

// No params
const sayHello = () => "Hello!"

// Multi-line
const greet = (name) => {
  const message = "Hello " + name
  return message
}
\`\`\`

## 3. Template Literals

Use backticks to embed variables directly in strings:

\`\`\`javascript
const name = "Manoj"
const score = 95
const city = "Mumbai"

// Old way
console.log("Hello " + name + ", your score is " + score)

// Template literal
console.log(\`Hello \${name}, your score is \${score}\`)
console.log(\`You are from \${city}\`)
console.log(\`2 + 2 = \${2 + 2}\`)

// Multi-line strings
const html = \`
  <div>
    <h1>\${name}</h1>
    <p>Score: \${score}</p>
  </div>
\`
\`\`\`

## 4. Default Parameters

\`\`\`javascript
// Old way
function greet(name) {
  name = name || "Student"
  return "Hello " + name
}

// Default parameters
const greet = (name = "Student") => \`Hello \${name}\`
const createUser = (name = "Anonymous", role = "student", age = 18) => ({
  name, role, age
})

greet("Manoj")   // Hello Manoj
greet()          // Hello Student
\`\`\`

## 5. Object Shorthand

\`\`\`javascript
const name = "Manoj"
const age = 25
const city = "Mumbai"

// Old way
const user = { name: name, age: age, city: city }

// Shorthand
const user = { name, age, city }
\`\`\`

## 6. Optional Chaining (?.)

Safely access nested properties without errors:

\`\`\`javascript
const user = {
  name: "Manoj",
  address: {
    city: "Mumbai"
  }
}

// Old way — crashes if address is undefined
console.log(user.address.city)

// Optional chaining — safe
console.log(user?.address?.city)       // Mumbai
console.log(user?.phone?.number)       // undefined (no error)
console.log(user?.getName?.())         // undefined (no error)
\`\`\`

## 7. Nullish Coalescing (??)

Returns right side only when left side is null or undefined:

\`\`\`javascript
const score = null
const name = ""
const count = 0

// || returns right when left is falsy (includes 0 and "")
console.log(score || "No score")   // No score
console.log(name || "Anonymous")   // Anonymous
console.log(count || 10)           // 10 — WRONG!

// ?? returns right only when left is null or undefined
console.log(score ?? "No score")   // No score
console.log(name ?? "Anonymous")   // "" — empty string kept
console.log(count ?? 10)           // 0 — zero kept
\`\`\`

## Common Mistakes

1. Using var instead of const or let
2. Trying to reassign a const variable
3. Arrow function returning object without wrapping in ()
4. Using arrow functions when you need the this keyword

\`\`\`javascript
// Wrong — returns undefined
const getUser = () => { name: "Manoj" }

// Correct — wrap object in parentheses
const getUser = () => ({ name: "Manoj" })
\`\`\`

## Pro Tips

1. Always use const first, switch to let only if needed
2. Use arrow functions for callbacks and event handlers
3. const arrays and objects can still be modified — const prevents reassignment not mutation
4. Use UPPER_SNAKE_CASE for true constants like API_URL

## Interview Questions

**Q1. Difference between var, let and const?**
var is function scoped and hoisted. let is block scoped and reassignable. const is block scoped and cannot be reassigned.

**Q2. Difference between regular and arrow functions?**
Arrow functions are shorter and do not have their own this binding. Use regular functions when you need this.

**Q3. Can you modify a const array or object?**
Yes. const prevents reassignment but not modification. You can push to a const array or update a property of a const object.

**Q4. What is a template literal?**
Strings using backticks that allow embedded expressions and multiline text.

**Q5. What is optional chaining?**
The ?. operator safely accesses nested properties without throwing an error if the value is null or undefined.

## Summary

- Variables: use const by default, let when reassigning, never var
- Functions: arrow functions for modern code
- Strings: template literals instead of concatenation
- Parameters: default values instead of if checks
- Optional chaining: safe property access with ?.
- Nullish coalescing: default values with ??`
  },

  {
    order: 2,
    title: 'Destructuring & Spread Operator',
    duration: 20,
    isFree: true,
    content: `# Destructuring and Spread Operator

## Introduction

Two features you will use in every React component you write. Destructuring is like unpacking a suitcase — take everything out and place it where needed.

## 1. Array Destructuring

\`\`\`javascript
const colors = ["red", "green", "blue"]
const [first, second, third] = colors

console.log(first)   // red
console.log(second)  // green
console.log(third)   // blue

// Skip elements
const [, second, , fourth] = [1, 2, 3, 4]

// Default values
const [a = 0, b = 0] = [10]
console.log(a)  // 10
console.log(b)  // 0

// Swap variables
let x = 1, y = 2
[x, y] = [y, x]
console.log(x)  // 2
console.log(y)  // 1
\`\`\`

## React Connection — useState

\`\`\`javascript
// useState returns an array — we destructure it
const [count, setCount] = useState(0)
const [name, setName] = useState("")
const [isLoading, setIsLoading] = useState(true)
\`\`\`

## 2. Object Destructuring

\`\`\`javascript
const user = {
  name: "Manoj",
  age: 25,
  city: "Mumbai",
  role: "student"
}

// Basic destructuring
const { name, age, city } = user

// Rename while destructuring
const { name: userName, age: userAge } = user
console.log(userName)  // Manoj

// Default values
const { score = 0, level = "beginner" } = user
console.log(score)  // 0 (not in user object)

// Nested destructuring
const student = {
  name: "Manoj",
  address: {
    city: "Mumbai",
    state: "Maharashtra"
  }
}
const { address: { city, state } } = student
\`\`\`

## React Connection — Props Destructuring

\`\`\`javascript
// Without destructuring
const CourseCard = (props) => (
  <div>
    <h2>{props.title}</h2>
    <p>{props.description}</p>
  </div>
)

// With destructuring — much cleaner
const CourseCard = ({ title, description, level = "beginner" }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
    <span>{level}</span>
  </div>
)
\`\`\`

## 3. Rest Operator

Collects remaining items into one variable:

\`\`\`javascript
// Array rest
const [first, second, ...rest] = [1, 2, 3, 4, 5]
console.log(first)   // 1
console.log(second)  // 2
console.log(rest)    // [3, 4, 5]

// Object rest
const { name, age, ...otherDetails } = user
console.log(name)         // Manoj
console.log(otherDetails) // { city: "Mumbai", role: "student" }

// Function rest params
const sum = (...numbers) => numbers.reduce((total, n) => total + n, 0)
console.log(sum(1, 2, 3, 4, 5))  // 15
\`\`\`

## 4. Spread Operator

Expands items from arrays or objects:

\`\`\`javascript
// Combine arrays
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
const combined = [...arr1, ...arr2]   // [1, 2, 3, 4, 5, 6]

// Copy array
const original = [1, 2, 3]
const copy = [...original]

// Add to array
const withNew = [...original, 4, 5]  // [1, 2, 3, 4, 5]

// Combine objects
const obj1 = { a: 1, b: 2 }
const obj2 = { c: 3, d: 4 }
const merged = { ...obj1, ...obj2 }   // { a: 1, b: 2, c: 3, d: 4 }

// Update one field
const user = { name: "Manoj", age: 25, city: "Mumbai" }
const updated = { ...user, age: 26 }   // { name: "Manoj", age: 26, city: "Mumbai" }
\`\`\`

## React Connection — State Updates

\`\`\`javascript
// Update object state
const [user, setUser] = useState({ name: "Manoj", age: 25 })
setUser({ ...user, age: 26 })

// Add to array state
const [todos, setTodos] = useState([])
setTodos([...todos, newTodo])

// Remove from array state
setTodos(todos.filter(todo => todo.id !== id))

// Update item in array state
setTodos(todos.map(todo =>
  todo.id === id ? { ...todo, completed: true } : todo
))
\`\`\`

## Common Mistakes

1. Mutating state directly instead of spreading
2. Forgetting that spread only does a shallow copy
3. Putting rest anywhere except the last position

\`\`\`javascript
// Wrong — rest must be last
const { ...rest, name } = user  // SyntaxError

// Correct
const { name, ...rest } = user
\`\`\`

## Pro Tips

1. Remove sensitive fields: const { password, ...safeUser } = user
2. Pass all props to element: const Button = ({ label, ...props }) => <button {...props}>{label}</button>
3. Spread into function args: Math.max(...numbers)
4. Clone and modify: const newState = { ...state, loading: false }

## Interview Questions

**Q1. Difference between rest and spread?**
Spread expands an array or object into individual items. Rest collects multiple items into one array or object.

**Q2. Does spread do a deep copy?**
No. Spread only does a shallow copy. Nested objects still share the same reference.

**Q3. How do you update one property in state?**
Use spread: setUser({ ...user, age: 26 })

**Q4. What happens if two spread objects have the same key?**
The last one wins: { ...obj1, ...obj2 } — obj2 values override obj1.

## Summary

- Array destructuring unpacks arrays into variables
- Object destructuring unpacks objects into variables
- Rest collects remaining items into one variable
- Spread expands items from array or object
- Use spread for immutable state updates in React
- Never mutate state directly — always create new copy`
  },

  {
    order: 3,
    title: 'Array Methods',
    duration: 25,
    isFree: false,
    content: `# Array Methods — map, filter, reduce

## Introduction

These three methods are the backbone of React development. You will use them every single day.

- map = transform every item, returns same length array
- filter = keep only matching items, returns shorter array
- reduce = combine everything into one value of any type

## 1. map()

Transforms every item and returns a new array of the same length:

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5]

const doubled = numbers.map(n => n * 2)
console.log(doubled)  // [2, 4, 6, 8, 10]

const squared = numbers.map(n => n * n)
console.log(squared)  // [1, 4, 9, 16, 25]

// Object transformation
const users = [
  { id: 1, name: "Manoj", score: 95 },
  { id: 2, name: "Priya", score: 88 },
  { id: 3, name: "Rahul", score: 72 },
]

const names = users.map(user => user.name)
// ["Manoj", "Priya", "Rahul"]

const withGrade = users.map(user => ({
  ...user,
  grade: user.score >= 90 ? "A" : user.score >= 80 ? "B" : "C"
}))
\`\`\`

## React — Rendering Lists

\`\`\`jsx
function CourseList({ courses }) {
  return (
    <div>
      {courses.map(course => (
        <CourseCard
          key={course._id}
          title={course.title}
          level={course.level}
        />
      ))}
    </div>
  )
}
\`\`\`

## 2. filter()

Returns only items that pass the test:

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const evens = numbers.filter(n => n % 2 === 0)
console.log(evens)  // [2, 4, 6, 8, 10]

const bigNumbers = numbers.filter(n => n > 5)
console.log(bigNumbers)  // [6, 7, 8, 9, 10]

// Filter objects
const students = [
  { name: "Manoj", passed: true, city: "Mumbai" },
  { name: "Priya", passed: false, city: "Delhi" },
  { name: "Rahul", passed: true, city: "Mumbai" },
]

const passedStudents = students.filter(s => s.passed)
const mumbaiStudents = students.filter(s => s.city === "Mumbai")
const passedMumbai = students.filter(s => s.passed && s.city === "Mumbai")
\`\`\`

## React — Deleting from State and Filtering

\`\`\`jsx
// Delete item
const deleteTodo = (id) => {
  setTodos(todos.filter(todo => todo.id !== id))
}

// Search filter
const filteredCourses = courses.filter(course =>
  course.title.toLowerCase().includes(searchQuery.toLowerCase())
)

// Level filter
const beginnerCourses = courses.filter(course => course.level === "beginner")
\`\`\`

## 3. reduce()

Combines all items into a single value:

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5]

// Sum
const sum = numbers.reduce((total, n) => total + n, 0)
console.log(sum)  // 15

// Product
const product = numbers.reduce((total, n) => total * n, 1)
console.log(product)  // 120

// Max value
const max = numbers.reduce((max, n) => n > max ? n : max, numbers[0])
console.log(max)  // 5

// Count occurrences
const fruits = ["apple", "banana", "apple", "cherry", "banana", "apple"]
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1
  return acc
}, {})
console.log(counts)  // { apple: 3, banana: 2, cherry: 1 }

// Group by category
const courses = [
  { title: "React", category: "frontend" },
  { title: "Node.js", category: "backend" },
  { title: "CSS", category: "frontend" },
]
const grouped = courses.reduce((acc, course) => {
  if (!acc[course.category]) acc[course.category] = []
  acc[course.category].push(course)
  return acc
}, {})
\`\`\`

## 4. Other Important Methods

\`\`\`javascript
const numbers = [3, 1, 4, 1, 5, 9, 2, 6]

// find — first match
const firstBig = numbers.find(n => n > 5)
console.log(firstBig)  // 9

// findIndex — index of first match
const idx = numbers.findIndex(n => n > 5)
console.log(idx)  // 5

// some — at least one matches
const hasNegative = numbers.some(n => n < 0)
console.log(hasNegative)  // false

// every — all match
const allPositive = numbers.every(n => n > 0)
console.log(allPositive)  // true

// includes — contains value
console.log(numbers.includes(9))  // true

// sort — always copy first to avoid mutation
const sorted = [...numbers].sort((a, b) => a - b)
console.log(sorted)  // [1, 1, 2, 3, 4, 5, 6, 9]

// flat — flatten nested arrays
const nested = [[1, 2], [3, 4], [5, 6]]
console.log(nested.flat())  // [1, 2, 3, 4, 5, 6]
\`\`\`

## 5. Method Chaining

Combine multiple methods in sequence:

\`\`\`javascript
const students = [
  { name: "Manoj", city: "Mumbai", score: 95 },
  { name: "Priya", city: "Delhi", score: 72 },
  { name: "Rahul", city: "Mumbai", score: 85 },
  { name: "Anjali", city: "Mumbai", score: 68 },
]

const topMumbaiStudents = students
  .filter(s => s.city === "Mumbai")     // only Mumbai
  .filter(s => s.score >= 70)          // passed
  .sort((a, b) => b.score - a.score)   // highest first
  .map(s => s.name)                     // just names

console.log(topMumbaiStudents)  // ["Manoj", "Rahul"]
\`\`\`

## Common Mistakes

1. Forgetting return in map with curly braces
2. Mutating array with sort — always copy first with spread
3. Missing key prop in React list rendering
4. Missing initial value in reduce

\`\`\`javascript
// Wrong — returns array of undefined
const doubled = numbers.map(n => { n * 2 })

// Correct — add return or remove curly braces
const doubled = numbers.map(n => { return n * 2 })
const doubled = numbers.map(n => n * 2)
\`\`\`

## Interview Questions

**Q1. Difference between map and forEach?**
map returns a new array. forEach returns undefined and is used for side effects only.

**Q2. Why not use index as key in React?**
Indices change when items are reordered or deleted causing incorrect re-renders and bugs.

**Q3. What does reduce return?**
A single accumulated value of any type — number, string, array, object.

**Q4. Does filter mutate the original array?**
No. map, filter and reduce all return new arrays without modifying the original.

## Summary

- map transforms every item — same length array
- filter keeps matching items — shorter array
- reduce combines into one value — any type
- find returns first match, findIndex returns its index
- some checks if any match, every checks if all match
- Always copy arrays before sorting with spread
- Chain methods for powerful data transformations`
  },

  {
    order: 4,
    title: 'Async JavaScript',
    duration: 30,
    isFree: false,
    content: `# Async JavaScript — Promises and Async/Await

## Introduction

React apps fetch data from APIs constantly. Understanding async JavaScript is essential for every React developer. Think of it like ordering food at a restaurant — you place your order and can do other things while waiting instead of standing at the counter.

## 1. The Problem with Synchronous Code

\`\`\`javascript
// Synchronous — blocks everything
console.log("Start")
const data = fetchFromServer()  // Takes 3 seconds — everything freezes!
console.log("End")              // Only runs after 3 seconds
\`\`\`

Asynchronous code lets other code run while waiting:

\`\`\`javascript
// Asynchronous — non-blocking
console.log("Start")
fetchFromServer().then(data => console.log(data))
console.log("End")  // Runs immediately without waiting

// Output:
// Start
// End
// (data arrives 3 seconds later)
\`\`\`

## 2. Callbacks (Old Way)

\`\`\`javascript
function fetchUser(id, callback) {
  setTimeout(() => {
    callback({ id, name: "Manoj" })
  }, 1000)
}

fetchUser(1, (user) => {
  console.log(user.name)
})
\`\`\`

Problem — callback hell:
\`\`\`javascript
fetchUser(1, (user) => {
  fetchCourses(user.id, (courses) => {
    fetchProgress(courses[0].id, (progress) => {
      fetchScore(progress.id, (score) => {
        // Deeply nested — hard to read and maintain
      })
    })
  })
})
\`\`\`

## 3. Promises

Promises represent a value that will be available in the future:

\`\`\`javascript
// Promise has 3 states: pending, fulfilled, rejected

fetch("/api/courses")
  .then(response => response.json())   // runs when fulfilled
  .then(data => {
    console.log(data)
    setCourses(data)
  })
  .catch(error => {
    console.error(error)               // runs when rejected
    setError(error.message)
  })
  .finally(() => {
    setLoading(false)                  // always runs
  })
\`\`\`

## 4. Async/Await

Async/await is syntactic sugar over Promises — cleaner and easier to read:

\`\`\`javascript
// Basic async/await
const fetchCourses = async () => {
  const response = await fetch("/api/courses")
  const data = await response.json()
  return data
}

// With error handling
const fetchCourses = async () => {
  try {
    const response = await fetch("/api/courses")

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch courses:", error.message)
    throw error  // re-throw so caller can handle
  } finally {
    setLoading(false)
  }
}
\`\`\`

## 5. Async in React useEffect

\`\`\`jsx
// Wrong — cannot make useEffect itself async
useEffect(async () => {  // This is wrong!
  const data = await fetchCourses()
}, [])

// Correct — create inner async function
useEffect(() => {
  const loadCourses = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/courses")
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  loadCourses()
}, [])

// Full component example
function CourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/courses")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setCourses(data.courses)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return <ul>{courses.map(c => <li key={c._id}>{c.title}</li>)}</ul>
}
\`\`\`

## 6. Promise.all — Parallel Requests

Run multiple requests at the same time instead of one after another:

\`\`\`javascript
// Sequential — slow, takes 3 seconds total
const user = await fetchUser(1)      // 1 second
const courses = await fetchCourses() // 1 second
const settings = await fetchSettings() // 1 second

// Parallel — fast, takes 1 second total
const [user, courses, settings] = await Promise.all([
  fetchUser(1),
  fetchCourses(),
  fetchSettings()
])
\`\`\`

## 7. Cancelling Requests — AbortController

Prevent state updates on unmounted components:

\`\`\`javascript
useEffect(() => {
  const controller = new AbortController()

  const fetchData = async () => {
    try {
      const res = await fetch("/api/courses", {
        signal: controller.signal
      })
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request cancelled")
      } else {
        setError(err.message)
      }
    }
  }

  fetchData()

  return () => {
    controller.abort()  // Cancel on unmount
  }
}, [])
\`\`\`

## Common Mistakes

1. Making useEffect itself async — create inner async function
2. Not handling errors with try/catch
3. Not checking response.ok before parsing JSON
4. Running sequential requests when they can be parallel

## Pro Tips

1. Always use try/catch with async/await
2. Check response.ok before calling response.json()
3. Use Promise.all for parallel independent requests
4. Use AbortController to cancel requests on unmount
5. Show loading and error states for better UX

## Interview Questions

**Q1. Difference between synchronous and asynchronous?**
Synchronous blocks execution line by line. Asynchronous lets the program continue while waiting for an operation.

**Q2. What are the three states of a Promise?**
Pending (waiting), fulfilled (resolved successfully), rejected (failed).

**Q3. Why can you not make useEffect async directly?**
useEffect expects either nothing or a cleanup function returned. Async functions return a Promise which React cannot use as cleanup.

**Q4. Difference between Promise.all and Promise.allSettled?**
Promise.all rejects immediately if any promise fails. Promise.allSettled waits for all promises regardless of success or failure.

**Q5. What is async/await?**
Syntactic sugar over Promises that lets you write asynchronous code that looks synchronous. The await keyword pauses execution inside an async function until the Promise resolves.

## Summary

- JavaScript is single-threaded — async prevents blocking
- Promises represent future values with three states
- async/await makes async code look synchronous
- Always use try/catch with async/await
- Never make useEffect itself async — use inner function
- Use Promise.all for parallel requests
- Use AbortController to cancel on component unmount`
  },
]