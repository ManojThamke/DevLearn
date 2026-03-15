import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

const SubmissionsPage = () => {
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await api.get('/submissions/my')
                setSubmissions(res.data.submissions || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchSubmissions()
    }, [])

    // ── Avg score helper ───────────────────────────────────────────
    const getAvgScore = () => {
        const scored = submissions.filter(s => s.score?.scores?.final)
        if (!scored.length) return 'N/A'
        return Math.round(
            scored.reduce((t, s) => t + s.score.scores.final, 0) / scored.length
        ) + '/100'
    }

    const filtered = submissions.filter(sub => {
        if (filter === 'all') return true
        return sub.status === filter
    })

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        evaluating: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
    }

    const methodIcons = {
        github: '🐙',
        zip: '📦',
        editor: '💻',
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 space-y-4">
                    <div className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />
                    ))}
                </div>
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
                            <Link to="/dashboard" className="hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <span>›</span>
                            <span className="text-white">My Submissions</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">My Submissions</h1>
                        <p className="text-gray-400 text-sm">
                            Track all your project submissions and AI evaluation scores
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-3 mt-5">
                            {[
                                {
                                    label: 'Total',
                                    value: submissions.length,
                                    color: 'bg-white/10 text-white',
                                },
                                {
                                    label: 'Completed',
                                    value: submissions.filter(s => s.status === 'completed').length,
                                    color: 'bg-green-500/20 text-green-300',
                                },
                                {
                                    label: 'Pending',
                                    value: submissions.filter(s => s.status === 'pending').length,
                                    color: 'bg-yellow-500/20 text-yellow-300',
                                },
                                {
                                    label: 'Avg Score',
                                    value: getAvgScore(),
                                    color: 'bg-indigo-500/20 text-indigo-300',
                                },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium ${stat.color}`}
                                >
                                    <span className="opacity-70">{stat.label}: </span>
                                    <span className="font-bold">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── Filter Tabs ──────────────────────────────────────── */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {['all', 'pending', 'evaluating', 'completed', 'failed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {f === 'all'
                                ? `All (${submissions.length})`
                                : `${f} (${submissions.filter(s => s.status === f).length})`
                            }
                        </button>
                    ))}
                </div>

                {/* ── Empty State ──────────────────────────────────────── */}
                {filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
                    >
                        <p className="text-5xl mb-4">📭</p>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No submissions yet</h3>
                        <p className="text-gray-500 mb-6">
                            Complete a module and submit your project to see it here
                        </p>
                        <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                        >
                            🚀 Browse Courses
                        </Link>
                    </motion.div>
                )}

                {/* ── Submissions List ─────────────────────────────────── */}
                <div className="space-y-4">
                    {filtered.map((sub, i) => (
                        <motion.div
                            key={sub._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4 flex-wrap">

                                    {/* Left info */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-2xl flex-shrink-0">
                                            {methodIcons[sub.method] || '📁'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                {sub.project?.title || 'Project'}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {sub.course?.title || 'Course'} · {sub.module?.title || 'Module'}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="text-xs text-gray-400">
                                                    Attempt #{sub.attemptNumber}
                                                </span>
                                                <span className="text-gray-300">·</span>
                                                <span className="text-xs text-gray-400 capitalize">
                                                    {sub.method} submission
                                                </span>
                                                <span className="text-gray-300">·</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right — score and status */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {sub.score?.scores?.final !== undefined && (
                                            <div className="text-center">
                                                <div className={`text-2xl font-bold ${sub.score.scores.final >= 80 ? 'text-green-600' :
                                                        sub.score.scores.final >= 60 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                    }`}>
                                                    {sub.score.scores.final}
                                                </div>
                                                <div className="text-xs text-gray-400">/100</div>
                                            </div>
                                        )}
                                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusColors[sub.status] || 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {sub.status}
                                        </span>
                                        <Link
                                            to={'/submissions/' + sub._id}
                                            className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                                        >
                                            View →
                                        </Link>
                                    </div>
                                </div>

                                {/* Score bars if completed */}
                                {sub.score?.scores && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { label: 'Quality', key: 'quality' },
                                                { label: 'Security', key: 'security' },
                                                { label: 'Performance', key: 'performance' },
                                                { label: 'Professional', key: 'professionalism' },
                                            ].map(({ label, key }) => (
                                                <div key={key}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-500">{label}</span>
                                                        <span className="font-semibold text-gray-700">
                                                            {sub.score.scores[key] || 0}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: (sub.score.scores[key] || 0) + '%' }}
                                                            transition={{ duration: 1, delay: i * 0.05 }}
                                                            className={`h-full rounded-full ${(sub.score.scores[key] || 0) >= 80 ? 'bg-green-500' :
                                                                    (sub.score.scores[key] || 0) >= 60 ? 'bg-yellow-500' :
                                                                        'bg-red-500'
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* GitHub link */}
                                {sub.method === 'github' && sub.repoUrl && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <a
                                            href={sub.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            🐙 {sub.repoUrl}
                                        </a>
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default SubmissionsPage
