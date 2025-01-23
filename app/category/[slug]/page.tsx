import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import categoriesData from '@/lib/data/categories.json';
import { Website } from "@/lib/models";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react";

interface WebsiteDoc {
  _id: string;
  name: string;
  url: string;
  description?: string;
  relatedCategory: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

const CategoryPage = async ({ params }: PageProps) => {
  // Find category data from JSON
  const category = categoriesData.categories.find(cat => cat.id === params.slug);
  if (!category) {
    notFound();
  }

  // Get websites for this category
  let websites: WebsiteDoc[] = [];
  
  try {
    await connectDB();
    
    const results = await Website.find({ 
      relatedCategory: category.id 
    }).lean();

    websites = results.map(website => ({
      ...website,
      _id: website._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching websites:', error);
  }

  // Get the icon component
  const IconComponent = Icons[category.icon as keyof typeof Icons] || Icons.Folder;

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="space-y-8">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <Link 
              key={website._id} 
              href={`/tool/${encodeURIComponent(website.url)}`}
            >
              <Card className="p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {website.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{website.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {website.description || "No description available"}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {websites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No tools found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage; 