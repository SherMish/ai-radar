import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [30, 'Title cannot be longer than 30 characters'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Review body is required'],
    minlength: [25, 'Review must be at least 25 characters long'],
    trim: true,
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  relatedWebsite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
  },
  proof: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  relatedPlan: String,
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema); 