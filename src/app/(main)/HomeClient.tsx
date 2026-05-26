"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Match } from "@/types/api";
import { MatchCard } from "@/components/matches/MatchCard";
import { LiveBadge } from "@/components/core/LiveBadge";
import {
  Zap,
  Radio,
  Calendar,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface HomeClientProps {
  allMatches: Match[];
  liveMatches: Match[];
  scheduledMatches: Match[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function HomeClient({
  allMatches,
  liveMatches,
  scheduledMatches,
}: HomeClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const posterMatches = allMatches.filter((m) => m.poster);

  useEffect(() => {
    if (posterMatches.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posterMatches.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [posterMatches.length]);

  return (
    <div className="min-h-screen font-sans">
      {/* ── Hero Banner ────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/40 min-h-[480px] flex items-center">
        {/* Dynamic Background Slideshow */}
        <div className="absolute inset-0 z-0 bg-background">
          <AnimatePresence mode="wait">
            {posterMatches.length > 0 && (
              <motion.div
                key={posterMatches[currentSlide].id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.15, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${posterMatches[currentSlide].poster})` }}
              />
            )}
          </AnimatePresence>
          {/* Dark Forest Green radial vignette overlay to keep text ultra-readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(252,241,218,0.04),transparent_70%)] z-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-left"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider font-heading">
                  SportsRC Match Day
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.1] font-heading">
                Live Streaming. <br />
                <span className="text-primary">Interactive AI Chat.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-6 leading-relaxed font-light">
                Watch matches live with premium stream players and chat with our expert AI Tournament Analyst to dissect team forms, head-to-head records, and real-time stats.
              </p>

              {posterMatches.length > 0 && (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-xs text-primary mb-6 font-heading"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Featured: {posterMatches[currentSlide].homeTeam.name} vs {posterMatches[currentSlide].awayTeam.name}
                </motion.div>
              )}

              <div className="flex items-center gap-3">
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-background font-semibold text-sm hover:bg-primary/95 transition-colors font-heading"
                >
                  <Radio className="h-4 w-4" />
                  Watch Live Now
                </Link>
                <Link
                  href="/ai"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-primary/25 bg-transparent text-primary font-medium text-sm hover:bg-primary/5 transition-colors font-heading"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat with AI
                </Link>
              </div>
            </motion.div>

            {/* Hero stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 grid grid-cols-3 gap-3 w-full lg:max-w-md ml-auto"
            >
              {[
                { label: "Live Matches", value: liveMatches.length, icon: Radio, color: "text-live" },
                { label: "AI Analyst", value: "Active", icon: MessageSquare, color: "text-primary" },
                { label: "Upcoming", value: scheduledMatches.length, icon: Calendar, color: "text-white" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 text-center rounded border border-border/50 bg-black/40">
                  <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-xl font-bold font-heading tabular-nums">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Live Matches ──────────────────────── */}
      {liveMatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Radio className="h-5 w-5 text-live" />
              <h2 className="text-xl font-bold font-heading">Live Now</h2>
              <LiveBadge size="sm" />
            </div>
            <Link
              href="/live"
              className="text-xs text-primary/80 font-medium flex items-center gap-0.5 hover:text-primary transition-colors font-heading"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {liveMatches.map((match) => (
              <motion.div key={match.id} variants={item}>
                <MatchCard match={match} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Upcoming Fixtures ──────────────────── */}
      {scheduledMatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 text-primary/80" />
              <h2 className="text-xl font-bold font-heading">Upcoming Fixtures</h2>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {scheduledMatches.map((match) => (
              <motion.div key={match.id} variants={item}>
                <MatchCard match={match} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── All Matches ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Zap className="h-5 w-5 text-primary/80" />
            <h2 className="text-xl font-bold font-heading">All Matches</h2>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {allMatches.map((match) => (
            <motion.div key={match.id} variants={item}>
              <MatchCard match={match} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
