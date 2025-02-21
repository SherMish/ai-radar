import mongoose, { Schema } from 'mongoose';
import { PricingModel } from '../types/website';

// Export the type for client-side use
export interface WebsiteType {
  _id: string;
  name: string;
  url: string;
  description?: string;
  shortDescription?: string;
  category: string;
  logo?: string;
  pricingModel?: PricingModel;
  hasFreeTrialPeriod?: boolean;
  hasAPI?: boolean;
  launchYear?: number;
  createdBy?: string;
  owner?: string;
  reviewCount?: number;
  averageRating?: number;
  isVerified?: boolean;
  isActive?: boolean;
  radarTrust?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const WebsiteSchema = new Schema({
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
  shortDescription: {
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
  logo: {
    type: String,
    default: "",
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
  pricingModel: {
    type: String,
    enum: Object.values(PricingModel),
    default: null
  },
  hasFreeTrialPeriod: {
    type: Boolean,
    default: null
  },
  hasAPI: {
    type: Boolean,
    default: null
  },
  launchYear: {
    type: Number,
    default: null
  },
  radarTrust: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
}, {
  timestamps: true,
});

// Delete the model if it exists to prevent the "Cannot overwrite model" error
if (mongoose.models.Website) {
  delete mongoose.models.Website;
}

// Create and export the model
const Website = mongoose.model('Website', WebsiteSchema);

// Create indexes in a separate function that can be called explicitly
export async function createIndexes() {
  try {
    await Website.collection.createIndex(
      { url: 1 }, 
      { unique: true, sparse: true, background: true }
    );
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

export default Website; 