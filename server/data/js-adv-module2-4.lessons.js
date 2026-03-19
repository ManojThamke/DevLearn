export const jsAdvModule2Lessons = [
  {
    order: 1,
    title: 'Object-Oriented Programming',
    duration: 30,
    isFree: true,
    content: `# Object-Oriented Programming in JavaScript

## Classes vs Prototypes

JavaScript has two ways to do OOP:

### Constructor Functions (Old Way)

\`\`\`javascript
function User(name, email) {
  this.name = name
  this.email = email
}

User.prototype.getInfo = function() {
  return \`\${this.name} (\${this.email})\`
}

const user = new User('John', 'john@example.com')
console.log(user.getInfo()) // "John (john@example.com)"
\`\`\`

### ES6 Classes (Modern Way)

\`\`\`javascript
class User {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  getInfo() {
    return \`\${this.name} (\${this.email})\`
  }
}

const user = new User('John', 'john@example.com')
console.log(user.getInfo()) // "John (john@example.com)"
\`\`\`

**Note:** ES6 classes are just syntactic sugar over prototypes!

## Inheritance

### Prototype-Based Inheritance

\`\`\`javascript
class Person {
  constructor(name) {
    this.name = name
  }

  greet() {
    console.log(\`Hello, I'm \${this.name}\`)
  }
}

class Developer extends Person {
  constructor(name, language) {
    super(name)  // Call parent constructor
    this.language = language
  }

  code() {
    console.log(\`\${this.name} codes in \${this.language}\`)
  }
}

const dev = new Developer('Alice', 'JavaScript')
dev.greet()  // Hello, I'm Alice
dev.code()   // Alice codes in JavaScript
\`\`\`

## Encapsulation (Private Fields)

\`\`\`javascript
class BankAccount {
  #balance = 0  // Private field (# syntax)

  constructor(initialBalance) {
    this.#balance = initialBalance
  }

  deposit(amount) {
    this.#balance += amount
    return this.#balance
  }

  getBalance() {
    return this.#balance
  }
}

const account = new BankAccount(100)
console.log(account.getBalance())  // 100
console.log(account.#balance)      // ❌ Error: Private field
\`\`\`

## Static Methods

\`\`\`javascript
class MathUtils {
  static add(a, b) {
    return a + b
  }

  static multiply(a, b) {
    return a * b
  }
}

console.log(MathUtils.add(5, 3))        // 8
console.log(MathUtils.multiply(5, 3))  // 15

const utils = new MathUtils()
console.log(utils.add(5, 3))  // ❌ Error: Can't call static method
\`\`\`

## Getters & Setters

\`\`\`javascript
class Rectangle {
  constructor(width, height) {
    this._width = width
    this._height = height
  }

  get area() {
    return this._width * this._height
  }

  set width(newWidth) {
    if (newWidth <= 0) throw new Error('Width must be positive')
    this._width = newWidth
  }

  get width() {
    return this._width
  }
}

const rect = new Rectangle(5, 10)
console.log(rect.area)   // 50
rect.width = 8
console.log(rect.area)   // 80
rect.width = -1          // ❌ Error
\`\`\`

## Composition vs Inheritance

### Inheritance (More rigid)

\`\`\`javascript
class Animal {
  eat() { console.log('Eating...') }
}

class Dog extends Animal {
  bark() { console.log('Woof!') }
}

const dog = new Dog()
dog.eat()   // Eating...
dog.bark()  // Woof!
\`\`\`

### Composition (More flexible)

\`\`\`javascript
const eater = {
  eat() { console.log('Eating...') }
}

const barker = {
  bark() { console.log('Woof!') }
}

const dog = Object.assign({}, eater, barker)
dog.eat()   // Eating...
dog.bark()  // Woof!
\`\`\`

**Tip:** Prefer composition for flexibility!`,
  },
  {
    order: 2,
    title: 'Functional Programming Concepts',
    duration: 25,
    isFree: false,
    content: `# Functional Programming Concepts

## Pure Functions

A pure function:
- Returns the same output for same input
- Has no side effects

\`\`\`javascript
// ❌ NOT pure (depends on external variable)
let multiplier = 2
const multiply = (x) => x * multiplier

// ✅ Pure (self-contained)
const multiply = (x, multiplier) => x * multiplier

// ❌ NOT pure (side effect)
let total = 0
const addToTotal = (x) => {
  total += x
  return total
}

// ✅ Pure
const addNumbers = (a, b) => a + b
\`\`\`

## Immutability

Never modify original data:

\`\`\`javascript
// ❌ Mutates original
const user = { name: 'John', age: 30 }
user.age = 31

// ✅ Creates new object
const user = { name: 'John', age: 30 }
const updatedUser = { ...user, age: 31 }

// ❌ Mutates array
const nums = [1, 2, 3]
nums.push(4)

// ✅ Creates new array
const nums = [1, 2, 3]
const newNums = [...nums, 4]
\`\`\`

## Higher-Order Functions

\`\`\`javascript
// Takes a function
const withLogging = (fn) => {
  return (...args) => {
    console.log('Calling function...')
    const result = fn(...args)
    console.log('Result:', result)
    return result
  }
}

const add = (a, b) => a + b
const loggedAdd = withLogging(add)
loggedAdd(2, 3)

// Returns a function
const createGreeter = (greeting) => {
  return (name) => \`\${greeting}, \${name}!\`
}

const sayHello = createGreeter('Hello')
console.log(sayHello('Alice'))  // Hello, Alice!
\`\`\`

## Array Methods

\`\`\`javascript
const nums = [1, 2, 3, 4, 5]

// map - Transform
const doubled = nums.map(x => x * 2)  // [2, 4, 6, 8, 10]

// filter - Keep elements
const evens = nums.filter(x => x % 2 === 0)  // [2, 4]

// reduce - Combine into single value
const sum = nums.reduce((acc, x) => acc + x, 0)  // 15

// Chaining
const result = nums
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .reduce((acc, x) => acc + x, 0)
// 2*2 + 4*2 = 12
\`\`\`

## Currying

\`\`\`javascript
// Before
const add = (a, b, c) => a + b + c
add(1, 2, 3)  // 6

// After - Curried
const curriedAdd = (a) => (b) => (c) => a + b + c
curriedAdd(1)(2)(3)  // 6

// Partial application
const add1 = curriedAdd(1)
const add1and2 = add1(2)
const result = add1and2(3)  // 6
\`\`\``,
  },
  {
    order: 3,
    title: 'Design Patterns',
    duration: 30,
    isFree: false,
    content: `# JavaScript Design Patterns

## Singleton Pattern

Only one instance:

\`\`\`javascript
class Database {
  static instance = null

  constructor() {
    if (Database.instance) {
      return Database.instance
    }
    this.connection = null
    Database.instance = this
  }

  connect() {
    this.connection = 'Connected to DB'
  }
}

const db1 = new Database()
const db2 = new Database()
console.log(db1 === db2)  // true
\`\`\`

## Factory Pattern

Create objects without specifying classes:

\`\`\`javascript
class CarFactory {
  static createCar(type) {
    switch(type) {
      case 'sedan':
        return new Sedan()
      case 'suv':
        return new SUV()
      default:
        throw new Error('Unknown car type')
    }
  }
}

class Sedan {
  drive() { return 'Sedan driving' }
}
class SUV {
  drive() { return 'SUV driving off-road' }
}

const car = CarFactory.createCar('sedan')
console.log(car.drive())
\`\`\`

## Observer Pattern

\`\`\`javascript
class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
}

const emitter = new EventEmitter()
emitter.on('user:signup', (user) => {
  console.log(\`Welcome \${user.name}!\`)
})

emitter.emit('user:signup', { name: 'Alice' })
\`\`\`

## Decorator Pattern

\`\`\`javascript
const logDecorator = (fn) => {
  return (...args) => {
    console.log(\`Calling \${fn.name}\`)
    return fn(...args)
  }
}

const multiply = (a, b) => a * b
const loggedMultiply = logDecorator(multiply)
loggedMultiply(3, 4)  // Logs: Calling multiply
\`\`\`

## Module Pattern

\`\`\`javascript
const calculator = (() => {
  let result = 0

  return {
    add(x) {
      result += x
      return this
    },
    multiply(x) {
      result *= x
      return this
    },
    getResult() {
      return result
    }
  }
})()

calculator.add(5).multiply(2).add(3)
console.log(calculator.getResult())  // 13
\`\`\``,
  },
  {
    order: 4,
    title: 'Error Handling & Debugging',
    duration: 20,
    isFree: false,
    content: `# Error Handling & Debugging

## Error Types

\`\`\`javascript
// SyntaxError
const x = { invalid: }

// ReferenceError
console.log(undefinedVar)

// TypeError
const x = 5
x.toUpperCase()

// Custom Error
class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}
\`\`\`

## Try-Catch-Finally

\`\`\`javascript
try {
  JSON.parse('invalid json')
} catch (error) {
  console.error('Error:', error.message)
} finally {
  console.log('Cleanup complete')
}
\`\`\`

## Async Error Handling

\`\`\`javascript
// Promise chains
fetch('/data')
  .then(res => res.json())
  .catch(error => console.error(error))

// Async/await
async function fetchData() {
  try {
    const res = await fetch('/data')
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}
\`\`\`

## Debugging

\`\`\`javascript
console.log('Info')
console.warn('Warning')
console.error('Error')
console.table([{ name: 'John' }, { name: 'Jane' }])

console.time('timer')
// code
console.timeEnd('timer')

// Debugger
function complex() {
  debugger  // Pauses in DevTools
  return 'result'
}
\`\`\``,
  },
]

export const jsAdvModule3Lessons = [
  {
    order: 1,
    title: 'Promises Deep Dive',
    duration: 25,
    isFree: true,
    content: `# Promises Deep Dive

## Promise States

\`\`\`
pending → fulfilled (resolve) or rejected (reject)
\`\`\`

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!')
  }, 1000)
})

promise
  .then(value => console.log(value))
  .catch(error => console.error(error))
\`\`\`

## Promise Chaining

\`\`\`javascript
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(\`/api/posts/\${user.id}\`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(error => console.error(error))
\`\`\`

## Common Mistakes

\`\`\`javascript
// ❌ Not returning in then
fetch('/data')
  .then(res => res.json())  // Need return!
  .then(data => console.log(data))  // undefined

// ✅ Correct
fetch('/data')
  .then(res => res.json())
  .then(data => {
    console.log(data)
    return data
  })
\`\`\`

## Promise Utilities

\`\`\`javascript
// Wait for all
Promise.all([fetch('/users'), fetch('/posts')])

// First to complete
Promise.race([promise1, promise2])

// First to succeed
Promise.any([promise1, promise2])

// All results
Promise.allSettled([promise1, promise2])
\`\`\``,
  },
  {
    order: 2,
    title: 'Async/Await Mastery',
    duration: 20,
    isFree: true,
    content: `# Async/Await Mastery

## Async Functions

\`\`\`javascript
// Without async
function getData() {
  return Promise.resolve([1, 2, 3])
}

// With async (cleaner)
async function getData() {
  return [1, 2, 3]  // Auto-wrapped in Promise
}
\`\`\`

## Await Expression

\`\`\`javascript
async function example() {
  // Pauses until promise resolves
  const result = await someLongRunningTask()
  console.log(result)
}
\`\`\`

## Sequential vs Parallel

\`\`\`javascript
// ❌ SLOW - Sequential
async function slowFetch() {
  const user = await fetch('/user')      // 1 sec
  const posts = await fetch('/posts')    // 1 sec (total: 2 sec)
}

// ✅ FAST - Parallel
async function fastFetch() {
  const [user, posts] = await Promise.all([
    fetch('/user'),
    fetch('/posts')
  ])  // Total: 1 sec
}
\`\`\`

## Error Handling

\`\`\`javascript
async function getUserData(userId) {
  try {
    const user = await fetch(\`/api/users/\${userId}\`)
    return user.json()
  } catch (error) {
    console.error('Failed to fetch:', error)
    return null
  } finally {
    console.log('Request complete')
  }
}
\`\`\`

## Looping with Async

\`\`\`javascript
// ✅ Sequential
for (const id of ids) {
  const user = await fetchUser(id)
}

// ✅ Parallel
const users = await Promise.all(ids.map(id => fetchUser(id)))
\`\`\``,
  },
  {
    order: 3,
    title: 'Event Loop & Microtasks',
    duration: 30,
    isFree: false,
    content: `# Event Loop & Microtasks

## Execution Model

\`\`\`
1. Sync code (Call Stack)
2. Microtasks (Promises, MutationObserver)
3. Macrotasks (setTimeout, setInterval)
4. Repeat from step 2
\`\`\`

## Example

\`\`\`javascript
console.log('1: Start')

setTimeout(() => {
  console.log('4: setTimeout')
}, 0)

Promise.resolve()
  .then(() => console.log('2: Promise 1'))
  .then(() => console.log('3: Promise 2'))

console.log('5: End')

// Output:
// 1: Start
// 5: End
// 2: Promise 1
// 3: Promise 2
// 4: setTimeout
\`\`\`

## Why This Order?

1. Sync code runs first (1, 5)
2. All microtasks before next macrotask (2, 3)
3. Then macrotask (4)

## Macrotask Queue

\`\`\`javascript
setTimeout(() => console.log('Macrotask 1'), 0)
Promise.resolve().then(() => console.log('Microtask 1'))
setTimeout(() => console.log('Macrotask 2'), 0)
Promise.resolve().then(() => console.log('Microtask 2'))

// Output:
// Microtask 1
// Microtask 2
// Macrotask 1
// Macrotask 2
\`\`\`

## requestAnimationFrame

\`\`\`javascript
requestAnimationFrame(() => {
  console.log('rAF')
})

Promise.resolve().then(() => {
  console.log('Promise')
})

setTimeout(() => {
  console.log('setTimeout')
}, 0)

// Output:
// Promise
// rAF
// setTimeout
\`\`\``,
  },
  {
    order: 4,
    title: 'Generators & Iterators',
    duration: 25,
    isFree: false,
    content: `# Generators & Iterators

## Iterators

\`\`\`javascript
const iterator = {
  nums: [1, 2, 3],
  index: 0,
  [Symbol.iterator]() {
    return this
  },
  next() {
    if (this.index < this.nums.length) {
      return { value: this.nums[this.index++], done: false }
    }
    return { done: true }
  }
}

for (const val of iterator) {
  console.log(val)  // 1, 2, 3
}
\`\`\`

## Generator Functions

\`\`\`javascript
function* simpleGenerator() {
  yield 1
  yield 2
  yield 3
}

const gen = simpleGenerator()
console.log(gen.next())  // { value: 1, done: false }
console.log(gen.next())  // { value: 2, done: false }
console.log(gen.next())  // { value: 3, done: false }
console.log(gen.next())  // { done: true }

// Or use for...of
for (const val of simpleGenerator()) {
  console.log(val)  // 1, 2, 3
}
\`\`\`

## Infinite Sequences

\`\`\`javascript
function* infiniteCounter() {
  let n = 0
  while (true) {
    yield n++
  }
}

const counter = infiniteCounter()
console.log(counter.next().value)  // 0
console.log(counter.next().value)  // 1

function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

console.log([...range(1, 5)])  // [1, 2, 3, 4, 5]
\`\`\`

## Generator Delegation

\`\`\`javascript
function* gen1() {
  yield 1
  yield 2
}

function* gen2() {
  yield* gen1()  // Delegate
  yield 3
}

console.log([...gen2()])  // [1, 2, 3]
\`\`\`

## Real-World Use: Lazy Evaluation

\`\`\`javascript
function* lazyRange(start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

// Computed only when needed
const nums = lazyRange(1, 1000000)
for (const n of nums) {
  console.log(n)
  if (n === 100) break  // Stops, doesn't compute rest
}
\`\`\``,
  },
]

export const jsAdvModule4Lessons = [
  {
    order: 1,
    title: 'Higher-Order Functions',
    duration: 25,
    isFree: true,
    content: `# Higher-Order Functions

## Functions Taking Functions

\`\`\`javascript
const withLogging = (fn) => {
  return (...args) => {
    console.log('Calling...')
    const result = fn(...args)
    console.log('Done:', result)
    return result
  }
}

const add = (a, b) => a + b
const loggedAdd = withLogging(add)
loggedAdd(2, 3)  // Logs: Calling..., Done: 5
\`\`\`

## Functions Returning Functions

\`\`\`javascript
const createGreeter = (greeting) => {
  return (name) => \`\${greeting}, \${name}!\`
}

const sayHello = createGreeter('Hello')
console.log(sayHello('Alice'))  // Hello, Alice!
\`\`\`

## Currying

\`\`\`javascript
const curriedAdd = (a) => (b) => (c) => a + b + c
curriedAdd(1)(2)(3)  // 6

// Partial application
const add1 = curriedAdd(1)
const add1and2 = add1(2)
console.log(add1and2(3))  // 6
\`\`\`

## Function Composition

\`\`\`javascript
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x)

const addTwo = (x) => x + 2
const multiplyByThree = (x) => x * 3
const square = (x) => x * x

const process = compose(square, multiplyByThree, addTwo)
console.log(process(5))  // ((5 + 2) * 3)² = 441
\`\`\``,
  },
  {
    order: 2,
    title: 'Immutability Patterns',
    duration: 20,
    isFree: false,
    content: `# Immutability Patterns

## Object Immutability

\`\`\`javascript
// ❌ Mutates
const user = { name: 'John', age: 30 }
user.age = 31

// ✅ Immutable
const user = { name: 'John', age: 30 }
const updatedUser = { ...user, age: 31 }

// ✅ Object.assign
const updatedUser = Object.assign({}, user, { age: 31 })

// ✅ Object.freeze (prevents changes)
const frozenUser = Object.freeze({ name: 'John' })
frozenUser.name = 'Jane'  // No error but doesn't change
\`\`\`

## Array Immutability

\`\`\`javascript
// ❌ Mutates
const nums = [1, 2, 3]
nums.push(4)

// ✅ Immutable
const nums = [1, 2, 3]
const newNums = [...nums, 4]

// ✅ slice, concat, map
const newNums = nums.concat(4)
const doubled = nums.map(x => x * 2)

// ✅ Removing
const withoutFirst = nums.slice(1)

// ✅ Updating
const updated = nums.map((x, i) => i === 1 ? 99 : x)
\`\`\`

## Structural Sharing

\`\`\`javascript
const user = {
  name: 'John',
  address: {
    city: 'NYC',
    zip: '10001'
  }
}

// ❌ Mutates nested object
user.address.city = 'LA'

// ✅ Immutable nested update
const updated = {
  ...user,
  address: {
    ...user.address,
    city: 'LA'
  }
}
\`\`\``,
  },
  {
    order: 3,
    title: 'Functional Composition',
    duration: 30,
    isFree: false,
    content: `# Functional Composition

## Compose Utility

\`\`\`javascript
const compose = (...fns) => (x) => {
  return fns.reduceRight((acc, fn) => fn(acc), x)
}

const addTwo = (x) => x + 2
const multiplyByThree = (x) => x * 3
const square = (x) => x * x

const process = compose(square, multiplyByThree, addTwo)
console.log(process(5))
// (((5 + 2) * 3)²) = (21²) = 441
\`\`\`

## Pipe Utility (left to right)

\`\`\`javascript
const pipe = (...fns) => (x) => {
  return fns.reduce((acc, fn) => fn(acc), x)
}

const result = pipe(addTwo, multiplyByThree, square)(5)
// Same as compose but reads left to right
\`\`\`

## Reusable Composition

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5]

// Compose multiple operations
const process = pipe(
  (arr) => arr.filter(x => x % 2 === 0),
  (arr) => arr.map(x => x * 2),
  (arr) => arr.reduce((a, b) => a + b, 0)
)

console.log(process(numbers))  // 2*2 + 4*2 = 12
\`\`\`

## Practical Example

\`\`\`javascript
const getUsers = () => fetch('/api/users').then(r => r.json())
const filterActive = (users) => users.filter(u => u.active)
const sortByName = (users) => users.sort((a, b) => a.name.localeCompare(b.name))
const getNames = (users) => users.map(u => u.name)

const getActiveUserNames = pipe(
  getUsers,
  filterActive,
  sortByName,
  getNames
)

getActiveUserNames().then(names => console.log(names))
\`\`\``,
  },
  {
    order: 4,
    title: 'Performance & Optimization',
    duration: 25,
    isFree: false,
    content: `# JavaScript Performance & Optimization

## Memoization

\`\`\`javascript
// ❌ Slow - recalculates every time
function fibonacci(n) {
  if (n < 2) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// ✅ Fast - memoized
function memoize(fn) {
  const cache = {}
  return (n) => {
    if (n in cache) return cache[n]
    const result = fn(n)
    cache[n] = result
    return result
  }
}

const fastFib = memoize(function fib(n) {
  if (n < 2) return n
  return fastFib(n - 1) + fastFib(n - 2)
})

console.log(fastFib(50))  // Instant!
\`\`\`

## Debouncing

\`\`\`javascript
function debounce(fn, delayMs) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delayMs)
  }
}

// Usage: Search input
const handleSearch = debounce((query) => {
  fetch(\`/api/search?q=\${query}\`)
}, 300)

input.addEventListener('input', (e) => {
  handleSearch(e.target.value)
})
\`\`\`

## Throttling

\`\`\`javascript
function throttle(fn, delayMs) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= delayMs) {
      fn(...args)
      last = now
    }
  }
}

// Usage: Scroll listener
const handleScroll = throttle(() => {
  console.log('Scrolling')
}, 100)

window.addEventListener('scroll', handleScroll)
\`\`\`

## Lazy Loading

\`\`\`javascript
// Load images only when visible
const lazyImages = document.querySelectorAll('img[data-lazy]')

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.lazy
      observer.unobserve(img)
    }
  })
})

lazyImages.forEach(img => observer.observe(img))
\`\`\`

## Batch Updates

\`\`\`javascript
// ❌ Causes multiple reflows
for (let i = 0; i < 1000; i++) {
  element.style.width = i + 'px'  // Reflow each time
}

// ✅ Single reflow
element.style.width = '1000px'

// ✅ Using requestAnimationFrame
function updatePosition() {
  requestAnimationFrame(() => {
    // All DOM updates here
  })
}
\`\`\``,
  },
]
