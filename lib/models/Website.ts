import mongoose from 'mongoose';

const WebsiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  URL: {
    type: String,
    required: true,
    unique: true,
  },
  relatedCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: String,
  features: [String],
  logo: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Website || mongoose.model('Website', WebsiteSchema); 