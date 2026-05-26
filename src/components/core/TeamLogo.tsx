"use client";

import { cn } from "@/lib/utils";

interface TeamLogoProps {
  name: string;
  shortName?: string;
  logo?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

// Team color palette for initials fallback
const TEAM_COLORS: Record<string, string> = {
  ARS: "from-red-600 to-red-800",
  NEW: "from-gray-700 to-black",
  RMA: "from-blue-100 to-white",
  ATM: "from-red-600 to-blue-800",
  BAY: "from-red-600 to-red-700",
  BVB: "from-yellow-400 to-yellow-600",
  JUV: "from-gray-800 to-black",
  INT: "from-blue-700 to-black",
  PSG: "from-blue-800 to-red-600",
  OLM: "from-blue-400 to-blue-600",
  MCI: "from-sky-400 to-sky-600",
  LIV: "from-red-500 to-red-700",
  CHE: "from-blue-600 to-blue-800",
  TOT: "from-gray-100 to-blue-900",
  BAR: "from-blue-700 to-red-700",
  SEV: "from-red-500 to-white",
  MUN: "from-red-600 to-red-800",
  AVL: "from-purple-800 to-sky-300",
  NAP: "from-sky-400 to-sky-600",
  ACM: "from-red-600 to-black",
};

export function TeamLogo({ name, shortName, logo, size = "md", className }: TeamLogoProps) {
  const initials = shortName || name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colorKey = shortName || initials;
  const gradient = TEAM_COLORS[colorKey] || "from-primary/15 to-primary/5 text-primary border border-primary/20 shadow-none";

  if (logo) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full overflow-hidden bg-white/5 border border-primary/20",
          sizeMap[size].split(" ").slice(0, 2).join(" "), // get only sizing class
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            // Hide the image if it fails to load, so initials fallback can show if desired
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-br font-bold shadow-none",
        gradient,
        sizeMap[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
