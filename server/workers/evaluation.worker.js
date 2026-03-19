import evaluationQueue from '../queues/evaluation.queue.js'
import { evaluateSubmission } from '../services/evaluation.service.js'
import { checkProjectBadges } from '../controllers/badge.controller.js'
import Submission from '../models/Submission.model.js'

export const startWorker = () => {
  evaluationQueue.process(async (job) => {
    const { submissionId } = job.data
    console.log(`[Worker] Processing evaluation for submission: ${submissionId}`)
    const score = await evaluateSubmission(submissionId)

    // Check and award project badges
    try {
      const submission = await Submission.findById(submissionId)
      if (submission) {
        await checkProjectBadges(submission.student)
      }
    } catch (badgeErr) {
      console.error('[Worker] Badge check error:', badgeErr.message)
    }

    return { submissionId, finalScore: score.scores.final, passed: score.passed }
  })

  evaluationQueue.on('completed', (job, result) => {
    console.log(`[Worker] Job ${job.id} completed — Score: ${result.finalScore}/100, Passed: ${result.passed}`)
  })

  evaluationQueue.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed:`, err.message)
  })

  evaluationQueue.on('stalled', (job) => {
    console.warn(`[Worker] Job ${job.id} stalled — will be retried`)
  })

  console.log('[Worker] Evaluation queue worker started')
}
