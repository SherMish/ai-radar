"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useRef, useEffect } from "react";
import Link from "next/link";

interface Suggestion {
  _id: string;
  name: string;
  url: string;
}

interface SearchInputProps {
  className?: string;
  onSearch: (query: string) => void;
}

export function SearchInput({ className, onSearch }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/websites/search?q=${encodeURIComponent(query)}`);
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
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      onSearch(trimmedQuery);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className={`relative w-full ${className || ''}`}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search for an AI tool by URL or name"
              className="w-full h-12 pl-12 text-lg bg-secondary/50 border-secondary-foreground/10 gradient-border"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          </div>
          <Button 
            type="submit" 
            size="lg" 
            className="gradient-button h-12 w-full sm:w-[120px]"
          >
            Search
          </Button>
        </div>
      </form>

      {showSuggestions && query && (
        <div className="absolute w-full mt-2 bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-2 space-y-1 z-50 max-h-90 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion._id}
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
  );
} 