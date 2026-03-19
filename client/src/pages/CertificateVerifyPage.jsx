import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

const typeStyles = {
  fundamentals: {
    bg: 'from-blue-500 to-cyan-500',
    icon: '📘',
    label: 'Fundamentals',
  },
  developer: {
    bg: 'from-indigo-500 to-purple-500',
    icon: '💻',
    label: 'Developer',
  },
  expert: {
    bg: 'from-amber-500 to-orange-500',
    icon: '🏆',
    label: 'Expert',
  },
}

const CertificateVerifyPage = () => {
  const { certificateId } = useParams()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await api.get('/certificates/verify/' + certificateId)
        setCertificate(res.data.certificate)
      } catch (err) {
        setError('Certificate not found or invalid')
      } finally {
        setLoading(false)
      }
    }
    fetchCertificate()
  }, [certificateId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">❌</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Certificate</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const style = typeStyles[certificate.type] || typeStyles.fundamentals

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">

        {/* Verification Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-xl">✓</span>
          </div>
          <div>
            <p className="font-semibold text-green-800">Verified Certificate</p>
            <p className="text-sm text-green-600">
              This certificate was issued by DevLearn and is authentic.
            </p>
          </div>
        </motion.div>

        {/* Certificate Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${style.bg} p-8 text-white text-center relative overflow-hidden`}>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
              }}
            />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">{style.icon}</span>
              </div>
              <p className="text-sm uppercase tracking-wider text-white/80 mb-2">Certificate of Completion</p>
              <h1 className="text-2xl font-bold">{certificate.title}</h1>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-2">This is to certify that</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {certificate.user?.name || 'Student'}
            </h2>

            <p className="text-gray-500 mb-6">
              has successfully completed the <strong>{certificate.course?.title || 'Course'}</strong> course
              on DevLearn with a certification level of <strong>{style.label}</strong>.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-6">
              <div>
                <p className="text-3xl font-bold text-gray-900">{certificate.completedModules}</p>
                <p className="text-sm text-gray-500">Modules Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-600">{certificate.averageScore}%</p>
                <p className="text-sm text-gray-500">Average Score</p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Certificate ID</p>
              <p className="font-mono text-lg text-gray-900">{certificate.certificateId}</p>
            </div>

            {/* Date */}
            <p className="text-sm text-gray-400">
              Issued on {new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6 bg-gray-50 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">D</span>
              </div>
              <span className="font-bold text-gray-900">DevLearn</span>
            </div>
            <p className="text-xs text-gray-400">
              Developer Learning Platform
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default CertificateVerifyPage
