"use client";

import { useState } from "react";
import {
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";

import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BarChart, LineChart } from "@tremor/react";

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


  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        
        <p className="text-gray-400">
          Welcome back, {user?.name?.split(" ")[0]}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <h3 className="text-2xl font-bold mt-2">12,423</h3>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5%
              </p>
            </div>
            <Eye className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Reviews
              </p>
              <h3 className="text-2xl font-bold mt-2">142</h3>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8.2%
              </p>
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
              <h3 className="text-2xl font-bold mt-2">4.8</h3>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +0.3
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border border-white/[0.08]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Unique Visitors
              </p>
              <h3 className="text-2xl font-bold mt-2">5,847</h3>
              <p className="text-sm text-red-600 flex items-center mt-2">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                -3.2%
              </p>
            </div>
            <Users className="w-8 h-8 text-primary opacity-75" />
          </div>
        </Card>
      </div>

      
      
    </div>
  );
}
