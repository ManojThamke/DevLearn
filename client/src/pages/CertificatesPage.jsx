import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../services/api'

const typeStyles = {
  fundamentals: {
    bg: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-100 text-blue-700',
    icon: '📘',
    label: 'Fundamentals',
  },
  developer: {
    bg: 'from-indigo-500 to-purple-500',
    badge: 'bg-indigo-100 text-indigo-700',
    icon: '💻',
    label: 'Developer',
  },
  expert: {
    bg: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-100 text-amber-700',
    icon: '🏆',
    label: 'Expert',
  },
}

const CertificateCard = ({ certificate, index }) => {
  const style = typeStyles[certificate.type] || typeStyles.fundamentals

  const handleDownload = () => {
    // In real app, this would generate a PDF
    alert('PDF download coming soon! Certificate ID: ' + certificate.certificateId)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: certificate.title,
        text: 'I earned the ' + certificate.title + ' certificate on DevLearn!',
        url: certificate.verifyUrl,
      })
    } else {
      navigator.clipboard.writeText(certificate.verifyUrl)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Certificate Header */}
      <div className={`bg-gradient-to-r ${style.bg} p-6 text-white relative overflow-hidden`}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">{style.icon}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${style.badge}`}>
              {style.label}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1">{certificate.title}</h3>
          <p className="text-white/80 text-sm">{certificate.course?.title || 'React Course'}</p>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="p-5 space-y-4">
        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{certificate.completedModules}</p>
            <p className="text-xs text-gray-500">Modules</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-indigo-600">{certificate.averageScore || '-'}%</p>
            <p className="text-xs text-gray-500">Avg Score</p>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Certificate ID</p>
          <p className="font-mono text-sm text-gray-900">{certificate.certificateId}</p>
        </div>

        {/* Issue Date */}
        <p className="text-xs text-gray-400 text-center">
          Issued on {new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={handleShare}
            className="px-4 bg-gray-100 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates/my')
        setCertificates(res.data.certificates || [])
      } catch (err) {
        console.error('Failed to fetch certificates:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 rounded-3xl p-8 mb-8 relative overflow-hidden"
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
              <span className="text-white">Certificates</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-4xl">📜</span>
                  Your Certificates
                </h1>
                <p className="text-gray-400">
                  Complete courses to earn verified certificates
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 text-center">
                <p className="text-3xl font-bold text-white">{certificates.length}</p>
                <p className="text-sm text-gray-400">Certificates Earned</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificate Types Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 mb-8"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Certificate Levels</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <span className="text-2xl">📘</span>
              <div>
                <p className="font-medium text-blue-800">Fundamentals</p>
                <p className="text-xs text-blue-600">Complete 4 modules</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
              <span className="text-2xl">💻</span>
              <div>
                <p className="font-medium text-indigo-800">Developer</p>
                <p className="text-xs text-indigo-600">Complete all 8 modules</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-medium text-amber-800">Expert</p>
                <p className="text-xs text-amber-600">8 modules + 80% avg score</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16 bg-white rounded-2xl border border-gray-100"
          >
            <p className="text-6xl mb-4">🎓</p>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Certificates Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete course modules and projects to earn your first certificate. Start learning today!
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, i) => (
              <CertificateCard key={cert._id} certificate={cert} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default CertificatesPage
