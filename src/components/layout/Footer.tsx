import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-[#0c1a12] py-20 pb-28 md:pb-20 text-muted-foreground/80 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(252,241,218,0.02),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Centered Brand Logo */}
        <div className="mb-10">
          <Link href="/" className="inline-block">
            <h2 className="text-4xl font-bold font-heading text-foreground tracking-tight leading-none">
              Sports<span className="text-primary/70 font-light">FC</span>
            </h2>
          </Link>
        </div>

        {/* Centered Partners Title & Row */}
        <div className="mb-12">
          <p className="text-[9px] tracking-[0.3em] font-heading uppercase text-muted-foreground/50 mb-6">
            Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 max-w-xl mx-auto text-xs font-mono tracking-widest text-muted-foreground/60 uppercase">
            <Link href="https://reycasatech.com" target="_blank">
              <span className="hover:text-foreground transition-colors cursor-default">Reycasa</span>
            </Link>
            <Link href="https://grocelo.com" target="_blank">
              <span className="hover:text-foreground transition-colors cursor-default">Grocelo</span>
            </Link>
          </div>
        </div>

        {/* Centered Main Menu Links (2x2 Grid Layout just like reference) */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-4 max-w-xs mx-auto mb-12 text-center font-heading text-lg md:text-xl font-bold tracking-tight text-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Fixtures
          </Link>
          <Link href="/ai" className="hover:text-primary transition-colors">
            Chat
          </Link>
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blogs
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        {/* Centered Instagram Icon SVG */}
        <div className="flex justify-center mb-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground text-muted-foreground/80 transition-colors p-2.5 rounded-full border border-white/6 bg-white/2"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>

        {/* Centered Policy Links */}
        <div className="flex items-center justify-center gap-6 text-[10px] text-muted-foreground/60 mb-6">
          <a href="#" className="hover:text-foreground transition-colors">Site Terms</a>
        </div>

        {/* Legal Text */}
        <div className="text-[10px] text-muted-foreground/40 font-light max-w-xl mx-auto leading-relaxed pt-4 border-t border-primary/5">
          <p>SportsFC Ltd | Registered in England and Wales | Site by SportsFC</p>
        </div>
      </div>
    </footer>
  );
}
