"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StreamPlayerProps {
  streamUrl: string;
  className?: string;
}

export function StreamPlayer({
  streamUrl,
  className,
}: StreamPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-black aspect-video",
        className
      )}
    >
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-surface"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-heading uppercase tracking-wider">Loading live stream...</p>
            <Skeleton className="w-3/4 h-2 bg-white/5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-surface">
          <AlertTriangle className="h-10 w-10 text-primary" />
          <p className="text-sm font-semibold font-heading uppercase tracking-wider text-foreground">Stream Unavailable</p>
          <p className="text-xs text-muted-foreground max-w-[280px] text-center">
            This stream is currently not available. Try again later or check another match.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
            }}
            className="mt-2 px-4 py-1.5 rounded bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider font-heading hover:bg-primary/30 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stream iframe */}
      {!hasError && (
        <iframe
          src={streamUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}
