import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../services/api'

const categoryLabels = {
  learning: { label: 'Learning', color: 'bg-blue-100 text-blue-700' },
  streak: { label: 'Streak', color: 'bg-orange-100 text-orange-700' },
  completion: { label: 'Completion', color: 'bg-green-100 text-green-700' },
  project: { label: 'Project', color: 'bg-purple-100 text-purple-700' },
  score: { label: 'Score', color: 'bg-yellow-100 text-yellow-700' },
}

const BadgeCard = ({ badge, index }) => {
  const isEarned = badge.earned
  const isSecret = badge.isSecret && !isEarned

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative rounded-2xl border p-5 transition-all ${
        isEarned
          ? 'bg-white border-gray-200 shadow-sm hover:shadow-md'
          : 'bg-gray-50 border-gray-100 opacity-60'
      }`}
    >
      {/* Category tag */}
      <div className="absolute top-3 right-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          categoryLabels[badge.category]?.color || 'bg-gray-100 text-gray-600'
        }`}>
          {categoryLabels[badge.category]?.label || badge.category}
        </span>
      </div>

      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 ${
          isEarned ? '' : 'grayscale'
        }`}
        style={{ backgroundColor: isSecret ? '#e5e7eb' : `${badge.color}20` }}
      >
        {isSecret ? '?' : badge.icon}
      </div>

      {/* Title */}
      <h3 className={`font-bold text-lg mb-1 ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
        {isSecret ? 'Secret Badge' : badge.title}
      </h3>

      {/* Description */}
      <p className={`text-sm mb-3 ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
        {isSecret ? 'Complete a special achievement to unlock' : badge.description}
      </p>

      {/* Condition */}
      {!isSecret && (
        <p className="text-xs text-gray-400 mb-3">
          {badge.condition}
        </p>
      )}

      {/* XP Reward */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${isEarned ? 'text-indigo-600' : 'text-gray-400'}`}>
          +{badge.xpReward} XP
        </span>

        {isEarned && badge.earnedAt && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Earned {new Date(badge.earnedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
      </div>

      {/* Earned checkmark */}
      {isEarned && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm shadow-lg">
          ✓
        </div>
      )}
    </motion.div>
  )
}

const BadgesPage = () => {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await api.get('/badges')
        setBadges(res.data.badges || [])
      } catch (err) {
        console.error('Failed to fetch badges:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBadges()
  }, [])

  const earnedCount = badges.filter(b => b.earned).length
  const totalXP = badges.filter(b => b.earned).reduce((t, b) => t + b.xpReward, 0)

  const filteredBadges = filter === 'all'
    ? badges
    : filter === 'earned'
    ? badges.filter(b => b.earned)
    : badges.filter(b => b.category === filter)

  const categories = ['all', 'earned', ...Object.keys(categoryLabels)]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

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
              <span className="text-white">Badges</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-4xl">🏅</span>
                  Your Badges
                </h1>
                <p className="text-gray-400">
                  Complete achievements to earn badges and XP rewards
                </p>
              </div>

              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-white">{earnedCount}/{badges.length}</p>
                  <p className="text-sm text-gray-400">Badges Earned</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-indigo-400">{totalXP}</p>
                  <p className="text-sm text-gray-400">XP from Badges</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              {cat === 'all' ? 'All' : cat === 'earned' ? 'Earned' : categoryLabels[cat]?.label || cat}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        {filteredBadges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-gray-500">No badges found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBadges.map((badge, i) => (
              <BadgeCard key={badge._id || badge.slug} badge={badge} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default BadgesPage
