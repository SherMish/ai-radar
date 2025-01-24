import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import categoriesData from '@/lib/data/categories.json';
import { Website } from "@/lib/models";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebsiteDoc {
  _id: string;
  name: string;
  url: string;
  description?: string;
  category: string;
  averageRating: number;
  reviewCount: number;
}

interface PageProps {
  params: {
    slug: string;
  };
}

const CategoryPage = async ({ params }: PageProps) => {
  const category = categoriesData.categories.find(cat => cat.id === params.slug);
  if (!category) {
    notFound();
  }

  await connectDB();
  const websites = await Website.find({ category: category.id })
    .select('name url description category averageRating reviewCount')
    .lean();

  // Get the icon component
  const IconComponent = Icons[category.icon as keyof typeof Icons] || Icons.Laptop;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      
      <div className="relative container max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-lg border border-border/50 bg-secondary/50 backdrop-blur-sm">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">
                {category.name}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {category.description}
            </p>
          </div>

          <div className="p-6">
            {websites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No tools found in {category.name} category yet.
                </p>
                <p className="text-muted-foreground mb-8">
                  Would you like to add the first tool in this category?
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/tool/new">
                    <Button className="gradient-button w-full sm:w-auto">
                      Add New Tool
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Browse All Categories
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {websites.map((website) => (
                  <Link 
                    key={website._id.toString()} 
                    href={`/tool/${encodeURIComponent(website.url)}`}
                  >
                    <Card className="p-6 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors border-zinc-700/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-semibold mb-1 text-zinc-50">
                            {website.name}
                          </h2>
                          <p className="text-sm text-zinc-300 mb-3 truncate">
                            {website.url}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (website.averageRating || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-zinc-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-zinc-400">
                              {website.reviewCount || 0} reviews
                            </span>
                          </div>
                        </div>
                        {website.description && (
                          <p className="text-sm text-zinc-300 line-clamp-2 mt-2">
                            {website.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 