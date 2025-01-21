"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, Users2, Target, Settings2, BarChart3, Settings, Quote, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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
    quote: "AI-Radar has been instrumental in helping us understand our users' needs and improve our product. The insights we've gained are invaluable.",
    author: "Sarah Chen",
    role: "Product Lead at TechAI",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    quote: "The quality of feedback and the engagement from the AI-Radar community has exceeded our expectations. It's become an essential part of our growth strategy.",
    author: "Michael Rodriguez",
    role: "CEO of AITools Pro",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
];

export default function BusinessPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Grow Your AI Business with Trust and Credibility
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-Radar connects your AI business to a thriving professional community. Showcase your excellence, attract your ideal audience, and use customer feedback to grow your brand.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Enter your business URL"
                  className="w-full h-12 pl-12 text-lg bg-secondary/50 border-secondary-foreground/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
              <Button 
                className="gradient-button"
                size="lg"
                onClick={() => router.push(`/business/register${searchQuery ? `?url=${searchQuery}` : ''}`)}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-secondary/50 backdrop-blur-sm border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-2xl font-semibold mb-12 gradient-text">Trusted by Leading AI Companies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {trustedCompanies.map((company) => (
                <div key={company.name} className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <span className="text-2xl font-bold gradient-text">
                      {company.logo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-background relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Building2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Build Credibility and Trust</h3>
              <p className="text-muted-foreground">
                Showcase authentic customer reviews that highlight the impact of your AI tool. With AI-Radar's transparent review system, establish confidence and trust among your audience.
              </p>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Users2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Engage With Your Audience</h3>
              <p className="text-muted-foreground">
                Respond to reviews, address customer concerns, and demonstrate your commitment to user satisfaction. Foster loyalty by creating meaningful connections with your customers.
              </p>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Boost Visibility and Reach</h3>
              <p className="text-muted-foreground">
                Stand out with a professional profile featuring your logo, category, and key features. AI-Radar connects you with professionals actively searching for AI tools like yours.
              </p>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gain Actionable Insights</h3>
              <p className="text-muted-foreground">
                Use data-driven insights from user feedback to refine your offerings, understand customer preferences, and stay ahead of competitors in the rapidly evolving AI landscape.
              </p>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Settings className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drive Continuous Improvement</h3>
              <p className="text-muted-foreground">
                Harness the power of customer insights to refine and enhance your AI tool. AI-Radar's platform allows you to identify trends, address gaps, and innovate with confidence.
              </p>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Brand Protection</h3>
              <p className="text-muted-foreground">
                Safeguard your brand's reputation with proactive review management and detailed analytics. Monitor sentiment trends and address feedback promptly to maintain brand excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-secondary/50 backdrop-blur-sm border-y border-border">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">What Our Partners Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-background/50 backdrop-blur-sm p-8 rounded-lg border border-border">
                  <Quote className="w-10 h-10 text-primary mb-4" />
                  <p className="text-lg mb-6 text-muted-foreground">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-background relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold gradient-text">Ready to Grow Your AI Business?</h2>
            <p className="text-xl text-muted-foreground">
              Join the leading platform for AI tool discovery and reviews. Start building trust and credibility with your audience today.
            </p>
            <Button 
              className="gradient-button"
              size="lg"
              onClick={() => router.push('/business/register')}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}