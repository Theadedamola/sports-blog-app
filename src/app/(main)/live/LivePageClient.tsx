"use client";

import { motion } from "framer-motion";
import type { Match } from "@/types/api";
import { MatchCard } from "@/components/matches/MatchCard";
import { LiveBadge } from "@/components/core/LiveBadge";
import { Radio, Wifi } from "lucide-react";

interface LivePageClientProps {
  initialMatches: Match[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function LivePageClient({ initialMatches }: LivePageClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-live/10 border border-live/20 flex items-center justify-center">
            <Radio className="h-5 w-5 text-live" />
          </div>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              Live Matches
              <LiveBadge size="sm" />
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {initialMatches.length} matches in progress
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neon/60">
          <Wifi className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Auto-refresh</span>
        </div>
      </div>

      {/* Matches Grid */}
      {initialMatches.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {initialMatches.map((match) => (
            <motion.div key={match.id} variants={item}>
              <MatchCard match={match} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-card p-16 text-center">
          <Radio className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-lg font-bold mb-1">No Live Matches</h2>
          <p className="text-sm text-muted-foreground">
            Check back soon — matches are updated in real-time.
          </p>
        </div>
      )}
    </div>
  );
}
