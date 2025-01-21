"use client";

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

const latestReviews = [
  {
    id: 1,
    toolName: "ChatGPT",
    userName: "John Doe",
    rating: 5,
    content: "Amazing tool for creative writing and problem-solving!",
    logo: "C"
  },
  {
    id: 2,
    toolName: "Midjourney",
    userName: "Jane Smith",
    rating: 4,
    content: "Great for generating images, but can be inconsistent.",
    logo: "M"
  },
  {
    id: 3,
    toolName: "Claude",
    userName: "Mike Johnson",
    rating: 5,
    content: "Excellent for analytical tasks and detailed explanations.",
    logo: "C"
  },
  {
    id: 4,
    toolName: "Jasper",
    userName: "Sarah Wilson",
    rating: 4,
    content: "Very helpful for content creation and marketing copy.",
    logo: "J"
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([
    { name: "ChatGPT", url: "openai.com/chatgpt" },
    { name: "Midjourney", url: "midjourney.com" },
    { name: "Claude", url: "anthropic.com/claude" },
    { name: "Jasper", url: "jasper.ai" },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!emblaApi) return;

    let animationFrame: number;
    const scroll = () => {
      if (!emblaApi.canScrollNext()) {
        emblaApi.scrollTo(0);
      } else {
        emblaApi.scrollNext();
      }
      animationFrame = requestAnimationFrame(() => {
        setTimeout(scroll, 3000);
      });
    };

    const timeoutId = setTimeout(() => {
      scroll();
    }, 3000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeoutId);
    };
  }, [emblaApi]);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              AI-Radar
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover and share insights on the best AI tools
            </p>
          </div>

          {/* Search Section */}
          <div className="relative" ref={suggestionsRef}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for an AI tool by URL or name"
                  className="w-full h-12 pl-12 text-lg bg-secondary/50 border-secondary-foreground/10 gradient-border"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
              <Button size="lg" className="gradient-button">
                Search
              </Button>
            </div>

            {showSuggestions && searchQuery && (
              <div className="absolute w-full mt-2 bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-2 space-y-1 z-10 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.url}
                    href={`/tool/${encodeURIComponent(suggestion.url)}`}
                    className="flex items-center p-3 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">{suggestion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.url}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Latest Reviews Section */}
          {/* <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text text-left">Latest Reviews</h2>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6 pl-6">
                {latestReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex-[0_0_300px] min-w-0"
                  >
                    <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-border h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                          <span className="text-xl font-bold gradient-text">
                            {review.logo}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{review.toolName}</h3>
                          <p className="text-sm text-muted-foreground">{review.userName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {review.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Categories Section */}
          {/* <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text text-left">Explore Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group"
                  >
                    <div className="bg-secondary/50 backdrop-blur-sm p-4 rounded-lg border border-border hover:border-primary/50 transition-colors flex flex-col items-center text-center gap-2 h-[140px] justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm">{category.name}</h3>
                        <p className="text-xs text-muted-foreground">{category.count} tools</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
}