import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema(
  {
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
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    method: {
      type: String,
      enum: ['github', 'zip', 'editor'],
      required: true,
    },
    repoUrl: {
      type: String,
      default: '',
    },
    fileKey: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'pending',
        'queued',
        'evaluating',
        'completed',
        'failed',
      ],
      default: 'pending',
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
)

const Submission = mongoose.model('Submission', submissionSchema)

export default Submission