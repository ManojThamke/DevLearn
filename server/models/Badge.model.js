import mongoose from 'mongoose'

const badgeSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#6366f1',
  },
  category: {
    type: String,
    enum: ['learning', 'project', 'streak', 'score', 'completion'],
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  xpReward: {
    type: Number,
    default: 50,
  },
  isSecret: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

export default mongoose.model('Badge', badgeSchema)