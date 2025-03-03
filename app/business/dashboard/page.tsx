"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  MousePointer,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BarChart, LineChart } from "@tremor/react";
import { Review } from "@/components/reviews-section";

type Feature = {
  id: string;
  title: string;
  description: string;
};
const chartdata = [
  { date: "Jan 23", "Page Views": 890, "Unique Visitors": 338 },
  { date: "Feb 23", "Page Views": 967, "Unique Visitors": 437 },
  { date: "Mar 23", "Page Views": 1402, "Unique Visitors": 728 },
  // ... more data
];

// Add this function to fetch analytics
const fetchTotalViews = async (websiteId: string) => {
  try {
    const response = await fetch(
      `/api/analytics/get?websiteId=${websiteId}&eventType=page_visit`
    );
    const data = await response.json();

    // Calculate total views across all months
    const totalViews = data.reduce(
      (sum: number, item: any) => sum + (item.visitors || 0),
      0
    );
    return totalViews;
  } catch (error) {
    console.error("Error fetching total views:", error);
    return 0;
  }
};

// Add this function next to fetchTotalViews
const fetchTotalClicks = async (websiteId: string) => {
  try {
    const response = await fetch(
      `/api/analytics/get?websiteId=${websiteId}&eventType=click_site_button`
    );
    const data = await response.json();

    const totalClicks = data.reduce(
      (sum: number, item: any) => sum + (item.visitors || 0),
      0
    );
    return totalClicks;
  } catch (error) {
    console.error("Error fetching total clicks:", error);
    return 0;
  }
};

export default function DashboardPage() {
  const { isLoading, website, user } = useBusinessGuard();
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "1",
      title: "AI-Powered Writing",
      description: "Advanced natural language processing for content creation",
    },
    {
      id: "2",
      title: "Real-time Collaboration",
      description: "Work together seamlessly with team members",
    },
  ]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

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
      fetchTotalViews(website._id.toString()).then(setTotalViews);
      fetchTotalClicks(website._id.toString()).then(setTotalClicks);
    }
  }, [website]);

  if (isLoading || isLoadingReviews) {
    return <LoadingSpinner />;
  }
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <p className="text-gray-400">
          Welcome back, {user?.name?.split(" ")[0]}!
        </p>
        <Link
          href={`/tool/${website?.url}`}
          target="_blank"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <span>View Public Page</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Reviews
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {website?.reviewCount || 0}
              </h3>
              {/* Remove or comment out the percentage change for now */}
              {/* <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8.2%
              </p> */}
            </div>
            <Star className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Rating
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {website?.averageRating
                  ? website?.averageRating.toFixed(1)
                  : "0.0"}
              </h3>
              {/* Remove or comment out the percentage change for now */}
              {/* <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +0.3
              </p> */}
            </div>
            <Star className="w-8 h-8 text-yellow-500 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <h3 className="text-2xl font-bold mt-2">{totalViews}</h3>
              {/* <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5%
              </p> */}
            </div>
            <Eye className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Website Clicks
              </p>
              <h3 className="text-2xl font-bold mt-2">{totalClicks}</h3>
            </div>
            <MousePointer className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Latest Reviews - Second Row, Spans Full Width */}
        <Card className="col-span-full p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-200">
              Latest Reviews
            </h3>
            <Link
              href="/business/dashboard/reviews"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-200 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-400">
                Your tool hasn&apos;t received any reviews yet. Reviews will
                appear here once users start sharing their experiences.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.slice(0, 4).map((review) => (
                <div
                  key={review._id}
                  className="p-4 rounded-lg bg-white/5 border border-white/[0.08]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-600"
                          }`}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-200 mb-2 line-clamp-1">
                    {review.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {review.body}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
