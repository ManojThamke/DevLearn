export const module7Lessons = [
  {
    order: 1,
    title: 'JWT Authentication Fundamentals',
    duration: 30,
    isFree: true,
    content: `# JWT Authentication Fundamentals

## What is JWT?

JWT (JSON Web Token) is a compact, self-contained way to securely transmit information between parties as a JSON object. It is the most popular authentication method for modern web apps.

\`\`\`
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.abc123
\`\`\`

## JWT Structure

\`\`\`javascript
// Header — algorithm and token type
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload — claims (data)
{
  "userId": "64a1b2c3d4e5f6",
  "email": "manoj@devlearn.com",
  "role": "student",
  "iat": 1703001600,   // issued at
  "exp": 1703088000    // expires at
}

// Signature — verifies token has not been tampered
HMACSHA256(
  base64(header) + "." + base64(payload),
  JWT_SECRET
)
\`\`\`

## How JWT Auth Works

\`\`\`
1. User sends email + password to /api/auth/login
2. Server verifies credentials against database
3. Server creates JWT with userId and signs with secret
4. Server sends JWT back to client
5. Client stores JWT in localStorage or httpOnly cookie
6. Client sends JWT in Authorization header on every request
7. Server verifies JWT signature on protected routes
8. Server extracts userId from token and finds user
\`\`\`

## Backend — Generating JWT

\`\`\`javascript
// server/controllers/auth.controller.js
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    // Save refresh token to database
    user.refreshToken = refreshToken
    await user.save()

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if exists
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name, email,
      password: hashedPassword,
    })

    // Generate token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
\`\`\`

## Backend — Auth Middleware

\`\`\`javascript
// server/middleware/auth.middleware.js
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.userId).select('-password')

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' })
    }

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}
\`\`\`

## Frontend — Auth Context

\`\`\`jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.accessToken)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
\`\`\`

## Interview Questions

**Q1. What is JWT?**
A compact token format for securely transmitting claims between parties. Contains a header, payload and signature. The signature verifies the token has not been tampered with.

**Q2. Where should you store JWT on the client?**
httpOnly cookies are the most secure — JavaScript cannot access them preventing XSS attacks. localStorage is common but vulnerable to XSS. Never store in regular cookies without httpOnly flag.

**Q3. What is the difference between authentication and authorization?**
Authentication verifies who you are — login with email and password. Authorization verifies what you can do — checking role or permissions.

**Q4. What is the exp claim in JWT?**
The expiration time as a Unix timestamp. The server rejects tokens past this time. Short-lived access tokens of 15 minutes combined with refresh tokens are best practice.

**Q5. Can you invalidate a JWT before it expires?**
Not without server-side state. Options include maintaining a token blacklist, using very short expiry times, or storing a token version in the database and checking it on each request.

**Q6. What is the difference between access token and refresh token?**
Access tokens are short-lived (15 minutes) and sent with every request. Refresh tokens are long-lived (7 days) and only used to get new access tokens when the old one expires.

## Exercises

**Exercise 1 — Easy:** Decode a JWT token manually using atob() and read the payload without verifying the signature.

**Exercise 2 — Medium:** Build a login form that sends credentials to an API, stores the JWT and displays the user name.

**Exercise 3 — Hard:** Implement full JWT auth flow with access token (15 min) and refresh token (7 days). Auto-refresh access token before it expires.

## Summary

- JWT is a self-contained signed token with header, payload and signature
- Server generates JWT on login and sends to client
- Client sends JWT in Authorization header on every request
- Server middleware verifies JWT and extracts user
- Use short-lived access tokens with refresh tokens
- httpOnly cookies are more secure than localStorage`
  },

  {
    order: 2,
    title: 'Protected Routes & Role Based Access',
    duration: 30,
    isFree: false,
    content: `# Protected Routes & Role Based Access

## Protected Routes in React Router

\`\`\`jsx
// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

function ProtectedRoute({ children, roles }) {
  const { user, isLoggedIn, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner />

  if (!isLoggedIn) {
    // Save attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
\`\`\`

## Using Protected Routes in App.jsx

\`\`\`jsx
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses" element={<CourseCatalog />} />

      {/* Protected routes — any logged in user */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* Admin only routes */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/courses" element={
        <ProtectedRoute roles={['admin']}>
          <ManageCourses />
        </ProtectedRoute>
      } />

      {/* Instructor and admin routes */}
      <Route path="/create-course" element={
        <ProtectedRoute roles={['admin', 'instructor']}>
          <CreateCourse />
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
\`\`\`

## Redirect After Login

\`\`\`jsx
// LoginPage.jsx
function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate(from, { replace: true })  // redirect to intended page
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
\`\`\`

## Role Based UI Rendering

\`\`\`jsx
function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <nav>
      <Link to="/">DevLearn</Link>

      {/* Show for all users */}
      <Link to="/courses">Courses</Link>

      {isLoggedIn ? (
        <>
          {/* Show for all logged in users */}
          <Link to="/dashboard">Dashboard</Link>

          {/* Show only for admin */}
          {user?.role === 'admin' && (
            <Link to="/admin">Admin Panel</Link>
          )}

          {/* Show for admin and instructor */}
          {['admin', 'instructor'].includes(user?.role) && (
            <Link to="/create-course">Create Course</Link>
          )}

          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Get Started</Link>
        </>
      )}
    </nav>
  )
}
\`\`\`

## Role Based Component — Can Helper

\`\`\`jsx
// src/utils/permissions.js
export const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
}

export const PERMISSIONS = {
  CREATE_COURSE: [ROLES.ADMIN, ROLES.INSTRUCTOR],
  DELETE_COURSE: [ROLES.ADMIN],
  VIEW_ANALYTICS: [ROLES.ADMIN, ROLES.INSTRUCTOR],
  SUBMIT_PROJECT: [ROLES.STUDENT],
}

export const can = (user, permission) => {
  if (!user) return false
  return PERMISSIONS[permission]?.includes(user.role) ?? false
}

// Usage in components
function CourseActions({ course }) {
  const { user } = useAuth()

  return (
    <div>
      {can(user, 'CREATE_COURSE') && (
        <button>Edit Course</button>
      )}
      {can(user, 'DELETE_COURSE') && (
        <button>Delete Course</button>
      )}
      {can(user, 'SUBMIT_PROJECT') && (
        <button>Submit Project</button>
      )}
    </div>
  )
}
\`\`\`

## Persisting Auth State

\`\`\`jsx
// Refresh page without losing auth state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Verify token is still valid
        const { data } = await api.get('/auth/me')
        setUser(data.user)
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // ... rest of provider
}
\`\`\`

## Interview Questions

**Q1. What is a protected route?**
A route that requires authentication or specific permissions to access. If unauthorized the user is redirected to login or an error page.

**Q2. How do you redirect users to their intended page after login?**
Save the attempted URL in location.state before redirecting to login. After successful login navigate to location.state.from or a default route.

**Q3. What is role-based access control (RBAC)?**
A security model where permissions are assigned to roles and users are assigned roles. Instead of checking individual users you check their role.

**Q4. Should you only protect routes on the frontend?**
No. Frontend protection is for UX only. The backend must always verify authentication and authorization independently — never trust the client.

**Q5. How do you handle page refresh in a JWT auth app?**
On mount check for a stored token and call /api/auth/me to verify it and get fresh user data. Show a loading state while verifying so there is no flash of unauthenticated content.

**Q6. What is the difference between authentication and authorization in routes?**
Authentication checks if you are logged in. Authorization checks if you have permission for a specific resource or action.

## Exercises

**Exercise 1 — Easy:** Create a ProtectedRoute that redirects unauthenticated users to login and stores the intended URL.

**Exercise 2 — Medium:** Add role-based access so admin users see an Admin Panel link in the navbar. Students should not see it.

**Exercise 3 — Hard:** Build a permissions system with a can() helper. Use it to show or hide buttons based on user role throughout the app.

## Summary

- ProtectedRoute wraps routes that require authentication
- Save intended URL in location.state for redirect after login
- Role-based access restricts routes by user role
- Use a can() helper for permission checks in components
- Always protect routes on the backend too — frontend is UX only
- Persist auth by verifying token on page load`
  },

  {
    order: 3,
    title: 'Token Refresh & Security',
    duration: 30,
    isFree: false,
    content: `# Token Refresh & Security

## The Problem with Long-Lived Tokens

If an access token never expires and it is stolen an attacker can use it forever. The solution is short-lived access tokens plus long-lived refresh tokens.

\`\`\`
Access Token  → 15 minutes — sent with every request
Refresh Token → 7 days     — only used to get new access token
\`\`\`

## Refresh Token Flow

\`\`\`
1. User logs in → gets access token (15min) + refresh token (7d)
2. Client stores both tokens
3. Client sends access token with every API request
4. Access token expires after 15 minutes
5. API returns 401 Unauthorized
6. Client sends refresh token to /api/auth/refresh
7. Server verifies refresh token and issues new access token
8. Client retries original request with new access token
9. Repeat until refresh token expires
10. User must log in again
\`\`\`

## Backend — Refresh Token Endpoint

\`\`\`javascript
// server/controllers/auth.controller.js
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    // Find user and check refresh token matches
    const user = await User.findById(decoded.userId)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    // Issue new access token
    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    // Optionally rotate refresh token
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )
    user.refreshToken = newRefreshToken
    await user.save()

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired refresh token' })
  }
}
\`\`\`

## Frontend — Auto Token Refresh with Axios Interceptor

\`\`\`javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Add access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = \`Bearer \${token}\`
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Auto refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = \`Bearer \${token}\`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const { data } = await axios.post(
          \`\${import.meta.env.VITE_API_URL}/auth/refresh\`,
          { refreshToken }
        )

        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)

        processQueue(null, data.accessToken)
        originalRequest.headers.Authorization = \`Bearer \${data.accessToken}\`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
\`\`\`

## Security Best Practices

\`\`\`javascript
// 1. Hash passwords with bcrypt
const SALT_ROUNDS = 12
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

// 2. Never store plain text passwords
// Bad
user.password = req.body.password

// Good
user.password = await bcrypt.hash(req.body.password, 12)

// 3. Never send password in response
// Bad
res.json({ user })

// Good
const { password, refreshToken, ...safeUser } = user.toObject()
res.json({ user: safeUser })

// 4. Use environment variables for secrets
// Bad
const token = jwt.sign(payload, 'my-secret-123')

// Good
const token = jwt.sign(payload, process.env.JWT_SECRET)

// 5. Rate limit login attempts
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                      // 5 attempts per window
  message: 'Too many login attempts. Try again in 15 minutes.',
})

app.post('/api/auth/login', loginLimiter, loginController)

// 6. Validate and sanitize input
import { body, validationResult } from 'express-validator'

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
]

app.post('/api/auth/login', loginValidation, (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  // proceed with login
})
\`\`\`

## Interview Questions

**Q1. Why use short-lived access tokens?**
To limit the damage if a token is stolen. A token valid for only 15 minutes gives attackers a very small window. Combined with refresh tokens the user experience is not affected.

**Q2. What is refresh token rotation?**
Issuing a new refresh token every time the old one is used. If a refresh token is stolen it can only be used once before becoming invalid.

**Q3. What is a CSRF attack?**
Cross-Site Request Forgery — an attack where a malicious site tricks the browser into making requests to your API using stored cookies. JWT in Authorization headers is not vulnerable to CSRF.

**Q4. What is an XSS attack?**
Cross-Site Scripting — injecting malicious JavaScript that can read localStorage and steal tokens. Use Content Security Policy headers and httpOnly cookies to mitigate.

**Q5. What should you do when a refresh token fails?**
Clear all stored tokens and redirect the user to the login page. The session has expired and they need to authenticate again.

**Q6. Why should you never log JWT tokens?**
They contain user credentials. Logs are often stored in multiple places and accessible by many people. Logging tokens creates a security vulnerability.

## Exercises

**Exercise 1 — Easy:** Add a rate limiter to the login route that allows maximum 5 attempts per 15 minutes.

**Exercise 2 — Medium:** Implement token refresh in an Axios interceptor that automatically retries failed requests with a new access token.

**Exercise 3 — Hard:** Implement refresh token rotation — issue a new refresh token on every refresh and invalidate the old one in the database.

## Summary

- Use short-lived access tokens (15 min) with long-lived refresh tokens (7 days)
- Axios interceptors automatically refresh expired tokens
- Queue concurrent requests during token refresh
- Hash passwords with bcrypt using 12 salt rounds
- Never include passwords or tokens in API responses
- Rate limit login endpoints to prevent brute force
- Validate all input on the server side`
  },

  {
    order: 4,
    title: 'OAuth & Social Login',
    duration: 25,
    isFree: false,
    content: `# OAuth & Social Login

## What is OAuth 2.0?

OAuth 2.0 is an authorization framework that allows users to grant third-party applications access to their accounts without sharing passwords. Used for Google, GitHub, Facebook login.

\`\`\`
1. User clicks "Login with Google"
2. App redirects to Google OAuth page
3. User grants permission to your app
4. Google redirects back with authorization code
5. Your server exchanges code for access token
6. Your server gets user info from Google
7. Your server creates/finds local user and issues JWT
8. User is logged in
\`\`\`

## Google OAuth Setup

\`\`\`bash
npm install passport passport-google-oauth20
\`\`\`

\`\`\`javascript
// server/config/passport.js
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.model.js'
import jwt from 'jsonwebtoken'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = await User.findOne({ googleId: profile.id })

    if (!user) {
      // Check if email exists (link accounts)
      user = await User.findOne({ email: profile.emails[0].value })

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id
        user.avatarUrl = profile.photos[0].value
        await user.save()
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatarUrl: profile.photos[0].value,
          password: Math.random().toString(36),  // random password
          isEmailVerified: true,
        })
      }
    }

    return done(null, user)
  } catch (err) {
    return done(err, null)
  }
}))
\`\`\`

\`\`\`javascript
// server/routes/auth.routes.js
import passport from 'passport'

// Initiate Google OAuth
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
)

// Google callback
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: \`\${process.env.CLIENT_URL}/login?error=oauth_failed\`
  }),
  (req, res) => {
    const user = req.user

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    // Redirect to frontend with tokens in URL params
    // Frontend reads params and stores in localStorage
    res.redirect(
      \`\${process.env.CLIENT_URL}/auth/callback?accessToken=\${accessToken}&refreshToken=\${refreshToken}\`
    )
  }
)
\`\`\`

## Frontend — OAuth Callback Handler

\`\`\`jsx
// src/pages/AuthCallback.jsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setTokens } = useAuth()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (accessToken && refreshToken) {
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      // Fetch user data
      setTokens(accessToken, refreshToken)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login?error=oauth_failed', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      <p className="ml-3">Signing you in...</p>
    </div>
  )
}

export default AuthCallback
\`\`\`

## Social Login Buttons

\`\`\`jsx
function SocialLoginButtons() {
  const API_URL = import.meta.env.VITE_API_URL

  return (
    <div className="space-y-3">
      
        href={\`\${API_URL}/auth/google\`}
        className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors"
      >
        <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
        <span className="font-medium text-gray-700">Continue with Google</span>
      </a>

      
        href={\`\${API_URL}/auth/github\`}
        className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white rounded-xl py-3 px-4 hover:bg-gray-800 transition-colors"
      >
        <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5 invert" />
        <span className="font-medium">Continue with GitHub</span>
      </a>
    </div>
  )
}
\`\`\`

## GitHub OAuth Setup

\`\`\`javascript
import { Strategy as GitHubStrategy } from 'passport-github2'

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/api/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id })

    if (!user) {
      const email = profile.emails?.[0]?.value || \`\${profile.username}@github.com\`
      user = await User.create({
        name: profile.displayName || profile.username,
        email,
        githubId: profile.id,
        avatarUrl: profile.photos?.[0]?.value,
        password: Math.random().toString(36),
        isEmailVerified: true,
      })
    }

    return done(null, user)
  } catch (err) {
    return done(err, null)
  }
}))
\`\`\`

## Interview Questions

**Q1. What is OAuth 2.0?**
An authorization framework that lets users grant third-party apps access to their data without sharing passwords. The app receives tokens not credentials.

**Q2. What is the difference between OAuth and OpenID Connect?**
OAuth handles authorization — what can you access. OpenID Connect is built on top of OAuth and handles authentication — who you are. Google login uses OpenID Connect.

**Q3. Why is social login better for users?**
No new password to remember, faster signup, uses existing trusted accounts, and the identity provider handles security.

**Q4. What happens when a user with social login wants to reset their password?**
If they only have social login they do not have a password. Provide an option to set a password separately or always use the social provider for login.

**Q5. What is the state parameter in OAuth?**
A random string sent with the OAuth request and verified when the callback returns. Prevents CSRF attacks during the OAuth flow.

## Exercises

**Exercise 1 — Easy:** Add a Google login button to a login page that redirects to the OAuth URL.

**Exercise 2 — Medium:** Handle the OAuth callback page that extracts tokens from URL params and stores them.

**Exercise 3 — Hard:** Implement full Google OAuth flow — backend Passport strategy, callback route, JWT generation, and frontend callback handler.

## Summary

- OAuth 2.0 lets users login with existing accounts
- Server exchanges authorization code for user info
- Create or link local user account after OAuth
- Issue JWT just like normal login after OAuth
- Handle the callback page on the frontend
- Always validate the state parameter to prevent CSRF
- Support account linking for users with multiple login methods

Congratulations on finishing Module 7 — Authentication! Next: Production React!`
  }
]