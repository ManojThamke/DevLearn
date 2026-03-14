import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('All fields are required')
      return
    }

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  const features = [
    { icon: '🎯', text: 'Continue from where you left off' },
    { icon: '📊', text: 'Track your progress across all modules' },
    { icon: '🤖', text: 'Access AI assistant anytime' },
    { icon: '🏆', text: 'View your scores and certificates' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 flex items-center justify-center px-4 py-12">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left — Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="text-2xl font-bold text-white">
                Dev<span className="text-indigo-400">Learn</span>
              </Link>
              <h2 className="text-2xl font-bold text-white mt-4">
                Welcome back!
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Continue your learning journey
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="Enter your password"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white/10 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  'Login to DevLearn →'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs">Don't have an account?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Register link */}
            <Link
              to="/register"
              className="block w-full text-center border border-white/10 text-gray-300 hover:border-indigo-500 hover:text-white font-medium py-3 rounded-xl transition-all text-sm"
            >
              Create Free Account 🚀
            </Link>

            {/* Back */}
            <div className="text-center mt-5">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                ← Back to home
              </Link>
            </div>

          </div>
        </motion.div>

        {/* Right — Features */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            Pick up right
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              where you left off
            </span>
          </h2>
          <p className="text-gray-400 mb-8">
            Your progress, scores and learning history are all saved and waiting for you.
          </p>

          <div className="space-y-4 mb-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <span className="text-xl">{f.icon}</span>
                <span className="text-gray-300 text-sm">{f.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Progress preview */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold text-sm">
                React.js Complete Guide
              </p>
              <span className="text-indigo-400 text-sm font-bold">65%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { mod: 'JS', done: true },
                { mod: 'React', done: true },
                { mod: 'Hooks', done: false },
                { mod: 'Advanced', done: false },
              ].map((m, i) => (
                <div
                  key={i}
                  className={`text-center py-2 rounded-lg text-xs font-medium ${
                    m.done
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-white/5 text-gray-500 border border-white/5'
                  }`}
                >
                  {m.done ? '✓ ' : ''}{m.mod}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default LoginPage
