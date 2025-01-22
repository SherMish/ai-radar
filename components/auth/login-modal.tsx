"use client";

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLoginModal } from '@/hooks/use-login-modal';

export function LoginModal() {
  const loginModal = useLoginModal();

  const handleGoogleLogin = () => {
    signIn('google', { 
      callbackUrl: window.location.href 
    });
  };

  return (
    <Dialog open={loginModal.isOpen} onOpenChange={loginModal.onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border border-border/40">
        <DialogHeader className="space-y-3 text-center pb-2">
          <DialogTitle className="text-2xl font-bold">Welcome Back</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Sign in with Google to share your experience and review AI tools
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-6">
          <Button
            variant="outline"
            size="lg"
            className="w-full relative flex items-center justify-center bg-background hover:bg-secondary/80 border-border/50"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-5 h-5 absolute left-4" />
            <span>Continue with Google</span>
          </Button>
          <p className="text-xs text-center text-muted-foreground px-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}