"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  ArrowRight,
  Quote,
  Sparkles,
  Bot,
  Radar as RadarIcon,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { AnimatedWord } from "@/components/ui/animated-word";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    title: "Boost Visibility",
    description:
      "Get discovered by professionals and businesses actively looking for AI solutions",
    icon: Search,
  },
  {
    title: "Build Trust",
    description:
      "Collect and display verified user reviews to enhance credibility",
    icon: CheckCircle2,
  },
  {
    title: "Engage Users",
    description:
      "Respond to reviews, showcase updates, and interact with potential customers",
    icon: ArrowRight,
  },
  {
    title: "Data & Insights",
    description:
      "Gain access to analytics on user engagement, market trends, and competitors",
    icon: ArrowRight,
  },
];

const steps = [
  {
    title: "Claim Your AI Tool",
    description: "Verify your ownership and update your profile",
  },
  {
    title: "Optimize Your Listing",
    description: "Add key details, features, and pricing to attract users",
  },
  {
    title: "Get Reviews & Feedback",
    description:
      "Encourage users to leave reviews to improve trust and credibility",
  },
  {
    title: "Monitor Performance",
    description:
      "Track engagement, user feedback, and market trends through our analytics dashboard",
  },
];

const trustedCompanies = [
  { name: "OpenAI", logo: "O" },
  { name: "Anthropic", logo: "A" },
  { name: "Midjourney", logo: "M" },
  { name: "Jasper", logo: "J" },
  { name: "Stability AI", logo: "S" },
  { name: "Hugging Face", logo: "H" },
];

const testimonials = [
  {
    quote:
      "AI-Radar has been instrumental in helping us understand our users&apos; needs and improve our product. The insights we&apos;ve gained are invaluable.",
    author: "Sarah Chen",
    role: "Product Lead at TechAI",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    quote:
      "The quality of feedback and the engagement from the AI-Radar community has exceeded our expectations. It&apos;s become an essential part of our growth strategy.",
    author: "Michael Rodriguez",
    role: "CEO of AITools Pro",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
];

interface Tool {
  _id: string;
  name: string;
  url: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  averageRating: number;
  reviewCount: number;
  radarTrust?: number;
}

const latestTools: Tool[] = [
  {
    _id: "1",
    name: "ChatGPT",
    url: "chat.openai.com",
    shortDescription: "Advanced language model for natural conversations and content creation",
    averageRating: 4.8,
    reviewCount: 1250,
    radarTrust: 9.2,
  },
  {
    _id: "2",
    name: "Midjourney",
    url: "midjourney.com",
    shortDescription: "AI-powered image generation from text descriptions",
    averageRating: 4.6,
    reviewCount: 890,
    radarTrust: 8.9,
  },
  // Add more sample tools as needed
];

function useCountUp(
  end: number,
  duration: number = 1000,
  decimals: number = 0
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setCount(progress * end);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  return decimals === 0 ? Math.floor(count) : count.toFixed(decimals);
}

function GrowthIndicator({
  value,
  delay = 1500,
}: {
  value: number;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`text-xs text-emerald-500 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      ↑ {value}%
    </div>
  );
}

export default function BusinessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold">
                <AnimatedWord /> <br /> Your AI Business with AI-Radar
              </h1>
              <p className="text-xl text-muted-foreground">
                Thousands of businesses and professionals use AI-Radar to
                discover AI tools. Make sure they find yours.
              </p>
              <Button
                size="lg"
                className="gradient-button"
                onClick={() => router.push("/business/register")}
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Right Column - Graphic */}
            <div className="relative aspect-square md:aspect-auto md:h-[500px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-border/50 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full max-w-[90%] md:max-w-[80%] aspect-square">
                    {/* Floating Elements */}
                    <div className="absolute top-0 left-[10%] w-20 h-20 bg-primary/20 rounded-lg animate-float-diagonal" />
                    <div className="absolute top-[20%] right-[10%] w-16 h-16 bg-secondary/20 rounded-full animate-float-right" />
                    <div className="absolute bottom-[20%] left-[20%] w-24 h-24 bg-blue-500/20 rounded-lg rotate-45 animate-float-left" />

                    {/* Central Element - Adjust sizing for mobile */}
                    <div className="absolute inset-[10%] md:inset-[20%] bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-4 md:p-6">
                      <div className="h-full flex flex-col">
                        {/* Analytics Header - Adjust spacing for mobile */}
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center relative group">
                              <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary absolute group-hover:opacity-0 transition-opacity" />
                              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                              <div className="font-medium text-sm md:text-base">
                                Your AI Tool
                              </div>
                              <div className="text-xs md:text-sm text-muted-foreground">
                                Last 30 days
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid - Adjust spacing and text sizes for mobile */}
                        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                          <div className="bg-background/50 rounded-lg p-2 md:p-3">
                            <div className="text-xs md:text-sm text-muted-foreground">
                              Page Views
                            </div>
                            <div className="text-lg md:text-2xl font-bold">
                              {useCountUp(9752, 1500)}
                            </div>
                            <GrowthIndicator value={12} />
                          </div>
                          <div className="bg-background/50 rounded-lg p-2 md:p-3">
                            <div className="text-xs md:text-sm text-muted-foreground">
                              Conversions
                            </div>
                            <div className="text-lg md:text-2xl font-bold">
                              {useCountUp(1239, 1500)}
                            </div>
                            <GrowthIndicator value={26} />
                          </div>
                        </div>

                        {/* Trust Score - Adjust spacing and text sizes for mobile */}
                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1 text-primary">
                              <RadarIcon className="w-3 h-3 md:w-4 md:h-4" />
                              <span className="text-xs md:text-sm font-medium">
                                RadarTrust™
                              </span>
                            </div>
                            <div className="text-xs md:text-sm text-primary">
                              {useCountUp(9.1, 1500, 1)}
                            </div>
                          </div>
                          <div className="h-1.5 md:h-2 rounded-full bg-background overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-[1500ms]"
                              style={{ width: `${useCountUp(91, 1500)}%` }}
                            />
                          </div>
                          <div className="mt-1 md:mt-2 text-[10px] md:text-xs text-muted-foreground">
                            Top 9% of AI tools
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Floating Elements */}
                    <div className="absolute bottom-[10%] right-[15%] w-12 h-12 bg-purple-500/20 rounded-full animate-float" />
                    <div className="absolute top-[40%] left-[5%] w-14 h-14 bg-pink-500/20 rounded-lg rotate-12 animate-float-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Search Tool Section */}
      <section className="relative py-16 bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* <h2 className="text-4xl md:text-5xl font-bold">Find your AI tool</h2> */}
            <p className="text-lg">
            Help Users Find You – Claim Your AI Tool
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <div className="relative">
                <Input
                  type="url"
                  placeholder="Enter your website URL"
                  className="h-14 pl-5 pr-36 text-lg"
                />
                <Button 
                  className="absolute right-2 top-2 h-10 px-8 text-base"
                  onClick={() => router.push("/business/register")}
                >
                  Claim
                </Button>
              </div>
              <div className="mt-3 text-sm text-muted-foreground text-center">
                ex. www.ai-radar.co
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Section */}
      <section className="relative py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-zinc-50">
                Claim your profile. Control your reputation.
              </span>{" "}
              <span className="text-primary">Grow faster</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Take control of your AI tool&apos;s presence on AI-Radar. Engage with users, respond to feedback, and showcase your innovation to thousands of potential customers.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Profile</h3>
              <p className="text-muted-foreground">
                Get a verified badge, customize your listing, and maintain accurate information about your AI tool.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <RadarIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Review Management</h3>
              <p className="text-muted-foreground">
                Respond to reviews, gather feedback, and build trust with transparent communication with your users.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Growth Analytics</h3>
              <p className="text-muted-foreground">
                Access detailed insights about your performance, user engagement, and market position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-secondary/50 backdrop-blur-sm border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Join AI-Radar?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-32 h-20 rounded-2xl bg-primary/10 mb-2">
                  <div className="text-4xl font-bold text-primary">10K+</div>
                </div>
                <h3 className="text-xl font-semibold">Monthly Visitors</h3>
                <p className="text-muted-foreground">
                  Gain exposure to thousands of professionals searching for AI solutions
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-32 h-20 rounded-2xl bg-primary/10 mb-2">
                  <div className="text-4xl font-bold text-primary">75%</div>
                </div>
                <h3 className="text-xl font-semibold">Increased Engagement</h3>
                <p className="text-muted-foreground">
                  Listed AI tools see a significant boost in user interaction and conversions
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-32 h-20 rounded-2xl bg-primary/10 mb-2">
                  <div className="text-4xl font-bold text-primary">500+</div>
                </div>
                <h3 className="text-xl font-semibold">AI Companies</h3>
                <p className="text-muted-foreground">
                  Join a growing network of AI businesses leveraging AI-Radar for visibility
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button
                size="lg"
                className="gradient-button"
                onClick={() => router.push("/business/register")}
              >
                List Your AI Tool
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Control Section */}
      <section className="relative py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm"
              >
                <div className="text-4xl font-bold text-primary mb-4">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings Section */}
      <section className="relative py-24 bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Latest AI Tools on AI-Radar
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {latestTools.map((tool) => (
                <Card key={tool._id} className="p-6 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors border-zinc-700/50">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center overflow-hidden">
                      <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center">
                        <span className="text-xs text-zinc-400">{tool.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h2 className="text-lg font-semibold text-zinc-50">
                          {tool.name}
                        </h2>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < tool.averageRating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-zinc-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-zinc-400">
                            {tool.averageRating.toFixed(1)}
                          </span>
                          <div className="w-px h-4 bg-zinc-700" />
                          <div className="flex items-center gap-1 text-primary">
                            <RadarIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {tool.radarTrust}
                              <span className="ml-1">RadarTrust™</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {tool.shortDescription && (
                        <p className="text-sm text-zinc-400 line-clamp-2">
                          {tool.shortDescription}
                        </p>
                      )}
                      
                      <div className="flex items-center">
                        <Button
                          onClick={() => window.open(`https://${tool.url}`, '_blank')}
                          className="sm:ml-auto inline-flex items-center justify-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors text-sm"
                        >
                          Visit Website
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20">
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold gradient-text">
              Join AI-Radar Today and Scale Your AI Business
            </h2>
            <p className="text-xl text-muted-foreground">
              Start building trust and credibility with your audience today.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="gradient-button"
                onClick={() => router.push("/business/register")}
              >
                Claim Your Tool
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/business/register")}
              >
                List Your AI Tool
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
