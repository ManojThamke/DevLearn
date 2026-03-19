import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// ── Stat Card ──────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
  </motion.div>
)

// ── Progress Ring ──────────────────────────────────────────────────
const ProgressRing = ({ percent }) => {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
        <circle
          cx="44" cy="44" r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <motion.circle
          cx="44" cy="44" r={radius}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{percent}%</span>
      </div>
    </div>
  )
}

// ── Course Progress Card ───────────────────────────────────────────
const CourseProgressCard = ({ enrollment, index }) => {
  const { course, percentComplete, completedLessons, enrolledAt } = enrollment
  const [imageLoaded, setImageLoaded] = useState(true)

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
    >
      {/* Course thumbnail */}
      <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${gradientMap[course.slug] || 'from-gray-700 to-gray-900'}`}>
        {imageLoaded && course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={() => setImageLoaded(false)}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[course.level]}`}>
            {course.level}
          </span>
          <span className="text-white text-xs bg-black/40 px-2 py-1 rounded-full flex-shrink-0">
            {completedLessons}/{course.totalLessons}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Enrolled {new Date(enrolledAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500">Progress</span>
            <span className="font-bold text-indigo-600">{percentComplete}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: percentComplete + '%' }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>

        <Link
          to={'/courses/' + course.slug}
          className="block w-full text-center bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:shadow-md hover:shadow-indigo-500/30 transition-all"
        >
          {percentComplete === 0 ? 'Start Learning →' : percentComplete === 100 ? 'Review Course ✓' : 'Continue →'}
        </Link>
      </div>
    </motion.div>
  )
}

// ── Empty Enrollment ───────────────────────────────────────────────
const EmptyEnrollment = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center"
  >
    <div className="text-5xl mb-4">📚</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">
      No courses yet
    </h3>
    <p className="text-gray-500 mb-6">
      Enroll in your first course and start your coding journey!
    </p>
    <Link
      to="/courses"
      className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
    >
      🚀 Browse Courses
    </Link>
  </motion.div>
)

// ── Main Page ──────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ enrolledCourses: 0, totalLessonsCompleted: 0 })

  const fetchProgress = async () => {
    try {
      setLoading(true)

      // Fetch profile stats (more reliable)
      const profileRes = await api.get('/profile')
      console.log('Profile stats:', profileRes.data.stats)
      setStats(profileRes.data.stats || { enrolledCourses: 0, totalLessonsCompleted: 0 })

      // Fetch progress/enrollments for course cards
      const progressRes = await api.get('/progress')
      console.log('Progress enrollments:', progressRes.data)
      setEnrollments(progressRes.data.enrollments || [])
    } catch (err) {
      console.error('Dashboard fetch error:', err.response?.data || err.message)
      setEnrollments([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    fetchProgress()
  }, [])

  // Refetch when navigating to dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      fetchProgress()
    }
  }, [location])

  // Refresh when page becomes visible (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProgress()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Computed stats
  const totalLessonsCompleted = enrollments.reduce(
    (t, e) => t + (e.completedLessons || 0), 0
  )
  const completedCourses = enrollments.filter(e => e.isCompleted).length
  const inProgressCourses = enrollments.filter(
    e => !e.isCompleted && e.percentComplete > 0
  ).length

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 px-4 py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute right-0 top-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-indigo-400 text-sm font-medium mb-1">
                {greeting()},
              </p>
              <h1 className="text-3xl font-bold text-white">
                {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-400 mt-1">
                Keep going! You are making great progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={fetchProgress}
                disabled={loading}
                className="hidden md:flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                Refresh
              </button>
              <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-3">
                <div className="text-right">
                  <p className="text-white font-bold text-xl">
                    {user?.xpTotal || 0} XP
                  </p>
                  <p className="text-gray-400 text-xs">Total Points</p>
                </div>
                <div className="text-3xl">⭐</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon="📚"
            label="Enrolled Courses"
            value={enrollments.length}
            color="bg-indigo-50"
            delay={0}
          />
          <StatCard
            icon="✅"
            label="Lessons Completed"
            value={totalLessonsCompleted}
            color="bg-green-50"
            delay={0.1}
          />
          <StatCard
            icon="🔥"
            label="In Progress"
            value={inProgressCourses}
            color="bg-orange-50"
            delay={0.2}
          />
          <StatCard
            icon="🏆"
            label="Completed"
            value={completedCourses}
            color="bg-yellow-50"
            delay={0.3}
          />
        </div>
      </section>

      {/* ── My Courses ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            My Courses
          </h2>
          <Link
            to="/courses"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Browse More →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {enrollments.length === 0
              ? <EmptyEnrollment />
              : enrollments.map((enrollment, i) => (
                <CourseProgressCard
                  key={enrollment.course._id}
                  enrollment={enrollment}
                  index={i}
                />
              ))
            }
          </div>
        )}
      </section>

      {/* ── Overall Progress ────────────────────────────────────── */}
      {enrollments.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Overall Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.map((enrollment, i) => (
              <motion.div
                key={enrollment.course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
              >
                <div className="flex-shrink-0">
                  <ProgressRing percent={enrollment.percentComplete} />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-bold text-gray-900 truncate">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {enrollment.completedLessons} of {enrollment.course.totalLessons} lessons done
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {enrollment.isCompleted ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                        ✓ Completed
                      </span>
                    ) : enrollment.percentComplete > 0 ? (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                        🔥 In Progress
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                        Not Started
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to={'/courses/' + enrollment.course.slug}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex-shrink-0 whitespace-nowrap"
                >
                  View →
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: '📚', label: 'Browse Courses', to: '/courses', color: 'from-indigo-500 to-cyan-500' },
            { icon: '🤖', label: 'Ask AI', to: '#', color: 'from-purple-500 to-pink-500', action: true },
            { icon: '👤', label: 'Edit Profile', to: '/profile', color: 'from-orange-500 to-yellow-500' },
            { icon: '🏆', label: 'Certificates', to: '/certificates', color: 'from-green-500 to-teal-500' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={item.to}
                className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 group text-center h-full"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-lg sm:text-2xl group-hover:scale-110 transition-transform shadow-md`}>
                  {item.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Dashboard
