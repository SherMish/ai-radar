"use client";

import { SearchInput } from "@/components/search-input";
import { useRouter } from "next/navigation";

export function SearchSection() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[30vh] relative overflow-visible">
      <div className="relative container mx-auto px-4 py-8 pb-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Find AI You Can Trust
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover and share insights on the best AI tools
            </p>
          </div>
          
          <div className="relative">
            <SearchInput onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
} 