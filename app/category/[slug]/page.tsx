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

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [tools, setTools] = useState(mockTools[params.slug] || []);
  const [filteredTools, setFilteredTools] = useState(tools);
  const [sortBy, setSortBy] = useState<SortOption>("rating-high");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    price: "all",
    features: [],
    integrations: [],
    platforms: [],
    minRating: 0,
    lastUpdated: 365, // days
  });

  if (!tools.length) {
    notFound();
  }

  const categoryName = params.slug.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  const resetFilters = () => {
    setFilters({
      search: "",
      price: "all",
      features: [],
      integrations: [],
      platforms: [],
      minRating: 0,
      lastUpdated: 365,
    });
    setSortBy("rating-high");
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tools];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        tool => 
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply price filter
    if (filters.price !== "all") {
      result = result.filter(tool => tool.price === filters.price);
    }

    // Apply feature filters
    if (filters.features.length > 0) {
      result = result.filter(tool => 
        filters.features.every(feature => tool.features.includes(feature))
      );
    }

    // Apply integration filters
    if (filters.integrations.length > 0) {
      result = result.filter(tool => 
        filters.integrations.every(integration => tool.integrations.includes(integration))
      );
    }

    // Apply platform filters
    if (filters.platforms.length > 0) {
      result = result.filter(tool => 
        filters.platforms.every(platform => tool.platforms.includes(platform))
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter(tool => tool.rating >= filters.minRating);
    }

    // Apply last updated filter
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - filters.lastUpdated);
    result = result.filter(tool => new Date(tool.lastUpdated) >= cutoffDate);

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-new":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case "date-old":
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        case "price-low":
          return (a.price === "free" ? 0 : a.price === "freemium" ? 1 : 2) -
                 (b.price === "free" ? 0 : b.price === "freemium" ? 1 : 2);
        case "price-high":
          return (b.price === "free" ? 0 : b.price === "freemium" ? 1 : 2) -
                 (a.price === "free" ? 0 : a.price === "freemium" ? 1 : 2);
        default:
          return 0;
      }
    });

    setFilteredTools(result);
  }, [tools, filters, sortBy]);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold gradient-text">{categoryName}</h1>
            <p className="text-xl text-muted-foreground">
              Discover and compare the best {categoryName.toLowerCase()} tools
            </p>
          </div>

          {/* Filters and Sorting */}
          <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-4 border border-border">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="date-new">Newest First</SelectItem>
                  <SelectItem value="date-old">Oldest First</SelectItem>
                  <SelectItem value="rating-high">Highest Rated</SelectItem>
                  <SelectItem value="rating-low">Lowest Rated</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>

              {/* Filters Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {Object.values(filters).some(value => 
                      Array.isArray(value) ? value.length > 0 : value !== "" && value !== "all" && value !== 0 && value !== 365
                    ) && (
                      <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Price Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Price</h3>
                      <Select
                        value={filters.price}
                        onValueChange={(value: PriceFilter) => 
                          setFilters({ ...filters, price: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="freemium">Freemium</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Features Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Features</h3>
                      <div className="space-y-2">
                        {features.map(feature => (
                          <div key={feature} className="flex items-center gap-2">
                            <Checkbox
                              id={feature}
                              checked={filters.features.includes(feature)}
                              onCheckedChange={(checked) => {
                                setFilters({
                                  ...filters,
                                  features: checked
                                    ? [...filters.features, feature]
                                    : filters.features.filter(f => f !== feature)
                                });
                              }}
                            />
                            <label htmlFor={feature} className="text-sm">
                              {feature}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Integrations Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Integrations</h3>
                      <div className="space-y-2">
                        {integrations.map(integration => (
                          <div key={integration} className="flex items-center gap-2">
                            <Checkbox
                              id={integration}
                              checked={filters.integrations.includes(integration)}
                              onCheckedChange={(checked) => {
                                setFilters({
                                  ...filters,
                                  integrations: checked
                                    ? [...filters.integrations, integration]
                                    : filters.integrations.filter(i => i !== integration)
                                });
                              }}
                            />
                            <label htmlFor={integration} className="text-sm">
                              {integration}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Platforms Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Platforms</h3>
                      <div className="space-y-2">
                        {platforms.map(platform => (
                          <div key={platform} className="flex items-center gap-2">
                            <Checkbox
                              id={platform}
                              checked={filters.platforms.includes(platform)}
                              onCheckedChange={(checked) => {
                                setFilters({
                                  ...filters,
                                  platforms: checked
                                    ? [...filters.platforms, platform]
                                    : filters.platforms.filter(p => p !== platform)
                                });
                              }}
                            />
                            <label htmlFor={platform} className="text-sm">
                              {platform}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Minimum Rating Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Minimum Rating</h3>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[filters.minRating]}
                          min={0}
                          max={5}
                          step={0.5}
                          onValueChange={([value]) => 
                            setFilters({ ...filters, minRating: value })
                          }
                        />
                        <span className="min-w-[3ch] text-sm">
                          {filters.minRating}
                        </span>
                      </div>
                    </div>

                    {/* Last Updated Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Last Updated Within</h3>
                      <Select
                        value={filters.lastUpdated.toString()}
                        onValueChange={(value) => 
                          setFilters({ ...filters, lastUpdated: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Last 7 days</SelectItem>
                          <SelectItem value="30">Last 30 days</SelectItem>
                          <SelectItem value="90">Last 3 months</SelectItem>
                          <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reset Filters */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Reset Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={resetFilters}
                className="hidden md:flex"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={`/tool/${encodeURIComponent(tool.url)}`}>
                <Card className="h-full hover:border-primary/50 transition-colors bg-secondary/50 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                        <span className="text-xl font-bold gradient-text">
                          {tool.logo}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{tool.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium">{tool.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({tool.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {tool.price}
                      </span>
                      {tool.platforms.slice(0, 2).map(platform => (
                        <span
                          key={platform}
                          className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                        >
                          {platform}
                        </span>
                      ))}
                      {tool.platforms.length > 2 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                          +{tool.platforms.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools match your filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}