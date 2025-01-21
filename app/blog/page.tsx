import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in 2024",
    excerpt: "Exploring the latest trends and predictions in artificial intelligence for the coming year.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    date: "March 21, 2024",
    author: "Sarah Johnson",
    slug: "future-of-ai-2024"
  },
  {
    id: 2,
    title: "Top 10 AI Tools for Content Creation",
    excerpt: "A comprehensive guide to the best AI-powered tools for creating engaging content.",
    image: "https://images.unsplash.com/photo-1664575602554-2087b04935a5",
    date: "March 20, 2024",
    author: "Michael Chen",
    slug: "top-ai-content-tools"
  },
  {
    id: 3,
    title: "AI Ethics: A Practical Guide",
    excerpt: "Understanding the ethical considerations when implementing AI solutions.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    date: "March 19, 2024",
    author: "Emma Williams",
    slug: "ai-ethics-guide"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">AI-Radar Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, guides, and news from the world of AI
            </p>
          </div>

          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="md:flex">
                    <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.author}</span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                      <p className="text-muted-foreground">{post.excerpt}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}