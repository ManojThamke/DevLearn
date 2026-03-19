import Badge from '../models/Badge.model.js'
import UserBadge from '../models/UserBadge.model.js'
import User from '../models/User.model.js'
import Progress from '../models/Progress.model.js'
import Submission from '../models/Submission.model.js'
import Score from '../models/Score.model.js'
import { badgeDefinitions } from '../data/badgeDefinitions.js'

// ── Seed badges into database ────────────────────────────────
export const seedBadges = async (req, res) => {
  try {
    for (const badge of badgeDefinitions) {
      await Badge.findOneAndUpdate(
        { slug: badge.slug },
        badge,
        { upsert: true, new: true }
      )
    }
    res.json({ success: true, message: 'Badges seeded successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── Get all badges ───────────────────────────────────────────
export const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ xpReward: 1 })

    // If user is logged in show which ones they earned
    if (req.user) {
      const userBadges = await UserBadge.find({ user: req.user._id })
        .populate('badge')

      const earnedSlugs = userBadges.map(ub => ub.badge.slug)

      const badgesWithStatus = badges.map(badge => ({
        ...badge.toObject(),
        earned: earnedSlugs.includes(badge.slug),
        earnedAt: userBadges.find(ub => ub.badge.slug === badge.slug)?.earnedAt || null,
      }))

      return res.json({ success: true, badges: badgesWithStatus })
    }

    res.json({ success: true, badges })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── Get user badges ──────────────────────────────────────────
export const getUserBadges = async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user: req.user._id })
      .populate('badge')
      .sort({ earnedAt: -1 })

    res.json({ success: true, badges: userBadges })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── Award badge to user ──────────────────────────────────────
export const awardBadge = async (userId, badgeSlug, context = '') => {
  try {
    const badge = await Badge.findOne({ slug: badgeSlug })
    if (!badge) return null

    // Check if already earned
    const existing = await UserBadge.findOne({ user: userId, badge: badge._id })
    if (existing) return null

    // Award badge
    const userBadge = await UserBadge.create({
      user: userId,
      badge: badge._id,
      context,
    })

    // Add XP to user
    await User.findByIdAndUpdate(userId, {
      $inc: { xpTotal: badge.xpReward }
    })

    console.log('🏅 Badge awarded:', badge.title, 'to user:', userId)
    return { badge, userBadge }
  } catch (err) {
    console.error('Badge award error:', err.message)
    return null
  }
}

// ── Check and award badges after lesson complete ─────────────
export const checkLessonBadges = async (userId) => {
  try {
    const progressRecords = await Progress.find({ student: userId })
    const totalCompleted = progressRecords.reduce(
      (total, p) => total + (p.completedLessons?.length || 0), 0
    )

    if (totalCompleted >= 1) await awardBadge(userId, 'first-lesson', 'Completed first lesson')
    if (totalCompleted >= 5) await awardBadge(userId, 'five-lessons', 'Completed 5 lessons')
    if (totalCompleted >= 10) await awardBadge(userId, 'ten-lessons', 'Completed 10 lessons')

    // Check speed learner — 5 lessons in one day
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayLessons = progressRecords.reduce((total, p) => {
      const todayCompleted = (p.completedLessons || []).filter(l => {
        const completedDate = new Date(l.completedAt)
        completedDate.setHours(0, 0, 0, 0)
        return completedDate.getTime() === today.getTime()
      })
      return total + todayCompleted.length
    }, 0)

    if (todayLessons >= 5) await awardBadge(userId, 'speed-learner', 'Completed 5 lessons in one day')

  } catch (err) {
    console.error('Check lesson badges error:', err.message)
  }
}

// ── Check and award badges after project submission ──────────
export const checkProjectBadges = async (userId) => {
  try {
    const submissions = await Submission.find({ student: userId, status: 'completed' })
    const scores = await Score.find({ student: userId })

    // First project
    if (submissions.length >= 1) {
      await awardBadge(userId, 'first-project', 'Submitted first project')
    }

    // 5 projects
    if (submissions.length >= 5) {
      await awardBadge(userId, 'consistent-coder', 'Submitted 5 projects')
    }

    // High scorer — 90+ on any project
    const highScore = scores.find(s => s.scores?.final >= 90)
    if (highScore) {
      await awardBadge(userId, 'high-scorer', 'Scored 90+ on a project')
    }

    // Perfectionist — 100 on any project
    const perfectScore = scores.find(s => s.scores?.final === 100)
    if (perfectScore) {
      await awardBadge(userId, 'perfectionist', 'Scored 100 on a project')
    }

    // Clean coder — average 85+ across 3 projects
    if (scores.length >= 3) {
      const avg = scores.reduce((t, s) => t + (s.scores?.final || 0), 0) / scores.length
      if (avg >= 85) {
        await awardBadge(userId, 'code-quality', 'Averaged 85+ across 3 projects')
      }
    }

  } catch (err) {
    console.error('Check project badges error:', err.message)
  }
}

// ── Check and award badges after module complete ─────────────
export const checkModuleBadges = async (userId, courseId) => {
  try {
    const Progress = (await import('../models/Progress.model.js')).default
    const progress = await Progress.findOne({ student: userId, course: courseId })

    if (!progress) return

    const completedModules = progress.completedModules?.length || 0

    if (completedModules >= 1) await awardBadge(userId, 'module-master', 'Completed first module')
    if (completedModules >= 4) await awardBadge(userId, 'halfway-there', 'Completed 4 modules')
    if (completedModules >= 8) await awardBadge(userId, 'react-developer', 'Completed all 8 modules')

  } catch (err) {
    console.error('Check module badges error:', err.message)
  }
}