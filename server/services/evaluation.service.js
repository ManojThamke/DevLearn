import path from 'path'
import fs from 'fs'
import AdmZip from 'adm-zip'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import Submission from '../models/Submission.model.js'
import Score from '../models/Score.model.js'
import { evaluateCode } from './gemini.service.js'
import { fetchRepoCode } from './github.service.js'
import { runInDocker } from './docker.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ALLOWED_CODE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.md']
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

export const evaluateSubmission = async (submissionId) => {
  const submission = await Submission.findById(submissionId).populate('project')

  if (!submission) throw new Error(`Submission ${submissionId} not found`)
  if (!submission.project) throw new Error(`Project not found for submission ${submissionId}`)

  // Update status to evaluating
  submission.status = 'evaluating'
  await submission.save()

  try {
    // Step 1: Fetch code based on submission method
    const code = await fetchCode(submission)

    if (!code || code.trim().length < 10) {
      throw new Error('No valid code found in submission')
    }

    // Step 2: Optionally run in Docker
    let testResults = null
    try {
      testResults = await runInDocker(code)
    } catch (err) {
      console.error('[Evaluation] Docker execution failed (non-fatal):', err.message)
    }

    // Step 3: Build project context for Gemini
    const projectContext = {
      title: submission.project.title,
      description: submission.project.description,
      requirements: submission.project.requirements,
      techStack: submission.project.techStack,
      difficulty: submission.project.difficulty,
    }

    // Step 4: Send to Gemini for evaluation
    const evaluation = await evaluateCode(code, projectContext, testResults)

    // Step 5: Save Score to DB
    const score = await Score.create({
      submission: submission._id,
      student: submission.student,
      project: submission.project._id,
      scores: {
        quality: clampScore(evaluation.scores.quality),
        security: clampScore(evaluation.scores.security),
        performance: clampScore(evaluation.scores.performance),
        professionalism: clampScore(evaluation.scores.professionalism),
        final: clampScore(evaluation.scores.final),
      },
      feedback: {
        quality: evaluation.feedback?.quality || '',
        security: evaluation.feedback?.security || '',
        performance: evaluation.feedback?.performance || '',
        professionalism: evaluation.feedback?.professionalism || '',
        summary: evaluation.feedback?.summary || '',
      },
      criticalIssues: evaluation.criticalIssues || [],
      improvements: evaluation.improvements || [],
      passed: evaluation.passed ?? evaluation.scores.final >= 60,
      evaluatedAt: new Date(),
    })

    // Step 6: Update submission status to completed
    submission.status = 'completed'
    await submission.save()

    console.log(`[Evaluation] Submission ${submissionId} completed — Score: ${score.scores.final}/100`)
    return score
  } catch (err) {
    // Mark as failed on any error
    submission.status = 'failed'
    await submission.save()
    console.error(`[Evaluation] Submission ${submissionId} failed:`, err.message)
    throw err
  }
}

async function fetchCode(submission) {
  switch (submission.method) {
    case 'github':
      return await fetchRepoCode(submission.repoUrl)

    case 'zip':
      return extractZipCode(submission.fileKey)

    case 'editor':
      return submission.code

    default:
      throw new Error(`Unknown submission method: ${submission.method}`)
  }
}

function extractZipCode(fileKey) {
  const zipPath = path.join(UPLOADS_DIR, fileKey)

  if (!fs.existsSync(zipPath)) {
    throw new Error(`ZIP file not found: ${fileKey}`)
  }

  const zip = new AdmZip(zipPath)
  const entries = zip.getEntries()
  let combinedCode = ''
  let totalSize = 0
  const maxSize = 500 * 1024 // 500KB

  for (const entry of entries) {
    if (entry.isDirectory) continue
    if (totalSize >= maxSize) {
      combinedCode += '\n// === TRUNCATED: Size limit reached ===\n'
      break
    }

    const entryName = entry.entryName
    // Skip excluded directories
    if (['node_modules/', '.git/', 'dist/', 'build/', '.next/'].some(d => entryName.includes(d))) {
      continue
    }

    // Only include allowed file types
    const ext = path.extname(entryName).toLowerCase()
    const filename = path.basename(entryName)
    if (!ALLOWED_CODE_EXTENSIONS.includes(ext) && filename !== 'package.json' && filename !== 'README.md') {
      continue
    }

    try {
      const content = entry.getData().toString('utf-8')
      combinedCode += `// === FILE: ${entryName} ===\n${content}\n\n`
      totalSize += content.length
    } catch (_) {
      combinedCode += `// === FILE: ${entryName} === (failed to read)\n\n`
    }
  }

  return combinedCode
}

function clampScore(value) {
  const num = Number(value) || 0
  return Math.min(100, Math.max(0, Math.round(num)))
}
