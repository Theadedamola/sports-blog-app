import type { Metadata } from "next";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SportsFC — Live Football Streaming & Match Day",
    template: "%s | SportsFC",
  },
  description:
    "Watch SportsFC live sports, stream matches, and converse with the AI Tournament Analyst.",
  keywords: [
    "live football streaming",
    "sports results",
    "live match today",
    "AI sports analyst",
  ],
  openGraph: {
    type: "website",
    title: "SportsFC — Live Football Streaming & Match Day",
    description: "Watch live sports streams and get premium match analysis with SportsFC AI.",
    siteName: "SportsFC",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Stack+Sans+Notch:wght@200..700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background font-sans text-foreground"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
