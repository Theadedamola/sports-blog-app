"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Brain,
  Activity,
  CheckCircle2,
  XCircle,
  BarChart3,
  Eye,
  MessageSquare,
  Zap,
  Lock,
  FilePlus,
  Trash2,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";
import { MOCK_MATCHES } from "@/lib/api/mock-data";
import type { BlogPost } from "@/lib/api/blog-data";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// Image presets for the blog post
const IMAGE_PRESETS = [
  {
    name: "Night Stadium",
    url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Day Pitch",
    url: "https://images.unsplash.com/photo-1540747737956-378724044602?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Tactics Ball",
    url: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800&auto=format&fit=crop",
  },
];

export function AdminClient() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Blog creation state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tactics");
  const [readTime, setReadTime] = useState("5 min read");
  const [coverImage, setCoverImage] = useState(IMAGE_PRESETS[0].url);
  const [authorName, setAuthorName] = useState("Marc Debusschere");
  const [authorRole, setAuthorRole] = useState("Lead Tactical Analyst");
  const [authorAvatar, setAuthorAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"
  );

  const [customPosts, setCustomPosts] = useState<BlogPost[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const apiKeySet = !!process.env.NEXT_PUBLIC_HAS_API_KEY;
  const liveCount = MOCK_MATCHES.filter((m) => m.status === "live").length;
  const streamCount = MOCK_MATCHES.filter((m) => m.streamUrl).length;

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(sessionStorage.getItem("sportsrc_admin_auth") === "true");
    loadCustomPosts();
  }, []);

  const loadCustomPosts = () => {
    try {
      const stored = localStorage.getItem("custom_blog_posts");
      if (stored) {
        setCustomPosts(JSON.parse(stored) as BlogPost[]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "admin" && password.trim() === "admin") {
      sessionStorage.setItem("sportsrc_admin_auth", "true");
      setIsLoggedIn(true);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials. Please use admin / admin.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sportsrc_admin_auth");
    setIsLoggedIn(false);
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPost: BlogPost = {
      id: `custom-${Date.now()}`,
      title,
      slug,
      category,
      readTime,
      publishedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      summary,
      coverImage,
      author: {
        name: authorName,
        role: authorRole,
        avatar: authorAvatar,
      },
      content,
    };

    try {
      const existing = localStorage.getItem("custom_blog_posts");
      const list = existing ? (JSON.parse(existing) as BlogPost[]) : [];
      const updatedList = [newPost, ...list];
      localStorage.setItem("custom_blog_posts", JSON.stringify(updatedList));

      setCustomPosts(updatedList);
      setSuccessMessage("Blueprint article published successfully!");
      setTitle("");
      setSummary("");
      setContent("");
      
      // Auto-hide success message after 4s
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = (id: string) => {
    try {
      const existing = localStorage.getItem("custom_blog_posts");
      if (existing) {
        const list = JSON.parse(existing) as BlogPost[];
        const filtered = list.filter((p) => p.id !== id);
        localStorage.setItem("custom_blog_posts", JSON.stringify(filtered));
        setCustomPosts(filtered);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isMounted) return null;

  // 🔒 Protected Login Screen
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 min-h-[80vh] flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full glass-card border border-primary/10 bg-black/30 p-8 rounded-2xl text-center relative overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(252,241,218,0.02),transparent_60%)] pointer-events-none" />
          
          <div className="h-12 w-12 rounded bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-6 w-6 text-primary" />
          </div>

          <h1 className="text-2xl font-bold font-heading text-foreground mb-1">
            Admin Auth Panel
          </h1>
          <p className="text-xs text-muted-foreground font-light mb-6">
            Input master keys to unlock the platform controller
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-primary font-heading mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-4 pr-4 py-2.5 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors placeholder:text-muted-foreground/40"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-primary font-heading mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-4 pr-4 py-2.5 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors placeholder:text-muted-foreground/40"
              />
            </div>

            {authError && (
              <p className="text-[11px] text-destructive font-semibold font-heading text-center mt-1">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-background font-bold text-xs uppercase tracking-widest font-heading hover:bg-white transition-colors rounded mt-4"
            >
              Verify Keys
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.04] text-[10px] text-muted-foreground/60 font-light">
            Notice: Use default keys <code className="text-primary font-semibold">admin</code> / <code className="text-primary font-semibold">admin</code> to log in.
          </div>
        </motion.div>
      </div>
    );
  }

  // 🎛️ Admin Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-6 text-left">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider font-heading">
              Platform management & tactical posting
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-primary/20 text-primary hover:bg-primary/5 font-semibold text-[10px] uppercase tracking-wider font-heading transition-colors self-start sm:self-auto"
        >
          <LogOut className="h-3.5 w-3.5" />
          Lock Dashboard
        </button>
      </div>

      {/* Status Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            title: "SportsRC API",
            status: true,
            value: "Connected",
            icon: Server,
            color: "text-primary",
            bg: "bg-primary/10 border-primary/20",
          },
          {
            title: "OpenRouter AI",
            status: false,
            value: apiKeySet ? "Active" : "No API Key",
            icon: Brain,
            color: apiKeySet ? "text-primary" : "text-primary/60",
            bg: apiKeySet ? "bg-primary/10 border-primary/20" : "bg-primary/5 border-primary/10",
          },
          {
            title: "Live Matches",
            status: true,
            value: `${liveCount} Active`,
            icon: Activity,
            color: "text-live",
            bg: "bg-live/10 border-live/20",
          },
          {
            title: "Streams Available",
            status: true,
            value: `${streamCount} Active`,
            icon: Zap,
            color: "text-primary",
            bg: "bg-primary/10 border-primary/20",
          },
        ].map((card) => (
          <motion.div key={card.title} variants={item} className="glass-card p-4 border border-border/50 rounded">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-9 w-9 rounded border flex items-center justify-center ${card.bg}`}>
                <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
              </div>
              {card.status ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <XCircle className="h-4 w-4 text-primary/60" />
              )}
            </div>
            <h3 className="text-sm font-semibold font-heading uppercase tracking-wider text-left">{card.title}</h3>
            <p className={`text-xs mt-0.5 font-bold font-heading uppercase tracking-wide text-left ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Admin Features Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column: Create Blog Post Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 md:p-8 border border-border/50 bg-black/20 rounded-xl relative">
            <div className="flex items-center gap-2 mb-6">
              <FilePlus className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold font-heading uppercase tracking-wider">Publish Scout Blueprint</h2>
            </div>

            <form onSubmit={handlePublishPost} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-primary font-heading mb-1.5">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="The Rise of High-Intensity Counters"
                    required
                    className="w-full pl-4 pr-4 py-2.5 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors placeholder:text-muted-foreground/40"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-primary font-heading mb-1.5">
                    Category
                  </label>
                  <div className="flex gap-2">
                    {["Tactics", "Analysis"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider font-heading border transition-colors rounded ${
                          category === cat
                            ? "bg-primary text-background border-primary"
                            : "bg-transparent text-muted-foreground hover:text-foreground border-border/50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary font-heading mb-1.5">
                  Summary / Excerpt
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A tactical breakdown of low block transitions..."
                  required
                  className="w-full pl-4 pr-4 py-2.5 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors placeholder:text-muted-foreground/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-primary font-heading mb-1.5">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="6 min read"
                    required
                    className="w-full pl-4 pr-4 py-2.5 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors placeholder:text-muted-foreground/40"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-primary font-heading mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    required
                    className="w-full pl-4 pr-4 py-2.5 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              {/* Image presets */}
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 font-heading mb-2">
                  Presets Cover Images
                </span>
                <div className="flex gap-3">
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`text-[10px] px-3 py-1.5 border rounded uppercase font-semibold font-heading transition-colors ${
                        coverImage === preset.url
                          ? "border-primary text-primary bg-primary/5"
                          : "border-border/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary font-heading mb-1.5">
                  Tactical Analysis Content (Supports Markdown Elements)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="## Heading&#10;Tactical paragraphs here. Use **bold** text and lists:&#10;- Overload the half-spaces&#10;- Execute diagonal switches&#10;&#10;> 'Blockquotes add editorial styling.'"
                  required
                  rows={8}
                  className="w-full pl-4 pr-4 py-3 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground font-light transition-colors placeholder:text-muted-foreground/40 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/[0.04] pt-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 font-heading mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    className="w-full pl-3 pr-3 py-2 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 font-heading mb-1.5">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    required
                    className="w-full pl-3 pr-3 py-2 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 font-heading mb-1.5">
                    Author Avatar
                  </label>
                  <input
                    type="text"
                    value={authorAvatar}
                    onChange={(e) => setAuthorAvatar(e.target.value)}
                    required
                    className="w-full pl-3 pr-3 py-2 text-xs bg-black/20 border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-background font-bold text-xs uppercase tracking-widest font-heading hover:bg-white transition-all rounded shadow-lg"
              >
                Publish Article to feed
              </button>
            </form>

            {/* Success Toast */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-6 left-6 right-6 p-4 rounded bg-primary text-background border border-primary/25 font-bold font-heading text-xs text-center flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Manage Published Custom Posts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 border border-border/50 bg-black/20 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-sm font-semibold font-heading uppercase tracking-wider">Manage Blueprints</h2>
            </div>
            
            {customPosts.length === 0 ? (
              <p className="text-xs text-muted-foreground/80 font-light py-8 text-center border border-dashed border-white/[0.06] rounded bg-black/10">
                No custom blueprint articles published yet. Publish your first article using the creator desk.
              </p>
            ) : (
              <div className="space-y-3">
                {customPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded bg-white/[0.01] border border-white/[0.04] flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-foreground truncate font-heading">{post.title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-heading mt-0.5">
                        {post.category} • {post.readTime}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all cursor-pointer"
                      aria-label="Delete post"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6 border border-border/50 bg-black/20 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-sm font-semibold font-heading uppercase tracking-wider">Platform Analytics</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Page Views", value: "3,142", icon: Eye, change: "+12%" },
                { label: "AI Debate Queries", value: "198", icon: Brain, change: "+8%" },
                { label: "Active Streams", value: `${liveCount}`, icon: Activity, change: "Live" },
                { label: "Total Articles", value: `${3 + customPosts.length}`, icon: FilePlus, change: `+${customPosts.length}` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded bg-white/[0.01] border border-white/[0.04]"
                >
                  <stat.icon className="h-4 w-4 text-muted-foreground mb-2" />
                  <div className="text-lg font-bold tabular-nums font-heading">{stat.value}</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading">{stat.label}</span>
                    <span className="text-[10px] text-primary font-bold font-heading">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
