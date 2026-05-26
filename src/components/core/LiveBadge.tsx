"use client";

import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function LiveBadge({ size = "md", className, showText = true }: LiveBadgeProps) {
  const sizes = {
    sm: { dot: "h-1.5 w-1.5", text: "text-[10px]", padding: "px-1.5 py-0.5" },
    md: { dot: "h-2 w-2", text: "text-xs", padding: "px-2 py-0.5" },
    lg: { dot: "h-2.5 w-2.5", text: "text-sm", padding: "px-3 py-1" },
  };

  const s = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-live/20 font-bold uppercase tracking-wider text-live",
        s.padding,
        s.text,
        className
      )}
    >
      <span className={cn("rounded-full bg-live animate-pulse-live", s.dot)} />
      {showText && "Live"}
    </span>
  );
}
