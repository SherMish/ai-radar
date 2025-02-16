import { Metadata } from 'next';
import { notFound } from "next/navigation";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BlogPost } from '@/lib/types/blog';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getBlogPost(slug: string) {
  await connectDB();
  const post = await BlogPostModel.findOne({ slug, isPublished: true })
    .lean() as unknown as BlogPost & { _id: any };
  
  if (!post) return null;
  
  return {
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | AI-Radar Blog',
    };
  }

  return {
    title: `${post.title} | AI-Radar Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ['AI-Radar Team'],
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects - same as home page */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="fixed inset-0 bg-gradient-to-tr from-background to-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-90" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#1a1f2e,transparent)]" />
      
      <article className="relative container max-w-3xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Blog
        </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.estimatedReadTime} min read</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-invert prose-slate max-w-none
             [&>p]:leading-relaxed [&>p]:mb-4
            [&>h2]:text-foreground [&>h2]:font-semibold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-2xl
            [&>h3]:text-foreground [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-xl
            [&>h4]:text-foreground [&>h4]:font-semibold [&>h4]:mt-8 [&>h4]:mb-4 [&>h4]:text-lg
            [&>a]:text-primary [&>a]:no-underline hover:[&>a]:underline
            [&>strong]:text-foreground [&>strong]:font-semibold
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ul]:text-muted-foreground
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4 [&>ol]:text-muted-foreground
            [&>li]:my-2
            [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic
            [&>table]:w-full [&>table]:my-6 [&>table]:text-sm
            [&>thead>tr>th]:border [&>thead>tr>th]:border-border/50 [&>thead>tr>th]:p-2 [&>thead>tr>th]:bg-secondary/50
            [&>tbody>tr>td]:border [&>tbody>tr>td]:border-border/50 [&>tbody>tr>td]:p-2
            [&>code]:text-primary [&>code]:bg-primary/10 [&>code]:px-1 [&>code]:rounded
            [&>pre]:bg-secondary/50 [&>pre]:p-4 [&>pre]:rounded-lg
            [&>img]:rounded-lg [&>img]:my-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
} 