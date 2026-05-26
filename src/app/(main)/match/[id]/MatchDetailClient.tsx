"use client";

import { motion } from "framer-motion";
import type { MatchDetail } from "@/types/api";
import { StreamPlayer } from "@/components/stream/StreamPlayer";
import { ScoreBoard } from "@/components/core/ScoreBoard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  History,
  TrendingUp,
  ArrowLeft,
  Radio,
} from "lucide-react";
import Link from "next/link";

interface MatchDetailClientProps {
  match: MatchDetail;
}

export function MatchDetailClient({ match }: MatchDetailClientProps) {
  const isLive = match.status === "live" || match.status === "halftime";

  const showStats = !!match.stats && Object.keys(match.stats).length > 0;
  const showH2H = !!match.headToHead && match.headToHead.length > 0;
  const showForm = !!match.teamForm && ((match.teamForm.home && match.teamForm.home.length > 0) || (match.teamForm.away && match.teamForm.away.length > 0));

  const activeTabsCount = (showStats ? 1 : 0) + (showH2H ? 1 : 0) + (showForm ? 1 : 0);
  const defaultTab = showStats ? "stats" : showH2H ? "h2h" : showForm ? "form" : "";

  let gridColsClass = "grid-cols-3";
  if (activeTabsCount === 2) gridColsClass = "grid-cols-2";
  else if (activeTabsCount === 1) gridColsClass = "grid-cols-1";

  return (
    <div className="min-h-screen">
      {/* Back Button + League */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-heading"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Matches
          </Link>
          <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wider font-heading">
            {match.league.name} • {match.league.country}
          </Badge>
        </div>
      </div>

      {/* Stream Player */}
      {match.streamUrl && isLive && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <StreamPlayer
            streamUrl={match.streamUrl}
          />
        </div>
      )}

      {/* Live stream not available banner */}
      {isLive && !match.streamUrl && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="glass-card aspect-video flex flex-col items-center justify-center gap-3 border border-border/50 rounded-xl bg-black/40 p-6">
            <Radio className="h-10 w-10 text-muted-foreground animate-pulse" />
            <p className="text-sm font-semibold font-heading uppercase tracking-wider text-muted-foreground">Live Stream Not Available</p>
            <p className="text-xs text-muted-foreground/80 max-w-[320px] text-center">
              The live broadcast for this match is currently not available. Check back soon or follow the score below.
            </p>
          </div>
        </div>
      )}

      {/* ScoreBoard */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-8 flex justify-center"
      >
        <ScoreBoard match={match} size="lg" />
      </motion.div>

      {/* Content Tabs */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        {activeTabsCount > 0 ? (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className={cn("w-full glass-card border border-border/60 p-1 mb-6 grid gap-1", gridColsClass)}>
              {showStats && (
                <TabsTrigger
                  value="stats"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded text-xs font-heading uppercase tracking-wider"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  Stats
                </TabsTrigger>
              )}
              {showH2H && (
                <TabsTrigger
                  value="h2h"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded text-xs font-heading uppercase tracking-wider"
                >
                  <History className="h-3.5 w-3.5 mr-1.5" />
                  H2H
                </TabsTrigger>
              )}
              {showForm && (
                <TabsTrigger
                  value="form"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded text-xs font-heading uppercase tracking-wider"
                >
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  Form
                </TabsTrigger>
              )}
            </TabsList>

            {/* Stats Tab */}
            {showStats && (
              <TabsContent value="stats">
                {match.stats && (
                  <div className="glass-card p-6 space-y-4 border border-border/50">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 font-heading">
                      Match Statistics
                    </h3>
                    {Object.entries({
                      Possession: match.stats.possession,
                      Shots: match.stats.shots,
                      "Shots on Target": match.stats.shotsOnTarget,
                      Corners: match.stats.corners,
                      Fouls: match.stats.fouls,
                      "Pass Accuracy": match.stats.passAccuracy,
                      ...(match.stats.xG ? { "Expected Goals (xG)": match.stats.xG } : {}),
                    }).map(([label, stat]) => (
                      <StatBar
                        key={label}
                        label={label}
                        home={typeof stat === "object" ? stat.home : 0}
                        away={typeof stat === "object" ? stat.away : 0}
                        isPercentage={label === "Possession" || label === "Pass Accuracy"}
                        isDecimal={label === "Expected Goals (xG)"}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* H2H Tab */}
            {showH2H && (
              <TabsContent value="h2h">
                {match.headToHead && (
                  <div className="glass-card p-6 border border-border/50">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 font-heading">
                      Head-to-Head Record
                    </h3>
                    <div className="space-y-2">
                      {match.headToHead.map((record, i) => {
                        const isDraw = record.homeScore === record.awayScore;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-3 rounded bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                          >
                            <span className="text-xs text-muted-foreground w-20">{record.date}</span>
                            <span className="text-sm font-medium flex-1 text-right pr-3 truncate">
                              {record.homeTeam}
                            </span>
                            <span
                              className={`text-sm font-bold tabular-nums px-3 py-1 rounded ${
                                isDraw
                                  ? "text-primary bg-primary/10"
                                  : "text-foreground bg-white/[0.05]"
                              }`}
                            >
                              {record.homeScore} - {record.awayScore}
                            </span>
                            <span className="text-sm font-medium flex-1 pl-3 truncate">
                              {record.awayTeam}
                            </span>
                            <span className="text-[10px] text-muted-foreground w-24 text-right hidden md:block">
                              {record.competition}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                    {/* H2H Summary */}
                    <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-white font-heading">
                          {match.headToHead.filter((r) => r.homeScore > r.awayScore).length}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading">{match.homeTeam.name} Wins</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary font-heading">
                          {match.headToHead.filter((r) => r.homeScore === r.awayScore).length}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading">Draws</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white font-heading">
                          {match.headToHead.filter((r) => r.homeScore < r.awayScore).length}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading">{match.awayTeam.name} Wins</div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            )}

            {/* Form Tab */}
            {showForm && (
              <TabsContent value="form">
                {match.teamForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: match.homeTeam.name, form: match.teamForm.home },
                      { label: match.awayTeam.name, form: match.teamForm.away },
                    ].map(({ label, form }) => (
                      <div key={label} className="glass-card p-5 border border-border/50">
                        <h3 className="text-sm font-semibold mb-3 font-heading uppercase tracking-wider">{label} — Last 5</h3>
                        <div className="flex items-center gap-2 mb-4">
                          {form.map((entry, i) => (
                            <div
                              key={i}
                              className={`h-9 w-9 rounded flex items-center justify-center text-xs font-bold font-heading ${
                                entry.result === "W"
                                  ? "bg-win/10 text-win border border-win/20"
                                  : entry.result === "D"
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "bg-loss/10 text-loss border border-loss/20"
                              }`}
                            >
                              {entry.result}
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1.5">
                          {form.map((entry, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white/[0.01]"
                            >
                              <span className="text-muted-foreground">{entry.date}</span>
                              <span className="font-medium">vs {entry.opponent}</span>
                              <span
                                className={`font-bold font-heading ${
                                  entry.result === "W"
                                    ? "text-win"
                                    : entry.result === "D"
                                    ? "text-primary"
                                    : "text-loss"
                                }`}
                              >
                                {entry.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="glass-card p-12 text-center border border-border/50 bg-white/[0.01]">
            <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-sm font-semibold font-heading uppercase tracking-wider text-muted-foreground">Match details not available</p>
            <p className="text-xs text-muted-foreground/80 max-w-[360px] mx-auto mt-1">
              Detailed statistics, head-to-head records, and team form data are currently not available for this broadcast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat Bar Component ──────────────────────

function StatBar({
  label,
  home,
  away,
  isPercentage = false,
  isDecimal = false,
}: {
  label: string;
  home: number;
  away: number;
  isPercentage?: boolean;
  isDecimal?: boolean;
}) {
  const total = home + away || 1;
  const homeWidth = (home / total) * 100;
  const format = (v: number) => (isDecimal ? v.toFixed(1) : v.toString()) + (isPercentage ? "%" : "");
  const homeStronger = home >= away;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-bold tabular-nums ${homeStronger ? "text-primary" : "text-foreground/70"}`}>
          {format(home)}
        </span>
        <span className="text-muted-foreground text-[11px] font-heading uppercase tracking-wider">{label}</span>
        <span className={`font-bold tabular-nums ${!homeStronger ? "text-primary" : "text-foreground/70"}`}>
          {format(away)}
        </span>
      </div>
      <div className="flex h-1.5 rounded overflow-hidden bg-white/5 gap-0.5">
        <div
          className="bg-primary/60 rounded transition-all duration-700"
          style={{ width: `${homeWidth}%` }}
        />
        <div
          className="bg-white/10 rounded transition-all duration-700"
          style={{ width: `${100 - homeWidth}%` }}
        />
      </div>
    </div>
  );
}
