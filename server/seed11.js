import Badge from './models/Badge.model.js'
import { badgeDefinitions } from './data/badgeDefinitions.js'

// Inside seed() function after clearing data:
await Badge.deleteMany({})
for (const badge of badgeDefinitions) {
  await Badge.create(badge)
}
console.log('🏅 Badges seeded: ' + badgeDefinitions.length)
