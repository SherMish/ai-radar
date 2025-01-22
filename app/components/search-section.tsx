"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

interface Suggestion {
  _id: string;
  name: string;
  URL: string;
}

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/websites/search?q=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
          }
        } catch (error) {
          console.error('Search error:', error);
        }
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              AI-Radar
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover and share insights on the best AI tools
            </p>
          </div>

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
              <div className="absolute w-full mt-2 bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-2 space-y-1 z-10 max-h-90 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion._id}
                    href={`/tool/${encodeURIComponent(suggestion.URL)}`}
                    className="flex items-center p-3 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">{suggestion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.URL}
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="border-t border-border mt-2 pt-2">
                  <Link
                    href="/tool/new"
                    className="flex items-center p-3 rounded-md hover:bg-muted/50 transition-colors text-primary"
                  >
                    <div className="font-medium">
                      Can&apos;t find the tool? Add it now in seconds!
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 