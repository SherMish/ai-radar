"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/login-modal";
import { WebsiteRegistrationForm } from "@/components/business/registration/WebsiteForm";
import { DomainVerificationForm } from "@/components/business/registration/DomainVerificationForm";
import { PricingSection } from "@/components/business/registration/PricingSection";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLoginModal } from "@/hooks/use-login-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { verifyDomain as verifyDomainAction } from "@/app/actions/verification";

export default function BusinessRegistration() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(() => {
    // Initialize step based on URL params
    const token = searchParams?.get("token");
    const stepParam = searchParams?.get("step");
    if (token && stepParam === "4") {
      return 4;
    }
    return 1;
  });
  const loginModal = useLoginModal();
  const [formData, setFormData] = useState({
    websiteUrl: searchParams?.get("url") ?? "",
    businessName: "",
    fullName: "",
    phoneNumber: "",
    role: "",
    agreedToTerms: false,
  });
  const [verifiedWebsiteUrl, setVerifiedWebsiteUrl] = useState<string | null>(
    null
  );

  // Redirect to dashboard if user is already linked to a business
  useEffect(() => {
    if (session?.user?.businessId) {
      //can use isWebsiteOwner
      window.location.href = "/business/dashboard";
    }
  }, [session]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams?.get("token");
      console.log("Token from URL:", token);
      if (token && step === 4) {
        try {
          const result = await verifyDomainAction(token);
          setVerifiedWebsiteUrl(result.websiteUrl);
          toast({
            title: "Success",
            description: "Your domain ownership has been verified.",
          });
        } catch (error) {
          console.error("Verification error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to verify domain ownership.",
          });
          setStep(3);
        }
      }
    };

    verifyToken();
  }, [searchParams, step]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const steps = [
    { title: "Authentication", description: "Sign in or create an account" },
    { title: "Business Details", description: "Tell us about your business" },
    { title: "Verify Ownership", description: "Confirm your domain ownership" },
    { title: "Choose Plan", description: "Select your subscription plan" },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Register Your Business</h1>
          <p className="text-muted-foreground text-lg">
            Join AI Radar&apos;s business community and showcase your AI tool
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 relative z-10">
          <div className="flex justify-between items-center">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`flex-1 relative ${
                  i !== steps.length - 1
                    ? 'after:content-[""] after:h-[2px] after:w-full after:bg-border after:absolute after:top-1/2 after:left-1/2 after:-z-10'
                    : ""
                }`}
              >
                <div
                  className={`flex flex-col items-center ${
                    i + 1 === step
                      ? "text-primary"
                      : i + 1 < step
                      ? "text-success"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${
                      i + 1 === step
                        ? "bg-primary text-primary-foreground"
                        : i + 1 < step
                        ? "bg-success text-success-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {i + 1 < step ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className="text-sm font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="relative z-10 shadow-lg border-border/50 backdrop-blur-sm bg-background/95">
          <CardContent className="pt-6">
            {/* Step 1: Authentication */}
            <div className={`${step !== 1 ? "hidden" : ""}`}>
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  Sign in to continue
                </h2>
                {!session ? (
                  <Button
                    size="lg"
                    onClick={() => loginModal.onOpen()}
                    className="w-full max-w-sm"
                  >
                    Sign in / Sign up
                  </Button>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Signed in as {session.user.email}</span>
                    </div>
                    <Button onClick={() => setStep(2)}>Continue</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Website Registration */}
            {session && step === 2 && (
              <WebsiteRegistrationForm
                formData={formData}
                setFormData={setFormData}
                onComplete={() => setStep(3)}
              />
            )}

            {/* Step 3: Domain Verification */}
            {session && step === 3 && (
              <DomainVerificationForm
                websiteUrl={formData.websiteUrl}
                onComplete={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}

            {/* Step 4: Pricing */}
            {session && step === 4 && (
              <PricingSection
                websiteUrl={verifiedWebsiteUrl || formData.websiteUrl}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
