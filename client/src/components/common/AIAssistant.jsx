import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

// ── Message Content Renderer ───────────────────────────────────────
const MessageContent = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/g)
  return (
    <div className="text-sm leading-relaxed space-y-2">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.slice(3, -3).split('\n')
          const lang = lines[0] || 'javascript'
          const code = lines.slice(1).join('\n')
          return (
            <div key={i} className="rounded-xl overflow-hidden my-2 border border-gray-700">
              <div className="bg-gray-800 text-gray-400 text-xs px-3 py-1.5 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80" />
                </div>
                <span className="font-mono">{lang}</span>
              </div>
              <pre className="bg-gray-950 text-emerald-400 p-3 text-xs overflow-x-auto leading-relaxed font-mono">
                <code>{code}</code>
              </pre>
            </div>
          )
        }
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
        return (
          <p key={i} className="whitespace-pre-wrap leading-relaxed">
            {boldParts.map((bp, bi) => {
              if (bp.startsWith('**') && bp.endsWith('**')) {
                return (
                  <strong key={bi} className="font-semibold text-indigo-300">
                    {bp.slice(2, -2)}
                  </strong>
                )
              }
              return bp
            })}
          </p>
        )
      })}
    </div>
  )
}

// ── Quick Prompts ──────────────────────────────────────────────────
const quickPrompts = [
  { label: '⚛️ useState hook', text: 'Explain how useState works with a simple example' },
  { label: '🎯 Interview Q', text: 'Give me a common React interview question with detailed answer' },
  { label: '💡 Project hint', text: 'Give me a hint for building a Todo app in React without spoilers' },
  { label: '🔍 Best practices', text: 'What are best practices for writing clean React components?' },
  { label: '🪝 useEffect', text: 'Explain useEffect with a real world example' },
  { label: '🚀 Career path', text: 'What skills should I learn after React to get a job?' },
]

// ── Main Component ─────────────────────────────────────────────────
const AIAssistant = () => {
  const { isLoggedIn, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi${user ? ' ' + user.name?.split(' ')[0] : ''}! 👋\n\nI'm your **DevLearn AI** — here to help you master React and JavaScript.\n\nAsk me anything:\n- Lesson doubts\n- Code review\n- Interview prep\n- Project hints`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150)
      setUnread(0)
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    if (isOpen) return
    const t1 = setTimeout(() => setShowTooltip(true), 3000)
    const t2 = setTimeout(() => setShowTooltip(false), 7000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isOpen])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    const userMessage = { role: 'user', content: userText }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/ai/chat', {
        messages: updatedMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.reply,
      }])
      if (!isOpen) setUnread(prev => prev + 1)
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.response?.status === 401
          ? '🔐 Please **login** to use the AI assistant!'
          : '❌ Connection error. Please check your server and try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! 🧹 What would you like to learn?',
    }])
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
      }}
    >

      {/* ── Chat Window ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{
              width: '340px',
              height: isMinimized ? 'auto' : '600px',
              background: '#0f0f1a',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '24px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(8,145,178,0.2))',
                borderBottom: '1px solid rgba(99,102,241,0.2)',
                flexShrink: 0,
              }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #0891b2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'white' }}>
                    <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h1a7 7 0 017 7H4a7 7 0 017-7h1V5.72c-.6-.34-1-.98-1-1.72a2 2 0 012-2M7 14a5 5 0 0010 0H7m-2 7l2-3h10l2 3H5z" />
                  </svg>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '12px',
                    height: '12px',
                    background: '#34d399',
                    borderRadius: '50%',
                    border: '2px solid #0f0f1a',
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                  DevLearn AI
                </p>
                <p style={{
                  fontSize: '11px',
                  margin: 0,
                  marginTop: '2px',
                  color: loading ? '#fbbf24' : '#34d399',
                }}>
                  {loading ? '⚡ Generating...' : '● Online'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '2px' }}>
                {/* Minimize */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={isMinimized ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                  </svg>
                </button>

                {/* Clear */}
                <button
                  onClick={clearChat}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.2)'
                    e.currentTarget.style.color = '#f87171'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                  }}
                >
                  <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    background: '#0f0f1a',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(99,102,241,0.3) transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {msg.role === 'assistant' && (
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #6366f1, #0891b2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'white' }}>
                            <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h1a7 7 0 017 7H4a7 7 0 017-7h1V5.72c-.6-.34-1-.98-1-1.72a2 2 0 012-2M7 14a5 5 0 0010 0H7m-2 7l2-3h10l2 3H5z" />
                          </svg>
                        </div>
                      )}

                      <div
                        style={{
                          maxWidth: '82%',
                          borderRadius: '16px',
                          padding: '10px 14px',
                          fontSize: '13px',
                          ...(msg.role === 'user' ? {
                            background: 'linear-gradient(135deg, #6366f1, #0891b2)',
                            color: 'white',
                            borderBottomRightRadius: '4px',
                          } : {
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.9)',
                            borderBottomLeftRadius: '4px',
                          }),
                        }}
                      >
                        {msg.role === 'assistant'
                          ? <MessageContent content={msg.content} />
                          : <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                        }
                      </div>

                      {msg.role === 'user' && (
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '10px',
                            background: 'rgba(99,102,241,0.4)',
                            border: '1px solid rgba(99,102,241,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            color: 'white',
                            fontWeight: 'bold',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', gap: '10px' }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #6366f1, #0891b2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'white' }}>
                          <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h1a7 7 0 017 7H4a7 7 0 017-7h1V5.72c-.6-.34-1-.98-1-1.72a2 2 0 012-2M7 14a5 5 0 0010 0H7m-2 7l2-3h10l2 3H5z" />
                        </svg>
                      </div>
                      <div
                        style={{
                          borderRadius: '16px',
                          borderBottomLeftRadius: '4px',
                          padding: '12px 16px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '16px' }}>
                          {[0, 1, 2].map(j => (
                            <motion.div
                              key={j}
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#6366f1',
                              }}
                              animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* Quick prompts */}
                {messages.length <= 1 && (
                  <div
                    style={{
                      padding: '12px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)',
                      flexShrink: 0,
                    }}
                  >
                    <p style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.3)',
                      marginBottom: '8px',
                      margin: '0 0 8px 0',
                    }}>
                      Quick start
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {quickPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(prompt.text)}
                          style={{
                            fontSize: '11px',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            background: 'rgba(99,102,241,0.15)',
                            border: '1px solid rgba(99,102,241,0.25)',
                            color: 'rgba(165,168,251,0.9)',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(99,102,241,0.3)'
                            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
                            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'
                          }}
                        >
                          {prompt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div
                  style={{
                    padding: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    background: '#0f0f1a',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      borderRadius: '14px',
                      padding: '10px 12px',
                    }}
                  >
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything..."
                      rows={1}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.9)',
                        maxHeight: '80px',
                        caretColor: '#6366f1',
                        fontFamily: 'inherit',
                      }}
                    />
                    <motion.button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        border: 'none',
                        background: input.trim()
                          ? 'linear-gradient(135deg, #6366f1, #0891b2)'
                          : 'rgba(255,255,255,0.1)',
                        cursor: input.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        opacity: input.trim() ? 1 : 0.4,
                        transition: 'all 0.2s',
                      }}
                    >
                      <svg style={{ width: '16px', height: '16px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </motion.button>
                  </div>
                  <p style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.2)',
                    margin: '8px 0 0 0',
                  }}>
                    Enter to send · Shift+Enter for new line
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Button ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              style={{
                position: 'absolute',
                right: '70px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#1a1a2e',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '12px',
                padding: '10px 14px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <p style={{ color: '#a5a8fb', fontWeight: 600, fontSize: '12px', margin: 0 }}>
                👋 Need help?
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '2px 0 0 0' }}>
                Ask your AI tutor!
              </p>
              <div style={{
                position: 'absolute',
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                width: '10px',
                height: '10px',
                background: '#1a1a2e',
                borderRight: '1px solid rgba(99,102,241,0.3)',
                borderTop: '1px solid rgba(99,102,241,0.3)',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Circle Button ── */}
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen)
            setIsMinimized(false)
            setShowTooltip(false)
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          style={{
            position: 'relative',
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: isOpen
              ? 'linear-gradient(135deg, #4f46e5, #0e7490)'
              : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #0891b2 100%)',
            boxShadow: isOpen
              ? '0 4px 16px rgba(99,102,241,0.35)'
              : '0 8px 30px rgba(99,102,241,0.55), 0 0 0 1px rgba(99,102,241,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Shine */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25), transparent 60%)',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.18 }}
              >
                <svg style={{ width: '22px', height: '22px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.18 }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px', fill: 'white' }}>
                  <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h1a7 7 0 017 7H4a7 7 0 017-7h1V5.72c-.6-.34-1-.98-1-1.72a2 2 0 012-2M7 14a5 5 0 0010 0H7m-2 7l2-3h10l2 3H5z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse ring */}
          {!isOpen && (
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #0891b2)',
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          )}

          {/* Unread badge */}
          <AnimatePresence>
            {unread > 0 && !isOpen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '22px',
                  height: '22px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {unread}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Label */}
        <AnimatePresence>
          {!isOpen && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(99,102,241,0.85)',
                letterSpacing: '0.03em',
              }}
            >
              AI Help
            </motion.span>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default AIAssistant
