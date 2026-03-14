import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    xpTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User