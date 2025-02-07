"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, Flag, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Review } from "./reviews-section";
import { ReportReviewModal } from "./report-review-modal";
import { useSession } from "next-auth/react";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { data: session } = useSession();

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
    <>
      <Card className="p-6 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors border-zinc-700/50">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {review.isVerified ? (
                        <div className="flex items-center gap-1 text-emerald-500">
                          <ShieldCheck className="w-4 h-4 fill-emerald-500/10" />
                          <span className="text-xs font-medium">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-zinc-400">
                          <ShieldAlert className="w-4 h-4" />
                          <span className="text-xs font-medium">Unverified</span>
                        </div>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {review.isVerified 
                        ? "This review is verified with proof of using the service" 
                        : "This review was submitted without proof of using the service"
                      }
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <h3 className="text-lg font-semibold text-zinc-50 mb-2">
                {review.title}
              </h3>
            </div>
            <span className="text-xs text-zinc-500 whitespace-nowrap order-first sm:order-last">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsReportModalOpen(true)}
            >
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>
        </div>
      </Card>

      <ReportReviewModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        review={review}
        userEmail={session?.user?.email || ""}
      />
    </>
  );
} 