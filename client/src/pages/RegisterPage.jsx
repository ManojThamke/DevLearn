import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1) // 2 step form

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleStep1 = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Name is required')
    if (!form.email.trim()) return setError('Email is required')
    if (!form.email.includes('@')) return setError('Enter a valid email')
    setStep(2)
  }

  const handleStep2 = async (e) => {
    e.preventDefault()
    if (!form.password) return setError('Password is required')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (form.password !== form.confirm) return setError('Passwords do not match')

    setLoading(true)
    const result = await register(form.name, form.email, form.password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  const benefits = [
    '✅ Free access to all 16 lessons',
    '✅ 4 real-world projects to build',
    '✅ AI code evaluation and feedback',
    '✅ AI assistant available 24/7',
    '✅ Interview questions in every lesson',
    '✅ Progress tracking and certificates',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 flex items-center justify-center px-4 py-12">

      {/* Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left — Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <Link to="/" className="text-3xl font-bold text-white mb-8 block">
            Dev<span className="text-indigo-400">Learn</span>
          </Link>

          <h2 className="text-3xl font-bold text-white mb-3">
            Start your journey
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              completely free
            </span>
          </h2>

          <p className="text-gray-400 mb-8">
            Join and get instant access to everything you need to become a React developer.
          </p>

          <div className="space-y-3">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="text-gray-300 text-sm"
              >
                {b}
              </motion.div>
            ))}
          </div>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-lg">
                👨‍💻
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Rahul Sharma</p>
                <p className="text-gray-400 text-xs">Frontend Developer at TCS</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm italic">
              "Got placed at TCS within 2 months of completing DevLearn!"
            </p>
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

            {/* Logo mobile */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="text-2xl font-bold text-white">
                Dev<span className="text-indigo-400">Learn</span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Create your account</h2>
              <p className="text-gray-400 text-sm mt-1">Free forever. No credit card needed.</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-400' : 'text-gray-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <span className="text-xs font-medium">Your info</span>
              </div>
              <div className={`flex-1 h-px ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-700'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-400' : 'text-gray-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  2
                </div>
                <span className="text-xs font-medium">Password</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleStep1}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="Manoj Thamke"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  Continue →
                </motion.button>
              </motion.form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleStep2}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => handleChange('password', e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white/10 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={e => handleChange('confirm', e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Password strength */}
                {form.password && (
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            form.password.length >= i * 3
                              ? i <= 1 ? 'bg-red-500'
                              : i <= 2 ? 'bg-yellow-500'
                              : i <= 3 ? 'bg-blue-500'
                              : 'bg-green-500'
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {form.password.length < 4 ? 'Weak' : form.password.length < 7 ? 'Fair' : form.password.length < 10 ? 'Good' : 'Strong'} password
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-white/10 text-gray-300 hover:border-white/30 font-semibold py-3 rounded-xl transition-all"
                  >
                    ← Back
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-2 flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      'Create Account 🚀'
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs">Already have an account?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Link
              to="/login"
              className="block w-full text-center border border-white/10 text-gray-300 hover:border-indigo-500 hover:text-white font-medium py-3 rounded-xl transition-all text-sm"
            >
              Login Instead
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default RegisterPage
