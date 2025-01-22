import mongoose from 'mongoose';
import categoriesData from '../data/categories.json';

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
  description: String,
  relatedCategory: {
    type: String,
    required: true,
    validate: {
      validator: function(categoryId: string) {
        return categoriesData.categories.some(cat => cat.id === categoryId);
      },
      message: 'Invalid category ID'
    }
  },
  features: [String],
  logo: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Website || mongoose.model('Website', WebsiteSchema); 