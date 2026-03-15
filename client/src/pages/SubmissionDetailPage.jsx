import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

// ── Score Ring ─────────────────────────────────────────────────────
const ScoreRing = ({ score, label, color, delay }) => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    const colors = {
        indigo: { stroke: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-600', light: '#e0e7ff' },
        green: { stroke: '#22c55e', bg: 'bg-green-50', text: 'text-green-600', light: '#dcfce7' },
        orange: { stroke: '#f97316', bg: 'bg-orange-50', text: 'text-orange-600', light: '#ffedd5' },
        purple: { stroke: '#a855f7', bg: 'bg-purple-50', text: 'text-purple-600', light: '#f3e8ff' },
    }

    const c = colors[color] || colors.indigo

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`${c.bg} rounded-2xl p-5 flex flex-col items-center gap-3`}
        >
            <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r={radius} fill="none" stroke={c.light} strokeWidth="8" />
                    <motion.circle
                        cx="48" cy="48" r={radius}
                        fill="none"
                        stroke={c.stroke}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, delay, ease: 'easeOut' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold ${c.text}`}>{score}</span>
                </div>
            </div>
            <p className={`text-sm font-semibold ${c.text}`}>{label}</p>
        </motion.div>
    )
}

// ── Feedback Section ───────────────────────────────────────────────
const FeedbackSection = ({ title, icon, content, color, delay }) => {
    if (!content) return null
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`rounded-2xl p-5 border ${color}`}
        >
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>{icon}</span>
                {title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
        </motion.div>
    )
}

// ── Main Page ──────────────────────────────────────────────────────
const SubmissionDetailPage = () => {
    const { id } = useParams()
    const [submission, setSubmission] = useState(null)
    const [score, setScore] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setLoading(true)
                const res = await api.get('/submissions/' + id)
                setSubmission(res.data.submission)
                setScore(res.data.score)
            } catch (err) {
                setError('Submission not found')
            } finally {
                setLoading(false)
            }
        }
        fetchSubmission()
    }, [id])

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        evaluating: 'bg-blue-100 text-blue-700 border-blue-200',
        completed: 'bg-green-100 text-green-700 border-green-200',
        failed: 'bg-red-100 text-red-700 border-red-200',
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 space-y-6">
                    <div className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-36 bg-white rounded-2xl animate-pulse border border-gray-100" />
                        ))}
                    </div>
                    <div className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
                </div>
            </div>
        )
    }

    if (error || !submission) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-5xl mb-4">😕</p>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission not found</h2>
                <Link to="/submissions" className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl">
                    My Submissions
                </Link>
            </div>
        )
    }

    const isPending = !score && submission.status === 'pending'
    const isEvaluating = submission.status === 'evaluating'

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 space-y-6">

                {/* ── Header ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 rounded-3xl p-8 relative overflow-hidden"
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
                            <Link to="/submissions" className="hover:text-white transition-colors">Submissions</Link>
                            <span>›</span>
                            <span className="text-white">Detail</span>
                        </div>

                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">
                                    {submission.project?.title || 'Project Submission'}
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    {submission.course?.title} · {submission.module?.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium border capitalize ${statusColors[submission.status] || 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {submission.status === 'pending' ? '⏳ Pending Evaluation' :
                                            submission.status === 'evaluating' ? '🤖 AI Evaluating...' :
                                                submission.status === 'completed' ? '✅ Evaluation Complete' :
                                                    '❌ Evaluation Failed'}
                                    </span>
                                    <span className="text-xs text-gray-400 bg-white/10 px-3 py-1.5 rounded-full capitalize">
                                        {submission.method === 'github' ? '🐙 GitHub' :
                                            submission.method === 'zip' ? '📦 ZIP Upload' : '💻 Editor'}
                                    </span>
                                    <span className="text-xs text-gray-400 bg-white/10 px-3 py-1.5 rounded-full">
                                        Attempt #{submission.attemptNumber}
                                    </span>
                                    <span className="text-xs text-gray-400 bg-white/10 px-3 py-1.5 rounded-full">
                                        {new Date(submission.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            {score?.scores?.final !== undefined && (
                                <div className="text-center bg-white/10 rounded-2xl px-6 py-4">
                                    <p className="text-gray-400 text-xs mb-1">Final Score</p>
                                    <p className={`text-5xl font-bold ${score.scores.final >= 80 ? 'text-green-400' :
                                            score.scores.final >= 60 ? 'text-yellow-400' :
                                                'text-red-400'
                                        }`}>
                                        {score.scores.final}
                                    </p>
                                    <p className="text-gray-400 text-sm">/100</p>
                                    {score.passed && (
                                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full mt-1 inline-block">
                                            ✓ Passed
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── Pending / Evaluating State ───────────────────────── */}
                {(isPending || isEvaluating) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center"
                    >
                        <div className="text-5xl mb-4">
                            {isPending ? '⏳' : '🤖'}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {isPending ? 'Waiting for Evaluation' : 'AI is Evaluating Your Code...'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            {isPending
                                ? 'Your submission is in the queue. AI evaluation will begin shortly.'
                                : 'Our AI is carefully analyzing your code. This usually takes 1-2 minutes.'
                            }
                        </p>
                        <div className="max-w-sm mx-auto space-y-3">
                            {['Code Quality', 'Security Analysis', 'Performance Check', 'Professionalism'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: isEvaluating ? '100%' : '30%' }}
                                            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 w-32 text-left">{item}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                        >
                            🔄 Refresh to check status
                        </button>
                    </motion.div>
                )}

                {/* ── Score Rings ──────────────────────────────────────── */}
                {score?.scores && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Score Breakdown</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ScoreRing score={score.scores.quality || 0} label="Code Quality" color="indigo" delay={0.1} />
                            <ScoreRing score={score.scores.security || 0} label="Security" color="green" delay={0.2} />
                            <ScoreRing score={score.scores.performance || 0} label="Performance" color="orange" delay={0.3} />
                            <ScoreRing score={score.scores.professionalism || 0} label="Professionalism" color="purple" delay={0.4} />
                        </div>
                    </div>
                )}

                {/* ── Pass / Fail Banner ───────────────────────────────── */}
                {score && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`rounded-2xl p-5 border text-center ${score.passed
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                    >
                        <p className="text-3xl mb-2">{score.passed ? '🏆' : '📚'}</p>
                        <p className={`font-bold text-lg ${score.passed ? 'text-green-800' : 'text-red-800'}`}>
                            {score.passed ? 'Congratulations! You Passed!' : 'Keep Learning and Try Again!'}
                        </p>
                        <p className={`text-sm mt-1 ${score.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {score.passed
                                ? 'Great work! Your code meets the quality standards.'
                                : 'Review the feedback below and resubmit to improve your score.'
                            }
                        </p>
                    </motion.div>
                )}

                {/* ── AI Feedback ──────────────────────────────────────── */}
                {score?.feedback && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">AI Feedback</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FeedbackSection
                                title="Code Quality"
                                icon="⭐"
                                content={score.feedback.quality}
                                color="bg-indigo-50 border-indigo-100"
                                delay={0.1}
                            />
                            <FeedbackSection
                                title="Security"
                                icon="🔒"
                                content={score.feedback.security}
                                color="bg-green-50 border-green-100"
                                delay={0.2}
                            />
                            <FeedbackSection
                                title="Performance"
                                icon="⚡"
                                content={score.feedback.performance}
                                color="bg-orange-50 border-orange-100"
                                delay={0.3}
                            />
                            <FeedbackSection
                                title="Professionalism"
                                icon="💼"
                                content={score.feedback.professionalism}
                                color="bg-purple-50 border-purple-100"
                                delay={0.4}
                            />
                        </div>
                    </div>
                )}

                {/* ── Critical Issues ──────────────────────────────────── */}
                {score?.criticalIssues?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-red-50 border border-red-200 rounded-2xl p-5"
                    >
                        <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                            <span>🚨</span> Critical Issues to Fix
                        </h3>
                        <div className="space-y-2">
                            {score.criticalIssues.map((issue, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-red-700">
                                    <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                                    {issue}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Improvements ─────────────────────────────────────── */}
                {score?.improvements?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-blue-50 border border-blue-200 rounded-2xl p-5"
                    >
                        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <span>💡</span> Suggested Improvements
                        </h3>
                        <div className="space-y-2">
                            {score.improvements.map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-blue-700">
                                    <span className="text-blue-400 flex-shrink-0 font-bold">{i + 1}.</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Submission Info ───────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                    <h3 className="font-bold text-gray-900 mb-4">Submission Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Project', value: submission.project?.title },
                            { label: 'Course', value: submission.course?.title },
                            { label: 'Module', value: submission.module?.title },
                            { label: 'Method', value: submission.method?.toUpperCase() },
                            { label: 'Attempt', value: '#' + submission.attemptNumber },
                            {
                                label: 'Submitted', value: new Date(submission.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                                    {item.label}
                                </p>
                                <p className="text-sm font-semibold text-gray-800">{item.value || 'N/A'}</p>
                            </div>
                        ))}
                    </div>

                    {/* GitHub link */}
                    {submission.method === 'github' && submission.repoUrl && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
                                Repository
                            </p>

                            <a
                                href={submission.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                            >
                                🐙 {submission.repoUrl}
                            </a>
                        </div>
                    )}
                </motion.div>

                {/* ── Action Buttons ────────────────────────────────────── */}
                <div className="flex flex-wrap gap-3 pb-8">
                    <Link
                        to={'/submit/' + submission.module?._id}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm"
                    >
                        🚀 Resubmit Project
                    </Link>
                    <Link
                        to="/submissions"
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
                    >
                        ← All Submissions
                    </Link>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
                    >
                        📊 Dashboard
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default SubmissionDetailPage