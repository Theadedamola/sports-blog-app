"use client";

import { cn } from "@/lib/utils";
import type { Match } from "@/types/api";
import { TeamLogo } from "./TeamLogo";
import { LiveBadge } from "./LiveBadge";

interface ScoreBoardProps {
  match: Match;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreBoard({ match, size = "md", className }: ScoreBoardProps) {
  const isLive = match.status === "live" || match.status === "halftime";
  const isFinished = match.status === "finished";

  const sizes = {
    sm: { score: "text-2xl", team: "text-xs", logo: "sm" as const },
    md: { score: "text-4xl", team: "text-sm", logo: "md" as const },
    lg: { score: "text-6xl", team: "text-base", logo: "lg" as const },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-6 md:gap-10", className)}>
      {/* Home Team */}
      <div className="flex flex-col items-center gap-2 min-w-[80px]">
        <TeamLogo
          name={match.homeTeam.name}
          shortName={match.homeTeam.shortName}
          logo={match.homeTeam.logo}
          size={s.logo}
        />
        <span className={cn("font-semibold text-center text-foreground/90", s.team)}>
          {match.homeTeam.shortName || match.homeTeam.name}
        </span>
      </div>

      {/* Score */}
      <div className="flex flex-col items-center gap-1">
        {isLive && <LiveBadge size="sm" />}
        <div className="flex items-center gap-3">
          <span className={cn("font-black tabular-nums", s.score, isLive && "text-neon text-glow-neon")}>
            {match.score.home}
          </span>
          <span className={cn("text-muted-foreground font-light", size === "lg" ? "text-3xl" : "text-xl")}>
            :
          </span>
          <span className={cn("font-black tabular-nums", s.score, isLive && "text-neon text-glow-neon")}>
            {match.score.away}
          </span>
        </div>
        {isLive && match.minute && (
          <span className="text-xs font-mono text-neon/80">{match.minute}&apos;</span>
        )}
        {isFinished && (
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Full Time
          </span>
        )}
        {match.status === "halftime" && (
          <span className="text-xs font-medium text-draw uppercase tracking-wider">
            Half Time
          </span>
        )}
      </div>

      {/* Away Team */}
      <div className="flex flex-col items-center gap-2 min-w-[80px]">
        <TeamLogo
          name={match.awayTeam.name}
          shortName={match.awayTeam.shortName}
          logo={match.awayTeam.logo}
          size={s.logo}
        />
        <span className={cn("font-semibold text-center text-foreground/90", s.team)}>
          {match.awayTeam.shortName || match.awayTeam.name}
        </span>
      </div>
    </div>
  );
}
