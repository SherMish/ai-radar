import { notFound } from "next/navigation";
import { Star, ThumbsUp, Flag, Globe, Users, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import { Website, Review } from "@/lib/models";
import { Types } from 'mongoose';

interface WebsiteDoc {
  _id: Types.ObjectId;
  name: string;
  URL: string;
  relatedCategory: { name: string };
  owner: { name: string };
}

interface ReviewDoc {
  _id: Types.ObjectId;
  title: string;
  body: string;
  rating: number;
  createdAt: Date;
  relatedWebsite: Types.ObjectId;
  relatedUser?: { _id: Types.ObjectId; name: string; image?: string };
}

async function getWebsiteAndReviews(url: string) {
  await connectDB();
  
  const website = await Website.findOne({ URL: url })
    .populate('relatedCategory', 'name')
    .populate('owner', 'name')
    .lean<WebsiteDoc>();

  if (!website) {
    return null;
  }

  const reviews = await Review.find({ relatedWebsite: website._id })
    .populate('relatedUser', 'name image')
    .sort({ createdAt: -1 })
    .lean<ReviewDoc[]>();

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return {
    website: {
      ...website,
      _id: website._id.toString(),
    },
    reviews: reviews.map(review => ({
      ...review,
      _id: review._id.toString(),
      relatedWebsite: review.relatedWebsite.toString(),
      relatedUser: review.relatedUser 
        ? {
            ...review.relatedUser,
            _id: review.relatedUser._id.toString(),
          }
        : null,
    })),
    averageRating,
  };
}

export default async function ToolPage({ params }: { params: { url: string } }) {
  const data = await getWebsiteAndReviews(decodeURIComponent(params.url));
  if (!data) notFound();

  const { website, reviews, averageRating } = data;

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
                  {website.name[0]}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{website.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a href={website.URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      {website.URL}
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Data unavailable</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded: Data unavailable</span>
                  </div>
                </div>
              </div>
              <Button 
                className="gradient-button"
                asChild
              >
                <a href={`/tool/${encodeURIComponent(params.url)}/review`}>
                  Write Review
                </a>
              </Button>
            </div>
          </div>

          {/* Rating Overview */}
          <Card className="mb-8 bg-secondary/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {reviews.length} reviews
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-muted-foreground">
                    {website.description || "Description unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Features</h2>
            {website.features && website.features.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {website.features.map((feature, index) => (
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
            ) : (
              <p className="text-muted-foreground">Features data unavailable</p>
            )}
          </div>

          {/* Pricing */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
            <p className="text-muted-foreground">Pricing data unavailable</p>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map((review) => (
                <Card key={review._id} className="bg-secondary/50 backdrop-blur-sm">
                  <div className="p-6">
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
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Helpful (0)
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="w-4 h-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews yet. Be the first to review this tool!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}