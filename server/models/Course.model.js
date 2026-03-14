import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    tags: {
      type: [String],
      default: [],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    totalModules: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Course = mongoose.model('Course', courseSchema)

export default Course