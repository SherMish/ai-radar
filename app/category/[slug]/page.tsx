"use client";

import { useState, useEffect } from "react";
import { Star, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import categoriesData from '@/lib/data/categories.json';
import * as Icons from "lucide-react";
import { Website } from "@/lib/models";

// Mock data for tools in each category
const mockTools = {
  "text-generation": [
    {
      id: 1,
      name: "ChatGPT",
      description: "Advanced language model for text generation and conversation",
      rating: 4.8,
      reviewCount: 1250,
      url: "openai.com/chatgpt",
      logo: "C",
      price: "freemium",
      features: ["Text Generation", "Code Generation", "Translation"],
      integrations: ["API", "Web", "Mobile"],
      platforms: ["Web", "iOS", "Android"],
      lastUpdated: "2024-03-15",
      dateAdded: "2022-11-30",
    },
    {
      id: 2,
      name: "Claude",
      description: "AI assistant for writing, analysis, and coding",
      rating: 4.7,
      reviewCount: 856,
      url: "anthropic.com/claude",
      logo: "C",
      price: "paid",
      features: ["Text Generation", "Analysis", "Code Generation"],
      integrations: ["API", "Web"],
      platforms: ["Web"],
      lastUpdated: "2024-03-10",
      dateAdded: "2023-03-15",
    },
  ],
  "image-generation": [
    {
      id: 3,
      name: "Midjourney",
      description: "Create stunning artwork using AI",
      rating: 4.9,
      reviewCount: 2340,
      url: "midjourney.com",
      logo: "M",
      price: "paid",
      features: ["Image Generation", "Style Transfer", "Art Creation"],
      integrations: ["Discord", "API"],
      platforms: ["Discord", "Web"],
      lastUpdated: "2024-03-01",
      dateAdded: "2022-07-12",
    },
  ],
  // ... other categories
};

const features = [
  "Text Generation",
  "Code Generation",
  "Translation",
  "Analysis",
  "Image Generation",
  "Style Transfer",
  "Art Creation",
];

const integrations = ["API", "Web", "Mobile", "Discord"];
const platforms = ["Web", "iOS", "Android", "Discord"];

type SortOption = "name-asc" | "name-desc" | "date-new" | "date-old" | "rating-high" | "rating-low" | "price-low" | "price-high";
type PriceFilter = "all" | "free" | "freemium" | "paid";

interface Filters {
  search: string;
  price: PriceFilter;
  features: string[];
  integrations: string[];
  platforms: string[];
  minRating: number;
  lastUpdated: number; // days
}

interface WebsiteDoc {
  _id: string;
  name: string;
  URL: string;
  description?: string;
  relatedCategory: string;
}

async function getCategoryWebsites(categoryId: string) {
  await connectDB();
  
  const websites = await Website.find({ 
    relatedCategory: categoryId 
  }).lean();

  return websites.map(website => ({
    ...website,
    _id: website._id.toString(),
  })) as WebsiteDoc[];
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // Find category data from JSON
  const category = categoriesData.categories.find(cat => cat.id === params.slug);
  if (!category) {
    notFound();
  }

  // Get Icon component
  const IconComponent = Icons[category.icon as keyof typeof Icons];
  
  // Get websites for this category
  const websites = await getCategoryWebsites(category.id);

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="space-y-8">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>

        {/* Websites Grid */}
        {websites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <Link 
                key={website._id} 
                href={`/tool/${encodeURIComponent(website.URL)}`}
              >
                <Card className="p-6 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {website.name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{website.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {website.description || "No description available"}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No tools found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}