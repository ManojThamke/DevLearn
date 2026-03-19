import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  type: {
    type: String,
    enum: ['fundamentals', 'developer', 'expert'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  certificateId: {
    type: String,
    unique: true,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  completedModules: {
    type: Number,
    default: 0,
  },
  verifyUrl: {
    type: String,
  },
}, { timestamps: true })

export default mongoose.model('Certificate', certificateSchema)