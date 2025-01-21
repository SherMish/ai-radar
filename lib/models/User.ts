import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  workEmail: String,
  name: String,
  phoneNumber: String,
  isWebsiteOwner: {
    type: Boolean,
    default: false,
  },
  isVerifiedWebsiteOwner: {
    type: Boolean,
    default: false,
  },
  ownedWebsites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
  }],
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 