import Bull from 'bull'
import dotenv from 'dotenv'
dotenv.config()

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

const evaluationQueue = new Bull('evaluation', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    timeout: 5 * 60 * 1000,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 50,
    removeOnFail: 100,
  },
})

evaluationQueue.on('error', (err) => {
  console.error('[Queue] Redis connection error:', err.message)
})

export default evaluationQueue
