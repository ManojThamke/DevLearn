import dotenv from 'dotenv'
dotenv.config()

const apiKey = process.env.GEMINI_API_KEY

const modelsToTest = [
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.5-flash',
  'gemini-2.5-flash-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-latest',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
]

const test = async () => {
  console.log('Testing models...\n')

  for (const modelName of modelsToTest) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Say hi' }] }]
        })
      })

      const data = await res.json()

      if (res.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`✅ ${modelName} — WORKS!`)
      } else {
        console.log(`❌ ${modelName} — ${data?.error?.message?.slice(0, 60)}`)
      }
    } catch (err) {
      console.log(`❌ ${modelName} — ${err.message?.slice(0, 60)}`)
    }
  }
}

test()