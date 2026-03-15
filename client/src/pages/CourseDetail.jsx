import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// ── Module Accordion ───────────────────────────────────────────────
const ModuleItem = ({ module, index, isEnrolled, progress }) => {
  const [open, setOpen] = useState(index === 0)
  const completedLessons = progress?.completedLessons?.map(id =>
    typeof id === 'object' ? id.toString() : id
  ) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="border border-gray-100 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
          index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
          index === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
          index === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
          'bg-gradient-to-br from-green-500 to-teal-500'
        }`}>
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900">{module.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {module.lessons?.length} lessons
          </p>
        </div>

        {isEnrolled && module.lessons?.length > 0 && (
          <span className="text-xs text-gray-400 mr-2">
            {module.lessons.filter(l =>
              completedLessons.includes(l._id.toString())
            ).length}/{module.lessons.length}
          </span>
        )}

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-lg"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100">

              {/* Lessons List */}
              {module.lessons?.map((lesson, i) => {
                const isCompleted = completedLessons.includes(lesson._id.toString())
                const isFree = lesson.isFree

                return (
                  <div
                    key={lesson._id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : isEnrolled || isFree
                        ? 'bg-indigo-50 text-indigo-500'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : isEnrolled || isFree ? '▶' : '🔒'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isCompleted ? 'text-green-700' :
                        isEnrolled || isFree ? 'text-gray-800' :
                        'text-gray-400'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {lesson.duration} min read
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isFree && !isEnrolled && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Free
                        </span>
                      )}
                      {isEnrolled ? (
                        <Link
                          to={'/lessons/' + lesson._id}
                          className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                            isCompleted
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {isCompleted ? '✓ Review' : 'Start →'}
                        </Link>
                      ) : isFree ? (
                        <Link
                          to={'/lessons/' + lesson._id}
                          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Preview
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-300 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg">
                          🔒 Locked
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* ── Submit Project Button ──────────────────────── */}
              {isEnrolled && (
                <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-cyan-50 border-t border-indigo-100">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-indigo-800">
                        🚀 Module Project
                      </p>
                      <p className="text-xs text-indigo-500 mt-0.5">
                        Complete lessons then submit for AI evaluation
                      </p>
                    </div>
                    <Link
                      to={'/submit/' + module._id}
                      className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                    >
                      Submit →
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────
const CourseDetail = () => {
  const { slug } = useParams()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [progress, setProgress] = useState(null)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const res = await api.get('/courses/' + slug)
        setCourse(res.data.course)
        setIsEnrolled(res.data.isEnrolled)
        setProgress(res.data.progress)
      } catch (err) {
        setError('Course not found')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [slug])

  const handleEnroll = async () => {
    if (!isLoggedIn) { navigate('/register'); return }
    try {
      setEnrolling(true)
      await api.post('/courses/' + course._id + '/enroll')
      setIsEnrolled(true)
      setProgress({ completedLessons: [], percentComplete: 0 })
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-80 bg-gray-200 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
        <Link to="/courses" className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl">
          Browse Courses
        </Link>
      </div>
    )
  }

  const totalLessons = course.modules?.reduce((t, m) => t + (m.lessons?.length || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 py-16 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-white">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColors[course.level]}`}>
                  {course.level}
                </span>
                {course.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                {course.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 leading-relaxed mb-6"
              >
                {course.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-6"
              >
                {[
                  { icon: '📦', label: course.totalModules + ' Modules' },
                  { icon: '📖', label: totalLessons + ' Lessons' },
                  { icon: '🚀', label: '4 Projects' },
                  { icon: '👥', label: course.enrolledCount + ' Students' },
                  { icon: '🤖', label: 'AI Evaluation' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                    <span>{stat.icon}</span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Enroll Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <p className="text-2xl font-bold text-gray-900 mb-1">Free</p>
                  <p className="text-gray-500 text-sm mb-4">Full access to all content</p>

                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-bold text-indigo-600">
                            {progress?.percentComplete || 0}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: (progress?.percentComplete || 0) + '%' }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                          />
                        </div>
                      </div>
                      <Link
                        to={'/lessons/' + course.modules?.[0]?.lessons?.[0]?._id}
                        className="block w-full text-center bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                      >
                        Continue Learning →
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                    >
                      {enrolling ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enrolling...
                        </span>
                      ) : isLoggedIn ? 'Enroll Now — Free' : 'Sign Up to Enroll'}
                    </button>
                  )}

                  <div className="mt-4 space-y-2">
                    {[
                      '✅ Full lifetime access',
                      '✅ AI code evaluation',
                      '✅ Certificate of completion',
                      '✅ AI assistant 24/7',
                    ].map((item, i) => (
                      <p key={i} className="text-xs text-gray-500">{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Modules */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
            <div className="space-y-3">
              {course.modules?.map((module, i) => (
                <ModuleItem
                  key={module._id}
                  module={module}
                  index={i}
                  isEnrolled={isEnrolled}
                  progress={progress}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Mobile enroll */}
            <div className="lg:hidden bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {isEnrolled ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Your Progress</span>
                      <span className="font-bold text-indigo-600">
                        {progress?.percentComplete || 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: (progress?.percentComplete || 0) + '%' }}
                      />
                    </div>
                  </div>
                  <Link
                    to={'/lessons/' + course.modules?.[0]?.lessons?.[0]?._id}
                    className="block w-full text-center bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold py-3 rounded-xl"
                  >
                    Continue Learning →
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold py-3 rounded-xl"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
                </button>
              )}
            </div>

            {/* What you will learn */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">What you will learn</h3>
              <div className="space-y-2.5">
                {[
                  'Modern JavaScript ES6+ features',
                  'React components, props and state',
                  'All essential React Hooks',
                  'Context API for state management',
                  'React Router for navigation',
                  'Performance optimization',
                  'TailwindCSS styling',
                  'Build 4 real projects',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-indigo-500 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Requirements</h3>
              <div className="space-y-2.5">
                {[
                  'Basic computer knowledge',
                  'Text editor (VS Code recommended)',
                  'No prior React experience needed',
                  'Willingness to learn and practice',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-gray-400 mt-0.5">•</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default CourseDetail
