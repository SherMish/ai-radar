import { useState, useRef, useEffect } from "react";
import { Search, PlusCircle, Star, MessageSquare, Image as ImageIcon, Code, Music, Video, Database, Brain, Sparkles, Palette, Bot, Shield, Radar as RadarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Review, Website } from "@/lib/models";
import connectDB from "@/lib/mongodb";
import { Card } from "@/components/ui/card";
import { SearchSection } from "./components/search-section";
import { MarketingSection } from "./components/marketing-section";
import { CategoriesSection } from "./components/categories-section";
import { LatestReviewsCarousel } from "./components/latest-reviews-carousel";
import { RadarAnimation } from "./components/radar-animation";
import { Metadata } from "next";
import { Types, Document } from "mongoose";
import { RandomBlogPosts } from "@/components/random-blog-posts";
import { WebsiteCard } from "@/components/website-card";
import { LatestToolCard } from "@/app/components/latest-tool-card";

const categories = [
  { name: "Text Generation", icon: MessageSquare, count: 156 },
  { name: "Image Generation", icon: ImageIcon, count: 89 },
  { name: "Code Generation", icon: Code, count: 67 },
  { name: "Audio Processing", icon: Music, count: 45 },
  { name: "Video Generation", icon: Video, count: 34 },
  { name: "Data Analysis", icon: Database, count: 78 },
  { name: "Machine Learning", icon: Brain, count: 92 },
  { name: "Creative Tools", icon: Palette, count: 123 },
  { name: "Automation", icon: Bot, count: 56 },
  { name: "General AI", icon: Sparkles, count: 145 },
];

interface ReviewDoc extends Document {
  _id: Types.ObjectId;
  body: string;
  rating: number;
  createdAt: Date;
  relatedWebsite: {
    _id: Types.ObjectId;
    name: string;
    url: string;
  };
  relatedUser?: {
    _id: Types.ObjectId;
    name: string;
  };
  __v: number;
}

async function getLatestReviews() {
  await connectDB();

  const reviews = await Review.find()
    .populate("relatedWebsite", "name url")
    .populate("relatedUser", "name")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean<ReviewDoc[]>();

  return reviews.map((review) => ({
    ...review,
    _id: review._id.toString(),
    relatedWebsite: {
      ...review.relatedWebsite,
      _id: review.relatedWebsite._id.toString(),
    },
    relatedUser: review.relatedUser
      ? {
          name: review.relatedUser.name,
        }
      : undefined,
  }));
}

interface Suggestion {
  _id: string;
  name: string;
  url: string;
}

async function getLatestTools(limit = 6) {
  await connectDB();

  const tools = await Website.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return tools;
}

export const metadata: Metadata = {
  title: "AI Tools Directory & Reviews | Find the Best AI Tools, AI Radar",
  description:
    "Discover and compare the best AI tools with authentic user reviews. Find AI software for content creation, image generation, coding, productivity, and more. Real ratings and user experiences.",
  keywords: [
    "best AI tools",
    "AI software reviews",
    "top AI tools",
    "artificial intelligence tools",
    "AI tool comparison",
    "AI software directory",
    "ChatGPT alternatives",
    "AI image generators",
    "AI writing tools",
    "AI coding tools",
    "AI productivity tools",
    "best AI software",
    "AI tools for business",
    "AI tool ratings",
    "AI software recommendations",
    "user-reviewed AI tools",
    "AI tool reviews",
    "AI software comparison",
    "best AI applications",
    "top-rated AI software",
  ],
  openGraph: {
    type: "website",
    title: "Find the Best AI Tools - User Reviews & Ratings",
    description:
      "Compare top AI tools with authentic user reviews. Discover AI software for content creation, image generation, coding, and more.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "AI Tools Directory",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "AI Tools Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find the Best AI Tools - User Reviews & Ratings",
    description:
      "Compare top AI tools with authentic user reviews. Discover the best AI software for your needs.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

// Add structured data for rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI Tools Directory",
  description: "Find and compare the best AI tools with authentic user reviews",
  url: process.env.NEXT_PUBLIC_APP_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  about: {
    "@type": "Thing",
    name: "Artificial Intelligence Tools",
    description:
      "Directory of AI-powered software tools and applications with user reviews",
  },
};

export default async function Home() {
  const latestReviews = await getLatestReviews();
  const latestTools = await getLatestTools();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative min-h-screen">
        {/* Main background gradient */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

        {/* Radar Section */}
        <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center -z-10">
          <div className="relative w-[200px] h-[200px] mb-[182vh]">
            {/* <RadarAnimation /> */}
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Search Section - Added px-4 for mobile padding */}
          <div className="pt-12 px-4 sm:px-6 lg:px-8">
            <SearchSection />
          </div>

          {/* Add Tool Section - Subtle Version */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto flex items-center justify-center"></div>
          </div>

          {/* Categories Section - Added px-4 for mobile padding */}
          <div className="px-4 sm:px-6 lg:px-8">
            <CategoriesSection />
          </div>

          {/* Latest Reviews Section - Added px-4 for mobile padding */}
          {/* <div className="px-4 sm:px-6 lg:px-8">
            <LatestReviewsCarousel reviews={latestReviews} />
          </div> */}

          {/* Latest Tools Section */}
          <section className="py-12 bg-secondary/50 backdrop-blur-sm border-y border-border/50">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="grid lg:grid-cols-[400px,1fr] gap-12">
                {/* Left Column - Content */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">
                      Stay ahead.
                      <br />
                      Optimize workflows.
                      <br />
                      Scale smarter.
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Unlock the latest AI solutions designed to drive
                      efficiency, innovation, and growth. From automation to
                      advanced analytics, explore cutting-edge tools that can
                      give your business a competitive edge.
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-lg">
                      Want to feature your AI solution?{" "}
                      <Link
                        href="/tool/new"
                        className="text-primary hover:text-primary/90 hover:underline transition-colors"
                      >
                        List it today for free
                      </Link>{" "}
                      and reach professionals looking for the next big
                      innovation.
                    </p>
                  </div>
                </div>

                {/* Right Column - Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                  {latestTools.map((tool) => (
                    <LatestToolCard key={tool._id.toString()} website={tool} />
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Marketing Section - Added px-4 for mobile padding */}
          <div className="px-4 sm:px-6 lg:px-8">
            <MarketingSection />
          </div>

          {/* TrustRadar Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="grid lg:grid-cols-[1fr,400px] gap-12 items-center">
                {/* Left Column - Content */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">
                      <span className="text-primary">
                        RadarTrust™
                      </span>
                      <br />
                      The AI Industry’s Benchmark for Quality

                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      Our proprietary <strong>RadarTrust™</strong> score empowers businesses and professionals to make data-driven decisions 
            when selecting AI tools. We analyze key factors like <strong>user feedback, innovation, reliability, and market adoption </strong> 
            to ensure you invest in the most effective and trustworthy solutions.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                          <Star className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">User Reviews & Credibility</h3>
                          <p className="text-muted-foreground">
                            Authentic feedback and ratings from real users who have experienced the tools firsthand.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Innovation & Technological Edge</h3>
                          <p className="text-muted-foreground">
                            Assessment of unique features, technological advancement, and problem-solving capabilities.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                          <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Reliability & Performance</h3>
                          <p className="text-muted-foreground">
                            A deep dive into <strong>uptime, support quality, and long-term stability</strong>, ensuring seamless business operations.

                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Visual */}
                <div className="relative">
                  <div className="aspect-square rounded-full bg-primary/5 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                        <RadarIcon className="w-16 h-16 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <RandomBlogPosts />
    </>
  );
}
