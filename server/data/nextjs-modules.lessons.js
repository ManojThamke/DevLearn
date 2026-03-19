export const nextjsModule1Lessons = [
  {
    order: 1,
    title: 'Next.js Fundamentals & App Router',
    duration: 30,
    isFree: true,
    content: `# Next.js 14: App Router

## What is Next.js?

Next.js is a React framework for production with:
- File-based routing
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- API routes
- Built-in optimization

## App Router Structure

\`\`\`
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page (/)
├── dashboard/
│   ├── layout.tsx      # Dashboard layout
│   └── page.tsx        # /dashboard
├── blog/
│   ├── [id]/
│   │   └── page.tsx    # /blog/[id]
│   └── page.tsx        # /blog
└── api/
    └── users/
        └── route.ts    # /api/users
\`\`\`

## Creating Pages

\`\`\`typescript
// app/page.tsx (Home)
export default function Home() {
  return <h1>Welcome to Next.js</h1>
}

// app/about/page.tsx (/about)
export default function About() {
  return <h1>About Us</h1>
}

// app/blog/[id]/page.tsx (/blog/123)
export default function Blog({ params }: { params: { id: string } }) {
  return <h1>Blog Post {params.id}</h1>
}
\`\`\`

## Layouts

\`\`\`typescript
// app/layout.tsx (Root layout)
export const metadata = {
  title: 'My App',
  description: 'Built with Next.js'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>Navigation</nav>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  )
}

// app/dashboard/layout.tsx (Nested layout)
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  )
}
\`\`\`

## File Conventions

- \`page.tsx\` - UI for a route
- \`layout.tsx\` - Shared UI for segment
- \`error.tsx\` - Error UI
- \`loading.tsx\` - Loading UI (Suspense)
- \`not-found.tsx\` - 404 UI
- \`route.ts\` - API endpoint

## Navigation

\`\`\`typescript
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const router = useRouter()

  return (
    <>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <button onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </button>
    </>
  )
}
\`\`\`

## Project Setup

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind
cd my-app
npm run dev

# Visit http://localhost:3000
\`\`\``,
  },
  {
    order: 2,
    title: 'Server Components & Client Components',
    duration: 25,
    isFree: true,
    content: `# Server Components vs Client Components

## Server Components (Default)

Run **only on the server**:

\`\`\`typescript
// app/dashboard/page.tsx
import { getData } from '@/lib/db'

export default async function Dashboard() {
  // ✅ Can directly access database
  const data = await getData()

  // ✅ Can access secrets
  const apiKey = process.env.SECRET_KEY

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Data: {data}</p>
    </div>
  )
}
\`\`\`

## Client Components

Run **in the browser**:

\`\`\`typescript
'use client'  // Mark as client component

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  // ✅ Can use hooks
  // ✅ Can access window, localStorage
  // ✅ Can have event listeners

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
\`\`\`

## Mixing Server & Client

\`\`\`typescript
// app/dashboard/page.tsx (Server)
import { Sidebar } from '@/components/Sidebar'  // ✅ Server
import { Counter } from '@/components/Counter'  // ✅ Client

export default async function Dashboard() {
  const userId = await getCurrentUserId()

  return (
    <div>
      <Sidebar userId={userId} />
      <Counter />
    </div>
  )
}

// components/Sidebar.tsx (Server Component)
export async function Sidebar({ userId }: { userId: string }) {
  const user = await getUser(userId)
  return <aside>{user.name}</aside>
}

// components/Counter.tsx (Client Component)
'use client'
export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
\`\`\`

## When to Use Each

| Task | Server | Client |
|------|--------|--------|
| Fetch data | ✅ | ❌ |
| Access secrets | ✅ | ❌ |
| Use hooks | ❌ | ✅ |
| Event listeners | ❌ | ✅ |
| localStorage | ❌ | ✅ |
| Render database data | ✅ | ❌ |

## Data Passing

\`\`\`typescript
// Server to Client (Props)
export default async function Page() {
  const user = await getUser()

  return (
    <UserCard user={user} />  // Pass via props
  )
}

// Client Component receives props
'use client'
export function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>
}

// Client to Server (API or Server Actions)
'use client'
export function Button() {
  const handleClick = async () => {
    const result = await addToCart(productId)  // Server Action
  }
  return <button onClick={handleClick}>Add</button>
}
\`\`\``,
  },
  {
    order: 3,
    title: 'Styling with Tailwind & CSS Modules',
    duration: 25,
    isFree: false,
    content: `# Styling in Next.js

## Tailwind CSS

Included by default in Create Next App:

\`\`\`typescript
// Simple styles
export default function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      Click me
    </button>
  )
}

// Responsive
export default function Container() {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 px-4">
      Responsive container
    </div>
  )
}

// Dark mode
export default function Card() {
  return (
    <div className="bg-white dark:bg-slate-900 text-black dark:text-white p-4">
      Card
    </div>
  )
}
\`\`\`

## CSS Modules

For scoped CSS:

\`\`\`typescript
// Button.module.css
.primary {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}

.primary:hover {
  background-color: darkblue;
}

// Button.tsx
import styles from './Button.module.css'

export default function Button() {
  return (
    <button className={styles.primary}>
      Click me
    </button>
  )
}
\`\`\`

## Global Styles

\`\`\`typescript
// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}

// app/layout.tsx
import './globals.css'

export default function RootLayout({children}) {
  return <html>{children}</html>
}
\`\`\`

## Combining Styles

\`\`\`typescript
import styles from './Card.module.css'
import clsx from 'clsx'

export default function Card({ variant = 'default' }) {
  return (
    <div className={clsx(
      styles.card,
      'p-4 rounded-lg',
      {
        'bg-blue-50': variant === 'blue',
        'bg-red-50': variant === 'red'
      }
    )}>
      Content
    </div>
  )
}
\`\`\`

## Best Practices

✅ Use Tailwind for utilities
✅ Use CSS Modules for complex components
✅ Keep styles close to components
✅ Use CSS custom properties for themes
✅ Optimize images with next/image`,
  },
  {
    order: 4,
    title: 'Dynamic Routes & Parameters',
    duration: 20,
    isFree: false,
    content: `# Dynamic Routes & Parameters

## Basic Dynamic Routes

\`\`\`
app/
├── posts/
│   ├── [id]/
│   │   └── page.tsx    # /posts/1, /posts/123
│   └── page.tsx        # /posts

Structure:
/posts/123  →  params: { id: '123' }
/posts/abc  →  params: { id: 'abc' }
\`\`\`

\`\`\`typescript
// app/posts/[id]/page.tsx
interface PostPageProps {
  params: {
    id: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  return <h1>Post {params.id}</h1>
}
\`\`\`

## Multiple Parameters

\`\`\`
app/blog/[author]/[year]/page.tsx
/blog/john/2024  →  { author: 'john', year: '2024' }

app/store/[category]/[product]/page.tsx
/store/electronics/laptop  →  { category: 'electronics', product: 'laptop' }
\`\`\`

\`\`\`typescript
interface StorePageProps {
  params: {
    category: string
    product: string
  }
}

export default function StorePage({ params }: StorePageProps) {
  return (
    <div>
      <h1>{params.category}</h1>
      <p>Product: {params.product}</p>
    </div>
  )
}
\`\`\`

## Catch-all Routes

\`\`\`
app/docs/[...slug]/page.tsx
/docs/intro              →  { slug: ['intro'] }
/docs/guides/getting-started  →  { slug: ['guides', 'getting-started'] }
/docs/api/v1/users/123  →  { slug: ['api', 'v1', 'users', '123'] }
\`\`\`

\`\`\`typescript
interface DocsPageProps {
  params: {
    slug: string[]
  }
}

export default function DocsPage({ params }: DocsPageProps) {
  const path = params.slug.join(' > ')
  return <h1>Documentation: {path}</h1>
}
\`\`\`

## Optional Routes

\`\`\`
app/blog/[[...slug]]/page.tsx
/blog                    →  { slug: undefined }
/blog/2024              →  { slug: ['2024'] }
/blog/2024/javascript   →  { slug: ['2024', 'javascript'] }
\`\`\`

\`\`\`typescript
interface BlogPageProps {
  params: {
    slug?: string[]
  }
}

export default function BlogPage({ params }: BlogPageProps) {
  if (!params.slug) {
    return <h1>All Posts</h1>
  }

  if (params.slug.length === 1) {
    return <h1>Posts from {params.slug[0]}</h1>
  }

  return <h1>{params.slug.join(' - ')}</h1>
}
\`\`\`

## Query Parameters

\`\`\`typescript
'use client'

import { useSearchParams } from 'next/navigation'

export default function Search() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const page = searchParams.get('page')

  return (
    <div>
      <h1>Search: {query}</h1>
      <p>Page: {page}</p>
    </div>
  )
}

// /search?q=nextjs&page=2
\`\`\`

## Generating Static Routes

\`\`\`typescript
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts()

  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}

export default function Post({ params }: { params: { id: string } }) {
  return <h1>Post {params.id}</h1>
}

// Pre-generates static pages at build time
// /posts/1, /posts/2, /posts/3, etc.
\`\`\``,
  },
]

export const nextjsModule2Lessons = [
  {
    order: 1,
    title: 'Data Fetching & Caching',
    duration: 30,
    isFree: true,
    content: `# Data Fetching & Caching

## Server-Side Data Fetching

\`\`\`typescript
// Use async/await directly in Server Components
export default async function Page() {
  // Fetches on every request
  const data = await fetch('https://api.example.com/data')
    .then(r => r.json())

  return <div>{data.title}</div>
}
\`\`\`

## Caching Strategies

\`\`\`typescript
// Default: Cached (24 hours)
const data = await fetch('https://api.example.com/data')

// No cache (always fresh)
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
})

// Custom cache time (10 seconds)
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 10 }
})

// Cache indefinitely
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: false }
})
\`\`\`

## Incremental Static Regeneration (ISR)

\`\`\`typescript
// app/posts/[id]/page.tsx
export const revalidate = 60  // Revalidate every 60 seconds

export default async function Post({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  return <article>{post.title}</article>
}
\`\`\`

## React Query / Tanstack Query

\`\`\`typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export default function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts')
      return res.json()
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

## SWR Hook

\`\`\`typescript
'use client'

import useSWR from 'swr'

export default function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return <div>Hello {data.name}!</div>
}
\`\`\`

## Combining Techniques

\`\`\`typescript
// Server Component - Initial data
async function PostsList() {
  const posts = await fetch('https://api.example.com/posts')
    .then(r => r.json())

  return <ClientPostsList initialPosts={posts} />
}

// Client Component - Interactive updates
'use client'
function ClientPostsList({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts)

  const handleRefresh = async () => {
    const newPosts = await fetch('/api/posts').then(r => r.json())
    setPosts(newPosts)
  }

  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      {posts.map(p => <div key={p.id}>{p.title}</div>)}
    </div>
  )
}
\`\`\``,
  },
  {
    order: 2,
    title: 'API Routes & Middleware',
    duration: 25,
    isFree: true,
    content: `# API Routes & Middleware

## API Routes

\`\`\`typescript
// app/api/hello/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello' })
}

// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await getUsers()
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newUser = await createUser(body)
  return Response.json(newUser, { status: 201 })
}

// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser(params.id)
  return Response.json(user)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const updated = await updateUser(params.id, body)
  return Response.json(updated)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteUser(params.id)
  return new Response(null, { status: 204 })
}
\`\`\`

## Query Parameters in API

\`\`\`typescript
// app/api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const page = searchParams.get('page')

  const results = await search(query, page)
  return Response.json(results)
}

// Call: /api/search?q=nextjs&page=2
\`\`\`

## Middleware

\`\`\`typescript
// middleware.ts (root directory)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')

  // Redirect if no token
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
}
\`\`\`

## Request Context

\`\`\`typescript
// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Headers
  const userAgent = request.headers.get('user-agent')

  // Cookies
  const token = request.cookies.get('auth')?.value

  // URL
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  return NextResponse.json({ userAgent, token, id })
}
\`\`\`

## Error Handling

\`\`\`typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(params.id)
    if (!user) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json(user)
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
\`\`\``,
  },
  {
    order: 3,
    title: 'Database Integration',
    duration: 30,
    isFree: false,
    content: `# Database Integration

## Prisma ORM

\`\`\`bash
npm install @prisma/client
npm install -D prisma

npx prisma init
\`\`\`

\`\`\`typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  posts Post[]
}

model Post {
  id    Int     @id @default(autoincrement())
  title String
  body  String
  user  User    @relation(fields: [userId], references: [id])
  userId Int
}
\`\`\`

\`\`\`typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
\`\`\`

\`\`\`typescript
// Usage in Server Component
import { prisma } from '@/lib/db'

export default async function Users() {
  const users = await prisma.user.findMany()
  return <pre>{JSON.stringify(users, null, 2)}</pre>
}
\`\`\`

## MongoDB with Mongoose

\`\`\`typescript
// lib/mongodb.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Invalid MongoDB URI')
}

export async function connectDB() {
  if (mongoose.connection.readyState !== 0) {
    return
  }

  return mongoose.connect(MONGODB_URI)
}

// models/User.ts
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
})

export const User = mongoose.models.User || mongoose.model('User', userSchema)
\`\`\`

## Database in API Routes

\`\`\`typescript
// app/api/users/route.ts
import { prisma } from '@/lib/db'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await prisma.user.create({ data: body })
  return Response.json(user, { status: 201 })
}
\`\`\``,
  },
  {
    order: 4,
    title: 'Forms & Mutations',
    duration: 25,
    isFree: false,
    content: `# Forms & Server Actions

## Server Actions

\`\`\`typescript
// app/actions.ts
'use server'

import { prisma } from '@/lib/db'

export async function addPost(formData: FormData) {
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  await prisma.post.create({
    data: { title, body }
  })
}
\`\`\`

## HTML Forms

\`\`\`typescript
// app/create-post/page.tsx
import { addPost } from '@/app/actions'

export default function CreatePost() {
  return (
    <form action={addPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Body" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
\`\`\`

## React Forms

\`\`\`typescript
'use client'

import { FormEvent } from 'react'
import { addPost } from '@/app/actions'

export default function CreatePost() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await addPost(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="body" required />
      <button type="submit">Create</button>
    </form>
  )
}
\`\`\`

## Revalidation

\`\`\`typescript
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export async function addPost(formData: FormData) {
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  await prisma.post.create({
    data: { title, body }
  })

  // Revalidate the blog page
  revalidatePath('/blog')
}
\`\`\`

## With React Hook Form

\`\`\`typescript
'use client'

import { useForm } from 'react-hook-form'
import { addPost } from '@/app/actions'

export default function CreatePost() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('body', data.body)
    await addPost(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      <textarea {...register('body')} />
      <button type="submit">Create</button>
    </form>
  )
}
\`\`\`

## Error Handling

\`\`\`typescript
'use server'

import { redirect } from 'next/navigation'

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string

  if (!email.includes('@')) {
    throw new Error('Invalid email')
  }

  try {
    await prisma.user.create({ data: { email } })
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Email already exists')
    }
    throw error
  }

  redirect('/dashboard')
}
\`\`\``,
  },
]

export const nextjsModule3Lessons = [
  {
    order: 1,
    title: 'Authentication & Authorization',
    duration: 30,
    isFree: true,
    content: `# Authentication & Authorization

## NextAuth.js Setup

\`\`\`bash
npm install next-auth @auth/prisma-adapter
npm install bcryptjs
\`\`\`

\`\`\`typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email }
        })

        if (user && await verifyPassword(credentials?.password, user.password)) {
          return { id: user.id, email: user.email, name: user.name }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
\`\`\`

## OAuth Providers

\`\`\`typescript
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]
}
\`\`\`

## Login/Logout

\`\`\`typescript
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <p>{session.user?.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    )
  }

  return (
    <button onClick={() => signIn('github')}>Sign In with GitHub</button>
  )
}
\`\`\`

## Protected Routes

\`\`\`typescript
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <h1>Welcome {session.user?.email}</h1>
}
\`\`\`

## Role-based Access

\`\`\`typescript
export async function isAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'admin'
}

// Usage
export default async function AdminPanel() {
  if (!(await isAdmin())) {
    redirect('/unauthorized')
  }

  return <h1>Admin Panel</h1>
}
\`\`\``,
  },
  {
    order: 2,
    title: 'Deployment & Optimization',
    duration: 25,
    isFree: false,
    content: `# Deployment & Optimization

## Image Optimization

\`\`\`typescript
import Image from 'next/image'

export default function Hero() {
  return (
    <Image
      src="/hero.png"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  )
}
\`\`\`

## Font Optimization

\`\`\`typescript
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
\`\`\`

## Vercel Deployment

\`\`\`bash
# Push to GitHub
git push origin main

# Connect to Vercel
vercel

# Environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
\`\`\`

## Performance Optimization

\`\`\`typescript
// Dynamic imports (code splitting)
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('@/components/Heavy'))

export default function Page() {
  return <DynamicComponent />
}

// Lazy loading
const LazySidebar = dynamic(() => import('@/components/Sidebar'), {
  loading: () => <div>Loading...</div>
})
\`\`\`

## Lighthouse Scores

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## Monitoring

\`\`\`typescript
// pages/_app.tsx
import { useReportWebVitals } from 'next/web-vitals'

export default function App() {
  useReportWebVitals((metric) => {
    console.log(metric)  // Send to analytics
  })

  return <div>App</div>
}
\`\`\``,
  },
  {
    order: 3,
    title: 'Advanced Patterns & Real-World Project',
    duration: 35,
    isFree: false,
    content: `# Advanced Next.js Patterns

## Protected API Routes

\`\`\`typescript
// lib/withAuth.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'

export function withAuth(handler: Function) {
  return async (req: NextRequest, props: any) => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req, props)
  }
}

// Usage
// app/api/protected/route.ts
import { withAuth } from '@/lib/withAuth'

export const GET = withAuth(async (req, { params }) => {
  return Response.json({ data: 'secret' })
})
\`\`\`

## Streaming Responses

\`\`\`typescript
import { ReadableStream } from 'stream/web'

export async function GET(request: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 5; i++) {
        controller.enqueue(\`data: \${i} \n\`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
\`\`\`

## File Upload

\`\`\`typescript
'use client'

import { ChangeEvent, FormEvent } from 'react'

export default function Upload() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
  )
}

// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  // Handle file...
  return Response.json({ success: true })
}
\`\`\`

## Monorepo Setup

\`\`\`
packages/
├── ui/              # Shared components
├── auth/            # Auth utilities
└── types/           # Shared types

apps/
├── web/             # Main Next.js app
└── admin/           # Admin dashboard
\`\`\`

## Environment Variables

\`\`\`bash
# .env.local
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Only in backend
API_SECRET=secret

# Exposed to frontend (prefix with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=https://api.example.com
\`\`\`

## Building Production Apps

✅ Use TypeScript
✅ Implement proper error handling
✅ Add logging and monitoring
✅ Use environment variables
✅ Optimize images and fonts
✅ Implement caching strategy
✅ Add security headers`,
  },
  {
    order: 4,
    title: 'Testing & Monitoring',
    duration: 20,
    isFree: false,
    content: `# Testing & Monitoring

## Unit Testing with Vitest

\`\`\`typescript
// lib/math.test.ts
import { describe, it, expect } from 'vitest'
import { add, multiply } from './math'

describe('Math utilities', () => {
  it('adds numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('multiplies numbers', () => {
    expect(multiply(2, 3)).toBe(6)
  })
})
\`\`\`

## Component Testing with React Testing Library

\`\`\`typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('renders and responds to click', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })
})
\`\`\`

## E2E Testing with Playwright

\`\`\`typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login')

  await page.fill('input[name=email]', 'user@example.com')
  await page.fill('input[name=password]', 'password')
  await page.click('button[type=submit]')

  await expect(page).toHaveURL('http://localhost:3000/dashboard')
})
\`\`\`

## Monitoring with Sentry

\`\`\`typescript
// app/layout.tsx
'use client'

import * as Sentry from "@sentry/nextjs"

export default function RootLayout({ children }) {
  return (
    <Sentry.ErrorBoundary fallback={<h1>Error</h1>}>
      {children}
    </Sentry.ErrorBoundary>
  )
}
\`\`\`

## Analytics

\`\`\`typescript
// lib/analytics.ts
export function trackEvent(name: string, params?: Record<string, any>) {
  if (window.gtag) {
    window.gtag('event', name, params)
  }
}

// Usage
'use client'

import { trackEvent } from '@/lib/analytics'

export default function Button() {
  return (
    <button onClick={() => trackEvent('button_click')}>
      Track Click
    </button>
  )
}
\`\`\`

## Logging

\`\`\`typescript
// lib/logger.ts
export function logInfo(message: string, data?: any) {
  console.info(\`[INFO] \${message}\`, data)
}

export function logError(message: string, error: Error) {
  console.error(\`[ERROR] \${message}\`, error)
}

// Usage
logInfo('User created', { userId: 123 })
logError('Failed to fetch', new Error('Network error'))
\`\`\`

## Performance Monitoring

\`\`\`typescript
// lib/performance.ts
export function trackMetric(name: string, value: number) {
  console.log(\`[METRIC] \${name}: \${value}ms\`)
}

// Usage
const start = performance.now()
await fetchData()
const duration = performance.now() - start
trackMetric('fetchData', duration)
\`\`\``,
  },
]
