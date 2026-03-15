import dotenv from 'dotenv'
dotenv.config()

const SYSTEM_PROMPT = `You are DevLearn AI — a friendly and expert coding assistant 
built into the DevLearn platform. You help students learn React.js, JavaScript, 
Node.js and TailwindCSS.

You can help with:
1. Answering React and JavaScript questions clearly with code examples
2. Clearing doubts about lessons on the platform
3. Reviewing student code and suggesting improvements
4. Giving hints for projects without giving away the full solution
5. Interview practice with real questions and detailed answers

Rules:
- Always give code examples when explaining concepts
- Be encouraging and friendly — students are learning
- Keep answers concise but complete
- Format code in markdown code blocks
- If asked about something unrelated to coding politely redirect
- Always end with a follow up question or encouragement`

export const askAI = async (messages) => {
  const apiKey = process.env.GEMINI_API_KEY

  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Gemini error:', data?.error?.message)
    throw new Error(data?.error?.message || 'Gemini API failed')
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No response from Gemini')

  return text
}