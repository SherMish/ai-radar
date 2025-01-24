"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ReviewsToolbarProps {
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  totalReviews: number;
}

export function ReviewsToolbar({ onSortChange, onFilterChange, totalReviews }: ReviewsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-2xl font-semibold">
        Reviews ({totalReviews})
      </h2>
      <div className="flex items-center gap-3">
        <Select onValueChange={onFilterChange} defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="verified">Verified Only</SelectItem>
            <SelectItem value="unverified">Unverified Only</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onSortChange} defaultValue="newest">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 