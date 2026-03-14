import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

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
- If asked about something unrelated to coding, politely redirect
- Always end with a follow up question or encouragement`

export const askAI = async (messages) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  // Convert messages to Gemini format
  // Gemini uses 'user' and 'model' instead of 'user' and 'assistant'
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  // Last message is the current user input
  const lastMessage = messages[messages.length - 1]

  const chat = model.startChat({ history })

  const result = await chat.sendMessage(lastMessage.content)
  return result.response.text()
}