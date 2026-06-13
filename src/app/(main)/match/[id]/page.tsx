import type { Metadata } from "next";
import { fetchMatchDetail } from "@/lib/api/fetchers";
import { MatchDetailClient } from "@/app/(main)/match/[id]/MatchDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await fetchMatchDetail(id);
  if (!match) return { title: "Match Not Found" };
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} — ${match.league.name}`,
    description: `Watch ${match.homeTeam.name} vs ${match.awayTeam.name} live stream. ${match.league.name}.`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const match = await fetchMatchDetail(id);

  if (!match) notFound();

  return <MatchDetailClient match={match} />;
}
