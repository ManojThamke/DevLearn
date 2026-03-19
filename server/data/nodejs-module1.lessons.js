export const nodeModule1Lessons = [
  {
    order: 1,
    title: 'Node.js Runtime & V8 Engine',
    duration: 20,
    isFree: true,
    content: `# Node.js Runtime & V8 Engine

## What is Node.js?

Node.js is a runtime environment that allows JavaScript to run on the server-side. It uses Google's V8 engine (the same engine Chrome uses) to execute JavaScript outside the browser.

## Before vs After Node.js

**Before Node.js**: JavaScript only ran in browsers
**After Node.js**: JavaScript runs everywhere — backend, servers, databases, IoT devices

## How Node.js Works

\`\`\`
┌─────────────┐
│ JavaScript  │
│   Code      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Node.js     │── Provides APIs: fs, http, path
│ Platform    │── Event loop, async features
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ V8 Engine   │── Compiles JS to machine code
│ (Chrome)    │── Manages memory & garbage collection
└─────────────┘
\`\`\`

## Key Differences from Browser JavaScript

| Browser JS | Node.js |
|-----------|---------|
| DOM APIs | File System (fs) |
| window object | global object |
| No file system | Full file system access |
| Network restricted | Full network access |
| Local storage | Environment variables |

## Installation & First Program

Install Node.js from nodejs.org (includes npm)

\`\`\`bash
node --version
# v18.12.0 (your version)
\`\`\`

Create a file: \`hello.js\`

\`\`\`javascript
console.log("Hello from Node.js!")
\`\`\`

Run it:

\`\`\`bash
node hello.js
# Hello from Node.js!
\`\`\`

## The Event Loop

Node.js is single-threaded but handles concurrency through the event loop:

1. **Call Stack** — executes synchronous code
2. **Web APIs** — handles async operations (fs, http, timers)
3. **Callback Queue** — holds callbacks ready to execute
4. **Event Loop** — moves callbacks from queue → call stack

## Common Global Objects in Node.js

\`\`\`javascript
// Instead of window, we have global
console.log(global)

// __dirname — current directory
console.log(__dirname)

// __filename — current file
console.log(__filename)

// process — info about Node.js process
console.log(process.version)
console.log(process.env) // environment variables
\`\`\`

## Interview Question

**Q: Why is Node.js single-threaded but can handle concurrent requests?**

A: Node.js uses the event loop model. When a request comes in:
1. Synchronous code executes immediately
2. Async operations (DB queries, file reads) are offloaded to the system
3. When the operation completes, the callback is queued
4. The event loop picks it up when the call stack is empty

This allows one thread to handle thousands of concurrent connections efficiently.
`,
  },
  {
    order: 2,
    title: 'Modules & NPM Packages',
    duration: 25,
    isFree: true,
    content: `# Modules & NPM Packages

## CommonJS Modules

Node.js uses CommonJS module system (different from ES6 imports in browser):

\`\`\`javascript
// math.js (exporting)
function add(a, b) {
  return a + b
}

module.exports = { add }
\`\`\`

\`\`\`javascript
// app.js (importing)
const { add } = require('./math.js')

console.log(add(2, 3)) // 5
\`\`\`

## Module Caching

Node.js caches modules on first require. Subsequent requires return the cached version:

\`\`\`javascript
const math1 = require('./math.js')
const math2 = require('./math.js')

console.log(math1 === math2) // true (same object)
\`\`\`

## Built-in Modules

Node.js comes with powerful built-in modules:

\`\`\`javascript
// File System
const fs = require('fs')
const content = fs.readFileSync('file.txt', 'utf-8')

// Path
const path = require('path')
const fullPath = path.join(__dirname, 'uploads', 'file.txt')

// HTTP
const http = require('http')
const server = http.createServer((req, res) => {
  res.end('Hello World')
})
server.listen(3000)

// OS
const os = require('os')
console.log(os.platform()) // 'win32', 'linux', 'darwin'
console.log(os.cpus().length) // number of CPU cores
\`\`\`

## NPM (Node Package Manager)

npm is the package manager for Node.js. It has 1M+ packages:

\`\`\`bash
# Initialize a Node.js project
npm init -y

# This creates package.json with:
# - name, version, description
# - scripts, dependencies
# - devDependencies
\`\`\`

## package.json & package-lock.json

\`  \`\`json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "mongodb": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
\`\`\`

- **dependencies**: Required in production
- **devDependencies**: Only for development (testing, linting)
- **package-lock.json**: Locks exact versions (reproducible installs)

## Installing Packages

\`\`\`bash
# Install package and save to dependencies
npm install lodash

# Install as devDependency
npm install --save-dev nodemon

# Install specific version
npm install express@4.17.1

# Install from package.json
npm install

# Update packages
npm update

# Remove a package
npm uninstall lodash
\`\`\`

## Creating Your Own Package

You can create a package and publish it to npm:

\`\`\`javascript
// utils.js
const isEmpty = (str) => str.trim() === ''
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

module.exports = { isEmpty, capitalize }
\`\`\`

Others can install and use your package:

\`\`\`bash
npm install your-package-name
\`\`\`

## Interview Question

**Q: What's the difference between dependencies and devDependencies?**

A:
- **dependencies**: Code your app needs to run (lodash, express, mongoose)
- **devDependencies**: Tools for development only (testing, linting, formatting)

When users install your package, they only get dependencies, not devDependencies.
`,
  },
  {
    order: 3,
    title: 'File System (fs) Module',
    duration: 30,
    isFree: false,
    content: `# File System (fs) Module

## Reading Files

\`\`\`javascript
const fs = require('fs')

// Synchronous — blocks execution
const content = fs.readFileSync('data.txt', 'utf-8')
console.log(content)

// Asynchronous — doesn't block
fs.readFile('data.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }
  console.log(data)
})
\`\`\`

## Writing Files

\`\`\`javascript
// Write (overwrites if exists)
fs.writeFileSync('output.txt', 'Hello World')

// Async
fs.writeFile('output.txt', 'Hello World', (err) => {
  if (err) throw err
  console.log('File written!')
})

// Append to file
fs.appendFileSync('log.txt', 'New log entry\\n')
\`\`\`

## Promises Version (Better)

Use fs.promises for cleaner async syntax:

\`\`\`javascript
const fs = require('fs').promises

async function readConfig() {
  try {
    const data = await fs.readFile('config.json', 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to read config:', err)
  }
}

readConfig()
\`\`\`

## Directory Operations

\`\`\`javascript
// Create directory
fs.mkdirSync('uploads')

// List files in directory
const files = fs.readdirSync('./uploads')
console.log(files) // ['file1.txt', 'file2.txt']

// Delete file
fs.unlinkSync('temp.txt')

// Delete directory (must be empty)
fs.rmdirSync('empty-folder')

// Delete recursively (remove folder and all contents)
fs.rmSync('uploads', { recursive: true, force: true })
\`\`\`

## File Information

\`\`\`javascript
const stats = fs.statSync('file.txt')

console.log(stats.isFile()) // true
console.log(stats.isDirectory()) // false
console.log(stats.size) // bytes
console.log(stats.mtime) // modification time
\`\`\`

## Practical Example: Backup System

\`\`\`javascript
const fs = require('fs').promises
const path = require('path')

async function backupFile(source, backupDir) {
  try {
    // Create backup directory if it doesn't exist
    await fs.mkdir(backupDir, { recursive: true })

    // Read source file
    const content = await fs.readFile(source, 'utf-8')

    // Create backup with timestamp
    const filename = path.basename(source)
    const timestamp = new Date().toISOString().slice(0, 10)
    const backupPath = path.join(backupDir, \`\${filename}.backup-\${timestamp}\`)

    // Write backup
    await fs.writeFile(backupPath, content)
    console.log('Backup created:', backupPath)
  } catch (err) {
    console.error('Backup failed:', err.message)
  }
}

backupFile('important.txt', './backups')
\`\`\`

## Interview Question

**Q: Why use async file operations instead of sync?**

A: Synchronous file operations block JavaScript execution. While \`readFileSync\` waits for the file to be read, your app can't handle other requests.

With async operations, the app stays responsive and can handle multiple operations concurrently. This is critical for server applications handling many requests.
`,
  },
  {
    order: 4,
    title: 'Async/Await in Node.js',
    duration: 25,
    isFree: false,
    content: `# Async/Await in Node.js

## From Callbacks to Promises to Async/Await

\`\`\`javascript
// 1. Callback Hell (hard to read)
fs.readFile('file.txt', (err, data1) => {
  if (err) throw err
  fs.readFile('file2.txt', (err, data2) => {
    if (err) throw err
    console.log(data1, data2)
  })
})

// 2. Promises (better)
fs.promises.readFile('file.txt')
  .then(data1 => fs.promises.readFile('file2.txt').then(data2 => ({ data1, data2 })))
  .then(({ data1, data2 }) => console.log(data1, data2))
  .catch(err => console.error(err))

// 3. Async/Await (best — looks synchronous)
async function readFiles() {
  try {
    const data1 = await fs.promises.readFile('file.txt', 'utf-8')
    const data2 = await fs.promises.readFile('file2.txt', 'utf-8')
    console.log(data1, data2)
  } catch (err) {
    console.error(err)
  }
}

readFiles()
\`\`\`

## Understanding Promises

A Promise represents an async operation with 3 states:

1. **Pending** — operation in progress
2. **Fulfilled** — operation succeeded (then)
3. **Rejected** — operation failed (catch)

\`\`\`javascript
function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error('Delay must be positive'))
      return
    }
    setTimeout(() => resolve('Done!'), ms)
  })
}

// Using the promise
delay(1000)
  .then(result => console.log(result)) // 'Done!' after 1 second
  .catch(err => console.error(err))
\`\`\`

## Async Functions

An async function always returns a Promise:

\`\`\`javascript
async function fetchUser(id) {
  if (id < 0) {
    throw new Error('Invalid ID')
  }
  return { id, name: 'John' }
}

fetchUser(1)
  .then(user => console.log(user)) // { id: 1, name: 'John' }
  .catch(err => console.error(err))

fetchUser(-1)
  .catch(err => console.error(err)) // Error: Invalid ID
\`\`\`

## Handling Errors

\`\`\`javascript
async function processData() {
  try {
    const data = await fetchFromAPI()
    const processed = await processWithAI(data)
    return processed
  } catch (err) {
    // Handle all errors
    console.error('Process failed:', err.message)
    throw err // re-throw if needed
  } finally {
    // Runs whether success or error
    console.log('Cleanup done')
  }
}
\`\`\`

## Parallel Operations

\`\`\`javascript
// Bad — runs sequentially (slow)
async function slow() {
  const user = await fetchUser()
  const posts = await fetchPosts()
  const comments = await fetchComments()
}

// Good — runs in parallel (fast)
async function fast() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ])
}

// Good — with error handling
async function waitForAny() {
  const result = await Promise.race([
    fetchFromAPI1(),
    fetchFromAPI2(),
    fetchFromAPI3(),
  ]) // Returns result from whichever finishes first
}
\`\`\`

## Node.js Event Loop & Await

When you \`await\` in Node.js:

1. Execution pauses at that line
2. Event loop continues (can process other requests)
3. When promise resolves, execution resumes

This keeps your server responsive!

\`\`\`javascript
async function handleRequest(req, res) {
  console.log('1. Start')
  const data = await fetchDatabase() // Event loop is free while waiting
  console.log('2. Got data:', data)
  res.json(data)
}

// While request 1 is awaiting database, request 2 can run
\`\`\`

## Interview Question

**Q: What's the difference between \`Promise.all\` and \`Promise.race\`?**

A:
- **Promise.all**: Waits for ALL promises to resolve (or any to reject)
- **Promise.race**: Returns result of FIRST promise to settle (resolve or reject)

Use Promise.all for operations that depend on each other. Use Promise.race when you just need the fastest result.
`,
  },
]