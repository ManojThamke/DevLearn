import { askAI } from '../services/ai.service.js'

export const chat = async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required',
      })
    }

    const recentMessages = messages.slice(-10)
    const reply = await askAI(recentMessages)

    res.json({
      success: true,
      reply,
    })
  } catch (err) {
    // This will show us the EXACT error
    console.error('=== AI ERROR ===')
    console.error('Message:', err.message)
    console.error('Status:', err.status)
    console.error('Full error:', err)
    console.error('================')

    res.status(500).json({
      success: false,
      message: 'AI service error',
      error: err.message,
    })
  }
}