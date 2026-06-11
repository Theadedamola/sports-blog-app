"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Brain,
  Send,
  Sparkles,
  MessageSquare,
  Loader2,
  User,
  Bot,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "How can I stream the live matches today?",
  "Compare Arsenal and Newcastle's recent match forms",
  "Show me today's live match schedules",
  "Analyze the defensive stats of top Premier League teams in this tournament",
  "What is the head-to-head record between Chelsea and Leicester?",
  "How can I check completed match results?",
];

export function AIChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: data.content || data.message || "I apologize, I couldn't generate a response. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content:
          "I'm having trouble connecting right now. This could be because the OpenRouter API key isn't configured yet. Please add your `OPENROUTER_API_KEY` to `.env.local` to enable AI chat. In the meantime, explore today's matches on the **Live Now** or completed **Results** pages!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-6"
            >
              <div className="h-20 w-20 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold mb-2 font-heading">SportsFC AI Analyst</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-8">
              Ask me about live match stats, head-to-head records, tournament lineups,
              and team forms. I analyze live match data to give you real-time insights.
            </p>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => sendMessage(prompt)}
                  className="text-left p-3 rounded glass-card border border-border/50 text-xs text-muted-foreground hover:text-primary hover:border-primary/20 transition-all group"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-primary/60 mb-1.5 group-hover:text-primary transition-colors" />
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3 max-w-2xl",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "h-7 w-7 shrink-0 rounded flex items-center justify-center mt-0.5",
                    msg.role === "user"
                      ? "bg-primary/5 border border-primary/20"
                      : "bg-secondary border border-border/50"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded px-4 py-3 text-sm leading-relaxed max-w-lg",
                    msg.role === "user"
                      ? "bg-primary/10 border border-primary/20 text-foreground"
                      : "glass-card border border-border/50 text-foreground/90"
                  )}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="h-7 w-7 shrink-0 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="glass-card border border-border/50 rounded px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground">Analyzing...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border/50 p-4 glass">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about live scores, team forms, head-to-head records..."
              rows={1}
              className="w-full resize-none rounded bg-white/3 border border-white/8 px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all font-sans text-foreground"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <div className="absolute right-2 bottom-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className={cn(
              "h-11 w-11 rounded flex items-center justify-center transition-all shrink-0",
              input.trim() && !isLoading
                ? "bg-primary text-background hover:bg-primary/90"
                : "bg-white/5 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
