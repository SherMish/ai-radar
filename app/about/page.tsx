import { Building2, Users2, Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">About AI-Radar</h1>
            <p className="text-xl text-muted-foreground">
              Your trusted source for discovering and evaluating AI tools
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI-Radar was founded with a simple mission: to help people navigate the rapidly evolving landscape of artificial intelligence tools. We believe in creating transparency and trust in the AI ecosystem through authentic user reviews and comprehensive evaluations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="space-y-4">
                <Building2 className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide unbiased, user-driven insights into AI tools, helping individuals and businesses make informed decisions about AI adoption.
                </p>
              </div>
              
              <div className="space-y-4">
                <Users2 className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Community First</h3>
                <p className="text-muted-foreground">
                  We&apos;re built on the collective wisdom of our users, fostering a community of AI enthusiasts and professionals.
                </p>
              </div>
              
              <div className="space-y-4">
                <Target className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the most trusted platform for AI tool discovery and evaluation, driving innovation and responsible AI adoption.
                </p>
              </div>
              
              <div className="space-y-4">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Our Values</h3>
                <p className="text-muted-foreground">
                  Transparency, authenticity, and user empowerment guide everything we do.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-muted-foreground">
              Whether you&apos;re an AI enthusiast, professional, or just getting started, your experience matters. Join our community and help shape the future of AI tool discovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}