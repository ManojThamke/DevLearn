import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    estimatedHours: {
      type: Number,
      default: 2,
    },
    techStack: {
      type: [String],
      default: [],
    },
    testSuite: {
      framework: {
        type: String,
        enum: ['jest', 'playwright', 'cypress'],
        default: 'jest',
      },
      tests: [
        {
          name: { type: String },
          description: { type: String },
        },
      ],
    },
    maxScore: {
      type: Number,
      default: 100,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Project = mongoose.model('Project', projectSchema)

export default Project