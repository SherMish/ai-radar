import { notFound } from "next/navigation";
import { Star, ThumbsUp, Flag, Globe, Users, Calendar, Check, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import { Website, Review } from "@/lib/models";
import { Types } from 'mongoose';
import { ReviewCard } from "@/components/review-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import categoriesData from '@/lib/data/categories.json';
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface WebsiteDoc {
  _id: Types.ObjectId;
  name: string;
  url: string;
  isVerified: boolean;
  relatedCategory: { name: string };
  owner: { name: string };
}

interface ReviewDoc {
  _id: Types.ObjectId;
  title: string;
  body: string;
  rating: number;
  createdAt: Date;
  relatedWebsite: Types.ObjectId;
  relatedUser?: { _id: Types.ObjectId; name: string; image?: string };
  helpfulCount?: number;
}

interface PageProps {
  params: {
    url: string;
  };
}

async function getWebsiteData(url: string) {
  await connectDB();
  
  // Get website data
  const website = await Website.findOne({ url: url })
    .populate('owner')
    .populate('createdBy')
    .lean();

  if (!website) {
    notFound();
  }

  // Calculate average rating and review count from reviews
  const reviews = await Review.find({ relatedWebsite: website._id });
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;
  const reviewCount = reviews.length;

  // Update website with calculated stats
  await Website.findByIdAndUpdate(website._id, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount
  });

  // Find the category data
  const category = categoriesData.categories.find(cat => cat.id === website.relatedCategory);
  const Icon = category ? Icons[category.icon as keyof typeof Icons] : null;

  return {
    ...website,
    _id: website._id.toString(),
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
    owner: website.owner ? {
      ...website.owner,
      _id: website.owner._id.toString(),
    } : null,
    createdBy: website.createdBy ? {
      ...website.createdBy,
      _id: website.createdBy._id.toString(),
    } : null,
    category: category ? {
      ...category,
      Icon
    } : null
  };
}

const getReviews = async (websiteId: string) => {
  const reviews = await Review.find({ relatedWebsite: websiteId })
    .select('title body rating createdAt helpfulCount relatedUser')
    .populate('relatedUser', 'name')
    .lean();

  return reviews.map(review => ({
    ...review,
    _id: review._id.toString(),
    createdAt: review.createdAt.toISOString(),
    relatedUser: review.relatedUser ? {
      ...review.relatedUser,
      _id: review.relatedUser._id.toString()
    } : undefined,
    // Remove relatedWebsite from the transformation since it's not needed in the review card
  }));
};

export default async function ToolPage({ params }: PageProps) {
  const decodedUrl = decodeURIComponent(params.url);
  const website = await getWebsiteData(decodedUrl);

  const reviews = await getReviews(website._id.toString());

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                <span className="text-2xl font-bold gradient-text">
                  {website.name[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{website.name}</h1>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {website.isVerified ? (
                          <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                        ) : (
                          <ShieldAlert className="w-5 h-5 text-muted-foreground" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {website.isVerified 
                          ? "This tool has been verified by its owner" 
                          : "This tool hasn't been verified by its owner yet"
                        }
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={website.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      {website.url}
                    </a>
                  </div>
                  {website.category && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {website.category.Icon && (
                        <website.category.Icon className="w-4 h-4" />
                      )}
                      <span>{website.category.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Data unavailable</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded: Data unavailable</span>
                  </div>
                </div>
              </div>
              <Button 
                className="gradient-button"
                asChild
              >
                <a href={`/tool/${encodeURIComponent(params.url)}/review`}>
                  Write Review
                </a>
              </Button>
            </div>
          </div>

          {/* Rating Overview */}
          <Card className="mb-8 bg-secondary/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{website.averageRating.toFixed(1)}</div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(website.averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {reviews.length} reviews
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-muted-foreground">
                    {website.description || "Description unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Features</h2>
            {website.features && website.features.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {website.features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary/50 backdrop-blur-sm rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Features data unavailable</p>
            )}
          </div>

          {/* Pricing */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
            <p className="text-muted-foreground">Pricing data unavailable</p>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews yet. Be the first to review this tool!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}