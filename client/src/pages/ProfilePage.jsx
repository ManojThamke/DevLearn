import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// ── Default Avatars ────────────────────────────────────────────────
const defaultAvatars = [
  { id: 1, bg: 'from-indigo-500 to-purple-600', emoji: '👨‍💻' },
  { id: 2, bg: 'from-cyan-500 to-blue-600', emoji: '👩‍💻' },
  { id: 3, bg: 'from-green-500 to-teal-600', emoji: '🧑‍🎓' },
  { id: 4, bg: 'from-orange-500 to-red-600', emoji: '🦸' },
  { id: 5, bg: 'from-pink-500 to-rose-600', emoji: '🧑‍🚀' },
  { id: 6, bg: 'from-yellow-500 to-orange-600', emoji: '🧙‍♂️' },
  { id: 7, bg: 'from-violet-500 to-indigo-600', emoji: '🥷' },
  { id: 8, bg: 'from-teal-500 to-cyan-600', emoji: '🤖' },
]

// ── Avatar Display ─────────────────────────────────────────────────
const AvatarDisplay = ({ user, previewUrl, selectedDefault, size = 'lg' }) => {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  }

  const displayUrl = previewUrl || user?.avatarUrl

  // Show uploaded/URL image
  if (displayUrl && !displayUrl.startsWith('default:')) {
    return (
      <img
        src={displayUrl}
        alt={user?.name}
        className={`${sizes[size]} rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0`}
      />
    )
  }

  // Show selected default avatar
  const defaultId = selectedDefault ||
    (user?.avatarUrl?.startsWith('default:')
      ? parseInt(user.avatarUrl.split(':')[1])
      : null)

  if (defaultId) {
    const avatar = defaultAvatars.find(a => a.id === defaultId)
    if (avatar) {
      return (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${avatar.bg} flex items-center justify-center border-4 border-white shadow-lg flex-shrink-0`}>
          <span className={size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-base'}>
            {avatar.emoji}
          </span>
        </div>
      )
    }
  }

  // Default initials
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold border-4 border-white shadow-lg flex-shrink-0`}>
      <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
    </div>
  )
}

// ── Stat Card ──────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
  </motion.div>
)

// ── Section Card ───────────────────────────────────────────────────
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
      <span className="text-xl">{icon}</span>
      <h2 className="font-bold text-gray-900">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
)

// ── Main Page ──────────────────────────────────────────────────────
const ProfilePage = () => {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // Avatar states
  const [avatarTab, setAvatarTab] = useState('default')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedDefault, setSelectedDefault] = useState(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarSuccess, setAvatarSuccess] = useState('')
  const fileInputRef = useRef(null)

  // Edit profile form
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [editSuccess, setEditSuccess] = useState('')
  const [editError, setEditError] = useState('')

  // Change password form
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passLoading, setPassLoading] = useState(false)
  const [passSuccess, setPassSuccess] = useState('')
  const [passError, setPassError] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile')
        setProfile(res.data.user)
        setStats(res.data.stats)
        setEditForm({ name: res.data.user.name, email: res.data.user.email })
        setAvatarUrl(res.data.user.avatarUrl || '')

        // Set initial default selection
        if (res.data.user.avatarUrl?.startsWith('default:')) {
          setSelectedDefault(parseInt(res.data.user.avatarUrl.split(':')[1]))
          setAvatarTab('default')
        } else if (res.data.user.avatarUrl) {
          setAvatarTab('url')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result)
    reader.readAsDataURL(file)
  }

  // Handle avatar save
  const handleSaveAvatar = async () => {
    try {
      setAvatarLoading(true)

      let finalUrl = ''

      if (avatarTab === 'default' && selectedDefault) {
        finalUrl = 'default:' + selectedDefault
      } else if (avatarTab === 'url' && avatarUrl) {
        finalUrl = avatarUrl
      } else if (avatarTab === 'upload' && previewUrl) {
        finalUrl = previewUrl // base64
      }

      const res = await api.put('/profile/avatar', { avatarUrl: finalUrl })
      setProfile(res.data.user)
      setAvatarSuccess('Avatar updated successfully!')
      setPreviewUrl(null)
      setTimeout(() => setAvatarSuccess(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setEditError('')
    setEditSuccess('')
    if (!editForm.name || !editForm.email) {
      setEditError('All fields are required')
      return
    }
    try {
      setEditLoading(true)
      const res = await api.put('/profile/update', editForm)
      setProfile(res.data.user)
      setEditSuccess('Profile updated successfully!')
      setTimeout(() => setEditSuccess(''), 3000)
    } catch (err) {
      setEditError(err.response?.data?.message || 'Update failed')
    } finally {
      setEditLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess('')
    if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
      setPassError('All fields are required')
      return
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError('New passwords do not match')
      return
    }
    if (passForm.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters')
      return
    }
    try {
      setPassLoading(true)
      await api.put('/profile/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      })
      setPassSuccess('Password changed successfully!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPassSuccess(''), 3000)
    } catch (err) {
      setPassError(err.response?.data?.message || 'Password change failed')
    } finally {
      setPassLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">

        {/* ── Profile Header ─────────────────────────────────── */}
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
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <AvatarDisplay
              user={profile}
              previewUrl={previewUrl}
              selectedDefault={selectedDefault}
              size="lg"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{profile?.name}</h1>
              <p className="text-gray-400 mt-1">{profile?.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full font-medium capitalize">
                  {profile?.role}
                </span>
                <span className="text-xs bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full font-medium">
                  ⭐ {profile?.xpTotal || 0} XP
                </span>
                <span className="text-xs bg-green-500/20 border border-green-500/30 text-green-300 px-3 py-1 rounded-full font-medium">
                  🗓️ Joined {new Date(profile?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard icon="📚" label="Enrolled" value={stats?.enrolledCourses || 0} color="bg-indigo-50" />
          <StatCard icon="✅" label="Lessons Done" value={stats?.totalLessonsCompleted || 0} color="bg-green-50" />
          <StatCard icon="🏆" label="Completed" value={stats?.completedCourses || 0} color="bg-yellow-50" />
          <StatCard icon="⭐" label="XP Points" value={stats?.xpTotal || 0} color="bg-purple-50" />
        </motion.div>

        {/* ── Profile Picture ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionCard title="Profile Picture" icon="🖼️">
            <div className="flex flex-col sm:flex-row gap-6">

              {/* Preview */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <AvatarDisplay
                  user={profile}
                  previewUrl={previewUrl}
                  selectedDefault={selectedDefault}
                  size="md"
                />
                <p className="text-xs text-gray-400">Preview</p>
              </div>

              <div className="flex-1">
                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
                  {[
                    { id: 'default', label: '🎭 Choose Avatar' },
                    { id: 'upload', label: '📁 Upload File' },
                    { id: 'url', label: '🔗 Image URL' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setAvatarTab(tab.id)
                        setPreviewUrl(null)
                      }}
                      className={`flex-1 text-xs font-medium py-2 px-3 rounded-lg transition-all ${
                        avatarTab === tab.id
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Default Avatars */}
                {avatarTab === 'default' && (
                  <div>
                    <p className="text-xs text-gray-500 mb-3">
                      Choose a default avatar for your profile
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {defaultAvatars.map(avatar => (
                        <button
                          key={avatar.id}
                          onClick={() => {
                            setSelectedDefault(avatar.id)
                            setPreviewUrl(null)
                          }}
                          className={`relative aspect-square rounded-2xl bg-gradient-to-br ${avatar.bg} flex items-center justify-center text-2xl transition-all hover:scale-105 ${
                            selectedDefault === avatar.id
                              ? 'ring-3 ring-indigo-500 ring-offset-2 scale-105'
                              : ''
                          }`}
                          style={{ ringWidth: selectedDefault === avatar.id ? '3px' : '0' }}
                        >
                          {avatar.emoji}
                          {selectedDefault === avatar.id && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                {avatarTab === 'upload' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
                    >
                      {previewUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200 mx-auto"
                          />
                          <p className="text-sm text-indigo-600 font-medium">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="text-4xl mb-3">📁</div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload image
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, GIF up to 2MB
                          </p>
                        </>
                      )}
                    </div>
                    {previewUrl && (
                      <button
                        onClick={() => setPreviewUrl(null)}
                        className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove selected image
                      </button>
                    )}
                  </div>
                )}

                {/* URL Input */}
                {avatarTab === 'url' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={e => setAvatarUrl(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      Paste a direct image URL from Unsplash, Gravatar or any image hosting.
                    </p>
                  </div>
                )}

                {/* Save button */}
                {avatarSuccess && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-sm mt-3 font-medium"
                  >
                    ✅ {avatarSuccess}
                  </motion.p>
                )}

                <motion.button
                  onClick={handleSaveAvatar}
                  disabled={avatarLoading || (
                    avatarTab === 'default' && !selectedDefault &&
                    avatarTab === 'upload' && !previewUrl &&
                    avatarTab === 'url' && !avatarUrl
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                >
                  {avatarLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : 'Save Avatar'}
                </motion.button>
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Edit Profile ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionCard title="Edit Profile" icon="✏️">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {editSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl"
                >
                  ✅ {editSuccess}
                </motion.div>
              )}
              {editError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"
                >
                  ⚠️ {editError}
                </motion.div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={editLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 text-sm"
                >
                  {editLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </motion.button>
              </div>
            </form>
          </SectionCard>
        </motion.div>

        {/* ── Change Password ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SectionCard title="Change Password" icon="🔒">
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl"
                >
                  ✅ {passSuccess}
                </motion.div>
              )}
              {passError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"
                >
                  ⚠️ {passError}
                </motion.div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={passForm.currentPassword}
                    onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passForm.newPassword}
                      onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passForm.confirmPassword}
                      onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
                {passForm.newPassword && (
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            passForm.newPassword.length >= i * 3
                              ? i <= 1 ? 'bg-red-500'
                              : i <= 2 ? 'bg-yellow-500'
                              : i <= 3 ? 'bg-blue-500'
                              : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {passForm.newPassword.length < 4 ? 'Weak'
                        : passForm.newPassword.length < 7 ? 'Fair'
                        : passForm.newPassword.length < 10 ? 'Good'
                        : 'Strong'} password
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={() => setShowPasswords(!showPasswords)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Show passwords</span>
                </label>
                <motion.button
                  type="submit"
                  disabled={passLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 text-sm"
                >
                  {passLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Changing...
                    </span>
                  ) : 'Change Password'}
                </motion.button>
              </div>
            </form>
          </SectionCard>
        </motion.div>

        {/* ── Account Info ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SectionCard title="Account Info" icon="ℹ️">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Account ID', value: profile?._id?.slice(-8).toUpperCase() },
                { label: 'Role', value: profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1) },
                { label: 'Member Since', value: new Date(profile?.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Last Updated', value: new Date(profile?.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>

      </div>
    </div>
  )
}

export default ProfilePage
