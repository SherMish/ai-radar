import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import categoriesData from '@/lib/data/categories.json';
import { Website } from "@/lib/models";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { WebsiteCard } from "@/components/website-card";


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
    .select('name url description logo shortDescription category averageRating reviewCount')
    .lean();

  // Get the icon component
  const IconComponent = (category.icon ? Icons[category.icon as keyof typeof Icons] : Star) as LucideIcon;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      
      <div className="relative container max-w-4xl mx-auto sm:px-4 py-8">
        <div className="rounded-lg border border-border/50 bg-secondary/50 backdrop-blur-sm">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="text-white">
                  {category.name}
                </span>
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
                  <WebsiteCard
                    key={website._id.toString()}
                    website={website}
                  />
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