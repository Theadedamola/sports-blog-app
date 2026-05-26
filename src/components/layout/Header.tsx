"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Zap,
  Radio,
  BookOpen,
  MessageSquare,
  Search,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/ai", label: "AI Chat", icon: MessageSquare },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight font-heading">
              Sports<span className="text-primary/80">RC</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {item.href === "/live" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse-live" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded text-muted-foreground hover:text-foreground hover:bg-white/[0.02] transition-colors">
              <Search className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
