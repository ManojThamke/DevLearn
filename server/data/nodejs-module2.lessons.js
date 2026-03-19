export const nodeModule2Lessons = [
  {
    order: 1,
    title: 'Introduction to Express.js',
    duration: 25,
    isFree: true,
    content: `# Introduction to Express.js

## What is Express?

Express is a minimal and flexible Node.js web framework. It makes building REST APIs and web servers much easier than using Node's built-in \`http\` module.

## Express vs Native Node.js

\`\`\`javascript
// Native Node.js (complex)
const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname

  if (pathname === '/') {
    res.statusCode = 200
    res.end('Home')
  } else if (pathname === '/about') {
    res.statusCode = 200
    res.end('About')
  } else {
    res.statusCode = 404
    res.end('Not Found')
  }
})

server.listen(3000)

// Express (simple and clean)
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Home'))
app.get('/about', (req, res) => res.send('About'))
app.use((req, res) => res.status(404).send('Not Found'))

app.listen(3000)
\`\`\`

## Installing & Setting Up Express

\`\`\`bash
npm install express
\`\`\`

\`\`\`javascript
// index.js
const express = require('express')
const app = express()
const PORT = 3000

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`)
})
\`\`\`

## Routing Basics

\`\`\`javascript
// GET route
app.get('/', (req, res) => {
  res.send('Hello World')
})

// POST route
app.post('/users', (req, res) => {
  res.json({ message: 'User created' })
})

// Route parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id
  res.json({ userId })
})

// Query strings
app.get('/search', (req, res) => {
  const query = req.query.q
  res.json({ results: \`Searching for: \${query}\` })
})
// URL: /search?q=javascript
\`\`\`

## Middleware

Middleware functions execute in order and have access to request and response:

\`\`\`javascript
// Simple middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`)
  next() // pass control to next middleware
})

// JSON parsing middleware
app.use(express.json())

// Custom middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'No token' })
  }
  next()
}

// Using middleware on specific routes
app.get('/protected', authenticate, (req, res) => {
  res.json({ data: 'Secret data' })
})
\`\`\`

## Request & Response Objects

\`\`\`javascript
app.post('/data', (req, res) => {
  // Request
  console.log(req.method)    // 'POST'
  console.log(req.path)      // '/data'
  console.log(req.body)      // parsed JSON body
  console.log(req.query)     // query parameters
  console.log(req.params)    // route parameters
  console.log(req.headers)   // HTTP headers

  // Response
  res.status(200)
  res.json({ success: true })
  // Or: res.status(200).json({ success: true })
})
\`\`\`

## Common HTTP Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Error Handling

\`\`\`javascript
// Try-catch in route
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ error: 'Something went wrong' })
})
\`\`\`

## Interview Question

**Q: What's the role of \`next()\` in Express middleware?**

A: \`next()\` passes control to the next middleware or route handler. If you don't call \`next()\`, the request won't proceed, effectively halting the request cycle. This is useful for authentication — you can return an error in middleware and never call \`next()\`.
`,
  },
  {
    order: 2,
    title: 'REST API Design',
    duration: 35,
    isFree: true,
    content: `# REST API Design

## REST Principles

REST (Representational State Transfer) is an architectural style for web APIs:

1. **Client-Server**: Separation of concerns
2. **Stateless**: Each request is independent
3. **Cacheable**: Responses can be cached
4. **Resource-Based**: URLs represent resources, not actions

## Resource-Based URLs

Bad (action-based):
\`\`\`
GET /getUsers
POST /createUser
POST /updateUser
POST /deleteUser
\`\`\`

Good (resource-based):
\`\`\`
GET /users         # List all users
POST /users        # Create new user
GET /users/:id     # Get specific user
PUT /users/:id     # Update user
DELETE /users/:id  # Delete user
\`\`\`

## HTTP Methods

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resource | Yes |
| POST | Create new resource | No |
| PUT | Update entire resource | Yes |
| PATCH | Partial update | Sometimes |
| DELETE | Delete resource | Yes |

## Request/Response Structure

\`\`\`javascript
// POST /api/users
// Request:
{
  "name": "John Doe",
  "email": "john@example.com"
}

// Response (201):
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}

// Error Response (400):
{
  "error": "Email already exists",
  "status": 400
}
\`\`\`

## Pagination

\`\`\`javascript
app.get('/users', (req, res) => {
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const skip = (page - 1) * limit

  const users = User.find().skip(skip).limit(limit)

  res.json({
    page,
    limit,
    total: User.countDocuments(),
    users,
  })
})

// Usage: GET /users?page=2&limit=5
\`\`\`

## Filtering & Sorting

\`\`\`javascript
app.get('/products', (req, res) => {
  let query = {}

  // Filtering
  if (req.query.category) {
    query.category = req.query.category
  }
  if (req.query.minPrice) {
    query.price = { $gte: req.query.minPrice }
  }

  // Sorting
  let sort = {}
  if (req.query.sortBy) {
    const order = req.query.order === 'desc' ? -1 : 1
    sort[req.query.sortBy] = order
  }

  const products = Product.find(query).sort(sort)
  res.json(products)
})

// Usage: GET /products?category=electronics&minPrice=100&sortBy=price&order=asc
\`\`\`

## Building a User API

\`\`\`javascript
const express = require('express')
const app = express()
app.use(express.json())

let users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
]

let nextId = 3

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users)
})

// GET user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

// CREATE user
app.post('/api/users', (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ error: 'Name and email required' })
  }

  const user = {
    id: nextId++,
    ...req.body,
    createdAt: new Date(),
  }
  users.push(user)
  res.status(201).json(user)
})

// UPDATE user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))
  if (!user) return res.status(404).json({ error: 'User not found' })

  Object.assign(user, req.body)
  res.json(user)
})

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'User not found' })

  const deleted = users.splice(index, 1)
  res.json(deleted[0])
})

app.listen(3000, () => console.log('Server running on port 3000'))
\`\`\`

## Interview Question

**Q: Why is REST API considered stateless?**

A: In a REST API, each request contains all the information needed to process it. The server doesn't store client context between requests. This makes APIs scalable — any server instance can handle any request. Compare this to stateful apps where you need "sticky sessions" to route users to the same server.
`,
  },
  {
    order: 3,
    title: 'Handling JSON & Request Bodies',
    duration: 20,
    isFree: false,
    content: `# Handling JSON & Request Bodies

## JSON Middleware

Express's built-in JSON middleware parses incoming request bodies:

\`\`\`javascript
const express = require('express')
const app = express()

// Parse JSON bodies
app.use(express.json())

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }))

app.post('/users', (req, res) => {
  console.log(req.body) // Parsed JSON
  res.json({ received: req.body })
})
\`\`\`

## Accessing Request Body

\`\`\`javascript
app.post('/users', (req, res) => {
  const { name, email, age } = req.body

  // Validate
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' })
  }

  if (age && (age < 18 || age > 120)) {
    return res.status(400).json({ error: 'Invalid age' })
  }

  // Create user
  const user = { id: Date.now(), name, email, age }
  res.status(201).json(user)
})
\`\`\`

## File Uploads

Use multer middleware for file uploads:

\`\`\`bash
npm install multer
\`\`\`

\`\`\`javascript
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file) // {
                        //   fieldname: 'file',
                        //   originalname: 'image.jpg',
                        //   path: 'uploads/abc123'
                        // }
  res.json({ message: 'File uploaded' })
})
\`\`\`

## Validation & Sanitization

\`\`\`javascript
// Manual validation
app.post('/create-product', (req, res) => {
  const { name, price } = req.body

  // Validate
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid name' })
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Invalid price' })
  }

  // Sanitize
  const product = {
    name: name.trim(),
    price: parseFloat(price),
  }

  res.json(product)
})
\`\`\`

## Using joi for Validation (Better)

\`\`\`bash
npm install joi
\`\`\`

\`\`\`javascript
const joi = require('joi')

const userSchema = joi.object({
  name: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().required(),
  age: joi.number().integer().min(18).max(120),
})

app.post('/users', (req, res) => {
  const { error, value } = userSchema.validate(req.body)

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  // value is sanitized and valid
  res.json({ user: value })
})
\`\`\`

## Response Content Types

\`\`\`javascript
// JSON response
app.get('/json', (req, res) => {
  res.json({ data: 'value' })
})

// HTML response
app.get('/html', (req, res) => {
  res.type('html')
  res.send('<h1>Hello</h1>')
})

// Download file
app.get('/download', (req, res) => {
  res.download('file.pdf', 'report.pdf')
})

// Redirect
app.get('/old-page', (req, res) => {
  res.redirect('/new-page')
})
\`\`\`

## Interview Question

**Q: Why is it important to validate request bodies?**

A: Request validation prevents bugs and security issues:
1. **Type safety**: Ensure data is the expected type
2. **Security**: Prevent injection attacks by sanitizing input
3. **Data integrity**: Validate before saving to database
4. **User experience**: Provide clear error messages

Always validate on the server — don't trust client-side validation alone.
`,
  },
  {
    order: 4,
    title: 'Connecting to MongoDB',
    duration: 30,
    isFree: false,
    content: `# Connecting to MongoDB

## MongoDB Basics

MongoDB is a NoSQL document database. Data is stored as JSON-like documents:

\`\`\`json
{
  "_id": "60d5ec49c1234567890abcd1",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 28,
  "createdAt": "2024-01-15T10:30:00Z"
}
\`\`\`

## Installing MongoDB Driver

\`\`\`bash
npm install mongoose
# or
npm install mongodb
\`\`\`

## Connecting with Mongoose

Mongoose is an ODM (Object Document Mapper) that makes MongoDB easier to use:

\`\`\`javascript
const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection failed:', err))
\`\`\`

## Defining Schemas & Models

\`\`\`javascript
// Schema defines structure
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 150,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Model uses schema
const User = mongoose.model('User', userSchema)
\`\`\`

## CRUD Operations

\`\`\`javascript
// CREATE
const user = new User({
  name: 'John Doe',
  email: 'john@example.com',
})
await user.save()

// Or shorter:
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
})

// READ
const allUsers = await User.find()
const oneUser = await User.findById('60d5ec49...')
const admin = await User.findOne({ role: 'admin' })

// UPDATE
await User.findByIdAndUpdate('60d5ec49...', { age: 30 })

// DELETE
await User.findByIdAndDelete('60d5ec49...')
\`\`\`

## Using with Express

\`\`\`javascript
const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())

// Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})
const User = mongoose.model('User', userSchema)

// Routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Connect and start server
mongoose.connect('mongodb://localhost:27017/myapp').then(() => {
  app.listen(3000, () => console.log('Server running'))
})
\`\`\`

## Querying & Filtering

\`\`\`javascript
// Find by field
const adults = await User.find({ age: { $gte: 18 } })

// Find and sort
const users = await User.find().sort({ age: 1 })

// Limit and skip (pagination)
const page1 = await User.find().skip(0).limit(10)
const page2 = await User.find().skip(10).limit(10)

// Select specific fields
const names = await User.find().select('name email -_id')

// Count
const totalUsers = await User.countDocuments()
\`\`\`

## Interview Question

**Q: What's the difference between MongoDB and SQL databases?**

A:
- **MongoDB**: NoSQL, document-based, flexible schema, JSON-like documents, scales horizontally
- **SQL**: Relational, tables with fixed schema, uses joins, scales vertically

MongoDB is great for:
- Rapid prototyping (schema can change)
- Unstructured data
- Large scale distributed systems

SQL is great for:
- Strict data relationships
- Complex queries
- Data consistency requirements
`,
  },
]