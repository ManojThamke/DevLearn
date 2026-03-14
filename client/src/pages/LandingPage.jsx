import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ── Floating Particles ─────────────────────────────────────────────
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 25 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 5 + 2,
          height: Math.random() * 5 + 2,
          background: i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#38bdf8' : '#a78bfa',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
        }}
        animate={{ y: [0, -40, 0], x: [0, Math.random() * 20 - 10, 0], opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 3 }}
      />
    ))}
  </div>
)

// ── Grid Overlay ───────────────────────────────────────────────────
const GridOverlay = () => (
  <div
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
    }}
  />
)

// ── Typing Animation ───────────────────────────────────────────────
const TypingText = ({ words }) => {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index]
    let timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50)
    } else {
      setDeleting(false)
      setIndex(i => (i + 1) % words.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, index, words])

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
      {displayed}
      <span className="animate-pulse text-indigo-400">|</span>
    </span>
  )
}

// ── Animated Counter ───────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

// ── Data ───────────────────────────────────────────────────────────
const stats = [
  { label: 'Lessons', value: 16, suffix: '+' },
  { label: 'Projects', value: 4, suffix: '' },
  { label: 'Modules', value: 4, suffix: '' },
  { label: 'Students', value: 100, suffix: '+' },
]

const features = [
  { icon: '🎯', title: 'Structured Roadmap', desc: 'Follow a carefully designed path from JavaScript basics to advanced React.' },
  { icon: '🤖', title: 'AI Code Evaluation', desc: 'Get instant AI feedback on quality, security and performance of your code.' },
  { icon: '🚀', title: 'Real World Projects', desc: 'Build 4 production-ready projects to add to your portfolio.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Visual progress tracking across all modules with XP points and badges.' },
  { icon: '💡', title: 'Interview Prep', desc: 'Every lesson includes real interview questions with detailed answers.' },
  { icon: '⚡', title: 'Modern Stack', desc: 'React, TailwindCSS, Node.js and MongoDB — most in-demand skills of 2024.' },
]

const modules = [
  { order: 1, title: 'JavaScript for React', lessons: 4, project: 'Movie Search App', color: 'from-yellow-500 to-orange-500', icon: '⚡' },
  { order: 2, title: 'React Fundamentals', lessons: 4, project: 'Todo List App', color: 'from-blue-500 to-cyan-500', icon: '⚛️' },
  { order: 3, title: 'React Hooks', lessons: 4, project: 'Weather Dashboard', color: 'from-purple-500 to-pink-500', icon: '🪝' },
  { order: 4, title: 'Advanced React', lessons: 4, project: 'Full Blog Platform', color: 'from-green-500 to-teal-500', icon: '🚀' },
]

const techStack = [
  { name: 'React.js', icon: '⚛️', color: 'from-cyan-500 to-blue-500', desc: 'UI Library' },
  { name: 'JavaScript', icon: '🟨', color: 'from-yellow-400 to-orange-400', desc: 'Language' },
  { name: 'TailwindCSS', icon: '🎨', color: 'from-teal-400 to-cyan-400', desc: 'Styling' },
  { name: 'Node.js', icon: '🟢', color: 'from-green-500 to-emerald-500', desc: 'Backend' },
  { name: 'MongoDB', icon: '🍃', color: 'from-green-600 to-teal-600', desc: 'Database' },
  { name: 'Git & GitHub', icon: '🐙', color: 'from-gray-500 to-gray-700', desc: 'Version Control' },
]

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Frontend Developer at TCS',
    avatar: '👨‍💻',
    text: 'DevLearn completely changed how I approach coding. The AI feedback helped me identify bad habits I never knew I had. Got placed at TCS within 2 months!',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'React Developer at Infosys',
    avatar: '👩‍💻',
    text: 'The structured roadmap is exactly what I needed. No more wondering what to learn next. The projects are real-world and the lessons are crystal clear.',
    rating: 5,
  },
  {
    name: 'Ankit Desai',
    role: 'Full Stack Developer',
    avatar: '🧑‍💻',
    text: 'I tried many platforms but DevLearn is different. The interview questions in every lesson and AI assistant helped me crack 3 interviews!',
    rating: 5,
  },
]

const faqs = [
  {
    q: 'Is DevLearn completely free?',
    a: 'Yes! DevLearn is completely free to use. You get access to all lessons, projects and AI evaluation at no cost.',
  },
  {
    q: 'Do I need any prior experience?',
    a: 'No prior experience needed. We start from JavaScript basics and take you all the way to advanced React development.',
  },
  {
    q: 'How does AI code evaluation work?',
    a: 'After completing a module project, you submit your code via GitHub link or ZIP upload. Our AI analyzes it for quality, security, performance and professionalism — giving you a detailed score and feedback within seconds.',
  },
  {
    q: 'How long does the course take?',
    a: 'At your own pace! Most students complete it in 4-8 weeks studying 1-2 hours daily. The platform tracks your progress so you can pick up exactly where you left off.',
  },
  {
    q: 'Will I get a certificate?',
    a: 'Yes! After completing all 4 modules and their projects, you receive a certificate of completion that you can share on LinkedIn.',
  },
  {
    q: 'What makes DevLearn different from YouTube tutorials?',
    a: 'YouTube gives you passive learning. DevLearn gives you structured lessons + hands-on projects + AI evaluation + progress tracking + an AI assistant to clear doubts instantly.',
  },
]

// ── FAQ Item ───────────────────────────────────────────────────────
const FAQItem = ({ faq, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border border-gray-100 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-indigo-600 text-2xl flex-shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-gray-500 leading-relaxed bg-white">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Newsletter ─────────────────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Stay Updated
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
            Get coding tips in your inbox
          </h2>
          <p className="text-gray-500 mb-8">
            Weekly React tips, interview questions and project ideas. No spam ever.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl"
            >
              🎉 You're subscribed! Check your inbox for a welcome email.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all whitespace-nowrap"
              >
                Subscribe →
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// ── Main Page ──────────────────────────────────────────────────────
const LandingPage = () => {
  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 flex items-center justify-center">
        <Particles />
        <GridOverlay />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm px-5 py-2.5 rounded-full mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Now Live — Start Learning Today for Free
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          >
            Master{' '}
            <TypingText words={['React.js', 'TailwindCSS', 'Node.js', 'JavaScript', 'Full Stack']} />
            <br />
            <span className="text-gray-300 text-4xl md:text-6xl">
              and land your dream job
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A structured learning platform with AI-powered code evaluation,
            real-world projects, interview preparation and an AI assistant
            available 24/7 to clear your doubts instantly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/register"
              className="relative group px-10 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-2xl text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50"
            >
              <span className="relative z-10">🚀 Start Learning Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              to="/courses"
              className="px-10 py-4 border-2 border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-white font-bold rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:bg-indigo-500/10"
            >
              Browse Courses →
            </Link>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl py-4 px-2 text-center backdrop-blur-sm"
              >
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll down */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500"
        >
          <span className="text-xs">Scroll down</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Why DevLearn
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Everything you need to become a developer
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Not just videos. A complete system with projects, AI feedback and progress tracking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VIDEO DEMO ════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 relative overflow-hidden">
        <Particles />
        <GridOverlay />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">
              Platform Demo
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">
              See DevLearn in action
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/20"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 bg-gray-700 rounded-full px-4 py-1 text-xs text-gray-400 ml-4 max-w-xs mx-auto text-center">
                devlearn.app/courses/react-complete-guide
              </div>
            </div>

            {/* Mock UI */}
            <div className="p-6 min-h-64">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {['JavaScript for React', 'React Fundamentals', 'React Hooks'].map((title, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-gray-800 rounded-xl p-4 border border-white/5"
                  >
                    <div className={`h-1.5 rounded-full mb-3 ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-indigo-500 w-2/3' : 'bg-gray-600 w-1/3'}`} />
                    <p className="text-white text-xs font-medium">{title}</p>
                    <p className="text-gray-500 text-xs mt-1">{i === 0 ? '4/4 lessons' : i === 1 ? '2/4 lessons' : '0/4 lessons'}</p>
                  </motion.div>
                ))}
              </div>
              <div className="bg-gray-800 rounded-xl p-5 border border-indigo-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm">📖</div>
                  <div>
                    <p className="text-white text-sm font-medium">ES6+ Basics</p>
                    <p className="text-gray-500 text-xs">Module 1 · Lesson 1 · 15 min</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Completed ✓</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '65%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">Overall Progress: 65%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ COURSE MODULES ════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Course Structure
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              React.js Complete Guide
            </h2>
            <p className="text-gray-500 mt-3">4 modules · 16 lessons · 4 real projects</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className={`h-1.5 bg-gradient-to-r ${mod.color}`} />
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {mod.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Module {mod.order}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                          {mod.lessons} lessons
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{mod.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-lg">🚀</span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Module Project</p>
                      <p className="text-sm font-semibold text-gray-800">{mod.project}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
            >
              View Full Course Details →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ TECH STACK ════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Tech Stack
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Industry-standard technologies
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Everything you learn here is used in real companies right now.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="flex flex-col items-center gap-3 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                  {tech.icon}
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm">{tech.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Process
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              How it works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up free and enroll in the React Complete Guide instantly', icon: '📝' },
              { step: '02', title: 'Learn', desc: 'Study structured lessons with code examples, tips and interview questions', icon: '📖' },
              { step: '03', title: 'Build Projects', desc: 'Complete one real-world project after each module to solidify skills', icon: '🏗️' },
              { step: '04', title: 'AI Evaluation', desc: 'Submit code and get detailed AI feedback on quality, security and performance', icon: '🤖' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center group"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-indigo-300 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl shadow-indigo-500/30"
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-xs font-bold text-indigo-500 tracking-widest">STEP {item.step}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 relative overflow-hidden">
        <Particles />
        <GridOverlay />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">
              Student Stories
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">
              From learners to developers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Frequently asked questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ════════════════════════════════════════════ */}
      <Newsletter />

      {/* ══ FINAL CTA ═════════════════════════════════════════════ */}
      <section className="py-28 bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 relative overflow-hidden">
        <Particles />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">
              Start Today
            </span>
            <h2 className="text-5xl font-bold text-white mt-3 mb-4">
              Your coding journey
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                starts right now
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Free forever. No credit card. No excuses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-2xl text-lg hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300"
              >
                🚀 Get Started Free
              </Link>
              <Link
                to="/courses"
                className="px-12 py-4 border-2 border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-white font-bold rounded-2xl text-lg transition-all duration-300 hover:scale-105"
              >
                View Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage