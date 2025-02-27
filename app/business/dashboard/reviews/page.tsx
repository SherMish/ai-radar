"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReviewsPage() {
  const { isLoading, website } = useBusinessGuard();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      content: "Amazing tool for creative writing and problem-solving!",
      date: "2024-03-20",
      helpful: 42,
      responded: false,
    },
    // Add more mock reviews
  ]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
          Reviews
        </h1>
        <p className="text-gray-400">Manage and respond to your tool reviews</p>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6 bg-black/50 backdrop-blur border border-white/[0.08]">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "text-yellow-500" : "text-gray-400"
                        }`}
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">by {review.user}</span>
                </div>
                <p className="text-gray-200 mb-4">{review.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{review.date}</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {review.helpful}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Respond
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 