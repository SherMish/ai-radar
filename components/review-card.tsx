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
    createdAt: Date;
    helpfulCount: number;
    relatedUser?: {
      name: string;
    };
    relatedWebsite: {
      name: string;
      url: string;
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
    <Card className="bg-secondary/50 backdrop-blur-sm">
      <div className="p-6">
        {/* Website Name and Link */}
        <Link 
          href={`/tool/${encodeURIComponent(review.relatedWebsite.url)}`}
          className="inline-block text-lg font-semibold hover:text-primary transition-colors mb-4"
        >
          {review.relatedWebsite.name}
        </Link>

        {/* User Info and Rating */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold gradient-text">
                {(review.relatedUser?.name || 'A')[0]}
              </span>
            </div>
            <div>
              <div className="font-medium">{review.relatedUser?.name || "Anonymous"}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
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
            </div>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">{review.body}</p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
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