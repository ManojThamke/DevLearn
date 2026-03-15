import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

// ── Requirement Item ───────────────────────────────────────────────
const RequirementItem = ({ text, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-start gap-3 py-2"
  >
    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
      {index + 1}
    </div>
    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
  </motion.div>
)

// ── Tab Button ─────────────────────────────────────────────────────
const TabButton = ({ active, onClick, icon, label, desc }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl border-2 transition-all ${
      active
        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <span className="text-2xl">{icon}</span>
    <span className="font-semibold text-sm">{label}</span>
    <span className={`text-xs ${active ? 'text-indigo-500' : 'text-gray-400'}`}>{desc}</span>
  </button>
)

// ── Main Page ──────────────────────────────────────────────────────
const ProjectSubmitPage = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('github')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState(null)
  const [previousSubmissions, setPreviousSubmissions] = useState([])

  // GitHub tab
  const [repoUrl, setRepoUrl] = useState('')
  const [repoError, setRepoError] = useState('')

  // ZIP tab
  const [zipFile, setZipFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)

        // ── Fetch project by module ID ─────────────────────────
        const projectRes = await api.get('/projects/module/' + projectId)
        const fetchedProject = projectRes.data.project
        setProject(fetchedProject)

        // ── Fetch previous submissions using real project _id ──
        if (fetchedProject?._id) {
          try {
            const subRes = await api.get('/submissions/project/' + fetchedProject._id)
            setPreviousSubmissions(subRes.data.submissions || [])
          } catch {
            setPreviousSubmissions([])
          }
        }
      } catch (err) {
        console.error('Project fetch error:', err)
        setError('Project not found for this module')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [projectId])

  // Validate GitHub URL
  const validateGithubUrl = (url) => {
    const pattern = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/
    return pattern.test(url)
  }

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndSetFile(file)
  }

  const validateAndSetFile = (file) => {
    const allowed = ['.zip', '.rar', '.tar', '.gz']
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext)) {
      setSubmitError('Only ZIP, RAR, TAR and GZ files are allowed')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      setSubmitError('File size must be less than 100MB')
      return
    }
    setZipFile(file)
    setSubmitError('')
  }

  // Handle GitHub submission
  const handleGithubSubmit = async () => {
    setSubmitError('')
    setRepoError('')

    if (!repoUrl.trim()) {
      setRepoError('Please enter a GitHub repository URL')
      return
    }

    if (!validateGithubUrl(repoUrl)) {
      setRepoError('Please enter a valid GitHub URL (e.g. https://github.com/username/repo)')
      return
    }

    try {
      setSubmitting(true)
      const res = await api.post('/submissions', {
        projectId: project._id,  // ← use real project _id
        method: 'github',
        repoUrl: repoUrl.trim(),
      })
      setSubmissionId(res.data.submission._id)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle ZIP submission
  const handleZipSubmit = async () => {
    setSubmitError('')

    if (!zipFile) {
      setSubmitError('Please select a ZIP file')
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('file', zipFile)
      formData.append('projectId', project._id)  // ← use real project _id

      const res = await api.post('/submissions/upload-zip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSubmissionId(res.data.submission._id)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Project not found</h2>
        <p className="text-gray-500 text-sm mb-6">
          No project found for this module yet.
        </p>
        <Link
          to="/dashboard"
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  // ── Success State ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submitted Successfully!
          </h2>
          <p className="text-gray-500 mb-2">
            Your project has been submitted and is now being evaluated.
          </p>
          <p className="text-sm text-indigo-600 font-medium mb-8">
            AI evaluation usually takes 1-2 minutes.
          </p>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-800">Evaluation in Progress</p>
                <p className="text-xs text-indigo-500">AI is analyzing your code</p>
              </div>
            </div>
            <div className="space-y-2">
              {['Code Quality', 'Security', 'Performance', 'Professionalism'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-400 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-xs text-indigo-500 w-28 flex-shrink-0">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to={'/submissions/' + submissionId}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm"
            >
              View Submission & Score →
            </Link>
            <Link
              to="/submissions"
              className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              All My Submissions
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 rounded-3xl p-8 mb-6 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <span>›</span>
              <span className="text-white">Submit Project</span>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🚀</span>
                  <h1 className="text-2xl font-bold text-white">
                    {project?.title || 'Submit Project'}
                  </h1>
                </div>
                <p className="text-gray-400 text-sm max-w-xl">
                  {project?.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project?.difficulty && (
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${difficultyColors[project.difficulty]}`}>
                    {project.difficulty}
                  </span>
                )}
                {project?.estimatedHours && (
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full">
                    ⏱ {project.estimatedHours}h estimated
                  </span>
                )}
                {previousSubmissions.length > 0 && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full">
                    Attempt #{previousSubmissions.length + 1}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left — Submission Form ───────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Tabs */}
              <div className="flex gap-3 mb-5">
                <TabButton
                  active={activeTab === 'github'}
                  onClick={() => { setActiveTab('github'); setSubmitError('') }}
                  icon="🐙"
                  label="GitHub URL"
                  desc="Paste repo link"
                />
                <TabButton
                  active={activeTab === 'zip'}
                  onClick={() => { setActiveTab('zip'); setSubmitError('') }}
                  icon="📦"
                  label="ZIP Upload"
                  desc="Upload file"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4"
                  >
                    ⚠️ {submitError}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">

                {/* GitHub Tab */}
                {activeTab === 'github' && (
                  <motion.div
                    key="github"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Submit via GitHub</h3>
                      <p className="text-sm text-gray-500">
                        Push your code to GitHub and paste the repository URL below.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Before submitting:
                      </p>
                      {[
                        'Make sure your repo is PUBLIC',
                        'Include a README.md file',
                        'Push all your latest changes',
                        'Test your code works before submitting',
                      ].map((tip, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-green-500 flex-shrink-0">✓</span>
                          {tip}
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub Repository URL
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                          🐙
                        </span>
                        <input
                          type="url"
                          value={repoUrl}
                          onChange={e => {
                            setRepoUrl(e.target.value)
                            setRepoError('')
                          }}
                          placeholder="https://github.com/yourusername/your-project"
                          className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all ${
                            repoError
                              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                              : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                          }`}
                        />
                      </div>
                      {repoError && (
                        <p className="text-red-500 text-xs mt-1.5">{repoError}</p>
                      )}
                      {repoUrl && !repoError && validateGithubUrl(repoUrl) && (
                        <p className="text-green-500 text-xs mt-1.5 flex items-center gap-1">
                          <span>✓</span> Valid GitHub URL
                        </p>
                      )}
                    </div>

                    <motion.button
                      onClick={handleGithubSubmit}
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : '🚀 Submit Project'}
                    </motion.button>
                  </motion.div>
                )}

                {/* ZIP Tab */}
                {activeTab === 'zip' && (
                  <motion.div
                    key="zip"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Submit via ZIP File</h3>
                      <p className="text-sm text-gray-500">
                        Compress your project folder and upload it here.
                      </p>
                    </div>

                    {/* Drop zone */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                        dragOver
                          ? 'border-indigo-400 bg-indigo-50'
                          : zipFile
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip,.rar,.tar,.gz"
                        onChange={e => e.target.files[0] && validateAndSetFile(e.target.files[0])}
                        className="hidden"
                      />
                      <AnimatePresence mode="wait">
                        {zipFile ? (
                          <motion.div
                            key="file"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-2"
                          >
                            <div className="text-4xl">📦</div>
                            <p className="font-semibold text-green-700">{zipFile.name}</p>
                            <p className="text-sm text-green-600">{formatFileSize(zipFile.size)}</p>
                            <p className="text-xs text-gray-400">Click to change file</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3"
                          >
                            <div className="text-4xl">{dragOver ? '📂' : '📁'}</div>
                            <div>
                              <p className="font-semibold text-gray-700">
                                {dragOver ? 'Drop your file here!' : 'Drop file or click to browse'}
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                ZIP, RAR, TAR, GZ up to 100MB
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {zipFile && (
                      <button
                        onClick={() => setZipFile(null)}
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove file
                      </button>
                    )}

                    <motion.button
                      onClick={handleZipSubmit}
                      disabled={submitting || !zipFile}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : '📦 Upload & Submit'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Previous Submissions */}
            {previousSubmissions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">
                  Previous Submissions ({previousSubmissions.length})
                </h3>
                <div className="space-y-3">
                  {previousSubmissions.map((sub) => (
                    <div
                      key={sub._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          sub.status === 'completed' ? 'bg-green-100 text-green-700' :
                          sub.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {sub.attemptNumber}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Attempt #{sub.attemptNumber}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })} · {sub.method.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {sub.score && (
                          <span className="text-sm font-bold text-indigo-600">
                            {sub.score.scores?.final || 0}/100
                          </span>
                        )}
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          sub.status === 'completed' ? 'bg-green-100 text-green-700' :
                          sub.status === 'failed' ? 'bg-red-100 text-red-700' :
                          sub.status === 'evaluating' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {sub.status}
                        </span>
                        <Link
                          to={'/submissions/' + sub._id}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right — Project Info ─────────────────────────── */}
          <div className="space-y-5">

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📋</span> Requirements
              </h3>
              <div className="divide-y divide-gray-50">
                {project?.requirements?.length > 0 ? (
                  project.requirements.map((req, i) => (
                    <RequirementItem key={i} text={req} index={i} />
                  ))
                ) : (
                  <p className="text-sm text-gray-400 py-2">No requirements listed</p>
                )}
              </div>
            </motion.div>

            {/* Tech Stack */}
            {project?.techStack?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>⚡</span> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl border border-indigo-100 p-5"
            >
              <h3 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                <span>💡</span> AI Evaluation Tips
              </h3>
              <div className="space-y-2">
                {[
                  'Write clean, readable code',
                  'Add meaningful comments',
                  'Handle errors properly',
                  'Use proper folder structure',
                  'Include a README.md',
                  'Avoid hardcoded credentials',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-indigo-700">
                    <span className="text-indigo-400 flex-shrink-0 mt-0.5">•</span>
                    {tip}
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectSubmitPage
