import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
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
}, {
  timestamps: true,
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema); 