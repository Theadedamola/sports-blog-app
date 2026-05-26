// ──────────────────────────────────────────────
// Core API & Domain Types
// ──────────────────────────────────────────────

export interface Sport {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  country?: string;
}

export interface MatchScore {
  home: number;
  away: number;
}

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "postponed"
  | "cancelled";

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  status: MatchStatus;
  startTime: string;
  minute?: number;
  league: LeagueInfo;
  category: string;
  streamUrl?: string;
  venue?: string;
  poster?: string;
}

export interface LeagueInfo {
  id: string;
  name: string;
  country?: string;
  logo?: string;
  season?: string;
}

export interface MatchEvent {
  id: string;
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "var";
  minute: number;
  team: "home" | "away";
  playerName: string;
  detail?: string;
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  xG?: { home: number; away: number };
}

export interface MatchDetail extends Match {
  events: MatchEvent[];
  stats?: MatchStats;
  headToHead?: HeadToHeadRecord[];
  teamForm?: {
    home: TeamFormEntry[];
    away: TeamFormEntry[];
  };
}

export interface HeadToHeadRecord {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
}

export interface TeamFormEntry {
  opponent: string;
  result: "W" | "D" | "L";
  score: string;
  date: string;
}

// ──────────────────────────────────────────────
// AI Prediction Types
// ──────────────────────────────────────────────

export type ConfidenceLevel = "Very High" | "High" | "Medium" | "Low";

export interface PredictionResult {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  drawProbability: number;
  homeWinProbability: number;
  awayWinProbability: number;
  confidence: ConfidenceLevel;
  reasoning: string[];
  factors: PredictionFactor[];
  predictedScore?: string;
  over25Probability?: number;
  bttsProb?: number; // Both teams to score
  generatedAt: string;
}

export interface PredictionFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  weight: number;
  description: string;
}

// ──────────────────────────────────────────────
// Chat Types
// ──────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  matchCards?: PredictionResult[];
}

// ──────────────────────────────────────────────
// API Response Wrappers
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  cached?: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  perPage: number;
}
