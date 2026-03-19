export const jsAdvModule1Lessons = [
  {
    order: 1,
    title: 'Understanding Scope & Closures',
    duration: 30,
    isFree: true,
    content: `# Understanding Scope & Closures

## Scope Types

JavaScript has 3 types of scope: global, function, and block.

\`\`\`javascript
// Global scope
const globalVar = 'I am global'

function myFunction() {
  // Function scope
  const functionVar = 'I am in function'

  if (true) {
    // Block scope (let, const)
    const blockVar = 'I am in block'
    console.log(globalVar) // accessible
    console.log(functionVar) // accessible
    console.log(blockVar) // accessible
  }

  console.log(blockVar) // ReferenceError: blockVar not defined
}

console.log(globalVar) // accessible
console.log(functionVar) // ReferenceError
\`\`\`

## Scope Chain

When you reference a variable, JavaScript looks for it:
1. In current scope
2. In parent scope
3. In global scope
4. Throws ReferenceError if not found

\`\`\`javascript
const global = 'global'

function outer() {
  const outer_var = 'outer'

  function inner() {
    const inner_var = 'inner'
    console.log(inner_var)  // 'inner' - local
    console.log(outer_var)  // 'outer' - parent scope
    console.log(global)     // 'global' - global scope
  }

  inner()
}

outer()
\`\`\`

## Closures

A closure is a function that has access to variables from its outer scope even after the outer function has returned.

\`\`\`javascript
function makeCounter() {
  let count = 0 // enclosed variable

  return function increment() {
    count++
    return count
  }
}

const counter = makeCounter()
console.log(counter()) // 1
console.log(counter()) // 2
console.log(counter()) // 3

// count is NOT accessible directly
console.log(count) // ReferenceError
\`\`\`

## Practical Closure Uses

**Private variables:**
\`\`\`javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance // private

  return {
    deposit: (amount) => {
      balance += amount
      return balance
    },
    withdraw: (amount) => {
      balance -= amount
      return balance
    },
    getBalance: () => balance,
  }
}

const account = createBankAccount(1000)
account.deposit(500)  // 1500
account.withdraw(200) // 1300
console.log(account.getBalance()) // 1300
// Can't access balance directly!
\`\`\`

**Creating factory functions:**
\`\`\`javascript
function makeGreeter(greeting) {
  return function(name) {
    return \`\${greeting}, \${name}!\`
  }
}

const sayHello = makeGreeter('Hello')
const sayHi = makeGreeter('Hi')

console.log(sayHello('John'))  // 'Hello, John!'
console.log(sayHi('Jane'))     // 'Hi, Jane!'
\`\`\`

## Hoisting & Closures

\`\`\`javascript
// var is hoisted (moved to top, initialized as undefined)
console.log(hoistedVar) // undefined (not error!)
var hoistedVar = 5

// let/const throw ReferenceError in temporal dead zone
console.log(hoistedLet) // ReferenceError
let hoistedLet = 5
\`\`\`

## Interview Question

**Q: What does a closure remember?**

A: A closure captures and remembers:
1. Variables from its parent function
2. Global variables
3. Its own local variables

The parent function can return, but the closure still has access to those variables. This is the core of JavaScript's data privacy pattern.
`,
  },
  {
    order: 2,
    title: 'Prototypes & Prototype Chain',
    duration: 35,
    isFree: true,
    content: `# Prototypes & Prototype Chain

## What is a Prototype?

In JavaScript, objects inherit from other objects. Every object has a hidden [[Prototype]] property that links to another object.

\`\`\`javascript
const parent = {
  greet() {
    return \`Hello, I'm \${this.name}\`
  }
}

const child = Object.create(parent)
child.name = 'John'

console.log(child.greet()) // "Hello, I'm John"
console.log(child.hasOwnProperty('greet')) // false (inherited)
\`\`\`

## Constructor Functions

Before ES6 classes, functions were used as constructors:

\`\`\`javascript
function User(name, email) {
  this.name = name
  this.email = email
}

// Methods go on prototype
User.prototype.getInfo = function() {
  return \`\${this.name} <\${this.email}>\`
}

const user1 = new User('John', 'john@example.com')
const user2 = new User('Jane', 'jane@example.com')

console.log(user1.getInfo()) // 'John <john@example.com>'
console.log(user1.getInfo === user2.getInfo) // true (same function in memory)
\`\`\`

## Prototype Chain

When accessing a property:
1. Check own properties
2. Check prototype
3. Check prototype's prototype (chain)
4. Return undefined

\`\`\`javascript
const animal = { type: 'unknown' }
const dog = Object.create(animal)
dog.breed = 'Labrador'
const myDog = Object.create(dog)
myDog.name = 'Buddy'

// When accessing myDog.type:
// 1. Has myDog.type? No
// 2. Has dog.type? No
// 3. Has animal.type? Yes! Return 'unknown'

console.log(myDog.type) // 'unknown'
console.log(myDog.breed) // 'Labrador'
console.log(myDog.name) // 'Buddy'
\`\`\`

## Array Prototype Chain

\`\`\`javascript
const arr = [1, 2, 3]

// arr has methods like map, filter, etc.
console.log(arr.map(x => x * 2)) // [2, 4, 6]

// These come from Array.prototype
console.log(arr.__proto__ === Array.prototype) // true (in most browsers)

// Array.prototype inherits from Object.prototype
console.log(Array.prototype.__proto__ === Object.prototype) // true
\`\`\`

## ES6 Classes (Syntactic Sugar)

Classes are just syntactic sugar over prototypes:

\`\`\`javascript
class User {
  constructor(name) {
    this.name = name
  }

  greet() {
    return \`Hello, I'm \${this.name}\`
  }
}

// Equivalent to:
function User(name) {
  this.name = name
}
User.prototype.greet = function() {
  return \`Hello, I'm \${this.name}\`
}

// Both work the same way!
\`\`\`

## Inheritance

\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name
  }
  speak() {
    return \`\${this.name} makes a sound\`
  }
}

class Dog extends Animal {
  speak() {
    return \`\${this.name} barks\`
  }
}

const dog = new Dog('Rex')
console.log(dog.speak()) // 'Rex barks'
console.log(dog instanceof Dog) // true
console.log(dog instanceof Animal) // true
\`\`\`

## Interview Question

**Q: Why do we put methods on prototypes instead of in the constructor?**

A: Memory efficiency! If you define methods in the constructor, each instance creates a new copy of the method. With prototypes, all instances share the same method in memory.

Constructor approach (wasteful):
\`\`\`javascript
function User(name) {
  this.name = name
  this.greet = function() { return this.name } // NEW copy for each instance
}
\`\`\`

Prototype approach (efficient):
\`\`\`javascript
function User(name) {
  this.name = name
}
User.prototype.greet = function() { return this.name } // SHARED
\`\`\`
`,
  },
  {
    order: 3,
    title: 'this, call, apply, bind',
    duration: 25,
    isFree: false,
    content: `# Understanding "this", call, apply, bind

## What is "this"?

"this" refers to the object that is executing the current function. Its value depends on HOW the function is called.

\`\`\`javascript
const user = {
  name: 'John',
  greet() {
    console.log(\`Hello, I'm \${this.name}\`)
  }
}

user.greet() // "Hello, I'm John" - this = user
\`\`\`

## Different "this" Contexts

\`\`\`javascript
// 1. Method call - this = object
const obj = {
  name: 'Object',
  method() { console.log(this.name) }
}
obj.method() // 'Object'

// 2. Function call - this = window (or undefined in strict mode)
function standalone() {
  console.log(this)
}
standalone() // window object (or undefined, depending on mode)

// 3. Constructor - this = new object
function User(name) {
  this.name = name
}
const user = new User('John')
console.log(user.name) // 'John'

// 4. Arrow functions - this = parent scope (lexical)
const arrow = () => {
  console.log(this) // inherits from outer scope
}
\`\`\`

## The Call Method

\`call\` invokes a function with a specified "this" value:

\`\`\`javascript
const person1 = { name: 'John', age: 25 }
const person2 = { name: 'Jane', age: 30 }

function introduce() {
  return \`My name is \${this.name} and I'm \${this.age} years old\`
}

console.log(introduce.call(person1)) // 'My name is John and I'm 25 years old'
console.log(introduce.call(person2)) // 'My name is Jane and I'm 30 years old'

// call with arguments
function greet(greeting, punctuation) {
  return \`\${greeting}, I'm \${this.name}\${punctuation}\`
}

greet.call(person1, 'Hello', '!') // 'Hello, I'm John!'
\`\`\`

## The Apply Method

\`apply\` is like \`call\` but takes arguments as an array:

\`\`\`javascript
function sum(a, b, c) {
  return a + b + c + this.bonus
}

const context = { bonus: 10 }

console.log(sum.call(context, 1, 2, 3))     // 16
console.log(sum.apply(context, [1, 2, 3])) // 16 (same result, different syntax)

// apply is useful with array spread
const numbers = [1, 2, 3]
console.log(Math.max.apply(null, numbers)) // 3
// Equivalent: Math.max(...numbers)
\`\`\`

## The Bind Method

\`bind\` creates a new function with a fixed "this" value:

\`\`\`javascript
const user = {
  name: 'John',
  greet() {
    console.log(\`Hello, I'm \${this.name}\`)
  }
}

const greet = user.greet
greet() // Error! "this" is undefined

// Fix with bind
const boundGreet = user.greet.bind(user)
boundGreet() // 'Hello, I'm John'

// Partial application with bind
function add(a, b) {
  return a + b
}

const add5 = add.bind(null, 5)
console.log(add5(3)) // 8
\`\`\`

## Common Use Cases

**Event Listeners:**
\`\`\`javascript
class Button {
  constructor(label) {
    this.label = label
  }

  onClick() {
    console.log(\`\${this.label} clicked\`)
  }
}

const btn = new Button('Submit')
// Wrong - this is lost
document.getElementById('btn').addEventListener('click', btn.onClick)

// Correct - bind fixes this
document.getElementById('btn').addEventListener('click', btn.onClick.bind(btn))

// Or use arrow function in class
class BetterButton {
  constructor(label) {
    this.label = label
  }

  onClick = () => {
    console.log(\`\${this.label} clicked\`)
  }
}
\`\`\`

## Interview Question

**Q: When would you use call vs apply vs bind?**

A:
- **call**: When you know arguments in advance
- **apply**: When you have arguments in an array
- **bind**: When you need a new function with fixed "this" (event handlers, timers)
`,
  },
  {
    order: 4,
    title: 'Advanced Array Methods',
    duration: 20,
    isFree: false,
    content: `# Advanced Array Methods

## map, filter, reduce

### map - Transform Each Element

\`\`\`javascript
const numbers = [1, 2, 3, 4]
const doubled = numbers.map(n => n * 2)
console.log(doubled) // [2, 4, 6, 8]

// With objects
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
]
const names = users.map(u => u.name)
console.log(names) // ['John', 'Jane']
\`\`\`

### filter - Keep Matching Elements

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5, 6]
const even = numbers.filter(n => n % 2 === 0)
console.log(even) // [2, 4, 6]

// Complex filtering
const users = [
  { name: 'John', age: 25, active: true },
  { name: 'Jane', age: 30, active: false },
  { name: 'Bob', age: 22, active: true },
]
const activeAdults = users.filter(u => u.active && u.age >= 25)
console.log(activeAdults) // [{ name: 'John', ... }]
\`\`\`

### reduce - Combine into Single Value

\`\`\`javascript
const numbers = [1, 2, 3, 4]
const sum = numbers.reduce((acc, n) => acc + n, 0)
console.log(sum) // 10

// Build object from array
const items = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']
const count = items.reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1
  return acc
}, {})
console.log(count) // { apple: 3, banana: 2, orange: 1 }

// Chaining operations
const total = [1, 2, 3, 4]
  .filter(n => n > 2)
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0)
console.log(total) // 14 (3*2 + 4*2 = 6 + 8)
\`\`\`

## find, findIndex, some, every

\`\`\`javascript
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' },
]

// find - first matching element
const user = users.find(u => u.id === 2)
console.log(user) // { id: 2, name: 'Jane' }

// findIndex - index of first match
const index = users.findIndex(u => u.name === 'Bob')
console.log(index) // 2

// some - is there at least one match?
const hasJohn = users.some(u => u.name === 'John')
console.log(hasJohn) // true

// every - do all match?
const allHaveId = users.every(u => u.id)
console.log(allHaveId) // true
\`\`\`

## Practical Examples

**Data Transformation:**
\`\`\`javascript
const products = [
  { name: 'Laptop', price: 1000, category: 'electronics' },
  { name: 'Phone', price: 500, category: 'electronics' },
  { name: 'Book', price: 20, category: 'books' },
]

// Get expensive items with discounts applied
const sale = products
  .filter(p => p.price > 100)
  .map(p => ({
    ...p,
    price: p.price * 0.9, // 10% off
    onSale: true
  }))

console.log(sale)
// [
//   { name: 'Laptop', price: 900, category: 'electronics', onSale: true },
//   { name: 'Phone', price: 450, category: 'electronics', onSale: true }
// ]
\`\`\`

**Grouping Data:**
\`\`\`javascript
const scores = [
  { student: 'John', score: 85 },
  { student: 'Jane', score: 92 },
  { student: 'Bob', score: 85 },
  { student: 'Alice', score: 92 },
]

const byScore = scores.reduce((acc, item) => {
  const score = item.score
  if (!acc[score]) acc[score] = []
  acc[score].push(item.student)
  return acc
}, {})

console.log(byScore)
// {
//   '85': ['John', 'Bob'],
//   '92': ['Jane', 'Alice']
// }
\`\`\`

## Interview Question

**Q: When would you use reduce instead of a for loop?**

A: Reduce is great for:
1. Computing a single value from an array
2. Transforming into a different data structure
3. Functional programming style (immutability)

However, for side effects or early exits, loops are sometimes clearer.
`,
  },
]
