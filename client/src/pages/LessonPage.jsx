import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// ── Dark Mode Hook ─────────────────────────────────────────────────
const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('lessonDark') === 'true'
  })
  const toggle = () => {
    setDark(d => {
      localStorage.setItem('lessonDark', !d)
      return !d
    })
  }
  return [dark, toggle]
}

// ── Reading Progress Hook ──────────────────────────────────────────
const useReadingProgress = () => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const el = document.getElementById('lesson-content')
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const vh = window.innerHeight
      const scrolled = Math.max(0, -top)
      const total = height - vh
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }
    window.addEventListener('scroll', update)
    return () => window.removeEventListener('scroll', update)
  }, [])
  return progress
}

// ── Code Block ─────────────────────────────────────────────────────
const CodeBlock = ({ code, language, dark }) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          </div>
          <span className="text-gray-400 text-xs font-mono">{language || 'javascript'}</span>
        </div>
        <button
          onClick={copy}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre className="bg-gray-950 p-5 overflow-x-auto">
        <code className="text-emerald-400 text-sm font-mono leading-relaxed">{code}</code>
      </pre>
    </div>
  )
}

// ── Markdown Renderer ──────────────────────────────────────────────
const MarkdownContent = ({ content, dark }) => {
  const lines = content.split('\n')
  const elements = []
  let i = 0
  let keyCounter = 0
  const tc = dark ? 'text-gray-100' : 'text-gray-800'
  const tc2 = dark ? 'text-gray-300' : 'text-gray-700'
  const tc3 = dark ? 'text-gray-400' : 'text-gray-500'

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const language = line.slice(3).trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(<CodeBlock key={keyCounter++} code={codeLines.join('\n')} language={language} dark={dark} />)
      i++
      continue
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={keyCounter++} className={`text-3xl font-bold ${tc} mt-10 mb-5 pb-3 border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
          {line.slice(2)}
        </h1>
      )
      i++; continue
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={keyCounter++} className={`text-xl font-bold ${tc} mt-8 mb-3 flex items-center gap-2`}>
          <span className="w-1 h-6 bg-indigo-500 rounded-full flex-shrink-0" />
          {line.slice(3)}
        </h2>
      )
      i++; continue
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={keyCounter++} className={`text-lg font-bold ${dark ? 'text-indigo-300' : 'text-indigo-700'} mt-6 mb-2`}>
          {line.slice(4)}
        </h3>
      )
      i++; continue
    }

    if (line.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
      const headers = tableLines[0].split('|').filter(c => c.trim())
      const rows = tableLines.slice(2).map(row => row.split('|').filter(c => c.trim()))
      elements.push(
        <div key={keyCounter++} className="my-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className={dark ? 'bg-indigo-900/50' : 'bg-indigo-50'}>
                {headers.map((h, hi) => (
                  <th key={hi} className={`px-4 py-3 text-left font-bold ${dark ? 'text-indigo-300 border-b border-gray-700' : 'text-indigo-800 border-b border-gray-200'}`}>
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? (dark ? 'bg-gray-800' : 'bg-white') : (dark ? 'bg-gray-750' : 'bg-gray-50')}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-3 ${dark ? 'text-gray-300 border-b border-gray-700' : 'text-gray-700 border-b border-gray-100'}`}>
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (line.startsWith('---')) {
      elements.push(<hr key={keyCounter++} className={`my-8 ${dark ? 'border-gray-700' : 'border-gray-200'}`} />)
      i++; continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2)); i++
      }
      elements.push(
        <ul key={keyCounter++} className="my-4 space-y-2">
          {items.map((item, li) => (
            <li key={li} className={`flex items-start gap-3 ${tc2}`}>
              <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    if (/^\d+\. /.test(line)) {
      const items = []
      let n = 0
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, '')); i++; n++ }
      elements.push(
        <ol key={keyCounter++} className="my-4 space-y-2">
          {items.map((item, li) => (
            <li key={li} className={`flex items-start gap-3 ${tc2}`}>
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {li + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <p key={keyCounter++} className={`font-bold ${tc} mt-4 mb-1`}>{line.slice(2, -2)}</p>
      )
      i++; continue
    }

    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={keyCounter++} className={`border-l-4 border-indigo-500 ${dark ? 'bg-indigo-900/20 text-indigo-300' : 'bg-indigo-50 text-indigo-800'} px-5 py-4 my-5 rounded-r-xl italic text-sm leading-relaxed`}>
          {line.slice(2)}
        </blockquote>
      )
      i++; continue
    }

    if (line.trim() === '') { i++; continue }

    const parts = line.split(/(`[^`]+`)/)
    elements.push(
      <p key={keyCounter++} className={`${tc2} leading-relaxed my-2.5 text-base`}>
        {parts.map((part, pi) => {
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={pi} className={`${dark ? 'bg-gray-800 text-indigo-400 border border-gray-700' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'} px-1.5 py-0.5 rounded-lg text-sm font-mono`}>
                {part.slice(1, -1)}
              </code>
            )
          }
          return part
        })}
      </p>
    )
    i++
  }
  return <div className="lesson-content">{elements}</div>
}

// ── Module Colors ──────────────────────────────────────────────────
const moduleColors = [
  { bg: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
]

// ── Lesson Sidebar ─────────────────────────────────────────────────
const LessonSidebar = ({ course, currentLessonId, completedLessons, dark, onClose }) => {
  const bg = dark ? 'bg-gray-900' : 'bg-white'
  const border = dark ? 'border-gray-700' : 'border-gray-100'
  const moduleBg = dark ? 'bg-gray-800' : 'bg-gray-50'

  return (
    <div className={`flex flex-col h-full ${bg}`}>
      {/* Header */}
      <div className={`p-4 border-b ${border}`}>
        <div className="flex items-center justify-between mb-3">
          <Link
            to={'/courses/' + course.slug}
            className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-600 font-semibold transition-colors"
          >
            ← Back to course
          </Link>
          {onClose && (
            <button onClick={onClose} className={`text-sm ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>
              ✕
            </button>
          )}
        </div>
        <div className={`${dark ? 'bg-gray-800' : 'bg-indigo-50'} rounded-xl p-3`}>
          <p className={`text-xs font-bold ${dark ? 'text-indigo-400' : 'text-indigo-600'} uppercase tracking-wider mb-1`}>
            📚 Course
          </p>
          <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
            {course.title}
          </p>
          <div className="mt-2">
            <div className={`h-1.5 ${dark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: (completedLessons.length / (course.modules?.reduce((t, m) => t + (m.lessons?.length || 0), 0) || 1) * 100) + '%' }}
              />
            </div>
            <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {completedLessons.length} lessons completed
            </p>
          </div>
        </div>
      </div>

      {/* Lessons list */}
      <div className="flex-1 overflow-y-auto">
        {course.modules?.map((module, mi) => {
          const color = moduleColors[mi % moduleColors.length]
          const moduleCompletedCount = module.lessons?.filter(l =>
            completedLessons.includes(l._id.toString())
          ).length || 0
          const isModuleDone = moduleCompletedCount === (module.lessons?.length || 0)

          return (
            <div key={module._id}>
              {/* Module header */}
              <div className={`px-4 py-3 ${moduleBg} border-b ${border} sticky top-0 z-10`}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg ${isModuleDone ? 'bg-green-500' : color.bg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {isModuleDone ? '✓' : mi + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider truncate`}>
                      {module.title}
                    </p>
                  </div>
                  <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'} flex-shrink-0`}>
                    {moduleCompletedCount}/{module.lessons?.length}
                  </span>
                </div>
              </div>

              {/* Lessons */}
              {module.lessons?.map((lesson, li) => {
                const isCompleted = completedLessons.includes(lesson._id.toString())
                const isCurrent = lesson._id === currentLessonId

                return (
                  <Link
                    key={lesson._id}
                    to={'/lessons/' + lesson._id}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 border-b ${border} transition-all group ${
                      isCurrent
                        ? dark ? 'bg-indigo-900/40 border-l-2 border-l-indigo-500' : 'bg-indigo-50 border-l-2 border-l-indigo-600'
                        : dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Status circle */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-sm shadow-green-200'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                        : dark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isCompleted ? '✓' : li + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate transition-colors ${
                        isCurrent
                          ? dark ? 'text-indigo-300' : 'text-indigo-700'
                          : isCompleted
                          ? dark ? 'text-green-400' : 'text-green-700'
                          : dark ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {lesson.duration} min
                        </p>
                        {lesson.isFree && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                            Free
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Current indicator */}
                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Lesson Page ───────────────────────────────────────────────
const LessonPage = () => {
  const { id } = useParams()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [dark, toggleDark] = useDarkMode()
  const readingProgress = useReadingProgress()

  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [completedLessons, setCompletedLessons] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const bg = dark ? 'bg-gray-900' : 'bg-white'
  const border = dark ? 'border-gray-700' : 'border-gray-100'
  const topBg = dark ? 'bg-gray-900/95 backdrop-blur border-gray-700' : 'bg-white/95 backdrop-blur border-gray-100'

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true)
        setCompleted(false)
        setError(null)

        const lessonRes = await api.get('/lessons/' + id)
        const lessonData = lessonRes.data.lesson
        setLesson(lessonData)

        const courseRes = await api.get('/courses/id/' + lessonData.course)
        setCourse(courseRes.data.course)

        if (isLoggedIn) {
          try {
            const progressRes = await api.get('/progress/' + lessonData.course)
            const cl = progressRes.data.progress?.completedLessons || []
            const clStrings = cl.map(l => typeof l === 'object' ? l.toString() : l)
            setCompletedLessons(clStrings)
            setCompleted(clStrings.includes(id))
          } catch { }
        }

        window.scrollTo(0, 0)
      } catch (err) {
        const message = err.response?.data?.message || 'Lesson not found'
        const status = err.response?.status
        setError({ message, status })
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [id, isLoggedIn])

  const handleComplete = async () => {
    if (!isLoggedIn) { navigate('/register'); return }
    try {
      setCompleting(true)
      await api.post('/lessons/' + id + '/complete')
      setCompleted(true)
      setCompletedLessons(prev => [...prev, id])
    } catch (err) {
      console.error(err)
    } finally {
      setCompleting(false)
    }
  }

  const getAllLessons = () => {
    const all = []
    course?.modules?.forEach(mod => {
      mod.lessons?.forEach(lesson => all.push({ ...lesson, moduleName: mod.title }))
    })
    return all
  }

  const allLessons = getAllLessons()
  const currentIndex = allLessons.findIndex(l => l._id === id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  if (loading) {
    return (
      <div className={`min-h-screen flex ${dark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`w-72 hidden lg:block border-r ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="p-4 space-y-3">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className={`h-10 ${dark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl animate-pulse`} />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 space-y-4 max-w-3xl mx-auto">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-${i === 1 ? 8 : 4} ${dark ? 'bg-gray-800' : 'bg-gray-100'} rounded animate-pulse`} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    const errorMessage = error?.message || 'Lesson not found'
    const isAuthError = error?.status === 401
    const isEnrollError = error?.status === 403

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${dark ? 'bg-gray-900' : 'bg-white'}`}>
        <p className="text-5xl mb-4">{isAuthError ? '🔐' : isEnrollError ? '📚' : '😕'}</p>
        <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'} mb-2`}>
          {isAuthError ? 'Login Required' : isEnrollError ? 'Enrollment Required' : 'Lesson Not Found'}
        </h2>
        <p className={`${dark ? 'text-gray-400' : 'text-gray-500'} mb-6 text-center max-w-md`}>
          {errorMessage}
        </p>
        <div className="flex gap-3">
          {isAuthError ? (
            <Link to="/login" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              Login to Continue
            </Link>
          ) : isEnrollError ? (
            <Link to="/courses" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              Enroll in Course
            </Link>
          ) : (
            <Link to="/courses" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              Browse Courses
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex ${bg} transition-colors duration-300`}>

      {/* ── Desktop Sidebar ──────────────────────────────────────── */}
      {course && (
        <aside className={`hidden lg:flex flex-col w-72 xl:w-80 border-r ${border} flex-shrink-0 sticky top-0 h-screen overflow-hidden`}>
          <LessonSidebar
            course={course}
            currentLessonId={id}
            completedLessons={completedLessons}
            dark={dark}
          />
        </aside>
      )}

      {/* ── Mobile Sidebar ───────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && course && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden flex flex-col shadow-2xl`}
            >
              <LessonSidebar
                course={course}
                currentLessonId={id}
                completedLessons={completedLessons}
                dark={dark}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Reading progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
            style={{ width: readingProgress + '%' }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Top bar */}
        <div className={`sticky top-0 z-30 border-b ${topBg} px-4 py-3 flex items-center gap-3 shadow-sm`}>

          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Lesson info */}
          <div className="flex-1 min-w-0">
            <p className={`text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {course?.title}
            </p>
            <p className={`text-sm font-bold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
              {lesson.title}
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Reading progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className={`w-24 h-1.5 ${dark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                  style={{ width: readingProgress + '%' }}
                />
              </div>
              <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} min-w-[30px]`}>
                {Math.round(readingProgress)}%
              </span>
            </div>

            {/* Duration */}
            <span className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              ⏱ {lesson.duration} min
            </span>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className={`p-2 rounded-xl transition-all ${dark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title="Toggle dark mode"
            >
              {dark ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              )}
            </button>

            {/* Mark complete */}
            {completed ? (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 text-xs bg-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-sm shadow-green-200"
              >
                ✓ Completed
              </motion.span>
            ) : (
              <motion.button
                onClick={handleComplete}
                disabled={completing}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
              >
                {completing ? (
                  <>
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : '✓ Mark Complete'}
              </motion.button>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div id="lesson-content" className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">

            {/* Header */}
            <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {lesson.isFree && (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                    🆓 Free Lesson
                  </span>
                )}
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                  📖 {lesson.duration} min read
                </span>
                {currentIndex >= 0 && (
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${dark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    Lesson {currentIndex + 1} of {allLessons.length}
                  </span>
                )}
              </div>

              <h1 className={`text-3xl sm:text-4xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}>
                {lesson.title}
              </h1>

              {/* Progress */}
              {allLessons.length > 0 && (
                <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} border rounded-2xl p-4`}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className={`font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Course Progress
                    </span>
                    <span className="font-bold text-indigo-600">
                      {Math.round(completedLessons.length / allLessons.length * 100)}%
                    </span>
                  </div>
                  <div className={`h-2 ${dark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: (completedLessons.length / allLessons.length * 100) + '%' }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                    />
                  </div>
                  <p className={`text-xs mt-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {completedLessons.length} of {allLessons.length} lessons completed
                  </p>
                </div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              key={id + '_content'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <MarkdownContent content={lesson.content || 'Content coming soon...'} dark={dark} />
            </motion.div>

            {/* Complete section */}
            <div className="mt-14 pt-8 border-t border-dashed border-gray-200">
              {completed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Lesson Complete!</h3>
                  <p className="text-green-600 text-sm mb-6">
                    Amazing work! You are making great progress.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {prevLesson && (
                      <Link
                        to={'/lessons/' + prevLesson._id}
                        className="px-5 py-2.5 border border-green-300 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
                      >
                        ← Previous
                      </Link>
                    )}
                    {nextLesson && (
                      <Link
                        to={'/lessons/' + nextLesson._id}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-200"
                      >
                        Next Lesson →
                      </Link>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className={`${dark ? 'bg-indigo-900/20 border-indigo-800' : 'bg-indigo-50 border-indigo-100'} border rounded-2xl p-8 text-center`}>
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Done reading?
                  </h3>
                  <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Mark this lesson as complete to track your progress and unlock next lesson.
                  </p>
                  <motion.button
                    onClick={handleComplete}
                    disabled={completing}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-10 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                  >
                    {completing ? 'Saving...' : '✓ Mark as Complete'}
                  </motion.button>
                </div>
              )}
            </div>

            {/* Prev / Next */}
            <div className="flex items-center justify-between mt-8 gap-4">
              {prevLesson ? (
                <Link
                  to={'/lessons/' + prevLesson._id}
                  className={`flex items-center gap-3 text-sm px-4 py-3.5 rounded-2xl border transition-all flex-1 max-w-xs group ${
                    dark ? 'border-gray-700 hover:border-indigo-500 hover:bg-gray-800' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <span className={`text-lg ${dark ? 'text-gray-400 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600'}`}>←</span>
                  <div className="min-w-0">
                    <p className={`text-xs mb-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Previous</p>
                    <p className={`font-semibold truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{prevLesson.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {nextLesson && (
                <Link
                  to={'/lessons/' + nextLesson._id}
                  className={`flex items-center gap-3 text-sm px-4 py-3.5 rounded-2xl border transition-all flex-1 max-w-xs text-right justify-end group ${
                    dark ? 'border-gray-700 hover:border-indigo-500 hover:bg-gray-800' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-xs mb-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Next</p>
                    <p className={`font-semibold truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{nextLesson.title}</p>
                  </div>
                  <span className={`text-lg ${dark ? 'text-gray-400 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600'}`}>→</span>
                </Link>
              )}
            </div>

            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonPage
