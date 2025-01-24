"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface ReviewCardProps {
  review: {
    _id: string;
    title: string;
    body: string;
    rating: number;
    createdAt: string;
    helpfulCount: number;
    relatedUser?: {
      _id: string;
      name: string;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false);

  // Check if user has already voted on mount
  useEffect(() => {
    const votedReviews = JSON.parse(localStorage.getItem('votedReviews') || '[]');
    setHasVoted(votedReviews.includes(review._id));
  }, [review._id]);

  const handleHelpfulClick = async () => {
    // Prevent voting if already voted
    if (hasVoted) return;

    try {
      const response = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: review._id }),
      });
      
      if (response.ok) {
        // Update localStorage
        const votedReviews = JSON.parse(localStorage.getItem('votedReviews') || '[]');
        localStorage.setItem('votedReviews', JSON.stringify([...votedReviews, review._id]));
        
        // Update UI state
        setHasVoted(true);
        
        // Update helpful count display
        const reviewElement = document.getElementById(`helpful-count-${review._id}`);
        if (reviewElement) {
          const currentCount = parseInt(reviewElement.textContent || '0');
          reviewElement.textContent = (currentCount + 1).toString();
        }
      }
    } catch (error) {
      console.error('Error marking as helpful:', error);
    }
  };

  return (
    <Card className="p-6 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors border-zinc-700/50">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-400">
                by {review.relatedUser?.name || "Anonymous"}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-50 mb-2">
              {review.title}
            </h3>
          </div>
        </div>
        <p className="mt-4 text-zinc-300">{review.body}</p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-700/50">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleHelpfulClick}
            disabled={hasVoted}
            className={hasVoted ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ThumbsUp className={`w-4 h-4 mr-2 ${hasVoted ? "fill-current" : ""}`} />
            Helpful (<span id={`helpful-count-${review._id}`}>{review.helpfulCount || 0}</span>)
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        </div>
      </div>
    </Card>
  );
} 