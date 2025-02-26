"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const freeFeatures = [
  "Verified business profile",
  "Basic analytics dashboard",
  "Review management",
];

const proOnlyFeatures = [
  "Featured listing",
  "Full analytics dashboard",
  "Custom branding",
  "Priority support",
  "Full control over tool page",
  "Early access to new features",
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);

  const monthlyPrice = 249;
  const annualDiscount = 0.37; // 37% off
  const annualPrice = monthlyPrice * 12 * (1 - annualDiscount);

  const handleProSubscription = async () => {
    setLoading(true);
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_KEY as string
    );
    // Implement Stripe checkout
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      <Alert className="bg-success/10 border-success/20 text-success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Your domain has been successfully verified! Choose your plan to
          continue.
        </AlertDescription>
      </Alert>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4">
        <span className={!isAnnual ? "font-semibold" : "text-muted-foreground"}>
          Monthly
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out ${
            isAnnual ? "bg-primary" : "bg-gray-200"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-200 ${
              isAnnual ? "translate-x-6" : ""
            }`}
          />
        </button>
        <div className="flex items-center gap-2">
          <span
            className={isAnnual ? "font-semibold" : "text-muted-foreground"}
          >
            Annual
          </span>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            Save 37%
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className="p-6 border-2 border-border/50">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-muted-foreground mt-2">
                Basic features for getting started
              </p>
            </div>
            <div className="text-3xl font-bold">$0</div>
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" onClick={() => {}}>
              Start with Free
            </Button>
          </div>
        </Card>

        {/* Pro Plan */}
        <Card className="p-6 border-2 border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-muted-foreground mt-2">
                Advanced features to scale your AI business
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold">
                ${isAnnual ? Math.round(annualPrice / 12) : monthlyPrice}
                <span className="text-lg font-normal text-muted-foreground">
                  /mo
                </span>
              </div>
              {isAnnual && (
                <div className="text-sm text-muted-foreground mt-1">
                  Billed annually (${Math.round(annualPrice)}/year)
                </div>
              )}
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-medium text-primary">
                <ArrowRight className="h-5 w-5" />
                Everything in Free, plus:
              </li>
              {proOnlyFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 pl-5">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              size="lg"
              onClick={handleProSubscription}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isAnnual
                ? "Get Pro Annual"
                : "Get Pro Monthly"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Trust Message */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Secure payment powered by Stripe. Cancel anytime.</p>
      </div>
    </div>
  );
}
