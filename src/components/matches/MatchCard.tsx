"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Match } from "@/types/api";
import { TeamLogo } from "@/components/core/TeamLogo";
import { LiveBadge } from "@/components/core/LiveBadge";
import Link from "next/link";
import { Clock, Play } from "lucide-react";
import { format } from "date-fns";

interface MatchCardProps {
  match: Match;
  className?: string;
}

export function MatchCard({ match, className }: MatchCardProps) {
  const isLive = match.status === "live" || match.status === "halftime";
  const isScheduled = match.status === "scheduled";
  const isFinished = match.status === "finished";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/match/${match.id}`}>
        <div
          className={cn(
            "glass-card relative overflow-hidden p-4 cursor-pointer transition-all duration-300",
            "hover:border-primary/30",
            isLive && "border-primary/15",
            className
          )}
        >
          {/* League + Status */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
              {match.league.name}
            </span>
            {isLive && <LiveBadge size="sm" />}
            {isFinished && (
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest font-heading">
                FT
              </span>
            )}
            {isScheduled && (
              <span className="text-[10px] font-medium text-primary flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(match.startTime), "MMM dd, HH:mm")}
              </span>
            )}
          </div>

          {/* Teams & Score */}
          <div className="space-y-2.5">
            {/* Home */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <TeamLogo name={match.homeTeam.name} shortName={match.homeTeam.shortName} logo={match.homeTeam.logo} size="sm" />
                <span className="text-sm font-semibold truncate">{match.homeTeam.name}</span>
              </div>
              <span
                className={cn(
                  "text-lg font-bold tabular-nums min-w-[24px] text-right font-heading",
                  isLive && "text-primary",
                  isScheduled && "text-muted-foreground text-base"
                )}
              >
                {isScheduled ? "-" : match.score.home}
              </span>
            </div>

            {/* Away */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <TeamLogo name={match.awayTeam.name} shortName={match.awayTeam.shortName} logo={match.awayTeam.logo} size="sm" />
                <span className="text-sm font-semibold truncate">{match.awayTeam.name}</span>
              </div>
              <span
                className={cn(
                  "text-lg font-bold tabular-nums min-w-[24px] text-right font-heading",
                  isLive && "text-primary",
                  isScheduled && "text-muted-foreground text-base"
                )}
              >
                {isScheduled ? "-" : match.score.away}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/50">
            {isLive && match.minute ? (
              <span className="text-xs font-mono text-primary/80">{match.minute}&apos;</span>
            ) : (
              <span className="text-[10px] text-muted-foreground">
                {match.league.country} • {format(new Date(match.startTime), "MMM dd, yyyy")}
              </span>
            )}

            <div className="flex items-center gap-2">
              {match.streamUrl && isLive && (
                <span className="text-[10px] text-primary flex items-center gap-1 font-semibold uppercase tracking-wider font-heading">
                  <Play className="h-3 w-3" fill="currentColor" />
                  Watch Live
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
