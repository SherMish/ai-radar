import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Only required if not using OAuth
    required: function() {
      return !this.googleId;
    },
  },
  image: String,
  emailVerified: Date,
  googleId: String,  // Made optional for email/password auth
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  isWebsiteOwner: {
    type: Boolean,
    default: false,
  },
  isVerifiedWebsiteOwner: {
    type: Boolean,
    default: false,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  lastLoginAt: Date,
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema); 