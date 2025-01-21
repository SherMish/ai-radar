"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

// This would be replaced with actual data fetching
const mockReviews = [
  {
    id: 1,
    toolName: "ChatGPT",
    rating: 5,
    content: "Amazing tool for creative writing and problem-solving!",
    date: "2024-03-20",
  },
  {
    id: 2,
    toolName: "Midjourney",
    rating: 4,
    content: "Great for generating images, but can be inconsistent.",
    date: "2024-03-15",
  },
];

export default function MyReviewsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold gradient-text mb-8">My Reviews</h1>
          
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <Card key={review.id} className="p-6 bg-secondary/50 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{review.toolName}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-muted-foreground">{review.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}