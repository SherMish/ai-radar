import { ToolPageClient } from "./tool-page-client";

// This would be replaced with actual data fetching
const toolData = {
  "openai.com/chatgpt": {
    name: "ChatGPT",
    url: "openai.com/chatgpt",
    category: "Text Generation",
    description: "ChatGPT is an advanced language model that can engage in natural conversations, assist with writing, answer questions, and help solve complex problems.",
    features: [
      "Natural language understanding",
      "Context-aware responses",
      "Multiple conversation styles",
      "Code generation and debugging",
      "Creative writing assistance",
    ],
    pricing: {
      free: true,
      plans: [
        {
          name: "Free",
          price: "$0",
          features: ["Basic chat functionality", "Standard response time"],
        },
        {
          name: "Plus",
          price: "$20/month",
          features: ["Priority access", "Faster response time", "Advanced features"],
        },
      ],
    },
    stats: {
      averageScore: 4.8,
      totalReviews: 1250,
      monthlyUsers: "100M+",
      founded: "2022",
    },
    reviews: [
      {
        id: 1,
        userName: "John Doe",
        userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        rating: 5,
        content: "ChatGPT has revolutionized how I work. The ability to generate high-quality content and get instant answers to complex questions is invaluable.",
        helpful: 42,
        date: "2024-03-20",
      },
      {
        id: 2,
        userName: "Jane Smith",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        rating: 4,
        content: "Very useful for brainstorming and getting quick answers. Sometimes the responses can be inconsistent, but overall it's an excellent tool.",
        helpful: 28,
        date: "2024-03-19",
      },
    ],
  },
  "midjourney.com": {
    name: "Midjourney",
    url: "midjourney.com",
    category: "Image Generation",
    description: "Midjourney is an AI-powered tool that generates high-quality images from text descriptions, perfect for artists and designers.",
    features: [
      "Text-to-image generation",
      "High-resolution output",
      "Style customization",
      "Batch processing",
      "Commercial usage rights",
    ],
    pricing: {
      free: false,
      plans: [
        {
          name: "Basic",
          price: "$10/month",
          features: ["200 generations", "Standard quality", "Basic support"],
        },
        {
          name: "Pro",
          price: "$30/month",
          features: ["Unlimited generations", "Priority processing", "Advanced features"],
        },
      ],
    },
    stats: {
      averageScore: 4.9,
      totalReviews: 2340,
      monthlyUsers: "5M+",
      founded: "2021",
    },
    reviews: [
      {
        id: 1,
        userName: "Alex Chen",
        userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        rating: 5,
        content: "The quality of images Midjourney produces is absolutely stunning. It's become an essential tool in my creative workflow.",
        helpful: 56,
        date: "2024-03-18",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(toolData).map((url) => ({
    url: encodeURIComponent(url),
  }));
}

export default function ToolPage({
  params,
}: {
  params: { url: string };
}) {
  const decodedUrl = decodeURIComponent(params.url);
  const data = toolData[decodedUrl];

  if (!data) {
    return null;
  }

  return <ToolPageClient data={data} url={params.url} />;
}