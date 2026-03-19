export const nodeModule3Lessons = [
  {
    order: 1,
    title: 'MongoDB Schema Design',
    duration: 30,
    isFree: true,
    content: `# MongoDB Schema Design

## Relational vs Document Model

MongoDB uses a **document-oriented** model instead of rigid tables:

\`\`\`javascript
// SQL (tables with fixed schema)
Users Table: id, name, email
Posts Table: id, user_id, title, content
Comments Table: id, post_id, user_id, text

// MongoDB (flexible documents)
{
  _id: ObjectId,
  name: "John",
  email: "john@example.com",
  posts: [
    {
      title: "Post 1",
      content: "...",
      comments: [
        { text: "Great!", author: "Jane" }
      ]
    }
  ]
}
\`\`\`

## Schema Design Patterns: Embedding vs Referencing

### 1. Embedding (Denormalization)

Store related data **inside the document**:

\`\`\`javascript
// User with embedded address
db.users.insertOne({
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001"
  },
  phone: [
    { type: "home", number: "212-555-1234" },
    { type: "mobile", number: "646-555-4567" }
  ]
})
\`\`\`

**Pros:**
- ✅ Faster queries (no joins needed)
- ✅ Single atomic operation
- ✅ Easier to read/understand

**Cons:**
- ❌ Data duplication
- ❌ Large documents
- ❌ Hard to update if data is shared

### 2. Referencing (Normalization)

Store **references** to other documents:

\`\`\`javascript
// Users collection
db.users.insertOne({
  _id: ObjectId("user1"),
  name: "John Doe",
  address_id: ObjectId("addr1")
})

// Addresses collection
db.addresses.insertOne({
  _id: ObjectId("addr1"),
  street: "123 Main St",
  city: "New York"
})
\`\`\`

**Pros:**
- ✅ No data duplication
- ✅ Smaller documents
- ✅ Flexible updates

**Cons:**
- ❌ Slower queries (requires joins)
- ❌ Multiple operations needed

## When to Embed vs Reference

| Scenario | Use |
|----------|-----|
| One-to-One relation | Embed |
| One-to-Few relation | Embed |
| One-to-Many (1 to ~50 items) | Embed |
| One-to-Many (1 to many items) | Reference |
| Many-to-Many | Reference |
| Shared data updated frequently | Reference |

## Real-World Example: E-Commerce

\`\`\`javascript
// ✅ GOOD - Embed product info in order (historical record)
db.orders.insertOne({
  _id: ObjectId("order1"),
  user_id: ObjectId("user1"),
  orderDate: new Date(),
  items: [
    {
      product_id: ObjectId("prod1"),
      productName: "Laptop",
      price: 1200,
      quantity: 1
    }
  ]
})

// ❌ Why embed product name?
// - Product price changes shouldn't affect past orders
// - Store the price at time of purchase

// ✅ User -> Products (reference, not embed)
db.users.insertOne({
  _id: ObjectId("user1"),
  name: "John",
  wishlist: [
    ObjectId("prod1"),
    ObjectId("prod2")
  ]
})
\`\`\`

## Summary

- **Embed** for closely related data that changes together
- **Reference** for shared data or many-to-many relationships
- **Denormalize** for performance-critical queries
- **Normalize** for consistency and storage efficiency`,
  },
  {
    order: 2,
    title: 'Aggregation Pipeline',
    duration: 35,
    isFree: false,
    content: `# MongoDB Aggregation Pipeline

## What is Aggregation?

Transform and analyze data at scale using **pipeline stages**. Each stage processes documents and passes results to the next stage.

\`\`\`
┌──────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌─────────┐
│ Raw Data │ -> │ $match │ -> │ $group │ -> │ $sort  │ -> │ Results │
└──────────┘    └────────┘    └────────┘    └────────┘    └─────────┘
\`\`\`

## Basic Aggregation Stages

### $match — Filter documents

\`\`\`javascript
// Find orders over $100
db.orders.aggregate([
  { $match: { total: { $gt: 100 } } }
])
\`\`\`

### $group — Group and aggregate

\`\`\`javascript
// Total sales by customer
db.orders.aggregate([
  {
    $group: {
      _id: "$customer_id",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
    }
  }
])
\`\`\`

### $project — Select fields

\`\`\`javascript
// Only show name and email
db.users.aggregate([
  { $project: { name: 1, email: 1, _id: 0 } }
])
\`\`\`

### $sort — Sort results

\`\`\`javascript
// Sort by total descending
db.orders.aggregate([
  { $sort: { total: -1 } }
])
\`\`\`

### $limit & $skip — Pagination

\`\`\`javascript
// Skip 10, limit 5
db.orders.aggregate([
  { $skip: 10 },
  { $limit: 5 }
])
\`\`\`

### $lookup — Join collections

\`\`\`javascript
// Join orders with customers
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  }
])
\`\`\`

## Real-World Example: Sales Analytics

\`\`\`javascript
// Top products by revenue in last 30 days
db.orders.aggregate([
  // Stage 1: Filter recent orders
  {
    $match: {
      orderDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }
  },
  // Stage 2: Unwind items array
  { $unwind: "$items" },
  // Stage 3: Group by product
  {
    $group: {
      _id: "$items.product_id",
      revenue: { $sum: "$items.price" },
      quantity: { $sum: "$items.quantity" }
    }
  },
  // Stage 4: Sort by revenue
  { $sort: { revenue: -1 } },
  // Stage 5: Limit top 10
  { $limit: 10 }
])
\`\`\`

## Aggregation Operators

| Operator | Purpose |
|----------|---------|
| $sum | Sum values |
| $avg | Average |
| $min | Minimum |
| $max | Maximum |
| $count | Count documents |
| $push | Array of values |
| $first | First value |
| $last | Last value |

## Performance Tips

- ✅ $match early to filter data
- ✅ Use indexes on filtered fields
- ✅ $project before $group to reduce data
- ❌ Avoid $lookup if possible
- ❌ Don't transform data if filtering can do it`,
  },
  {
    order: 3,
    title: 'Indexing & Performance',
    duration: 25,
    isFree: false,
    content: `# MongoDB Indexing & Performance

## What are Indexes?

Indexes are **sorted data structures** that speed up queries:

\`\`\`
Without Index (Collection Scan):
┌────────────────────────────────────────────────────┐
│ Check Doc 1  Check Doc 2  Check Doc 3  ... 1 MILLION        │
└────────────────────────────────────────────────────┘
Time: O(n) - Very Slow

With Index (Binary Search):
┌────────┐
│        │ <- Go left/right
│        │ <- Found in ~20 steps
└────────┘
Time: O(log n) - Very Fast
\`\`\`

## Creating Indexes

### Single Field Index

\`\`\`javascript
// Create index on email
db.users.createIndex({ email: 1 })

// Index in descending order
db.users.createIndex({ age: -1 })
\`\`\`

### Compound Index (Multiple Fields)

\`\`\`javascript
// Index on user_id AND status
db.orders.createIndex({ user_id: 1, status: 1 })

// Query that benefits from this index
db.orders.find({ user_id: 123, status: "completed" })
\`\`\`

### Unique Index

\`\`\`javascript
// Ensure email is unique
db.users.createIndex({ email: 1 }, { unique: true })
\`\`\`

### Text Index (Full-Text Search)

\`\`\`javascript
// Enable text search on title and description
db.products.createIndex({ title: "text", description: "text" })

// Search
db.products.find({ $text: { $search: "laptop" } })
\`\`\`

## Analyzing Query Performance

### Explain Plans

\`\`\`javascript
// See how MongoDB executes the query
db.users.find({ email: "john@example.com" }).explain("executionStats")

// Results:
{
  "executionStats": {
    "executionStages": {
      "stage": "COLLSCAN",  // ❌ Bad: Full collection scan
      "nReturned": 1,
      "totalDocsExamined": 1000000
    }
  }
}

// After adding index:
{
  "executionStats": {
    "executionStages": {
      "stage": "IXSCAN",    // ✅ Good: Index scan
      "nReturned": 1,
      "totalDocsExamined": 1
    }
  }
}
\`\`\`

## Query Performance Best Practices

| Do ✅ | Don't ❌ |
|------|---------|
| Index fields you filter on | Query without indexes |
| Use compound indexes wisely | Create too many indexes |
| Index frequently queried fields | Index low-cardinality data |
| Monitor slow queries | Ignore query performance |

## Index Types

| Index | Use Case |
|-------|----------|
| Single field | Searching by one field |
| Compound | Multiple field filters |
| Unique | Prevent duplicates |
| Text | Full-text search |
| Geospatial | Location-based queries |
| TTL | Auto-expire documents |

## Common Slow Query Patterns

\`\`\`javascript
// ❌ SLOW: Scanning entire collection
db.users.find({ age: { $gt: 25 } })

// ✅ FAST: With index
db.users.createIndex({ age: 1 })

// ❌ SLOW: Regex at beginning
db.users.find({ name: /^john/ })

// ✅ FAST: Exact match with index
db.users.find({ name: "john" })

// ❌ SLOW: Large $in array
db.products.find({ id: { $in: [longArrayOf1M] } })

// ✅ FAST: Pre-aggregate data
\`\`\`

## Monitoring Performance

\`\`\`javascript
// Enable profiling
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(5)

// Get stats
db.collection.stats()
\`\`\``,
  },
  {
    order: 4,
    title: 'Transactions & Consistency',
    duration: 20,
    isFree: false,
    content: `# MongoDB Transactions & Consistency

## ACID Properties

MongoDB supports **ACID transactions** for multi-document operations:

- **A**tomicity — All or nothing
- **C**onsistency — Valid state
- **I**solation — No interference
- **D**urability — Persisted

## Multi-Document Transactions

### Without Transaction (Risky)

\`\`\`javascript
// ❌ PROBLEM: If step 2 fails, money is lost!
// Step 1: Remove $100 from Alice
db.accounts.updateOne({ name: "Alice" }, { $inc: { balance: -100 } })

// Step 2: Add $100 to Bob
db.accounts.updateOne({ name: "Bob" }, { $inc: { balance: 100 } })
// ← App crashes here...
\`\`\`

### With Transaction (Safe)

\`\`\`javascript
const session = db.getMongo().startSession()
session.startTransaction()

try {
  // Both operations together
  db.accounts.updateOne(
    { name: "Alice" },
    { $inc: { balance: -100 } },
    { session }
  )

  db.accounts.updateOne(
    { name: "Bob" },
    { $inc: { balance: 100 } },
    { session }
  )

  session.commitTransaction()
} catch (error) {
  session.abortTransaction()
  throw error
} finally {
  session.endSession()
}
\`\`\`

## Real-World Example: Order Processing

\`\`\`javascript
async function processOrder(customerId, cartItems) {
  const session = db.getMongo().startSession()
  session.startTransaction()

  try {
    // 1. Deduct inventory
    for (const item of cartItems) {
      db.products.updateOne(
        { _id: item.product_id },
        { $inc: { stock: -item.quantity } },
        { session }
      )
    }

    // 2. Create order
    const order = {
      customer_id: customerId,
      items: cartItems,
      status: "pending",
      createdAt: new Date()
    }
    const result = db.orders.insertOne(order, { session })

    // 3. Update customer
    db.customers.updateOne(
      { _id: customerId },
      { $push: { orders: result.insertedId } },
      { session }
    )

    session.commitTransaction()
    return result.insertedId
  } catch (error) {
    session.abortTransaction()
    console.error("Order failed", error)
    throw error
  } finally {
    session.endSession()
  }
}
\`\`\`

## Write Concern

Control durability level:

\`\`\`javascript
// Acknowledge write (default)
db.users.insertOne({ name: "John" }, { writeConcern: { w: 1 } })

// Wait for replication
db.users.insertOne(
  { name: "John" },
  { writeConcern: { w: 2 } }  // 2 replicas
)

// Wait for disk sync
db.users.insertOne(
  { name: "John" },
  { writeConcern: { w: 1, j: true } }  // Journaled
)
\`\`\`

## Isolation Levels

\`\`\`javascript
// Snapshot isolation (default for transactions)
session.startTransaction({ readConcern: "snapshot" })

// Read uncommitted (faster but risky)
session.startTransaction({ readConcern: "local" })

// Read committed
session.startTransaction({ readConcern: "majority" })
\`\`\`

## Best Practices

✅ **DO:**
- Use transactions for related operations
- Commit frequently to reduce locks
- Handle errors and rollback properly
- Test transaction failure scenarios

❌ **DON'T:**
- Use transactions for simple operations
- Keep transactions long-running
- Ignore rollback errors
- Assume transactions solve all consistency issues

## Consistency Models

| Model | Speed | Consistency |
|-------|-------|-------------|
| Eventual | ⚡ Fast | Eventually consistent |
| Strong | 🐢 Slow | Immediately consistent |
| Causal | ⚡⚡ Balanced | Causally consistent |

MongoDB uses **causal consistency** in transactions!`,
  },
]
