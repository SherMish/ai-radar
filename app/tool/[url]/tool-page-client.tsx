"use client";

import { Star, ThumbsUp, Flag, MessageSquare, Globe, Users, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ToolData = {
  name: string;
  url: string;
  category: string;
  description: string;
  features: string[];
  pricing: {
    free: boolean;
    plans: {
      name: string;
      price: string;
      features: string[];
    }[];
  };
  stats: {
    averageScore: number;
    totalReviews: number;
    monthlyUsers: string;
    founded: string;
  };
  reviews: {
    id: number;
    userName: string;
    userImage: string;
    rating: number;
    content: string;
    helpful: number;
    date: string;
  }[];
};

interface ToolPageClientProps {
  data: ToolData;
  url: string;
}

export function ToolPageClient({ data, url }: ToolPageClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                <span className="text-2xl font-bold gradient-text">
                  {data.name[0]}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a href={`https://${data.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      {data.url}
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{data.stats.monthlyUsers} monthly users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded {data.stats.founded}</span>
                  </div>
                </div>
              </div>
              <Button 
                className="gradient-button"
                onClick={() => router.push(`/tool/${encodeURIComponent(url)}/review`)}
              >
                Write Review
              </Button>
            </div>
          </div>

          {/* Rating Overview */}
          <Card className="mb-8 bg-secondary/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{data.stats.averageScore}</div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(data.stats.averageScore)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {data.stats.totalReviews} reviews
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-muted-foreground">
                    {data.description}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 bg-secondary/50 backdrop-blur-sm rounded-lg border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.pricing.plans.map((plan, index) => (
                <Card key={index} className="bg-secondary/50 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="text-2xl font-bold mb-4">{plan.price}</div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
            <div className="space-y-6">
              {data.reviews.map((review) => (
                <Card key={review.id} className="bg-secondary/50 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={review.userImage}
                            alt={review.userName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {review.date}
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
                    <p className="mt-4 text-muted-foreground">{review.content}</p>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="w-4 h-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}