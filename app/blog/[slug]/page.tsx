import { notFound } from "next/navigation";
import Image from "next/image";

// This would be replaced with actual data fetching
const getBlogPost = (slug: string) => {
  const posts = {
    "future-of-ai-2024": {
      title: "The Future of AI in 2024",
      content: `
        As we move further into 2024, the landscape of artificial intelligence continues to evolve at an unprecedented pace. From breakthrough developments in language models to innovative applications in healthcare and beyond, this year promises to be transformative for AI technology.

        ## Key Trends

        1. **Multimodal AI Models**
        The integration of different types of data - text, images, audio, and video - into single AI models is becoming increasingly sophisticated.

        2. **AI Democratization**
        More accessible tools and platforms are making AI technology available to a broader audience, from small businesses to individual creators.

        3. **Enhanced Privacy Measures**
        As AI systems become more prevalent, there's a growing focus on privacy-preserving techniques and responsible AI development.

        ## Impact on Industries

        The influence of AI is being felt across various sectors:

        - **Healthcare**: Improved diagnostic tools and personalized treatment plans
        - **Education**: Adaptive learning systems and automated grading
        - **Finance**: Advanced fraud detection and automated trading systems
        - **Creative Industries**: More sophisticated content generation tools

        ## Looking Ahead

        The future of AI holds both promise and challenges. As we continue to push the boundaries of what's possible, it's crucial to maintain a balance between innovation and responsible development.
      `,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      date: "March 21, 2024",
      author: "Sarah Johnson",
      authorRole: "AI Research Analyst"
    },
    "top-ai-content-tools": {
      title: "Top 10 AI Tools for Content Creation",
      content: "Content coming soon...",
      image: "https://images.unsplash.com/photo-1664575602554-2087b04935a5",
      date: "March 20, 2024",
      author: "Michael Chen",
      authorRole: "Content Strategist"
    },
    "ai-ethics-guide": {
      title: "AI Ethics: A Practical Guide",
      content: "Content coming soon...",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
      date: "March 19, 2024",
      author: "Emma Williams",
      authorRole: "AI Ethics Researcher"
    }
  }[slug];

  if (!posts) return null;
  return posts;
};

export function generateStaticParams() {
  return [
    { slug: "future-of-ai-2024" },
    { slug: "top-ai-content-tools" },
    { slug: "ai-ethics-guide" },
  ];
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">{post.title}</h1>
            <div className="flex items-center text-muted-foreground mb-8">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
              {post.authorRole && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.authorRole}</span>
                </>
              )}
            </div>
            <div className="relative aspect-video mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}