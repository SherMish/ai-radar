import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from "next/navigation";
import { Star, ThumbsUp, Flag, Globe, Users, Calendar, Check, ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";
import Review from "@/lib/models/Review";
import { Types } from 'mongoose';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import categoriesData from '@/lib/data/categories.json';
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ReviewsSection } from "@/components/reviews-section";
import Link from "next/link";
import { Document } from 'mongoose';
import { Card } from "@/components/ui/card";

interface WebsiteDoc {
  _id: Types.ObjectId;
  name: string;
  url: string;
  isVerified: boolean;
  relatedCategory: { name: string };
  owner: { name: string };
}

interface ReviewDoc extends Document {
  _id: Types.ObjectId;
  title: string;
  body: string;
  rating: number;
  createdAt: Date;
  isVerified: boolean;
  relatedWebsite: Types.ObjectId;
  relatedUser?: { _id: Types.ObjectId; name: string; image?: string };
  helpfulCount?: number;
}

interface Review {
  _id: string;
  title: string;
  body: string;
  rating: number;
  createdAt: string;
  helpfulCount?: number;
  relatedUser?: {
    name: string;
  };
  isVerified?: boolean;
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
    .select('name url description category averageRating reviewCount isVerified')
    .lean();

  if (!website) {
    notFound();
  }

  // Calculate average rating and review count from reviews
  const reviews = await Review.find({ relatedWebsite: website._id });
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
    : 0;

  // Update website with calculated stats
  await Website.findByIdAndUpdate(website._id, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount
  });

  // Find the category data from categories.json
  const categoryData = categoriesData.categories.find(cat => cat.id === website.category);
  const Icon = categoryData?.icon ? (Icons[categoryData.icon as keyof typeof Icons] as LucideIcon) : null;

  return {
    ...website,
    _id: website._id.toString(),
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
    category: categoryData ? {
      ...categoryData,
      Icon: Icon as LucideIcon
    } : null
  };
}

const getReviews = async (websiteId: string) => {
  const reviews = await Review.find({ relatedWebsite: websiteId })
    .select('title body rating createdAt helpfulCount relatedUser isVerified')
    .populate('relatedUser', 'name')
    .lean<ReviewDoc[]>();

  return reviews.map((review) => ({
    _id: review._id.toString(),
    title: review.title,
    body: review.body,
    rating: review.rating,
    helpfulCount: review.helpfulCount,
    createdAt: review.createdAt.toISOString(),
    relatedUser: review.relatedUser ? {
      name: review.relatedUser.name,
    } : undefined,
    isVerified: review.isVerified || false
  })) as Review[];
};

function getRatingStatus(rating: number): { label: string; color: string } {
  if (rating === 0) return { label: 'Neutral', color: 'text-zinc-500' };
  if (rating >= 4.5) return { label: 'Excellent', color: 'text-emerald-500' };
  if (rating >= 4.0) return { label: 'Very Good', color: 'text-green-500' };
  if (rating >= 3.5) return { label: 'Good', color: 'text-blue-500' };
  if (rating >= 3.0) return { label: 'Average', color: 'text-yellow-500' };
  if (rating >= 2.0) return { label: 'Below Average', color: 'text-orange-500' };
  return { label: 'Poor', color: 'text-red-500' };
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const decodedUrl = decodeURIComponent(params.url);
  const website = await getWebsiteData(decodedUrl);
  
  if (!website) {
    return {
      title: 'Tool Not Found',
    };
  }

  const averageRating = website.averageRating?.toFixed(1) || "No";
  const reviewText = `${website.reviewCount} ${website.reviewCount === 1 ? 'Review' : 'Reviews'}`;

  return {
    title: `${website.name} Reviews - ${averageRating}★ Rating (${reviewText})`,
    description: website.description || 
      `Read ${reviewText} of ${website.name}. User ratings, feedback, and detailed reviews. Average rating: ${averageRating} out of 5 stars.`,
    keywords: [
      website.name,
      `${website.name} reviews`,
      `${website.name} ratings`,
      `${website.name} user reviews`,
      `${website.name} feedback`,
      website.category?.name || '',
      'AI tool reviews',
      'AI software reviews',
      'user reviews',
      'ratings and reviews'
    ].filter(Boolean),
    openGraph: {
      title: `${website.name} - Reviews & Ratings`,
      description: website.description || 
        `Read user reviews and ratings for ${website.name}. Average rating: ${averageRating} out of 5 stars based on ${reviewText}.`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${website.name} Reviews & Ratings`,
      description: `${averageRating}★ rating based on ${reviewText}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
    },
  };
}

// Add export for static params if you want to pre-render some pages
export async function generateStaticParams() {
  await connectDB();
  const websites = await Website.find()
    .select('url')
    .limit(100) // Limit to most important tools
    .lean();

  return websites.map((website) => ({
    url: website.url,
  }));
}

export default async function ToolPage({ params }: PageProps) {
  const decodedUrl = decodeURIComponent(params.url);
  const website = await getWebsiteData(decodedUrl);
  const reviews = await getReviews(website._id.toString());
  
  // For debugging
  console.log('Processed website data:', website);

  const ratingStatus = getRatingStatus(website.averageRating || 0);

  // Add structured data for rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: website.name,
    description: website.description,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: website.averageRating,
      reviewCount: website.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      author: {
        '@type': 'Person',
        name: review.relatedUser?.name || 'Anonymous',
      },
      reviewBody: review.body,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        
        <div className="relative container max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-lg border border-border/50 bg-secondary/50 backdrop-blur-sm">
            <div className="p-6">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <span className="text-2xl font-bold gradient-text">
                      {website.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-col lg:flex-row gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
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
                        {website.category && (
                          <Link 
                            href={`/category/${website.category.id}`}
                            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
                          >
                            {website.category.Icon && (
                              <website.category.Icon className="w-4 h-4" />
                            )}
                            <span>{website.category.name}</span>
                          </Link>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <a 
                          href={website.url.startsWith('http') ? website.url : `https://${website.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span className="font-medium">Visit</span>
                          <span className="text-zinc-400 hidden sm:inline">{website.url}</span>
                        </a>
                        <Button 
                          className="gradient-button px-4 py-3 h-auto"
                          asChild
                        >
                          <Link href={`/tool/${encodeURIComponent(params.url)}/review`}>
                            Write Review
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Overview */}
              <div className="mb-8 p-6 rounded-lg border border-border/50 bg-background/50">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Rating Column */}
                  <div className="flex flex-col items-center text-center md:w-48">
                    <div className="text-5xl font-bold mb-2">
                      {website.averageRating ? website.averageRating.toFixed(1) : '0'}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < (website.averageRating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                    <div className={`text-sm font-medium ${ratingStatus.color} mb-1`}>
                      {ratingStatus.label}
                    </div>
                    <div className="text-sm text-zinc-400">
                      Based on {website.reviewCount || 0} reviews
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden md:block w-px bg-border/50 self-stretch" />

                  {/* Description Column */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold">About {website.name}</h3>
                    <div className="space-y-4 text-muted-foreground">
                      {website.description ? (
                        <p>{website.description}</p>
                      ) : (
                        <>
                          <p>
                            Description unavailable
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Features</h2>
                {/* {website.features && website.features.length > 0 ? (
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
                ) : ( */}
                  <p className="text-muted-foreground">Features data unavailable</p>
                {/* )} */}
              </div>

              {/* Pricing */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
                <p className="text-muted-foreground">Pricing data unavailable</p>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-border/50 pt-6">
                <ReviewsSection reviews={reviews} />            
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}