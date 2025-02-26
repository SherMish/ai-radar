"use client";

import { useState } from "react";
import {
  BarChart3,
  MessageSquare,
  Settings,
  Star,
  Users,
  Calendar,
  TrendingUp,
  Filter,
  ThumbsUp,
  Flag,
  Building2,
  Upload,
  Bell,
  Users2,
  CreditCard,
  Puzzle,
  BarChart,
  Share2,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image'
import { useBusinessGuard } from '@/hooks/use-business-guard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type Feature = {
  id: string;
  title: string;
  description: string;
};

// Mock data
const mockReviews = [
  {
    id: 1,
    userName: "John Doe",
    rating: 5,
    content: "Amazing tool for creative writing and problem-solving!",
    date: "2024-03-20",
    helpful: 42,
    responded: false,
  },
  {
    id: 2,
    userName: "Jane Smith",
    rating: 4,
    content: "Very useful but can be inconsistent at times.",
    date: "2024-03-19",
    helpful: 28,
    responded: true,
  },
];

const mockMetrics = {
  averageRating: 4.5,
  totalReviews: 156,
  monthlyVisitors: 12500,
  customerEngagement: 78,
  weekOverWeek: {
    visitors: +15,
    reviews: +8,
    engagement: +12,
  },
};

export default function BusinessDashboard() {
  const { isLoading, website, user } = useBusinessGuard();
  const [activeTab, setActiveTab] = useState("analytics");
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
  const [newFeature, setNewFeature] = useState({ title: "", description: "" });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        logo: "Please upload a PNG or JPG file"
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        logo: "File size must be less than 2MB"
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLogo(file);
    setFormErrors(prev => ({ ...prev, logo: "" }));
  };

  const addFeature = () => {
    if (!newFeature.title || !newFeature.description) return;
    
    setFeatures(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: newFeature.title,
        description: newFeature.description,
      },
    ]);
    setNewFeature({ title: "", description: "" });
  };

  const removeFeature = (id: string) => {
    setFeatures(prev => prev.filter(feature => feature.id !== id));
  };

  const moveFeature = (id: string, direction: "up" | "down") => {
    const index = features.findIndex(feature => feature.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === features.length - 1)
    ) {
      return;
    }

    const newFeatures = [...features];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
    setFeatures(newFeatures);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground/90">
            {website?.url || 'Loading...'}
          </h1>
          <p className="text-muted-foreground">
            Business Dashboard
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-4 bg-secondary/50 backdrop-blur-sm">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === "analytics" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
                <Button
                  variant={activeTab === "reviews" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("reviews")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reviews
                </Button>
                <Button
                  variant={activeTab === "profile" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Business Profile
                </Button>
                <Button
                  variant={activeTab === "settings" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="space-y-8">
                  {/* Analytics Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <Star className="h-8 w-8 text-yellow-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">Average Rating</p>
                          <h3 className="text-2xl font-bold">{mockMetrics.averageRating}/5.0</h3>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Reviews</p>
                          <h3 className="text-2xl font-bold">{mockMetrics.totalReviews}</h3>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Visitors</p>
                          <h3 className="text-2xl font-bold">{mockMetrics.monthlyVisitors.toLocaleString()}</h3>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Customer Engagement</p>
                          <h3 className="text-2xl font-bold">{mockMetrics.customerEngagement}%</h3>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Week over Week Comparisons */}
                  <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Week over Week Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Visitors</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-semibold ${mockMetrics.weekOverWeek.visitors > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {mockMetrics.weekOverWeek.visitors > 0 ? '+' : ''}{mockMetrics.weekOverWeek.visitors}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reviews</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-semibold ${mockMetrics.weekOverWeek.reviews > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {mockMetrics.weekOverWeek.reviews > 0 ? '+' : ''}{mockMetrics.weekOverWeek.reviews}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-semibold ${mockMetrics.weekOverWeek.engagement > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {mockMetrics.weekOverWeek.engagement > 0 ? '+' : ''}{mockMetrics.weekOverWeek.engagement}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div className="space-y-6">
                  {/* Filters */}
                  <Card className="p-4 bg-secondary/50 backdrop-blur-sm">
                    <div className="flex flex-wrap gap-4">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="rating-high">Highest Rating</SelectItem>
                          <SelectItem value="rating-low">Lowest Rating</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Response status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Reviews</SelectItem>
                          <SelectItem value="responded">Responded</SelectItem>
                          <SelectItem value="not-responded">Not Responded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <Card key={review.id} className="p-6 bg-secondary/50 backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
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
                            <p className="font-medium">{review.userName}</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              {review.date}
                            </p>
                            <p className="text-muted-foreground">{review.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Helpful ({review.helpful})
                          </Button>
                          {!review.responded && (
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Respond
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Flag className="w-4 h-4 mr-2" />
                            Report
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Business Profile Tab */}
              <TabsContent value="profile">
                <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Business Name</label>
                          <Input defaultValue="AI Company Name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Website URL</label>
                          <Input defaultValue="https://example.com" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Business Email</label>
                          <Input defaultValue="contact@example.com" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <Input defaultValue="+1 (555) 123-4567" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Business Description</h3>
                      <Textarea
                        className="h-32"
                        defaultValue="We are a leading AI company specializing in..."
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Business Logo</h3>
                      <div className="flex items-center gap-4">
                        {logoPreview ? (
                          <div className="relative w-24 h-24">
                            <Image 
                              src={logoPreview}
                              alt="Logo preview"
                              width={96}
                              height={96}
                              className="w-full h-full object-contain rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2"
                              onClick={() => {
                                setLogo(null);
                                setLogoPreview("");
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                            <label className="cursor-pointer text-center p-2">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Upload Logo</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handleLogoChange}
                              />
                            </label>
                          </div>
                        )}
                        <div className="flex-1 text-sm text-muted-foreground">
                          <p>Maximum file size: 2MB</p>
                          <p>Supported formats: PNG, JPG, JPEG</p>
                        </div>
                      </div>
                      {formErrors.logo && (
                        <p className="text-sm text-destructive">{formErrors.logo}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Key Features</h3>
                      <div className="space-y-4">
                        {features.map((feature, index) => (
                          <div
                            key={feature.id}
                            className="p-4 border border-border rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{feature.title}</h4>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveFeature(feature.id, "up")}
                                  disabled={index === 0}
                                >
                                  ↑
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveFeature(feature.id, "down")}
                                  disabled={index === features.length - 1}
                                >
                                  ↓
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFeature(feature.id)}
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        ))}

                        {features.length < 5 && (
                          <div className="p-4 border border-border rounded-lg space-y-4">
                            <div className="space-y-2">
                              <Input
                                placeholder="Feature title"
                                value={newFeature.title}
                                onChange={(e) =>
                                  setNewFeature({ ...newFeature, title: e.target.value })
                                }
                              />
                              <Textarea
                                placeholder="Feature description (max 150 characters)"
                                value={newFeature.description}
                                onChange={(e) =>
                                  setNewFeature({ ...newFeature, description: e.target.value })
                                }
                                maxLength={150}
                              />
                            </div>
                            <Button onClick={addFeature}>Add Feature</Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="gradient-button">Save Changes</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Manage your email notification preferences</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Manage Team Access</p>
                          <p className="text-sm text-muted-foreground">Add or remove team members and set permissions</p>
                        </div>
                        <Button variant="outline">Manage Team</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-secondary/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Billing & Subscription</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Current Plan: Professional</p>
                          <p className="text-sm text-muted-foreground">Manage your subscription and billing details</p>
                        </div>
                        <Button variant="outline">Manage Subscription</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}