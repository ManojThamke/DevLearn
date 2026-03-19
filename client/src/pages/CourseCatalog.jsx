import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

// ── Course Card ────────────────────────────────────────────────────
const CourseCard = ({ course, index }) => {
  const [imageLoaded, setImageLoaded] = useState(true)

  const levelColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200',
  }

  const levelIcons = {
    beginner: '🌱',
    intermediate: '🔥',
    advanced: '⚡',
  }

  const gradientMap = {
    'react-complete-guide': 'from-blue-500 to-cyan-500',
    'javascript-advanced': 'from-yellow-500 to-orange-500',
    'nodejs-complete-guide': 'from-green-600 to-teal-600',
    'typescript-mastery': 'from-blue-600 to-blue-400',
    'nextjs-fullstack': 'from-purple-600 to-pink-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
    >
      {/* Thumbnail */}
      <div className={`relative overflow-hidden h-48 bg-gradient-to-br ${gradientMap[course.slug] || 'from-gray-700 to-gray-900'}`}>
        {imageLoaded && course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={() => setImageLoaded(false)}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Level badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${levelColors[course.level]}`}>
            {levelIcons[course.level]} {course.level}
          </span>
        </div>

        {/* Enrolled count */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
            👥 {course.enrolledCount} students
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {course.tags?.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 py-3 border-t border-gray-100 mb-4">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <span>📦</span>
            <span>{course.totalModules} modules</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <span>📖</span>
            <span>{course.totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <span>🚀</span>
            <span>4 projects</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={'/courses/' + course.slug}
          className="block w-full text-center bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 text-sm"
        >
          View Course →
        </Link>
      </div>
    </motion.div>
  )
}

// ── Skeleton Loader ────────────────────────────────────────────────
const CourseSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-10 bg-gray-200 rounded-xl w-full mt-4" />
    </div>
  </div>
)

// ── Main Page ──────────────────────────────────────────────────────
const CourseCatalog = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const res = await api.get('/courses')
        setCourses(res.data.courses)
      } catch (err) {
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Filter courses
  const filtered = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))

    const matchesLevel =
      selectedLevel === 'all' || course.level === selectedLevel

    return matchesSearch && matchesLevel
  })

  const levels = ['all', 'beginner', 'intermediate', 'advanced']

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 py-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {courses.length} Course{courses.length !== 1 ? 's' : ''} Available
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Our Courses
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
              Structured learning paths with real projects and AI-powered evaluation.
            </p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto w-full px-4 sm:px-0">
              <span className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search courses, topics..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl pl-11 sm:pl-11 pr-5 py-3 sm:py-3.5 text-sm outline-none focus:border-indigo-500 focus:bg-white/15 transition-all backdrop-blur-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Filters + Courses ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        {/* Filter tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all capitalize whitespace-nowrap flex-shrink-0 ${
                  selectedLevel === level
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {level === 'all' ? '🌐 All' : level === 'beginner' ? '🌱 Beginner' : level === 'intermediate' ? '🔥 Intermediate' : '⚡ Advanced'}
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-sm whitespace-nowrap">
            {loading ? 'Loading...' : filtered.length + ' course' + (filtered.length !== 1 ? 's' : '') + ' found'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">😕</p>
            <p className="text-gray-700 font-semibold text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map(i => <CourseSkeleton key={i} />)}
          </div>
        )}

        {/* Courses grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try searching for something else or clear filters
                </p>
                <button
                  onClick={() => { setSearch(''); setSelectedLevel('all') }}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((course, i) => (
                  <CourseCard key={course._id} course={course} index={i} />
                ))}
              </div>
            )}
          </>
        )}

      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <section className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 py-16 px-4 text-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to start learning?
            </h2>
            <p className="text-gray-400 mb-6">
              Free forever. No credit card needed.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
            >
              🚀 Get Started Free
            </Link>
          </motion.div>
        </section>
      )}

    </div>
  )
}

export default CourseCatalog