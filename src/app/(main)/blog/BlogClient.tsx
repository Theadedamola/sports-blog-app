"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "@/lib/api/blog-data";
import type { Match } from "@/types/api";
import { Search, Calendar, Clock, ArrowRight, BookOpen, Radio } from "lucide-react";
import Link from "next/link";

interface BlogClientProps {
  posts: BlogPost[];
  liveMatches: Match[];
  scheduledMatches: Match[];
}

const categories = ["All", "Tactics", "Analysis"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function BlogClient({ posts, liveMatches, scheduledMatches }: BlogClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredMatches = [...liveMatches, ...scheduledMatches.slice(0, 4)];

  useEffect(() => {
    if (featuredMatches.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMatches.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMatches.length]);

  const [allPosts, setAllPosts] = useState<BlogPost[]>(posts);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("custom_blog_posts");
      if (stored) {
        const custom = JSON.parse(stored) as BlogPost[];
        const uniqueCustom = custom.filter((cp) => !posts.some((p) => p.id === cp.id));
        setAllPosts([...uniqueCustom, ...posts]);
      }
    } catch (e) {
      console.error("Error loading custom blog posts", e);
    }
  }, [posts]);

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16 min-h-screen text-foreground">
      {/* ── Stadium Header Banner ───────────────── */}
      <div className="relative rounded-2xl overflow-hidden mb-12 min-h-[220px] flex items-center border border-white/[0.06] bg-black/40">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: `url('/stadium_hero.png')` }}
        />
        {/* Dark radial overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(252,241,218,0.03),transparent_70%)] z-10" />
        
        <div className="relative z-20 px-6 py-8 md:px-10 md:py-12 max-w-2xl text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary font-heading">
              SportsRC Desk
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-3 tracking-tight">
            Latest News
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed font-light">
            Premium football tactical breakdowns, scouting reports, and performance blueprints from our analyst desk.
          </p>
        </div>
      </div>

      {/* ── Search & Filter Panel ───────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/30">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider font-heading transition-colors ${
                activeCategory === category
                  ? "bg-primary text-background border border-primary"
                  : "bg-transparent text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* ── Editorial Stack ────────────────────── */}
      {filteredPosts.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12 max-w-6xl"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.id} variants={item}>
              <Link href={`/blog/${post.id}`} className="group block">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                  {/* Left: cover Image */}
                  <div className="w-full md:w-[45%] relative aspect-video md:aspect-[1.4] overflow-hidden rounded-[20px] border border-white/[0.04] shadow-2xl bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Right: Content */}
                  <div className="w-full md:w-[55%] text-left flex flex-col justify-center gap-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h2>

                    <p className="text-xs md:text-sm text-muted-foreground/80 font-light leading-relaxed max-w-xl">
                      {post.summary}
                    </p>

                    <div className="pt-2">
                      <span className="inline-block px-6 py-3 border border-foreground/50 text-foreground font-bold text-[10px] uppercase tracking-widest font-heading hover:border-foreground hover:bg-foreground/5 transition-all duration-300">
                        Read More
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-card p-16 text-center border border-border/50 bg-black/20">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
          <h2 className="text-sm font-semibold font-heading uppercase tracking-wider text-muted-foreground">No articles found</h2>
          <p className="text-xs text-muted-foreground/80 max-w-[320px] mx-auto mt-1">
            We couldn't find any articles matching "{search}". Try searching for another topic or selecting a different category.
          </p>
        </div>
      )}

      {/* ── Matchday Featured Slideshow Banner ────────────────── */}
      {featuredMatches.length > 0 ? (
        <div className="relative rounded-[20px] overflow-hidden min-h-[220px] md:min-h-[265px] border border-white/[0.06] bg-black/40 mt-24">
          <AnimatePresence mode="wait">
            {(() => {
              const match = featuredMatches[currentSlide];
              const bannerBg = match.poster || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop';
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 flex items-center"
                >
                  {/* Clickable wrapper for the entire slide */}
                  <Link href={`/match/${match.id}`} className="absolute inset-0 flex items-center group">
                    {/* Clear, full-color sports action poster background */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                      style={{ backgroundImage: `url('${bannerBg}')` }}
                    />
                    {/* Rich dark vignette overlay so the text is crystal clear */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-10" />
                    
                    <div className="relative z-20 px-8 py-8 md:px-12 md:py-10 text-left max-w-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        {match.status === "live" || match.status === "halftime" ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-live animate-pulse-live" />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-live font-heading">
                              Live Broadcast
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-primary font-heading">
                              Upcoming Match
                            </span>
                          </>
                        )}
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4 tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </h3>
                      
                      <p className="text-xs md:text-sm text-muted-foreground/90 font-light mb-6">
                        {match.league.name} • {match.league.country} • {new Date(match.startTime).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>

                      <div>
                        <span className="inline-block px-8 py-3 bg-primary text-background font-bold text-xs uppercase tracking-wider font-heading hover:bg-white transition-colors rounded">
                          {match.status === "live" || match.status === "halftime" ? "Watch Live" : "Stream Match"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Slideshow pagination indicator dots centered at bottom right */}
          {featuredMatches.length > 1 && (
            <div className="absolute bottom-4 right-8 z-30 flex items-center gap-2">
              {featuredMatches.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? "w-4 bg-primary" 
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-24 relative rounded-[20px] overflow-hidden min-h-[220px] md:min-h-[260px] flex items-center border border-white/[0.06] bg-black/40">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent z-10" />
          
          <div className="relative z-20 px-8 py-8 md:px-12 md:py-10 text-left max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4 tracking-tight leading-none">
              SportsRC Broadcast Arena
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground/80 font-light mb-6">
              No live broadcasts scheduled at this moment. Stay tuned for upcoming analytical match blueprints.
            </p>
            <Link 
              href="/live"
              className="inline-block px-8 py-3 bg-primary text-background font-bold text-xs uppercase tracking-wider font-heading hover:bg-white transition-colors rounded"
            >
              Explore Schedule
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
