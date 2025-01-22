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
  hashedPassword: {
    type: String,
    required: function() {
      return !this.googleId;
    },
  },
  image: String,
  emailVerified: Date,
  googleId: {
    type: String,
  },
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

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.hashedPassword);
};

// Delete the model if it exists
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model('User', UserSchema);

// Drop the existing index and create a new one
async function setupIndexes() {
  try {
    const collection = User.collection;
    // Drop the existing index if it exists
    await collection.dropIndex('googleId_1').catch(() => {});
    // Create a new sparse index
    await collection.createIndex({ googleId: 1 }, { 
      sparse: true,
      unique: true,
      background: true 
    });
  } catch (error) {
    console.error('Error setting up indexes:', error);
  }
}

// Run the index setup
setupIndexes();

export default User; 