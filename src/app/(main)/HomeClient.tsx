"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Match } from "@/types/api";
import type { BlogPost } from "@/lib/api/blog-data";
import { MatchCard } from "@/components/matches/MatchCard";
import { LiveBadge } from "@/components/core/LiveBadge";
import {
  Radio,
  Calendar,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Tv,
  Trophy,
  Clock,
  BookOpen,
  Play,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

interface HomeClientProps {
  allMatches: Match[];
  liveMatches: Match[];
  scheduledMatches: Match[];
  posts: BlogPost[];
}

const matchTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

function formatMatchTime(startTime: string) {
  return matchTimeFormatter.format(new Date(startTime));
}

export function HomeClient({
  allMatches,
  liveMatches,
  scheduledMatches,
  posts = [],
}: HomeClientProps) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "upcoming">("all");

  // Highlight featured post
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);

  useEffect(() => {
    // Show disclaimer once on load
    const accepted = localStorage.getItem("sportsrc_disclaimer_accepted");
    if (accepted !== "true") {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("sportsrc_disclaimer_accepted", "true");
    setShowDisclaimer(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      
      {/* ── 🚨 Disclaimer Modal ────────────────── */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-xl p-8 bg-secondary/90 border border-primary/20 rounded-2xl shadow-2xl text-left relative overflow-hidden"
            >
              {/* Top ambient light glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
              
              <div className="flex items-center gap-3.5 mb-5 border-b border-white/6 pb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading uppercase tracking-wide">
                    Disclaimer & Terms of Use
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-heading mt-0.5">
                    Copyright & Streaming Index Notice
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed font-light">
                <p>
                  Welcome to <strong className="text-primary font-semibold">SportsFC</strong>. We operate strictly as an indexer and directory of live sports coverage.
                </p>
                <p>
                  <strong className="text-primary">Streaming Host Disclaimer:</strong> None of the live broadcasts, match streams, or video players displayed on this platform are hosted, uploaded, or transmitted by SportsFC. All video content is hosted on external, third-party public servers. We operate solely as a free search tool indexing publicly available links.
                </p>
                <p>
                  By entering this site, you acknowledge that SportsFC bears no responsibility or liability for any content, licensing issues, or copyright compliance related to external links. Please address all copyright complaints or takedown inquiries directly to the respective host server providers.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5">
                  <Info className="h-3 w-3 text-primary/60" />
                  Requires one-time consent on load
                </span>
                <button
                  onClick={handleAcceptDisclaimer}
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-background font-bold text-xs uppercase tracking-widest font-heading hover:bg-white transition-colors rounded shadow-lg"
                >
                  Accept & Proceed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 🗞️ Breaking News Ticker ─────────────── */}
      <div className="bg-black/40 border-b border-border/40 py-2.5 overflow-hidden sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-live/15 border border-live/30 text-[10px] font-bold text-live uppercase tracking-wider font-heading shrink-0 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-live" />
            Breaking News
          </div>
          
          <div className="w-full overflow-hidden relative">
            <div className="flex gap-12 text-xs font-semibold uppercase tracking-wide whitespace-nowrap animate-ticker font-heading text-muted-foreground">
              <span>⚽ FIFA WORLD CUP 2026 LIVE HUB IS ACTIVE — STREAM ALL MATCHES WITH REAL-TIME AI TACTICAL INSIGHTS</span>
              <span>📈 AI ANALYST MODEL UPDATES HEAD-TO-HEAD PREDICTIONS FOR THE CURRENT MATCHDAY</span>
              <span>🏆 WORLD CUP GROUP STAGE: FRANCE VS BRAZIL PREVIEW PACK RELEASED</span>
              <span>⚽ FIFA WORLD CUP 2026 LIVE HUB IS ACTIVE — STREAM ALL MATCHES WITH REAL-TIME AI TACTICAL INSIGHTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 🏆 World Cup 2026 Live Hub Hero ──────── */}
      <section className="relative overflow-hidden border-b border-border/40 min-h-[440px] flex items-center bg-black/30">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.18] mix-blend-luminosity scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/60 to-background z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(252,241,218,0.06),transparent_60%)] z-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 z-20 w-full text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* World Cup Left Banner Details */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest font-heading">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                FIFA World Cup 2026 Live coverage
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-none font-heading uppercase">
                The World Cup <br />
                <span className="text-primary">Spectacle Ignites</span>
              </h1>
              
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed font-light">
                Follow the 2026 tournament stage live on SportsFC. Access lag-free streams aggregated from public directories, follow match events in real-time, and run advanced tactics debates on form, formations, and statistics with our interactive AI Tournament Analyst.
              </p>

              {/* Tournament Statistics Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 max-w-xl">
                {[
                  { label: "Matches Active", value: liveMatches.length, sub: "Broadcasting Now" },
                  { label: "Scout Reports", value: posts.length, sub: "Tactical Blueprints" },
                  { label: "Next Kickoff", value: scheduledMatches.length > 0 ? "Today" : "Tomorrow", sub: "Stage Schedule" },
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-white/1 border border-white/5 rounded-xl hover:border-primary/10 transition-colors">
                    <div className="text-xl font-bold font-heading text-primary">{stat.value}</div>
                    <div className="text-[9px] font-bold text-foreground/80 uppercase tracking-wide mt-0.5">{stat.label}</div>
                    <div className="text-[8px] text-muted-foreground font-light">{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-background font-bold text-xs uppercase tracking-widest font-heading hover:bg-white transition-all rounded shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
                >
                  <Tv className="h-4.5 w-4.5" />
                  Enter Streaming Arena
                </Link>
                {/* <Link
                  href="/ai"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-primary/25 bg-transparent text-primary font-bold text-xs uppercase tracking-widest font-heading hover:bg-primary/5 transition-all rounded"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  Consult AI analyst
                </Link> */}
              </div>
            </div>

            {/* Quick Live Preview widget (right side) */}
            <div className="lg:col-span-4 w-full">
              <div className="glass-card border border-primary/10 bg-black/40 p-6 rounded-2xl relative overflow-hidden text-left shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(252,241,218,0.02),transparent_70%)] pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/6 pb-3.5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-live animate-pulse-live" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-live font-heading">
                      Broadcasting Live
                    </span>
                  </div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-heading">
                    Matchday 3
                  </span>
                </div>

                {liveMatches.length > 0 ? (
                  <div className="space-y-4">
                    {liveMatches.slice(0, 1).map((match) => (
                      <div key={match.id} className="space-y-4">
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm">⚽</div>
                            <span className="text-sm font-bold font-heading">{match.homeTeam.name}</span>
                          </div>
                          <span className="text-lg font-bold font-heading text-primary">{match.score.home}</span>
                        </div>
                        
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm">⚽</div>
                            <span className="text-sm font-bold font-heading">{match.awayTeam.name}</span>
                          </div>
                          <span className="text-lg font-bold font-heading text-primary">{match.score.away}</span>
                        </div>

                        <div className="pt-3 border-t border-white/4 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground/80 font-mono">
                            Elapsed: {match.minute ? `${match.minute}'` : 'Live'}
                          </span>
                          <Link
                            href={`/match/${match.id}`}
                            className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:text-white transition-colors uppercase font-heading"
                          >
                            Watch Stream
                            <Play className="h-3 w-3 fill-primary" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground space-y-2">
                    <Radio className="h-8 w-8 mx-auto text-muted-foreground/40" />
                    <p className="text-xs font-semibold font-heading uppercase tracking-wide">No Active Broadcasts</p>
                    <p className="text-[10px] font-light max-w-[200px] mx-auto">All streams are currently offline. Check the schedules below.</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── 📰 Premium News & Coverage Grid ──────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column (65% width): Journalism / Blog Feed ── */}
          <div className="lg:col-span-8 space-y-12 text-left">
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4.5 w-4.5 text-primary" />
                <h2 className="text-2xl font-bold font-heading uppercase tracking-wide">Scout Blueprint & Analysis</h2>
              </div>
              <p className="text-xs text-muted-foreground font-light">
                Tactical breakdowns, scouting reviews, and match blueprints from the analytical desk.
              </p>
              <div className="h-px bg-border/40 w-full mt-4" />
            </div>

            {/* Main Featured Editorial Story */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.id}`} className="group block">
                <article className="space-y-4">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/4 bg-black/40 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold bg-primary text-background font-heading uppercase tracking-wider rounded">
                      {featuredPost.category}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/85 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {featuredPost.publishedDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-xs md:text-sm text-muted-foreground/80 font-light leading-relaxed max-w-3xl">
                      {featuredPost.summary}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest font-heading">
                      Read Blueprint Report
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Secondary Journalism Cards */}
            {secondaryPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/4">
                {secondaryPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                    <article className="space-y-3">
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/4 bg-black/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold bg-primary/90 text-background font-heading uppercase tracking-wider rounded">
                          {post.category}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 font-mono">
                          <span>{post.publishedDate}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h4 className="text-base font-bold font-heading leading-snug group-hover:text-primary transition-colors truncate">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 font-light leading-relaxed">
                          {post.summary}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* Match Listings Directory */}
            <div className="pt-10 border-t border-white/4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold font-heading uppercase tracking-wide">Match Broadcasts</h3>
                  <p className="text-[10px] text-muted-foreground font-light">Explore results, active streams, and upcoming schedules.</p>
                </div>
                
                {/* Tab selections */}
                <div className="flex bg-secondary border border-white/5 p-1 rounded-full self-start sm:self-auto">
                  {(["all", "live", "upcoming"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-[10px] font-bold font-heading uppercase tracking-wider rounded-lg transition-colors ${
                        activeTab === tab
                          ? "bg-primary text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/2"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtering logic and grid */}
              {(() => {
                let matchesToRender = allMatches;
                if (activeTab === "live") matchesToRender = liveMatches;
                if (activeTab === "upcoming") matchesToRender = scheduledMatches;

                if (matchesToRender.length === 0) {
                  return (
                    <div className="glass-card p-12 text-center border border-white/6 bg-black/10 rounded-xl">
                      <Radio className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-xs font-bold font-heading uppercase tracking-wider text-muted-foreground">No matches found</p>
                      <p className="text-[10px] text-muted-foreground/60 font-light mt-1">There are no matches listed under this category at this moment.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matchesToRender.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>

          {/* ── Right Column (35% width): Sidebar widgets ── */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Live Matches Sidebar list */}
            <div className="glass-card p-5 border border-border/50 bg-black/20 rounded-xl">
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/6">
                <div className="flex items-center gap-2">
                  <Radio className="h-4.5 w-4.5 text-live" />
                  <h3 className="text-xs font-bold font-heading uppercase tracking-wider">Live Channels</h3>
                </div>
                {liveMatches.length > 0 && <LiveBadge size="sm" />}
              </div>

              {liveMatches.length > 0 ? (
                <div className="space-y-3.5">
                  {liveMatches.map((match) => (
                    <Link
                      key={match.id}
                      href={`/match/${match.id}`}
                      className="block p-3.5 rounded bg-white/1 border border-white/3 hover:border-primary/20 transition-all hover:bg-white/2"
                    >
                      <div className="flex justify-between items-center gap-3 text-xs mb-2">
                        <span className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider">
                          {match.league.name}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-live font-semibold font-mono">
                          <span className="h-1 w-1 rounded-full bg-live animate-pulse" />
                          {match.minute ? `${match.minute}'` : "LIVE"}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between font-heading">
                        <span className="text-sm font-bold truncate max-w-[130px]">{match.homeTeam.name}</span>
                        <span className="text-sm font-bold text-primary">{match.score.home}</span>
                      </div>
                      <div className="flex items-center justify-between font-heading mt-1">
                        <span className="text-sm font-bold truncate max-w-[130px]">{match.awayTeam.name}</span>
                        <span className="text-sm font-bold text-primary">{match.score.away}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground/60 border border-dashed border-white/5 bg-black/10 rounded">
                  <Radio className="h-6 w-6 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-[10px] font-bold uppercase tracking-wider font-heading">All streams offline</p>
                  <p className="text-[9px] font-light mt-0.5">Live broadcasts start at scheduled times.</p>
                </div>
              )}
            </div>

            {/* Upcoming Timeline Sidebar calendar */}
            <div className="glass-card p-5 border border-border/50 bg-black/20 rounded-xl">
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-primary/80" />
                  <h3 className="text-xs font-bold font-heading uppercase tracking-wider">Fixture Timeline</h3>
                </div>
                <span className="text-[9px] text-muted-foreground font-mono">Today</span>
              </div>

              {scheduledMatches.length > 0 ? (
                <div className="space-y-3.5">
                  {scheduledMatches.slice(0, 4).map((match) => (
                    <div
                      key={match.id}
                      className="p-3 rounded bg-white/1 border border-white/3 text-left"
                    >
                      <div className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider mb-2">
                        {match.league.name} • {formatMatchTime(match.startTime)}
                      </div>
                      
                      <div className="flex items-center justify-between font-heading font-semibold text-xs">
                        <span className="truncate max-w-[120px]">{match.homeTeam.name}</span>
                        <span className="text-muted-foreground/40">vs</span>
                        <span className="truncate max-w-[120px] text-right">{match.awayTeam.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground/60 border border-dashed border-white/5 bg-black/10 rounded">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-[10px] font-bold uppercase tracking-wider font-heading">No Scheduled Fixtures</p>
                  <p className="text-[9px] font-light mt-0.5">Checking upcoming matchdays...</p>
                </div>
              )}
            </div>

            {/* AI Debate Widget desk */}
            <div className="glass-card p-5 border border-primary/10 bg-primary/5 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20 bg-[radial-gradient(circle_at_top_right,rgba(252,241,218,0.06),transparent_60%)] pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-primary">AI Analyst Desk</h3>
              </div>
              
              <p className="text-xs text-muted-foreground font-light leading-relaxed mb-4">
                Have a sports dispute or want to analyze team form for the World Cup matches? Query our analyst engine to dissect lineups, tactics, head-to-heads, and form lines instantly.
              </p>

              <Link
                href="/ai"
                className="w-full py-2.5 bg-primary text-background font-bold text-[10px] uppercase tracking-widest font-heading hover:bg-white transition-colors rounded flex items-center justify-center gap-1.5 shadow"
              >
                Debate Tactics Now
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
