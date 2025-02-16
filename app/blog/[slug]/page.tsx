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
    <div className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
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
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
} 