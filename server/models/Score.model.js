import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    scores: {
      quality: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      security: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      performance: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      professionalism: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      final: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    feedback: {
      quality: { type: String, default: '' },
      security: { type: String, default: '' },
      performance: { type: String, default: '' },
      professionalism: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    criticalIssues: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    passed: {
      type: Boolean,
      default: false,
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

const Score = mongoose.model('Score', scoreSchema)

export default Score
