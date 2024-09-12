import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  roles: {
    type: [String]
  },
  refreshToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving, only if modified
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  (async () => {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  })();
});

const User = mongoose.model('User', userSchema);

export default User;
