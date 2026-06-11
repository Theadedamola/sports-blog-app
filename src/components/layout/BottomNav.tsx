"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Zap, Radio, BookOpen, MessageSquare } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/ai", label: "Chat", icon: MessageSquare },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden glass-strong border-t border-white/6">
      <div className="flex items-center justify-around py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[56px] rounded-xl transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute -top-1.5 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.href === "/live" && (
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-live animate-pulse-live" />
                )}
              </div>
              <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
