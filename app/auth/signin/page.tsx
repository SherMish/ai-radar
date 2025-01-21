"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    // Mock sign in - just redirect back to home
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative w-full max-w-md mx-auto p-6">
        <div className="bg-secondary/50 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-border">
          <h1 className="text-2xl font-bold gradient-text mb-6 text-center">Sign in to AI-Radar</h1>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full gradient-button"
            size="lg"
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}