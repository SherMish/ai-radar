"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useSession, signOut } from "next-auth/react";
import { UserNav } from "@/components/user-nav";

const navigation = [
  // { name: "For Businesses", href: "/business" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const loginModal = useLoginModal();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="AI-Radar"
                  width={150}
                  height={28}
                  
                />
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  BETA
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}

            {session?.user && (
              <Link
                href="/my-reviews"
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                My Reviews
              </Link>
            )}

            <div className="flex items-center gap-2">
              {session?.user ? (
                <UserNav user={session.user} onSignOut={() => signOut()} />
              ) : (
                <Button
                  variant="outline"
                  onClick={() => loginModal.onOpen()}
                  className="font-medium"
                >
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden",
            isOpen ? "block" : "hidden"
          )}
        >
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {session?.user && (
              <Link
                href="/my-reviews"
                className="block rounded-md px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Reviews
              </Link>
            )}

            <div className="px-3 py-4">
              {session?.user ? (
                <UserNav user={session.user} onSignOut={() => signOut()} />
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    loginModal.onOpen();
                  }}
                  className="w-full justify-start text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}