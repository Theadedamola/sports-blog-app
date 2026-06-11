"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "@/lib/api/blog-data";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Sparkles,
  Send,
  Loader2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface BlogDetailClientProps {
  initialPost: BlogPost | null;
  postId: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function BlogDetailClient({ initialPost, postId }: BlogDetailClientProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialPost) {
      const loadPost = async () => {
        try {
          const response = await fetch(`/api/blog/${postId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.post) {
              setPost(data.post);
              return;
            }
          }
          loadLocalFallback();
        } catch (e) {
          console.error("Error loading blog post dynamically:", e);
          loadLocalFallback();
        }
      };

      const loadLocalFallback = () => {
        try {
          const stored = localStorage.getItem("custom_blog_posts");
          if (stored) {
            const custom = JSON.parse(stored) as BlogPost[];
            const found = custom.find((p) => p.id === postId || p.slug === postId);
            if (found) {
              setPost(found);
            }
          }
        } catch (e) {
          console.error("Error reading custom blog post from local storage:", e);
        }
      };

      loadPost();
    } else {
      setPost(initialPost);
    }
  }, [initialPost, postId]);


  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, suggestionText?: string) => {
    if (!post) return;
    if (e) e.preventDefault();
    const textToSend = suggestionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!suggestionText) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          blogContext: {
            title: post.title,
            summary: post.summary,
            content: post.content,
          },
        }),
      });

      const data = await response.json();
      if (data && data.content) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: data.content,
          },
        ]);
      } else {
        throw new Error();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an issue analyzing this tactically. Let's try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-semibold font-heading uppercase tracking-wider text-muted-foreground">Dissecting Match Blueprint...</p>
      </div>
    );
  }

  const suggestions =
    post.category === "Tactics"
      ? [
          "Break down St Etienne's 4-5-1 block",
          "What is a cover shadow pressing trap?",
        ]
      : [
          "How do we overload half-spaces?",
          "How to stretch a low block horizontally?",
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16 min-h-screen">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-heading"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Feed
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editorial Article Column */}
        <article className="lg:col-span-8 glass-card overflow-hidden border border-border/50 bg-black/20 p-6 md:p-8 rounded-xl">
          {/* Cover image */}
          <div className="relative aspect-video rounded-xl overflow-hidden mb-6 border border-border/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold bg-primary text-background font-heading uppercase tracking-wider rounded">
              {post.category}
            </div>
          </div>

          {/* Article Header */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight font-heading">
            {post.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-10 w-10 rounded-full object-cover border border-primary/20"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-foreground">{post.author.name}</div>
              <div className="text-[11px] text-muted-foreground font-light">{post.author.role}</div>
            </div>
          </div>

          {/* Render article body with manual styling for Markdown */}
          <div className="text-sm md:text-base text-foreground/90 font-light leading-relaxed space-y-6">
            {post.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-xl md:text-2xl font-bold font-heading pt-4 text-foreground">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-lg font-bold font-heading pt-2 text-foreground/90">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("> ")) {
                const cleaned = paragraph.replace("> ", "").split("\n> ");
                return (
                  <blockquote
                    key={index}
                    className="border-l-2 border-primary pl-4 py-1.5 my-4 bg-primary/5 rounded-r text-sm text-primary/95 italic space-y-1"
                  >
                    {cleaned.map((line, lIdx) => (
                      <p key={lIdx}>{line}</p>
                    ))}
                  </blockquote>
                );
              }
              if (paragraph.startsWith("- ") || /^\d+\./.test(paragraph)) {
                const listItems = paragraph.split("\n");
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 pl-2 text-foreground/80">
                    {listItems.map((li, liIdx) => {
                      const text = li.replace(/^-\s+|^\d+\.\s+/, "");
                      if (li.startsWith("1. ") || li.startsWith("2. ")) {
                        const boldSplit = text.split(": ");
                        return (
                          <li key={liIdx} className="list-decimal pl-1">
                            {boldSplit.length > 1 ? (
                              <>
                                <strong className="font-semibold text-foreground">{boldSplit[0]}</strong>: {boldSplit[1]}
                              </>
                            ) : text}
                          </li>
                        );
                      }
                      return <li key={liIdx}>{text}</li>;
                    })}
                  </ul>
                );
              }
              // Bold inside paragraph mappings
              const parts = paragraph.split("**");
              return (
                <p key={index}>
                  {parts.map((part, pIdx) =>
                    pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-foreground">{part}</strong> : part
                  )}
                </p>
              );
            })}
          </div>
        </article>

        {/* AI Tactical Analyst Discussion Sidebar */}
        <aside className="lg:col-span-4 glass-card border border-border/50 bg-black/20 p-5 rounded-xl flex flex-col h-[560px] lg:h-[640px] sticky top-[80px]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
            <div className="h-6 w-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-primary">Discuss with AI Analyst</h3>
              <p className="text-[9px] text-muted-foreground font-light">Debate and unpack the tactics of this post</p>
            </div>
          </div>

          {/* Chat bubbles area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin text-xs mb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="font-semibold text-muted-foreground font-heading">Start the Discussion</p>
                <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">
                  Ask a question or select one of the tactical queries below to debate this article!
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {messages.map((m) => {
                  const isAssistant = m.role === "assistant";
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isAssistant ? "items-start text-left" : "items-end text-right"}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg leading-relaxed ${
                          isAssistant
                            ? "bg-secondary text-foreground border border-primary/10 rounded-tl-none"
                            : "bg-primary/10 text-primary border border-primary/20 rounded-tr-none font-medium"
                        }`}
                      >
                        {m.content}
                      </div>
                    </motion.div>
                  );
                })}
                {loading && (
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px] pl-1 font-mono italic">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    Analyst is dissecting...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-[10px] font-semibold text-muted-foreground font-heading uppercase tracking-wider">Tactical Questions:</p>
              <div className="flex flex-col gap-1.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(undefined, s)}
                    className="text-left w-full text-[11px] p-2.5 rounded bg-secondary/80 hover:bg-secondary border border-border/40 hover:border-primary/20 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="relative mt-auto pt-3 border-t border-border/30">
            <input
              type="text"
              placeholder="Ask a tactical question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="w-full bg-black/20 border border-border/50 focus:border-primary/50 focus:outline-none rounded pl-3 pr-10 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-[calc(50%-6px)] h-7 w-7 rounded bg-primary text-background disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center transition-colors hover:bg-primary/90"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
