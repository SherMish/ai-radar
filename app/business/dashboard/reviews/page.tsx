"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Star, MessageSquare } from "lucide-react";
import { Review } from "@/components/reviews-section";
import { Button } from "@/components/ui/button";

export default function ReviewsPage() {
  const { isLoading, website } = useBusinessGuard();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/websites/${website?._id}/reviews`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (website?._id) {
      fetchReviews();
    }
  }, [website?._id]);

  if (isLoading || isLoadingReviews) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
          Reviews
        </h1>
        <p className="text-gray-400">Manage and respond to your tool reviews</p>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-12 bg-black/50 backdrop-blur border border-white/[0.08] text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-medium text-gray-200 mb-2">No Reviews Yet</h3>
          <p className="text-gray-400 mb-6">
            Your tool hasn&apos;t received any reviews yet. Reviews will appear here once users start sharing their experiences.
          </p>
          <Button variant="outline">
            Share Your Tool
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review._id} className="p-6 bg-black/50 backdrop-blur border border-white/[0.08]">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-500" : "text-gray-600"
                          }`}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">{review.title}</span>
                  </div>
                  <p className="text-gray-200 mb-4">{review.body}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    {review.helpfulCount > 0 && (
                      <span>
                        {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Respond
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 