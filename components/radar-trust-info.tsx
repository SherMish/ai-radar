"use client";

import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RadarTrustInfoProps {
  children?: React.ReactNode;
}

export function RadarTrustInfo({ children }: RadarTrustInfoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <button className="inline-flex items-center hover:opacity-80 transition-opacity">
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Understanding the RadarTrust™ Algorithm</DialogTitle>
          <DialogDescription>
            The RadarTrust™ Score is an AI-driven reliability metric that
            evaluates AI tools using a proprietary algorithmic assessment model.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto">
          <div>
            <h3 className="font-medium mb-2">How the Algorithm Works</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The RadarTrust™ Algorithm leverages machine learning, data
              aggregation, and multi-source validation to compute an objective
              1-10 score. It weighs multiple trust signals, ensuring an accurate
              and unbiased assessment.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">User Reviews & Ratings (40%)</h4>
              <p className="text-sm text-muted-foreground">
                Our algorithm ingests and analyzes user feedback from trusted
                third-party sources. It evaluates both quantitative ratings
                (star reviews) and qualitative analysis (detailed feedback) to
                determine an overall satisfaction and reliability index.
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                Feature Robustness & Innovation (30%)
              </h4>
              <p className="text-sm text-muted-foreground">
                This category is assessed by AI-driven comparison models, which
                evaluate an AI tool&apos;s technical depth, capabilities, and
                feature innovation. The algorithm cross-references API
                availability, integrations, automation levels, and proprietary
                advancements to score how advanced the tool is in its category.
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                Market Adoption & Reputation (20%)
              </h4>
              <p className="text-sm text-muted-foreground">
                Our system performs real-time web analysis to assess:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Brand recognition (mentions, citations, partnerships)</li>
                <li>Industry authority (publications, media coverage)</li>
                <li>
                  Community engagement (active users, discussions, developer
                  feedback)
                </li>
                <li>Tool longevity (sustained adoption vs. recent hype)</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                Pricing & Accessibility (10%)
              </h4>
              <p className="text-sm text-muted-foreground">
                Our algorithm evaluates pricing fairness based on:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Free vs. paid model comparison</li>
                <li>Transparency in pricing</li>
                <li>Value-for-money ratio</li>
                <li>Availability of free trials or freemium tiers</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                AI tools that offer more accessible pricing structures receive
                higher scores, while expensive tools with unclear benefits may
                be rated lower.
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            <p className="font-medium mb-2">How Scores Are Updated</p>
            <p>
              The RadarTrust™ Algorithm continuously refines scores using
              real-time data ingestion, periodic recalculations, and dynamic
              weight adjustments based on market trends and evolving user
              feedback. This ensures that each tool&apos;s score remains
              accurate, up-to-date, and fair.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
