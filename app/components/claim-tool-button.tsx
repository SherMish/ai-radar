"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function ClaimToolButton({ websiteUrl }: { websiteUrl: string }) {
  const router = useRouter();

  const handleClaim = () => {
    localStorage.setItem(
      "businessRegistration",
      JSON.stringify({ websiteUrl })
    );
    router.push("/business/register");
  };

  return (
    <Button 
      onClick={handleClaim}
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
    >
      <ShieldCheck className="w-4 h-4 mr-2" />
      Claim Ownership
    </Button>
  );
} 