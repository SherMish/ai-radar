import { Metadata } from "next";
import { SideNav } from "./side-nav";

export const metadata: Metadata = {
  title: "Dashboard | AI Radar",
  description: "Manage your AI tool listing and view analytics",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <SideNav />
        <main className="flex-1 relative">
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#3b82f615,transparent_70%),radial-gradient(ellipse_at_bottom,#6366f115,transparent_70%)] pointer-events-none" />
          <div className="relative min-h-screen pb-16">
            {children}
          </div>
        </main>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-t border-white/[0.08] z-50">
        <div className="container mx-auto px-4 py-4">
          {/* Your footer content */}
        </div>
      </footer>
    </div>
  );
} 