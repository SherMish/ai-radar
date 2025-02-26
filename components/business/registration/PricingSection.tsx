"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingModal } from "@/components/ui/loading-modal";
import { toast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";

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

export function PricingSection({ websiteUrl }: { websiteUrl: string }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleFreePlan = async () => {
    if (!websiteUrl) {
      console.error("No website URL provided");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Website URL is missing. Please try again.",
      });
      return;
    }

    setLoading(true);
    console.log("Starting free plan registration for:", websiteUrl);

    try {
      // Get saved registration data
      const savedData = JSON.parse(
        localStorage.getItem("businessRegistration") || "{}"
      );
      console.log("Saved registration data:", savedData);

      // Check if website exists
      const cleanUrl = websiteUrl
        .toLowerCase()
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split("/")[0]
        .split(":")[0];
      console.log("Clean URL:", cleanUrl);

      const response = await fetch(
        `/api/website/check?url=${encodeURIComponent(cleanUrl)}`
      );
      const existingWebsite = await response.json();
      console.log("Existing website:", existingWebsite);

      // Generate metadata if needed
      let metadata = null;
      if (!existingWebsite.radarTrust) {
        console.log("Generating metadata...");
        const metadataResponse = await fetch("/api/admin/generate-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: websiteUrl }),
        });

        if (metadataResponse.ok) {
          metadata = await metadataResponse.json();
          console.log("Generated metadata:", metadata);
        } else {
          console.error(
            "Failed to generate metadata:",
            await metadataResponse.text()
          );
        }
      }

      // Get session for user ID
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const userId = session?.user?.id;
      console.log("User ID:", userId);

      // Update user profile first
      const userUpdateRes = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: savedData.fullName,
          phone: savedData.phoneNumber,
          workRole: savedData.role,
          workEmail: savedData.workEmail,
          role: 'business_owner',
          isWebsiteOwner: true,
          isVerifiedWebsiteOwner: true,
          relatedWebsite: cleanUrl
        }),
      });

      const userUpdateResult = await userUpdateRes.json();
      console.log("User update response:", userUpdateResult);

      if (!userUpdateRes.ok) {
        throw new Error(userUpdateResult.error || 'Failed to update user');
      }

      // Then update website
      const websiteUpdateRes = await fetch("/api/website/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cleanUrl,
          name: savedData.businessName,
          owner: userId,
          isVerified: true,
          ...(metadata || {}),
        }),
      });

      const websiteData = await websiteUpdateRes.json();
      console.log("Website update response:", websiteData);

      // Update user with website ID
      const websiteUpdateUserRes = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websites: websiteData._id // Add website ID to user's websites field
        }),
      });

      if (!websiteUpdateUserRes.ok) {
        console.error("Failed to update user with website ID");
      }

      // After successful website and user updates, cleanup verification
      const cleanupRes = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verification: null
        }),
      });

      if (!cleanupRes.ok) {
        console.error("Failed to cleanup verification data");
      }

      // Clear registration data
      localStorage.removeItem("businessRegistration");

      // Sign out and back in to refresh the session
      await signOut({ redirect: false });
      
      // Redirect to dashboard
      router.push("/business/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
      router.push("/business/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <LoadingModal open={loading} />

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
            <Button
              variant="outline"
              className="w-full"
              onClick={handleFreePlan}
              disabled={loading}
            >
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
