"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart2,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    href: "/business/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reviews",
    href: "/business/dashboard/reviews",
    icon: MessageSquare,
  },
  {
    title: "Tool Page",
    href: "/business/dashboard/tool",
    icon: Settings,
  },
  {
    title: "Settings",
    href: "/business/dashboard/settings",
    icon: Settings,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r border-white/[0.08] bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
            AI Radar
          </h2>
        </div>
        <div className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-white/[0.06]",
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-medium shadow-lg shadow-purple-500/20"
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  pathname === item.href
                    ? "text-white"
                    : "text-gray-400"
                )} />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 