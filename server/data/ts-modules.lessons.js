export const tsModule1Lessons = [
  {
    order: 1,
    title: 'TypeScript Basics & Setup',
    duration: 25,
    isFree: true,
    content: `# TypeScript Basics & Setup

## What is TypeScript?

TypeScript is JavaScript with **static types**:

\`\`\`typescript
// JavaScript (no types)
function add(a, b) {
  return a + b
}
add(2, '3')  // "23" - Unexpected!

// TypeScript (with types)
function add(a: number, b: number): number {
  return a + b
}
add(2, '3')  // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
\`\`\`

## Installation & Setup

\`\`\`bash
npm install -g typescript

# Check version
tsc --version

# Create tsconfig.json
tsc --init

# Watch mode
tsc --watch
\`\`\`

## Basic tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
\`\`\`

## Your First TypeScript Program

\`\`\`typescript
// hello.ts
const name: string = "Alice"
const age: number = 30
const isActive: boolean = true

console.log(\`Hello \${name}, age \${age}\`)
\`\`\`

Compile:
\`\`\`bash
tsc hello.ts
# Creates hello.js

node hello.js
# Hello Alice, age 30
\`\`\`

## Compilation

TypeScript → JavaScript:

\`\`\`typescript
// Input (TypeScript)
const greet = (name: string): string => {
  return \`Hello, \${name}!\`
}
\`\`\`

\`\`\`javascript
// Output (JavaScript)
const greet = (name) => {
  return \`Hello, \${name}!\`
}
\`\`\`

## Why TypeScript?

✅ **Benefits:**
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring
- Less runtime bugs

❌ **Trade-offs:**
- Extra build step
- Learning curve
- More verbose`,
  },
  {
    order: 2,
    title: 'Primitive Types & Type Annotations',
    duration: 30,
    isFree: true,
    content: `# Primitive Types & Type Annotations

## Basic Types

\`\`\`typescript
// String
const name: string = "John"

// Number
const age: number = 30
const pi: number = 3.14

// Boolean
const isActive: boolean = true

// Null & Undefined
const nothing: null = null
const undef: undefined = undefined

// Any (avoid!)
let anything: any = 5
anything = "string"  // No error (defeats purpose)

// Unknown (safer than any)
let value: unknown = 5
if (typeof value === 'number') {
  console.log(value + 1)
}
\`\`\`

## Arrays

\`\`\`typescript
// Array of numbers
const nums: number[] = [1, 2, 3]
const moreNums: Array<number> = [4, 5, 6]

// Array of strings
const names: string[] = ["Alice", "Bob"]

// Mixed types (union)
const mixed: (number | string)[] = [1, "two", 3]

// Array of objects
interface User {
  name: string
  age: number
}
const users: User[] = [{ name: "Alice", age: 30 }]
\`\`\`

## Tuples

\`\`\`typescript
// Fixed length, specific types
const tuple: [string, number] = ["Alice", 30]
const tuple2: [string, number, boolean] = ["Bob", 25, true]

// Optional elements
const maybe: [string, number?] = ["Alice"]

// Rest elements
const rest: [string, ...number[]] = ["Alice", 1, 2, 3]
\`\`\`

## Enums

\`\`\`typescript
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2
}

let color: Color = Color.Red

// String enum
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

let status: Status = Status.Active
\`\`\`

## Type Inference

\`\`\`typescript
// TypeScript infers the type
const name = "Alice"      // string
const age = 30           // number
const isActive = true    // boolean

// Hover over variable in IDE to see inferred type
const result = "Hello".toUpperCase()  // string
\`\`\`

## Union & Literal Types

\`\`\`typescript
// Union type
let id: string | number
id = 1          // ✅
id = "abc"      // ✅
id = true       // ❌

// Literal type
let direction: "up" | "down" | "left" | "right"
direction = "up"    // ✅
direction = "left"  // ✅
direction = "diag"  // ❌
\`\`\``,
  },
  {
    order: 3,
    title: 'Functions & Type Safety',
    duration: 25,
    isFree: false,
    content: `# Functions & Type Safety

## Function Types

\`\`\`typescript
// Parameters and return type
function add(a: number, b: number): number {
  return a + b
}

// Arrow function
const multiply = (a: number, b: number): number => a * b

// Optional parameters
function greet(name: string, greeting?: string): string {
  return \`\${greeting || 'Hello'}, \${name}!\`
}

// Default parameters
function power(base: number, exp: number = 2): number {
  return Math.pow(base, exp)
}
\`\`\`

## Function Overloading

\`\`\`typescript
// Overload signatures
function concat(a: string, b: string): string
function concat(a: number, b: number): number
function concat(a: any, b: any): any {
  return a + b
}

concat("Hello", " World")  // ✅ Returns string
concat(2, 3)              // ✅ Returns number
concat("2", 3)            // ❌ Error
\`\`\`

## Rest Parameters

\`\`\`typescript
// Spread syntax
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}

sum(1, 2, 3)        // 6
sum(1, 2, 3, 4, 5)  // 15

// With mixed parameters
function log(prefix: string, ...messages: string[]): void {
  console.log(prefix + ': ' + messages.join(', '))
}
\`\`\`

## Void & Never

\`\`\`typescript
// Void - no return value
function notify(): void {
  console.log("Notified!")
}

// Never - never returns
function throwError(): never {
  throw new Error("Error!")
}

function infiniteLoop(): never {
  while (true) {}
}
\`\`\`

## Callable Types

\`\`\`typescript
// Type for a function
type Callback = (data: string) => void

function processData(callback: Callback): void {
  callback("processed")
}

processData((data) => console.log(data))
\`\`\``,
  },
  {
    order: 4,
    title: 'Union & Intersection Types',
    duration: 20,
    isFree: false,
    content: `# Union & Intersection Types

## Union Types

\`\`\`typescript
// Value can be either type
type ID = string | number
let id: ID = 123      // ✅
id = "abc"            // ✅
id = true             // ❌

// Function parameter
function printId(id: string | number): void {
  console.log(\`ID: \${id}\`)
}

// With objects
type Admin = { role: "admin"; permissions: string[] }
type User = { role: "user"; email: string }
type Account = Admin | User

const account: Account = { role: "admin", permissions: ["read", "write"] }
\`\`\`

## Type Guards

\`\`\`typescript
// Narrow down union type
type ID = string | number

function processId(id: ID): void {
  if (typeof id === 'string') {
    console.log(id.toUpperCase())  // string methods available
  } else {
    console.log(id.toFixed(2))     // number methods available
  }
}

// instanceof guard
class Dog { bark() {} }
class Cat { meow() {} }

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}

// in operator
function printAnimal(animal: Dog | Cat): void {
  if ('bark' in animal) {
    animal.bark()
  }
}
\`\`\`

## Intersection Types

\`\`\`typescript
// Has properties from BOTH types
type Admin = { name: string; role: "admin" }
type Permissions = { permissions: string[] }
type AdminUser = Admin & Permissions

const admin: AdminUser = {
  name: "Alice",
  role: "admin",
  permissions: ["read", "write", "delete"]
}

// Function returning intersection
function combineObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}
\`\`\`

## Discriminated Unions

\`\`\`typescript
type Success = { status: "success"; data: string }
type Error = { status: "error"; error: Error }
type Result = Success | Error

function handle(result: Result): void {
  if (result.status === "success") {
    console.log(result.data)      // ✅ data available
  } else {
    console.log(result.error)     // ✅ error available
  }
}
\`\`\`

## Conditional Types

\`\`\`typescript
// Conditional based on type
type IsString<T> = T extends string ? true : false

type A = IsString<"hello">    // true
type B = IsString<123>        // false

// Practical: Extract array type
type Flatten<T> = T extends Array<infer U> ? U : T

type Str = Flatten<string[]>     // string
type Num = Flatten<number>       // number
\`\`\``,
  },
]

export const tsModule2Lessons = [
  {
    order: 1,
    title: 'Interfaces vs Types',
    duration: 25,
    isFree: true,
    content: `# Interfaces vs Types

## Interfaces

\`\`\`typescript
interface User {
  name: string
  age: number
  email?: string  // Optional
  readonly id: number  // Read-only
}

const user: User = {
  name: "Alice",
  age: 30,
  id: 1
}

// Interface extension
interface Admin extends User {
  permissions: string[]
}

const admin: Admin = {
  name: "Bob",
  age: 35,
  id: 2,
  permissions: ["read", "write"]
}
\`\`\`

## Type Aliases

\`\`\`typescript
type UserType = {
  name: string
  age: number
  email?: string
  readonly id: number
}

// Can also be union
type ID = string | number
type Status = "active" | "inactive"

// Intersection
type AdminType = UserType & { permissions: string[] }
\`\`\`

## When to Use Each

| Aspect | Interface | Type |
|--------|-----------|------|
| Objects | ✅ Best | ✅ Works |
| Unions | ❌ No | ✅ Yes |
| Primitives | ❌ No | ✅ Yes |
| Declaration merge | ✅ Yes | ❌ No |
| Syntax | Single | More flexible |

**General Rule:** Use interfaces for objects, types for everything else

## Declaration Merging (Interfaces Only)

\`\`\`typescript
interface Window {
  myCustomProperty: string
}

// Later...
interface Window {
  anotherProperty: number
}

// Merged into single interface
const win: Window = {
  myCustomProperty: "test",
  anotherProperty: 123
}
\`\`\`

## Best Practices

\`\`\`typescript
// ✅ Use interface for library/module exports
export interface UserInput {
  name: string
  email: string
}

// ✅ Use type for unions and complex types
export type Result = Success | Error

// ✅ Keep it simple
interface Product {
  id: number
  name: string
  price: number
}
\`\`\``,
  },
  {
    order: 2,
    title: 'Generics Deep Dive',
    duration: 35,
    isFree: true,
    content: `# Generics Deep Dive

## Generic Functions

\`\`\`typescript
// Without generics
function first(arr: any[]): any {
  return arr[0]
}

// With generics
function first<T>(arr: T[]): T {
  return arr[0]
}

first([1, 2, 3])              // number
first(["a", "b", "c"])        // string
first([{ x: 1 }, { x: 2 }])  // object
\`\`\`

## Generic Constraints

\`\`\`typescript
// Without constraint
function getProperty<T>(obj: T, key: string): any {
  return obj[key]  // Error: can't access arbitrary property
}

// With constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: "Alice", age: 30 }
getProperty(user, "name")   // ✅ Returns string
getProperty(user, "email")  // ❌ Error: not a property
\`\`\`

## Generic Classes

\`\`\`typescript
class Container<T> {
  private data: T[] = []

  add(item: T): void {
    this.data.push(item)
  }

  get(index: number): T {
    return this.data[index]
  }
}

const stringContainer = new Container<string>()
stringContainer.add("hello")
const value = stringContainer.get(0)  // string

const numberContainer = new Container<number>()
numberContainer.add(42)
\`\`\`

## Generic Interfaces

\`\`\`typescript
interface Repository<T> {
  find(id: number): T | null
  findAll(): T[]
  create(item: T): T
  delete(id: number): boolean
}

interface User {
  id: number
  name: string
}

class UserRepository implements Repository<User> {
  find(id: number): User | null {
    // Implementation
    return null
  }

  findAll(): User[] {
    return []
  }

  create(item: User): User {
    return item
  }

  delete(id: number): boolean {
    return true
  }
}
\`\`\`

## Multiple Type Parameters

\`\`\`typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}

const result = merge(
  { name: "Alice" },
  { age: 30 }
)

// result has both name and age
\`\`\`

## Default Generic Types

\`\`\`typescript
interface Response<T = string> {
  status: number
  data: T
}

const res1: Response = { status: 200, data: "success" }  // T = string
const res2: Response<number> = { status: 200, data: 42 }  // T = number
\`\`\``,
  },
  {
    order: 3,
    title: 'Utility Types & Type Manipulation',
    duration: 30,
    isFree: false,
    content: `# Utility Types & Type Manipulation

## Built-in Utility Types

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
}

// Partial - all properties optional
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string }

// Required - all properties required
type RequiredUser = Required<Partial<User>>
// { id: number; name: string; email: string }

// Pick - select specific properties
type UserPreview = Pick<User, "id" | "name">
// { id: number; name: string }

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, "email">
// { id: number; name: string }

// Record - create object with specific keys
type UserRoles = Record<"admin" | "user" | "guest", User>
// { admin: User; user: User; guest: User }

// Readonly - all properties read-only
type ReadonlyUser = Readonly<User>

// Extract - get intersection of two types
type StringOrNumber = string | number
type StringType = Extract<StringOrNumber, string>  // string

// Exclude - remove from union
type NonString = Exclude<StringOrNumber, string>  // number
\`\`\`

## Keyof Operator

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
}

type UserKeys = keyof User  // "id" | "name" | "email"

function getProperty<K extends keyof User>(user: User, key: K): User[K] {
  return user[key]
}

const user: User = { id: 1, name: "Alice", email: "alice@example.com" }
const name = getProperty(user, "name")  // ✅ string
const invalid = getProperty(user, "age")  // ❌ Error
\`\`\`

## Indexed Access & Mapped Types

\`\`\`typescript
interface User {
  id: number
  name: string
}

// Indexed access
type UserID = User["id"]      // number
type UserName = User["name"]  // string
type UserAll = User[keyof User]  // number | string

// Mapped types
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

type UserGetters = Getters<User>
// {
//   getId: () => number
//   getName: () => string
// }
\`\`\`

## Custom Utility Types

\`\`\`typescript
// Make specific properties optional
type Partial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Make specific properties required
type Required<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// Deep Partial (nested objects)
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
\`\`\``,
  },
  {
    order: 4,
    title: 'Decorators & Metadata',
    duration: 25,
    isFree: false,
    content: `# Decorators & Metadata

## Enabling Decorators

In tsconfig.json:

\`\`\`json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
\`\`\`

## Class Decorators

\`\`\`typescript
// Simple decorator
function Sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@Sealed
class User {
  name: string = "Alice"
}

// Decorator with options
function Logger(prefix: string) {
  return function(constructor: Function) {
    console.log(prefix + ': ' + constructor.name)
  }
}

@Logger("Creating class")
class Product {
  name: string = "Laptop"
}
\`\`\`

## Method Decorators

\`\`\`typescript
function Validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${propertyKey}\`)
    return originalMethod.apply(this, args)
  }

  return descriptor
}

class Calculator {
  @Validate
  add(a: number, b: number): number {
    return a + b
  }
}
\`\`\`

## Property Decorators

\`\`\`typescript
function Length(min: number, max: number) {
  return function(target: any, propertyKey: string) {
    let value: string

    const getter = () => value
    const setter = (newVal: string) => {
      if (newVal.length < min || newVal.length > max) {
        throw new Error(\`\${propertyKey} must be between \${min} and \${max} characters\`)
      }
      value = newVal
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    })
  }
}

class User {
  @Length(3, 20)
  name: string = ""
}

const user = new User()
user.name = "ab"  // ❌ Error: too short
user.name = "Alice"  // ✅ OK
\`\`\`

## Parameter Decorators

\`\`\`typescript
function Required(target: any, propertyKey: string, paramIndex: number) {
  console.log(\`Parameter \${paramIndex} in \${propertyKey} is required\`)
}

class UserService {
  create(@Required name: string, email?: string): void {
    console.log(\`Creating user: \${name}\`)
  }
}
\`\`\`

## Metadata

\`\`\`typescript
import "reflect-metadata"

// Store metadata
Reflect.defineMetadata("role", "admin", User, "name")

// Retrieve metadata
const role = Reflect.getMetadata("role", User, "name")
console.log(role)  // "admin"

// Get all metadata keys
const keys = Reflect.getMetadataKeys(User)
\`\`\`

## Practical Example: Validation Decorator

\`\`\`typescript
function validate(rules: Record<string, any>) {
  return function(target: any) {
    target.validate = function() {
      for (const [key, rule] of Object.entries(rules)) {
        if (rule.required && !this[key]) {
          throw new Error(\`\${key} is required\`)
        }
        if (rule.type && typeof this[key] !== rule.type) {
          throw new Error(\`\${key} must be \${rule.type}\`)
        }
      }
    }
  }
}

@validate({
  name: { required: true, type: "string" },
  age: { required: true, type: "number" }
})
class User {
  name: string = ""
  age: number = 0
}

const user = new User()
user.validate()  // Checks validation rules
\`\`\``,
  },
]

export const tsModule3Lessons = [
  {
    order: 1,
    title: 'TypeScript with React',
    duration: 30,
    isFree: true,
    content: `# TypeScript with React

## Functional Components

\`\`\`typescript
import React from 'react'

// Props interface
interface UserProps {
  name: string
  age: number
  email?: string
  onUpdate?: (name: string) => void
}

// Functional component
const User: React.FC<UserProps> = ({ name, age, email, onUpdate }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
      {onUpdate && (
        <button onClick={() => onUpdate("Updated")}>Update</button>
      )}
    </div>
  )
}

export default User
\`\`\`

## Hooks with TypeScript

\`\`\`typescript
import { useState, useCallback, useEffect } from 'react'

interface User {
  id: number
  name: string
}

function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    // Fetch users
    setLoading(false)
  }, [])

  const handleAddUser = useCallback((name: string): void => {
    const newUser: User = { id: Date.now(), name }
    setUsers(prev => [...prev, newUser])
  }, [])

  return (
    <div>
      {loading && <p>Loading...</p>}
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
\`\`\`

## Event Handling

\`\`\`typescript
import React from 'react'

interface FormProps {
  onSubmit: (email: string) => void
}

const LoginForm: React.FC<FormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    onSubmit(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} name="email" />
      <button type="submit">Login</button>
    </form>
  )
}
\`\`\`

## useReducer Typed

\`\`\`typescript
import { useReducer } from 'react'

interface State {
  count: number
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    case 'RESET':
      return { count: 0 }
  }
}

export function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
    </div>
  )
}
\`\`\`

## Context API

\`\`\`typescript
import { createContext, ReactNode } from 'react'

interface User {
  id: number
  name: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Implementation
  return <AuthContext.Provider value={{...}}>{children}</AuthContext.Provider>
}
\`\`\``,
  },
  {
    order: 2,
    title: 'TypeScript with Node.js',
    duration: 30,
    isFree: false,
    content: `# TypeScript with Node.js

## Express Setup

\`\`\`typescript
import express, { Express, Request, Response } from 'express'

const app: Express = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' })
})

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})
\`\`\`

## Request Handlers

\`\`\`typescript
import { RequestHandler } from 'express'

interface User {
  id: number
  name: string
  email: string
}

// Typed request handler
const getUser: RequestHandler<{ id: string }> = (req, res) => {
  const userId = parseInt(req.params.id)
  // { id: 123 }
  res.json({ id: userId })
}

// With request body
const createUser: RequestHandler<{}, User, { name: string; email: string }> = (req, res) => {
  const { name, email } = req.body
  const user: User = { id: 1, name, email }
  res.status(201).json(user)
}

// With query params
const searchUsers: RequestHandler<{}, User[], {}, { name?: string }> = (req, res) => {
  const { name } = req.query
  // name is optional string
  res.json([])
}

app.get('/users/:id', getUser)
app.post('/users', createUser)
app.get('/search', searchUsers)
\`\`\`

## Middleware

\`\`\`typescript
import { Request, Response, NextFunction } from 'express'

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization
  if (!token) {
    res.status(401).json({ error: 'No token' })
    return
  }
  next()
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.use(authenticate)
\`\`\`

## Database Integration

\`\`\`typescript
import mongoose from 'mongoose'

interface IUser {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  createdAt: Date
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export const User = mongoose.model<IUser>('User', userSchema)

// Using
const user = new User({ name: "Alice", email: "alice@example.com" })
const saved = await user.save()
\`\`\`

## Service Layer Pattern

\`\`\`typescript
interface User {
  id: number
  name: string
}

class UserService {
  async getUser(id: number): Promise<User | null> {
    // Database call
    return { id, name: "Alice" }
  }

  async createUser(data: { name: string; email: string }): Promise<User> {
    const user: User = { id: 1, name: data.name }
    return user
  }
}

// Use in controller
const userService = new UserService()

const getUser: RequestHandler = async (req, res) => {
  try {
    const user = await userService.getUser(1)
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
\`\`\``,
  },
  {
    order: 3,
    title: 'Advanced Patterns & Best Practices',
    duration: 25,
    isFree: false,
    content: `# Advanced TypeScript Patterns & Best Practices

## Dependency Injection

\`\`\`typescript
interface Logger {
  log(message: string): void
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message)
  }
}

class UserService {
  constructor(private logger: Logger) {}

  createUser(name: string): void {
    this.logger.log(\`Creating user: \${name}\`)
  }
}

// Inject logger
const logger = new ConsoleLogger()
const userService = new UserService(logger)
userService.createUser("Alice")
\`\`\`

## Factory Pattern

\`\`\`typescript
interface Database {
  connect(): Promise<void>
}

class PostgresDB implements Database {
  async connect() {
    console.log("Connecting to Postgres")
  }
}

class MongoDBConnection implements Database {
  async connect() {
    console.log("Connecting to MongoDB")
  }
}

class DatabaseFactory {
  static create(type: 'postgres' | 'mongo'): Database {
    switch (type) {
      case 'postgres':
        return new PostgresDB()
      case 'mongo':
        return new MongoDBConnection()
    }
  }
}

const db = DatabaseFactory.create('postgres')
await db.connect()
\`\`\`

## Builder Pattern

\`\`\`typescript
class QueryBuilder {
  private filters: Record<string, any> = {}
  private limit_: number = 10
  private offset_: number = 0

  addFilter(key: string, value: any): this {
    this.filters[key] = value
    return this
  }

  limit(n: number): this {
    this.limit_ = n
    return this
  }

  offset(n: number): this {
    this.offset_ = n
    return this
  }

  build() {
    return {
      filters: this.filters,
      limit: this.limit_,
      offset: this.offset_
    }
  }
}

// Fluent API
const query = new QueryBuilder()
  .addFilter('status', 'active')
  .addFilter('role', 'admin')
  .limit(20)
  .offset(0)
  .build()
\`\`\`

## Error Handling Best Practices

\`\`\`typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, \`\${resource} not found\`)
  }
}

// Usage
throw new ValidationError("Email is required")
throw new NotFoundError("User")
\`\`\`

## Type-Safe Configuration

\`\`\`typescript
interface Config {
  database: {
    url: string
    port: number
  }
  jwt: {
    secret: string
    expiresIn: string
  }
}

const config: Config = {
  database: {
    url: process.env.DB_URL || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10)
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: '24h'
  }
}

export default config
\`\`\`

## Best Practices Checklist

✅ Always aim for 100% type coverage
✅ Use strict mode in tsconfig.json
✅ Avoid \`any\` type
✅ Create specific types for your domain
✅ Use interfaces for contracts
✅ Leverage utility types
✅ Test with type coverage
✅ Document complex types`,
  },
  {
    order: 4,
    title: 'Migrating to TypeScript',
    duration: 20,
    isFree: false,
    content: `# Migrating to TypeScript

## Planning Migration

1. **Start small** - Pick low-impact files first
2. **Set up tooling** - tsconfig, build config
3. **Gradual adoption** - Convert file by file
4. **Team alignment** - Ensure everyone uses strict mode

## Step 1: Setup

\`\`\`bash
npm install -D typescript ts-loader @types/node

# Initialize tsconfig
npx tsc --init

# Update tsconfig.json
{\`
"compilerOptions": {
"target": "ES2020",
"module": "commonjs",
"outDir": "./dist",
"rootDir": "./src",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true
  }
}\`

# Update package.json
"scripts": {
"build": "tsc",
"dev": "tsc --watch"
}
\`\`\`

## Step 2: Rename & Configure

\`\`\`bash
# Rename .js files to .ts
git mv src/index.js src/index.ts

# Install type definitions
npm install -D @types/express @types/react
\`\`\`

## Step 3: Add Types Gradually

**Before:**
\`\`\`javascript
function getUserData(id) {
  return fetch(\`/api/users\${id}\`).then(r => r.json())
}
\`\`\`

**After:**
\`\`\`typescript
interface User {
  id: number
  name: string
}

async function getUserData(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json()
}
\`\`\`

## Step 4: Handling Third-party Libraries

\`\`\`bash
# With types
npm install lodash @types/lodash

# Without types - create ambient declaration
# types/custom.d.ts
declare module 'some-library' {
  export function someFunction(x: string): void
}
\`\`\`

## Common Issues & Fixes

\`\`\`typescript
// Issue: Any spreading
const obj: any = {}

// Fix: Define proper type
interface Config {
  name: string
  [key: string]: any
}

// Issue: React children
const Component = ({ children }) => <div>{children}</div>

// Fix: Type properly
const Component: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
)

// Issue: Window property
window.myProp = 5  // Error

// Fix: Extend window
declare global {
  interface Window {
    myProp: number
  }
}
\`\`\`

## Best Practices for Migration

✅ Migrate incrementally (file by file)
✅ Keep main branches clean - work in separate branch
✅ Use strict mode from day one
✅ Generate type definitions for public APIs
✅ Document why code exists
✅ Review type safety metrics
✅ Avoid over-engineering
✅ Test migrated code thoroughly`,
  },
]
