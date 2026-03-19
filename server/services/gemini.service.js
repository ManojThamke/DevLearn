import dotenv from 'dotenv'
dotenv.config()

// Collect all GEMINI_API_KEY_* env vars for round-robin
const apiKeys = []
for (let i = 1; i <= 4; i++) {
  const key = process.env[`GEMINI_API_KEY_${i}`]
  if (key) apiKeys.push(key)
}
// Fallback to single GEMINI_API_KEY if no numbered keys found
if (apiKeys.length === 0 && process.env.GEMINI_API_KEY) {
  apiKeys.push(process.env.GEMINI_API_KEY)
}

let currentKeyIndex = 0

function getNextKey() {
  if (apiKeys.length === 0) throw new Error('No Gemini API keys configured')
  const key = apiKeys[currentKeyIndex]
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length
  return key
}

const EVALUATION_PROMPT = `You are DevLearn Code Evaluator — an expert code reviewer and grader for a coding education platform.

You will receive:
1. PROJECT CONTEXT: title, description, requirements, tech stack
2. STUDENT CODE: the submitted source code
3. TEST RESULTS: (optional) output from running automated tests

Your job is to evaluate the student's code and return a JSON score object.

SCORING DIMENSIONS (each 0-100):
- quality: Code structure, readability, naming conventions, DRY principles, proper use of language features
- security: Input validation, XSS prevention, SQL/NoSQL injection prevention, proper auth handling, secret management
- performance: Efficient algorithms, minimal re-renders (React), proper async handling, no memory leaks
- professionalism: Error handling, documentation, Git-worthy code, production readiness, accessibility

RULES:
- Be fair but thorough — students are learning
- final score = weighted average: quality(30%) + security(20%) + performance(25%) + professionalism(25%)
- passed = true if final >= 60
- Give actionable feedback for each dimension
- List critical issues that MUST be fixed
- List improvements that WOULD be nice

You MUST respond with ONLY valid JSON (no markdown, no backticks, no explanation outside JSON).
The JSON must match this exact structure:

{
  "scores": {
    "quality": <number>,
    "security": <number>,
    "performance": <number>,
    "professionalism": <number>,
    "final": <number>
  },
  "feedback": {
    "quality": "<string>",
    "security": "<string>",
    "performance": "<string>",
    "professionalism": "<string>",
    "summary": "<string>"
  },
  "criticalIssues": ["<string>", ...],
  "improvements": ["<string>", ...],
  "passed": <boolean>
}`

export const evaluateCode = async (code, projectContext, testResults = null) => {
  const userPrompt = buildPrompt(code, projectContext, testResults)

  let lastError = null
  // Try each key once before giving up
  for (let attempt = 0; attempt < apiKeys.length; attempt++) {
    const apiKey = getNextKey()
    try {
      const result = await callGemini(apiKey, userPrompt)
      return result
    } catch (err) {
      console.error(`[Gemini] Key ${attempt + 1} failed:`, err.message)
      lastError = err
    }
  }

  throw new Error(`All Gemini API keys failed. Last error: ${lastError?.message}`)
}

function buildPrompt(code, projectContext, testResults) {
  let prompt = `=== PROJECT CONTEXT ===
Title: ${projectContext.title}
Description: ${projectContext.description}
Requirements: ${projectContext.requirements?.join(', ') || 'None specified'}
Tech Stack: ${projectContext.techStack?.join(', ') || 'Not specified'}
Difficulty: ${projectContext.difficulty || 'medium'}

=== STUDENT CODE ===
${code.slice(0, 500000)}
`
  if (testResults) {
    prompt += `
=== TEST RESULTS ===
Exit Code: ${testResults.exitCode}
Timed Out: ${testResults.timedOut}

stdout:
${testResults.stdout?.slice(0, 10000) || '(empty)'}

stderr:
${testResults.stderr?.slice(0, 5000) || '(empty)'}
`
  }

  prompt += `
Please evaluate this code and return the JSON score object as specified.`

  return prompt
}

async function callGemini(apiKey, userPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: EVALUATION_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.3,
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini API failed with status ${response.status}`)
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No response from Gemini')

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

  const parsed = JSON.parse(cleaned)

  // Validate structure
  if (!parsed.scores || typeof parsed.scores.final !== 'number') {
    throw new Error('Invalid Gemini response structure — missing scores.final')
  }

  return parsed
}
