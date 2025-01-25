import mongoose from 'mongoose';

const WebsiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    set: (url: string) => {
      if (!url) throw new Error('URL is required');
      return url
        .toLowerCase()
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split('/')[0]
        .split(':')[0];
    }
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Drop existing indexes to clean up old URL index
if (mongoose.models.Website) {
  delete mongoose.models.Website;
}

const Website = mongoose.model('Website', WebsiteSchema);

// Ensure proper indexes
async function setupIndexes() {
  try {
    const collection = Website.collection;
    // Drop all existing indexes except _id
    await collection.dropIndexes();
    // Create new index only on url field with sparse option
    await collection.createIndex({ url: 1 }, { 
      unique: true,
      sparse: true,
      background: true 
    });
  } catch (error) {
    console.error('Error setting up indexes:', error);
  }
}

// Run the index setup
setupIndexes();

export default Website; 