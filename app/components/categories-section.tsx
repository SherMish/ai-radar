"use client";

import { 
  MessageSquare, 
  Image as ImageIcon, 
  Code, 
  Music, 
  Video, 
  Database, 
  Brain, 
  Sparkles, 
  Palette, 
  Bot,
  Briefcase,
  PenTool,
  FileText,
  BarChart,
  Microscope,
  Users,
  Globe,
  Headphones,
  Search as SearchIcon,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const categories = [
  { name: "Text Generation", icon: MessageSquare, count: 156, description: "AI writing, content creation, and language models" },
  { name: "Image Generation", icon: ImageIcon, count: 89, description: "Create, edit, and enhance images with AI" },
  { name: "Code Generation", icon: Code, count: 67, description: "AI-powered coding and development tools" },
  { name: "Audio Processing", icon: Music, count: 45, description: "Voice synthesis, music generation, and audio editing" },
  { name: "Video Generation", icon: Video, count: 34, description: "Create and edit videos using AI" },
  { name: "Data Analysis", icon: Database, count: 78, description: "AI-powered data processing and analytics" },
  { name: "Machine Learning", icon: Brain, count: 92, description: "Ready-to-use ML models and platforms" },
  { name: "Creative Tools", icon: Palette, count: 123, description: "AI tools for artists and designers" },
  { name: "Automation", icon: Bot, count: 56, description: "Workflow and task automation with AI" },
  { name: "Business", icon: Briefcase, count: 88, description: "AI solutions for business operations" },
  { name: "Design", icon: PenTool, count: 67, description: "AI-assisted design and prototyping" },
  { name: "Content Analysis", icon: FileText, count: 45, description: "Content optimization and analysis" },
  { name: "Analytics", icon: BarChart, count: 78, description: "Advanced analytics and insights" },
  { name: "Research", icon: Microscope, count: 34, description: "AI-powered research and analysis tools" },
  { name: "Collaboration", icon: Users, count: 56, description: "Team collaboration enhanced by AI" },
  { name: "Translation", icon: Globe, count: 45, description: "Language translation and localization" },
  { name: "Speech", icon: Headphones, count: 34, description: "Speech recognition and processing" },
  { name: "SEO", icon: SearchIcon, count: 67, description: "AI-powered SEO optimization tools" },
  { name: "Productivity", icon: Zap, count: 89, description: "Personal and team productivity tools" },
  { name: "General AI", icon: Sparkles, count: 145, description: "Multi-purpose AI platforms" }
];

export function CategoriesSection() {
  return (
    <div className="py-24 relative">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore AI Tools by Category</h2>
          <p className="text-muted-foreground text-lg">
            Find the perfect AI tool for your specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link 
                key={category.name} 
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Card className="p-4 hover:bg-secondary/50 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1 flex items-center gap-2">
                        {category.name}
                        <span className="text-sm text-muted-foreground">
                          ({category.count})
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 