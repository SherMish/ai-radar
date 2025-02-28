export const revalidate = 60; // Update every 60 seconds

import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Star,
  ThumbsUp,
  Flag,
  Globe,
  Users,
  Calendar,
  Check,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  CreditCard,
  Code2,
  Clock,
  ArrowRight,
  Radar as RadarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import connectDB from "@/lib/mongodb";
import Website from "@/lib/models/Website";
import Review from "@/lib/models/Review";
import { Types } from "mongoose";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import categoriesData from "@/lib/data/categories.json";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ReviewsSection } from "@/components/reviews-section";
import Link from "next/link";
import { Document } from "mongoose";
import { Card } from "@/components/ui/card";
import WriteReviewButton from "@/app/components/WriteReviewButton";
import { PricingModel } from "@/lib/types/website";
import { WebsiteCard } from "@/components/website-card";
import { SuggestedToolCard } from "@/components/suggested-tool-card";
import { RadarTrustInfo } from "@/components/radar-trust-info";

interface WebsiteDoc {
  _id: Types.ObjectId;
  name: string;
  url: string;
  isVerified: boolean;
  relatedCategory: { name: string };
  owner: { name: string };
  radarTrust?: number;
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
    .select(
      "name url description shortDescription logo category averageRating reviewCount isVerified pricingModel launchYear hasAPI hasFreeTrialPeriod radarTrust"
    )
    .lean();

  if (!website) {
    notFound();
  }

  // Calculate average rating and review count from reviews
  const reviews = await Review.find({ relatedWebsite: website._id });
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
      : 0;

  // Update website with calculated stats
  await Website.findByIdAndUpdate(website._id, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount,
  });

  // Find the category data from categories.json
  const categoryData = categoriesData.categories.find(
    (cat) => cat.id === website.category
  );
  const Icon = categoryData?.icon
    ? (Icons[categoryData.icon as keyof typeof Icons] as LucideIcon)
    : null;

  return {
    ...website,
    _id: website._id.toString(),
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
    radarTrust: website.radarTrust,
    category: categoryData
      ? {
          ...categoryData,
          Icon: Icon as LucideIcon,
        }
      : null,
  };
}

const getReviews = async (websiteId: string) => {
  const reviews = await Review.find({ relatedWebsite: websiteId })
    .select("title body rating createdAt helpfulCount relatedUser isVerified")
    .populate("relatedUser", "name")
    .lean<ReviewDoc[]>();

  return reviews.map((review) => ({
    _id: review._id.toString(),
    title: review.title,
    body: review.body,
    rating: review.rating,
    helpfulCount: review.helpfulCount,
    createdAt: review.createdAt.toISOString(),
    relatedUser: review.relatedUser
      ? {
          name: review.relatedUser.name,
        }
      : undefined,
    isVerified: review.isVerified || false,
  })) as Review[];
};

function getRatingStatus(rating: number): { label: string; color: string } {
  if (rating === 0) return { label: "Neutral", color: "text-zinc-500" };
  if (rating >= 4.5) return { label: "Excellent", color: "text-emerald-500" };
  if (rating >= 4.0) return { label: "Very Good", color: "text-green-500" };
  if (rating >= 3.5) return { label: "Good", color: "text-blue-500" };
  if (rating >= 3.0) return { label: "Average", color: "text-yellow-500" };
  if (rating >= 2.0)
    return { label: "Below Average", color: "text-orange-500" };
  return { label: "Poor", color: "text-red-500" };
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
      title: "Tool Not Found",
    };
  }

  const averageRating = website.averageRating?.toFixed(1) || "No";
  const reviewText = `${website.reviewCount} ${
    website.reviewCount === 1 ? "Review" : "Reviews"
  }`;

  return {
    title: `${website.name} Reviews - ${averageRating}★ Rating (${reviewText})`,
    description:
      website.description ||
      `Read ${reviewText} of ${website.name}. User ratings, feedback, and detailed reviews. Average rating: ${averageRating} out of 5 stars.`,
    keywords: [
      website.name,
      `${website.name} reviews`,
      `${website.name} ratings`,
      `${website.name} user reviews`,
      `${website.name} feedback`,
      website.category?.name || "",
      "AI tool reviews",
      "AI software reviews",
      "user reviews",
      "ratings and reviews",
    ].filter(Boolean),
    openGraph: {
      title: `${website.name} - Reviews & Ratings`,
      description:
        website.description ||
        `Read user reviews and ratings for ${website.name}. Average rating: ${averageRating} out of 5 stars based on ${reviewText}.`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tool/${params.url}`,
    },
    twitter: {
      card: "summary_large_image",
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
    .select("url")
    .limit(100) // Limit to most important tools
    .lean();

  return websites.map((website) => ({
    url: website.url,
  }));
}

// Add this helper function to format the pricing model text
function formatPricingModel(model: PricingModel): string {
  const formats: Record<PricingModel, string> = {
    free: "Free",
    freemium: "🎁 Freemium",
    subscription: "📅 Subscription-based",
    pay_per_use: "💰 Pay per use",
    enterprise: "🏢 Enterprise (Custom pricing)",
  };
  return formats[model];
}

async function getSuggestedTools(
  currentToolUrl: string,
  category: { id: string },
  limit = 3
) {
  try {
    const tools = await Website.find({
      url: { $ne: currentToolUrl }, // exclude current tool
      category: category.id, // use just the category ID
    })
      .limit(limit)
      .lean();

    return tools;
  } catch (error) {
    console.error("Error fetching suggested tools:", error);
    return [];
  }
}

export default async function ToolPage({ params }: PageProps) {
  const decodedUrl = decodeURIComponent(params.url);
  const website = await getWebsiteData(decodedUrl);
  const reviews = await getReviews(website._id.toString());

  // For debugging
  console.log("Processed website data:", website);

  const ratingStatus = getRatingStatus(website.averageRating || 0);

  // Add structured data for rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: website.name,
    description: website.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: website.averageRating,
      reviewCount: website.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
      },
      author: {
        "@type": "Person",
        name: review.relatedUser?.name || "Anonymous",
      },
      reviewBody: review.body,
    })),
  };

  const suggestedTools = website.category
    ? await getSuggestedTools(decodedUrl, website.category, 3)
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

        <div className="relative container max-w-6xl mx-auto sm:px-4 py-8">
          <div className="rounded-lg border border-border/50 bg-secondary/50 backdrop-blur-sm">
            <div className="p-6 space-y-8">
              {/* Full width sections */}
              <div>
                {/* Header */}
                <div className="mb-8">
                  <div className="flex flex-col gap-6 lg:gap-0">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-[64px] h-[64px] rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center overflow-hidden">
                        {website.logo ? (
                          <Image
                            src={website.logo}
                            alt={website.name}
                            width={64}
                            height={64}
                            className="rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center">
                            <span className="text-xs text-zinc-400">
                              {website.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between flex-col lg:flex-row gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h1 className="text-3xl font-bold">
                                {website.name}
                              </h1>
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
                                      : "This tool hasn't been verified by its owner yet"}
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
                          <div className="hidden lg:flex flex-row gap-3">
                            <a
                              href={
                                website.url.startsWith("http")
                                  ? website.url
                                  : `https://${website.url}?utm_source=ai-radar&utm_medium=marketplace&utm_campaign=ai-radar`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors h-[40px]"
                            >
                              <ExternalLink className="w-5 h-5" />
                              <span className="font-medium">Visit</span>
                              <span className="text-zinc-400">
                                {website.url}
                              </span>
                            </a>
                            <WriteReviewButton url={params.url} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                      <a
                        href={
                          website.url.startsWith("http")
                            ? website.url
                            : `https://${website.url}?utm_source=ai-radar&utm_medium=marketplace&utm_campaign=ai-radar`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors h-[40px]"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-medium">Visit</span>
                      </a>
                      <WriteReviewButton url={params.url} />
                    </div>
                  </div>
                </div>

                {/* Rating Overview */}
                <div className="p-6 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* User Rating Column - Only show if there are reviews */}
                    {website.reviewCount > 0 && (
                      <div className="flex flex-col items-center justify-center text-center md:w-48">
                        <div className="text-5xl font-bold mb-2">
                          {website.averageRating
                            ? website.averageRating.toFixed(1)
                            : "0"}
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
                          Based on {website.reviewCount} reviews
                        </div>
                      </div>
                    )}

                    {/* Mobile Divider - Only show if there are reviews */}
                    {website.reviewCount > 0 && (
                      <div className="block md:hidden w-full h-px bg-border/50" />
                    )}

                    {/* RadarTrust Score */}
                    {website.radarTrust && (
                      <>
                        {website.reviewCount > 0 && (
                          <div className="hidden md:block w-px bg-border/50 self-stretch" />
                        )}
                        <div className="flex flex-col items-center justify-center text-center md:w-48">
                          <div className="text-5xl font-bold mb-2">
                            {website.radarTrust.toFixed(1)}
                            <span className="text-2xl text-muted-foreground">/10</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <RadarIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-sm font-medium text-primary mb-1">
                            RadarTrust™ Score
                          </div>
                          <div className="text-sm text-zinc-400">
                            <div className="flex items-center gap-1">
                              AI-powered analysis
                              <RadarTrustInfo />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Vertical/Horizontal Divider */}
                    <div className="block md:hidden w-full h-px bg-border/50" />
                    <div className="hidden md:block w-px bg-border/50 self-stretch" />

                    {/* Description Column */}
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-semibold">
                        About {website.name}
                      </h3>
                      <div className="space-y-4 text-muted-foreground">
                        {website.description ? (
                          <p>{website.description}</p>
                        ) : (
                          <>
                            <p>Description unavailable</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two column layout for remaining content */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
                <div>
                  {/* Details Section */}
                  <div className="mb-8">
                    {website.pricingModel ||
                    website.launchYear ||
                    website.hasFreeTrialPeriod ||
                    website.hasAPI ? (
                      <h2 className="text-2xl font-semibold mb-4">Details</h2>
                    ) : null}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {website.pricingModel && (
                        <div className="p-4 bg-secondary/50 backdrop-blur-sm rounded-lg border border-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                Pricing
                              </h3>
                              <p className="text-base mt-1">
                                {formatPricingModel(website.pricingModel)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {website.launchYear && (
                        <div className="p-4 bg-secondary/50 backdrop-blur-sm rounded-lg border border-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                Launch Year
                              </h3>
                              <p className="text-base mt-1">
                                {website.launchYear}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {website.hasAPI && (
                        <div className="p-4 bg-secondary/50 backdrop-blur-sm rounded-lg border border-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Code2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                API
                              </h3>
                              <p className="text-base mt-1">
                                {website.hasAPI ? "✅ Available" : "No"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {website.hasFreeTrialPeriod && (
                        <div className="p-4 bg-secondary/50 backdrop-blur-sm rounded-lg border border-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Clock className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                Free Trial
                              </h3>
                              <p className="text-base mt-1">
                                {website.hasFreeTrialPeriod
                                  ? "✅ Available"
                                  : "No"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="border-t border-border/50 pt-6">
                    {reviews.length > 0 ? (
                      <ReviewsSection reviews={reviews} />
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-2xl font-semibold mb-3">
                          No Reviews Yet
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Be the first to share your experience with{" "}
                          {website.name} and help others make informed
                          decisions.
                        </p>
                        <Link
                          href={`/tool/${params.url}/review`}
                          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Write the First Review
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Similar Tools Column */}
                {suggestedTools.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Similar Tools
                    </h2>
                    <div className="flex flex-col gap-3">
                      {suggestedTools.map((tool) => (
                        <SuggestedToolCard
                          key={tool._id.toString()}
                          website={tool}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
