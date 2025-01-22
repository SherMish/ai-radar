import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { 
  Star, 
  MessageSquare, 
  Image as ImageIcon, 
  Code, 
  Music, 
  Video, 
  Database, 
  Brain, 
  Sparkles, 
  Palette, 
  Bot 
} from "lucide-react";
import { Review } from "@/lib/models";
import connectDB from "@/lib/mongodb";
import { Card } from "@/components/ui/card";
import { SearchSection } from "./components/search-section";
import { MarketingSection } from "./components/marketing-section";
import { CategoriesSection } from "./components/categories-section";
import { LatestReviewsCarousel } from "./components/latest-reviews-carousel";
import { RadarAnimation } from "./components/radar-animation";

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

async function getLatestReviews() {
  await connectDB();
  
  const reviews = await Review.find()
    .populate('relatedWebsite', 'name URL')
    .populate('relatedUser', 'name')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return reviews.map(review => ({
    ...review,
    _id: review._id.toString(),
    relatedWebsite: {
      ...review.relatedWebsite,
      _id: review.relatedWebsite._id.toString(),
    },
    relatedUser: review.relatedUser ? {
      ...review.relatedUser,
      _id: review.relatedUser._id.toString(),
    } : null,
  }));
}

interface Suggestion {
  _id: string;
  name: string;
  URL: string;
}

export default async function Home() {
  const latestReviews = await getLatestReviews();
  
  return (
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
        <div className="pt-12">
          <SearchSection />
        </div>
        
        
        
        <CategoriesSection />
        <MarketingSection />
        <LatestReviewsCarousel reviews={latestReviews} />
      </div>
    </main>
  );
}