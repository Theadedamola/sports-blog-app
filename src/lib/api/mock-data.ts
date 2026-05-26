import type {
  Match,
  MatchDetail,
  Sport,
  HeadToHeadRecord,
  TeamFormEntry,
  MatchStats,
  MatchEvent,
} from "@/types/api";

// ──────────────────────────────────────────────
// Comprehensive Mock Data for Development
// All data designed to feed the AI prediction engine
// ──────────────────────────────────────────────

export const MOCK_SPORTS: Sport[] = [
  { id: "1", name: "Football", slug: "football", icon: "⚽" },
  { id: "2", name: "Basketball", slug: "basketball", icon: "🏀" },
  { id: "3", name: "Tennis", slug: "tennis", icon: "🎾" },
  { id: "4", name: "Cricket", slug: "cricket", icon: "🏏" },
  { id: "5", name: "Ice Hockey", slug: "ice-hockey", icon: "🏒" },
];

const now = new Date().toISOString();

export const MOCK_MATCHES: Match[] = [
  {
    id: "m-001",
    homeTeam: { id: "t-ars", name: "Arsenal", shortName: "ARS", logo: "/teams/arsenal.png" },
    awayTeam: { id: "t-new", name: "Newcastle United", shortName: "NEW", logo: "/teams/newcastle.png" },
    score: { home: 1, away: 1 },
    status: "live",
    startTime: now,
    minute: 67,
    league: { id: "l-epl", name: "Premier League", country: "England", season: "2025/26" },
    category: "football",
    streamUrl: "https://example.com/stream/m-001",
  },
  {
    id: "m-002",
    homeTeam: { id: "t-rma", name: "Real Madrid", shortName: "RMA", logo: "/teams/realmadrid.png" },
    awayTeam: { id: "t-atm", name: "Atlético Madrid", shortName: "ATM", logo: "/teams/atletico.png" },
    score: { home: 0, away: 0 },
    status: "live",
    startTime: now,
    minute: 34,
    league: { id: "l-liga", name: "La Liga", country: "Spain", season: "2025/26" },
    category: "football",
    streamUrl: "https://example.com/stream/m-002",
  },
  {
    id: "m-003",
    homeTeam: { id: "t-bay", name: "Bayern Munich", shortName: "BAY", logo: "/teams/bayern.png" },
    awayTeam: { id: "t-bvb", name: "Borussia Dortmund", shortName: "BVB", logo: "/teams/dortmund.png" },
    score: { home: 2, away: 1 },
    status: "live",
    startTime: now,
    minute: 78,
    league: { id: "l-bun", name: "Bundesliga", country: "Germany", season: "2025/26" },
    category: "football",
    streamUrl: "https://example.com/stream/m-003",
  },
  {
    id: "m-004",
    homeTeam: { id: "t-juv", name: "Juventus", shortName: "JUV", logo: "/teams/juventus.png" },
    awayTeam: { id: "t-int", name: "Inter Milan", shortName: "INT", logo: "/teams/inter.png" },
    score: { home: 0, away: 0 },
    status: "scheduled",
    startTime: new Date(Date.now() + 3600000).toISOString(),
    league: { id: "l-sa", name: "Serie A", country: "Italy", season: "2025/26" },
    category: "football",
    streamUrl: "https://example.com/stream/m-004",
  },
  {
    id: "m-005",
    homeTeam: { id: "t-psg", name: "Paris Saint-Germain", shortName: "PSG", logo: "/teams/psg.png" },
    awayTeam: { id: "t-olm", name: "Olympique Marseille", shortName: "OLM", logo: "/teams/marseille.png" },
    score: { home: 1, away: 0 },
    status: "halftime",
    startTime: now,
    minute: 45,
    league: { id: "l-l1", name: "Ligue 1", country: "France", season: "2025/26" },
    category: "football",
    streamUrl: "https://example.com/stream/m-005",
  },
  {
    id: "m-006",
    homeTeam: { id: "t-mci", name: "Manchester City", shortName: "MCI", logo: "/teams/mancity.png" },
    awayTeam: { id: "t-liv", name: "Liverpool", shortName: "LIV", logo: "/teams/liverpool.png" },
    score: { home: 0, away: 0 },
    status: "scheduled",
    startTime: new Date(Date.now() + 7200000).toISOString(),
    league: { id: "l-epl", name: "Premier League", country: "England", season: "2025/26" },
    category: "football",
    streamUrl: "https://example.com/stream/m-006",
  },
  {
    id: "m-007",
    homeTeam: { id: "t-che", name: "Chelsea", shortName: "CHE", logo: "/teams/chelsea.png" },
    awayTeam: { id: "t-tot", name: "Tottenham Hotspur", shortName: "TOT", logo: "/teams/tottenham.png" },
    score: { home: 2, away: 2 },
    status: "finished",
    startTime: new Date(Date.now() - 3600000).toISOString(),
    league: { id: "l-epl", name: "Premier League", country: "England", season: "2025/26" },
    category: "football",
  },
  {
    id: "m-008",
    homeTeam: { id: "t-bcn", name: "FC Barcelona", shortName: "BAR", logo: "/teams/barcelona.png" },
    awayTeam: { id: "t-sev", name: "Sevilla", shortName: "SEV", logo: "/teams/sevilla.png" },
    score: { home: 3, away: 1 },
    status: "finished",
    startTime: new Date(Date.now() - 7200000).toISOString(),
    league: { id: "l-liga", name: "La Liga", country: "Spain", season: "2025/26" },
    category: "football",
  },
  {
    id: "m-009",
    homeTeam: { id: "t-mun", name: "Manchester United", shortName: "MUN", logo: "/teams/manutd.png" },
    awayTeam: { id: "t-avl", name: "Aston Villa", shortName: "AVL", logo: "/teams/astonvilla.png" },
    score: { home: 1, away: 1 },
    status: "live",
    startTime: now,
    minute: 55,
    league: { id: "l-epl", name: "Premier League", country: "England", season: "2025/26" },
    category: "football",
    streamUrl: "https://example.com/stream/m-009",
  },
  {
    id: "m-010",
    homeTeam: { id: "t-nap", name: "Napoli", shortName: "NAP", logo: "/teams/napoli.png" },
    awayTeam: { id: "t-acm", name: "AC Milan", shortName: "ACM", logo: "/teams/acmilan.png" },
    score: { home: 0, away: 0 },
    status: "scheduled",
    startTime: new Date(Date.now() + 10800000).toISOString(),
    league: { id: "l-sa", name: "Serie A", country: "Italy", season: "2025/26" },
    category: "football",
    streamUrl: "https://example.com/stream/m-010",
  },
];

// ── Rich H2H and Form Data for AI Predictions ──

function generateH2H(team1: string, team2: string): HeadToHeadRecord[] {
  return [
    { date: "2025-04-12", homeTeam: team1, awayTeam: team2, homeScore: 1, awayScore: 1, competition: "Premier League" },
    { date: "2025-01-20", homeTeam: team2, awayTeam: team1, homeScore: 0, awayScore: 0, competition: "Premier League" },
    { date: "2024-10-05", homeTeam: team1, awayTeam: team2, homeScore: 2, awayScore: 1, competition: "League Cup" },
    { date: "2024-04-15", homeTeam: team2, awayTeam: team1, homeScore: 1, awayScore: 1, competition: "Premier League" },
    { date: "2024-01-08", homeTeam: team1, awayTeam: team2, homeScore: 0, awayScore: 1, competition: "Premier League" },
    { date: "2023-09-22", homeTeam: team2, awayTeam: team1, homeScore: 0, awayScore: 0, competition: "Premier League" },
  ];
}

function generateForm(strong: boolean): TeamFormEntry[] {
  if (strong) {
    return [
      { opponent: "Wolves", result: "W", score: "2-0", date: "2025-05-10" },
      { opponent: "Everton", result: "D", score: "1-1", date: "2025-05-03" },
      { opponent: "Brighton", result: "W", score: "1-0", date: "2025-04-26" },
      { opponent: "Crystal Palace", result: "W", score: "3-1", date: "2025-04-19" },
      { opponent: "Fulham", result: "D", score: "0-0", date: "2025-04-12" },
    ];
  }
  return [
    { opponent: "Leicester", result: "D", score: "1-1", date: "2025-05-10" },
    { opponent: "West Ham", result: "L", score: "0-2", date: "2025-05-03" },
    { opponent: "Brentford", result: "D", score: "0-0", date: "2025-04-26" },
    { opponent: "Bournemouth", result: "W", score: "1-0", date: "2025-04-19" },
    { opponent: "Ipswich", result: "D", score: "2-2", date: "2025-04-12" },
  ];
}

function generateStats(): MatchStats {
  return {
    possession: { home: 55, away: 45 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 4, away: 3 },
    corners: { home: 6, away: 4 },
    fouls: { home: 10, away: 13 },
    passes: { home: 487, away: 392 },
    passAccuracy: { home: 87, away: 82 },
    xG: { home: 1.2, away: 0.9 },
  };
}

function generateEvents(): MatchEvent[] {
  return [
    { id: "e1", type: "goal", minute: 23, team: "home", playerName: "Saka", detail: "Left foot" },
    { id: "e2", type: "yellow_card", minute: 31, team: "away", playerName: "Bruno G." },
    { id: "e3", type: "goal", minute: 56, team: "away", playerName: "Isak", detail: "Header" },
    { id: "e4", type: "substitution", minute: 62, team: "home", playerName: "Havertz → Trossard" },
  ];
}

export function getMockMatchDetail(matchId: string): MatchDetail | null {
  const match = MOCK_MATCHES.find((m) => m.id === matchId);
  if (!match) return null;

  return {
    ...match,
    events: generateEvents(),
    stats: generateStats(),
    headToHead: generateH2H(match.homeTeam.name, match.awayTeam.name),
    teamForm: {
      home: generateForm(true),
      away: generateForm(false),
    },
  };
}

export function getMockLiveMatches(): Match[] {
  return MOCK_MATCHES.filter((m) => m.status === "live" || m.status === "halftime");
}

export function getMockScheduledMatches(): Match[] {
  return MOCK_MATCHES.filter((m) => m.status === "scheduled");
}

export function getMockFinishedMatches(): Match[] {
  return MOCK_MATCHES.filter((m) => m.status === "finished");
}
