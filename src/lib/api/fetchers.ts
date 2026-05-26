import { fetchWithCache } from "./sportsrc";
import { ENDPOINTS } from "./endpoints";
import {
  MOCK_MATCHES,
  MOCK_SPORTS,
  getMockMatchDetail,
  getMockLiveMatches,
  getMockScheduledMatches,
  getMockFinishedMatches,
} from "./mock-data";
import type { Match, MatchDetail, Sport } from "@/types/api";

export const USE_MOCK = !process.env.SPORTSRC_API_KEY || process.env.SPORTSRC_API_KEY === "";

// ── Seeded Random Number Generator ───────────

function createSeededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function () {
    let t = (h += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Mapping Functions for Robustness ──────────

// Cache system for real-time API scores to prevent hitting limits
let cachedScoresMap: Record<string, { home: number; away: number; leagueName?: string; country?: string }> | null = null;
let lastScoresFetchTime = 0;

export function normalizeTeamName(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(/\bsaint\b|saint-/g, "st")
    .replace(/fc|afc|sc|cf|sd|de|club/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export async function fetchRealTimeScoresMap(): Promise<Record<string, { home: number; away: number; leagueName?: string; country?: string }>> {
  const now = Date.now();
  // Cache API response for 60 seconds
  if (cachedScoresMap && (now - lastScoresFetchTime < 60 * 1000)) {
    return cachedScoresMap;
  }

  const leagues = ["PL", "CL", "PD", "SA", "BL1", "FL1", "BSA", "ELC", "PPL"];
  const map: Record<string, { home: number; away: number; leagueName?: string; country?: string }> = {};

  try {
    const promises = leagues.map(async (leagueId) => {
      try {
        const response = await fetchWithCache<any>("/", {
          data: "results",
          category: "scores",
          league: leagueId,
        });
        if (response && response.data) {
          // The API returns an object with 'live' and 'finished' arrays
          const matchList = [
            ...(Array.isArray(response.data.live) ? response.data.live : []),
            ...(Array.isArray(response.data.finished) ? response.data.finished : [])
          ];
          matchList.forEach((m: any) => {
            const homeName = m.homeTeam?.shortName || m.homeTeam?.name;
            const awayName = m.awayTeam?.shortName || m.awayTeam?.name;
            if (homeName && awayName && m.score && m.score.fullTime) {
              const homeScore = m.score.fullTime.home;
              const awayScore = m.score.fullTime.away;
              if (homeScore !== null && awayScore !== null) {
                const key = `${normalizeTeamName(homeName)}_${normalizeTeamName(awayName)}`;
                map[key] = {
                  home: homeScore,
                  away: awayScore,
                  leagueName: m.competition?.name,
                  country: m.area?.name,
                };
              }
            }
          });
        }
      } catch {
        // Suppress single league fetch errors
      }
    });

    await Promise.all(promises);
    cachedScoresMap = map;
    lastScoresFetchTime = now;
    return map;
  } catch {
    return map;
  }
}

export function mapApiMatch(
  raw: any,
  scoresMap?: Record<string, { home: number; away: number; leagueName?: string; country?: string }>
): Match {
  if (!raw) return MOCK_MATCHES[0];
  
  // If it's already in our domain model format, return it
  if (raw.league && raw.league.name && raw.homeTeam && raw.score) {
    return raw as Match;
  }

  const dateMs = raw.date || Date.now();
  const startTime = new Date(dateMs).toISOString();

  // Determine status based on date
  const now = Date.now();
  let status: Match["status"] = "scheduled";
  let minute: number | undefined;

  // If match date is within 2 hours of current time, count it as live
  if (now >= dateMs && now <= dateMs + 2 * 3600 * 1000) {
    status = "live";
    minute = undefined; // Do not use simulated minutes, show raw live status/badge
  } else if (now > dateMs + 2 * 3600 * 1000) {
    status = "finished";
  }

  // Live and realistic seeded score simulation
  let score = { home: 0, away: 0 };
  if (status === "live" || status === "finished") {
    let foundRealScore = false;

    // Check if the match is in the real-time API scores map
    if (scoresMap && raw.teams?.home?.name && raw.teams?.away?.name) {
      const key = `${normalizeTeamName(raw.teams.home.name)}_${normalizeTeamName(raw.teams.away.name)}`;
      const realScore = scoresMap[key];
      if (realScore) {
        score = { home: realScore.home, away: realScore.away };
        foundRealScore = true;
      }
    }

    if (!foundRealScore) {
      score = { home: 0, away: 0 };
    }
  }

  // Stream URL mapping - read embedUrl from source objects
  let streamUrl = raw.streamUrl || undefined;
  if (raw.sources && raw.sources.length > 0) {
    streamUrl = raw.sources[0].embedUrl || raw.sources[0].url || raw.sources[0].embed;
  }

  // Get league name and country
  let leagueName = raw.category || "football";
  let country = "International";

  if (scoresMap && raw.teams?.home?.name && raw.teams?.away?.name) {
    const key = `${normalizeTeamName(raw.teams.home.name)}_${normalizeTeamName(raw.teams.away.name)}`;
    const realScore = scoresMap[key];
    if (realScore && realScore.leagueName) {
      leagueName = realScore.leagueName;
      if (realScore.country) {
        country = realScore.country;
      }
    }
  }

  // Capitalize league name if it's just the category, or use the sport type football
  if (leagueName === "football") {
    leagueName = "Football";
  } else if (leagueName === "basketball") {
    leagueName = "Basketball";
  }

  return {
    id: raw.id || `m-${Date.now()}`,
    homeTeam: {
      id: `t-${(raw.teams?.home?.name || "home").toLowerCase().replace(/\s+/g, "-")}`,
      name: raw.teams?.home?.name || "Home Team",
      logo: raw.teams?.home?.badge || undefined,
    },
    awayTeam: {
      id: `t-${(raw.teams?.away?.name || "away").toLowerCase().replace(/\s+/g, "-")}`,
      name: raw.teams?.away?.name || "Away Team",
      logo: raw.teams?.away?.badge || undefined,
    },
    score,
    status,
    startTime,
    minute,
    league: {
      id: "l-custom",
      name: leagueName,
      country,
      season: "2025/26",
    },
    category: raw.category || "football",
    streamUrl,
    poster: raw.poster || undefined,
  };
}

export function mapApiMatchDetail(
  raw: any,
  scoresMap?: Record<string, { home: number; away: number; leagueName?: string; country?: string }>
): MatchDetail {
  if (!raw) return getMockMatchDetail("m-001")!;

  // If it's already a full detail from mock or custom, return
  if (raw.headToHead && raw.teamForm && raw.stats) {
    return raw as MatchDetail;
  }

  const baseMatch = mapApiMatch(raw, scoresMap);

  if (!USE_MOCK) {
    return {
      ...baseMatch,
      events: [],
    };
  }
  const homeName = baseMatch.homeTeam.name;
  const awayName = baseMatch.awayTeam.name;
  const leagueName = baseMatch.league.name;

  // Set up seeded random generator based on match ID to guarantee stable unique results
  const rand = createSeededRandom(baseMatch.id);

  // 1. Generate realistic H2H records
  const h2h = [];
  const competitors = [homeName, awayName];
  const totalH2HMatches = 5;
  const dateOffsetDays = [32, 124, 218, 312, 404];

  for (let i = 0; i < totalH2HMatches; i++) {
    const isHomeSwapped = rand() > 0.5;
    const hTeam = isHomeSwapped ? competitors[0] : competitors[1];
    const aTeam = isHomeSwapped ? competitors[1] : competitors[0];

    const scoreRoll = rand();
    let hScore = 0;
    let aScore = 0;

    if (scoreRoll > 0.6) {
      // Realistic draw (0-0, 1-1, 2-2)
      hScore = Math.floor(rand() * 3);
      aScore = hScore;
    } else {
      hScore = Math.floor(rand() * 4);
      aScore = Math.floor(rand() * 3);
      if (hScore === aScore) {
        hScore += 1;
      }
    }

    const matchDate = new Date(Date.now() - dateOffsetDays[i] * 24 * 3600 * 1000)
      .toISOString()
      .split("T")[0];

    h2h.push({
      date: matchDate,
      homeTeam: hTeam,
      awayTeam: aTeam,
      homeScore: hScore,
      awayScore: aScore,
      competition: rand() > 0.25 ? leagueName : "League Cup",
    });
  }

  // 2. Generate Team Form
  const homeForm = [];
  const awayForm = [];

  const opponentsPool = [
    "Man City", "Liverpool", "Chelsea", "Arsenal", "Spurs", "Newcastle", "Aston Villa",
    "Man United", "West Ham", "Brighton", "Everton", "Crystal Palace", "Fulham", "Wolves",
    "Real Madrid", "Barcelona", "Atletico Madrid", "Real Sociedad", "Villarreal", "Real Betis",
    "Bayern Munich", "Dortmund", "Leverkusen", "Leipzig", "Frankfurt", "Monchengladbach",
    "PSG", "Marseille", "Monaco", "Lille", "Lyon", "Nice", "Lens", "Rennes"
  ].filter((name) => name !== homeName && name !== awayName);

  for (let i = 0; i < 5; i++) {
    // Home Form
    const opponentHome = opponentsPool[Math.floor(rand() * opponentsPool.length)] || "Opponent";
    const resRollHome = rand();
    const resultHome = resRollHome > 0.6 ? "W" : resRollHome > 0.25 ? "D" : "L";

    let scoreHome = "1-1";
    if (resultHome === "W") {
      const gs = Math.floor(rand() * 3) + 1;
      const gc = Math.floor(rand() * gs);
      scoreHome = `${gs}-${gc}`;
    } else if (resultHome === "L") {
      const gc = Math.floor(rand() * 3) + 1;
      const gs = Math.floor(rand() * gc);
      scoreHome = `${gs}-${gc}`;
    } else {
      const gs = Math.floor(rand() * 3);
      scoreHome = `${gs}-${gs}`;
    }

    const formDateHome = new Date(Date.now() - (i + 1) * 7 * 24 * 3600 * 1000)
      .toISOString()
      .split("T")[0];

    homeForm.push({
      opponent: opponentHome,
      result: resultHome as "W" | "D" | "L",
      score: scoreHome,
      date: formDateHome,
    });

    // Away Form
    const opponentAway = opponentsPool[Math.floor(rand() * opponentsPool.length)] || "Opponent";
    const resRollAway = rand();
    const resultAway = resRollAway > 0.6 ? "W" : resRollAway > 0.25 ? "D" : "L";

    let scoreAway = "1-1";
    if (resultAway === "W") {
      const gs = Math.floor(rand() * 3) + 1;
      const gc = Math.floor(rand() * gs);
      scoreAway = `${gs}-${gc}`;
    } else if (resultAway === "L") {
      const gc = Math.floor(rand() * 3) + 1;
      const gs = Math.floor(rand() * gc);
      scoreAway = `${gs}-${gc}`;
    } else {
      const gs = Math.floor(rand() * 3);
      scoreAway = `${gs}-${gs}`;
    }

    const formDateAway = new Date(Date.now() - (i + 1) * 7 * 24 * 3600 * 1000)
      .toISOString()
      .split("T")[0];

    awayForm.push({
      opponent: opponentAway,
      result: resultAway as "W" | "D" | "L",
      score: scoreAway,
      date: formDateAway,
    });
  }

  const teamForm = {
    home: homeForm,
    away: awayForm,
  };

  // 3. Generate Match Statistics matching base score
  const homeScore = baseMatch.score.home;
  const awayScore = baseMatch.score.away;

  let basePossessionHome = 50;
  if (homeScore > awayScore) {
    basePossessionHome = 52 + Math.floor(rand() * 10);
  } else if (homeScore < awayScore) {
    basePossessionHome = 38 + Math.floor(rand() * 10);
  } else {
    basePossessionHome = 46 + Math.floor(rand() * 8);
  }
  const basePossessionAway = 100 - basePossessionHome;

  const shotsHome = Math.floor(rand() * 7) + (homeScore * 2) + 4;
  const shotsAway = Math.floor(rand() * 7) + (awayScore * 2) + 4;

  const sotHome = Math.min(shotsHome, Math.max(homeScore, Math.floor(shotsHome * (0.3 + rand() * 0.3))));
  const sotAway = Math.min(shotsAway, Math.max(awayScore, Math.floor(shotsAway * (0.3 + rand() * 0.3))));

  const cornersHome = Math.floor(rand() * 5) + Math.floor(sotHome / 1.5) + 1;
  const cornersAway = Math.floor(rand() * 5) + Math.floor(sotAway / 1.5) + 1;

  const foulsHome = Math.floor(rand() * 6) + 8;
  const foulsAway = Math.floor(rand() * 6) + 8;

  const passesHome = 300 + Math.floor(basePossessionHome * 3.5) + Math.floor(rand() * 40);
  const passesAway = 300 + Math.floor(basePossessionAway * 3.5) + Math.floor(rand() * 40);

  const accHome = Math.floor(76 + rand() * 12);
  const accAway = Math.floor(76 + rand() * 12);

  const xGHome = Number((homeScore * 0.42 + sotHome * 0.14 + rand() * 0.3).toFixed(2));
  const xGAway = Number((awayScore * 0.42 + sotAway * 0.14 + rand() * 0.3).toFixed(2));

  const stats = {
    possession: { home: basePossessionHome, away: basePossessionAway },
    shots: { home: shotsHome, away: shotsAway },
    shotsOnTarget: { home: sotHome, away: sotAway },
    corners: { home: cornersHome, away: cornersAway },
    fouls: { home: foulsHome, away: foulsAway },
    passes: { home: passesHome, away: passesAway },
    passAccuracy: { home: accHome, away: accAway },
    xG: { home: xGHome, away: xGAway },
  };

  // Seeded random goal events generation synchronized with scoreline minutes
  const randScore = createSeededRandom(baseMatch.id || "default-seed");
  const homeGoalCount = baseMatch.score.home;
  const awayGoalCount = baseMatch.score.away;

  const simHomeGoalMinutes: number[] = [];
  for (let i = 0; i < homeGoalCount; i++) {
    simHomeGoalMinutes.push(Math.floor(randScore() * 88) + 2);
  }
  const simAwayGoalMinutes: number[] = [];
  for (let i = 0; i < awayGoalCount; i++) {
    simAwayGoalMinutes.push(Math.floor(randScore() * 88) + 2);
  }

  const eventsList: { id: string; type: "goal"; minute: number; team: "home" | "away"; playerName: string }[] = [];
  let eventIdCounter = 1;

  simHomeGoalMinutes.forEach((min) => {
    eventsList.push({
      id: `e-${eventIdCounter++}`,
      type: "goal",
      minute: min,
      team: "home",
      playerName: "Striker",
    });
  });

  simAwayGoalMinutes.forEach((min) => {
    eventsList.push({
      id: `e-${eventIdCounter++}`,
      type: "goal",
      minute: min,
      team: "away",
      playerName: "Forward",
    });
  });

  eventsList.sort((a, b) => a.minute - b.minute);

  // If live, display only scored goals up to the current elapsed minute
  const currentEvents = baseMatch.status === "live"
    ? eventsList.filter((e) => e.minute <= (baseMatch.minute || 1))
    : eventsList;

  return {
    ...baseMatch,
    events: currentEvents,
    stats,
    headToHead: h2h,
    teamForm,
  };
}

// ── Sports ──────────────────────────────────

export async function fetchSports(): Promise<Sport[]> {
  if (USE_MOCK) return MOCK_SPORTS;
  try {
    const params = ENDPOINTS.sports();
    const data = await fetchWithCache<{ data: Sport[] } | Sport[]>("/", params as Record<string, string>);
    const list = Array.isArray(data) ? data : (data as { data: Sport[] }).data || [];
    return list.length > 0 ? list : [];
  } catch {
    return [];
  }
}

// ── Matches ─────────────────────────────────

export async function fetchMatches(
  category = "football",
  options?: { status?: string; date?: string }
): Promise<Match[]> {
  if (USE_MOCK) return MOCK_MATCHES.filter((m) => m.category === category);
  try {
    const params = ENDPOINTS.matches(category, options);
    const response = await fetchWithCache<unknown>("/", params as Record<string, string>);
    const data = response as { data?: any[] };
    if (data && Array.isArray(data.data)) {
      // Fetch real-time scores from results category
      const scoresMap = await fetchRealTimeScoresMap();
      return data.data.map((m) => mapApiMatch(m, scoresMap));
    }
    return [];
  } catch {
    return [];
  }
}

export async function fetchLiveMatches(): Promise<Match[]> {
  if (USE_MOCK) return getMockLiveMatches();
  try {
    const today = new Date().toISOString().split("T")[0];
    const all = await fetchMatches("football", { status: "inprogress", date: today });
    return all.filter((m) => m.status === "live" || m.status === "halftime");
  } catch {
    return [];
  }
}

export async function fetchScheduledMatches(): Promise<Match[]> {
  if (USE_MOCK) return getMockScheduledMatches();
  try {
    const today = new Date().toISOString().split("T")[0];
    const all = await fetchMatches("football", { status: "upcoming", date: today });
    const scheduled = all.filter((m) => m.status === "scheduled");

    // Filter to only include matches scheduled for the present calendar day
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return scheduled.filter((m) => {
      const matchTime = new Date(m.startTime).getTime();
      return matchTime >= startOfToday.getTime() && matchTime <= endOfToday.getTime();
    });
  } catch {
    return [];
  }
}

export async function fetchFinishedMatches(): Promise<Match[]> {
  if (USE_MOCK) return getMockFinishedMatches();
  try {
    const today = new Date().toISOString().split("T")[0];
    const all = await fetchMatches("football", { status: "finished", date: today });
    return all.filter((m) => m.status === "finished");
  } catch {
    return [];
  }
}

// ── Match Detail ────────────────────────────

export async function fetchMatchDetail(
  id: string,
  category = "football"
): Promise<MatchDetail | null> {
  if (USE_MOCK) return getMockMatchDetail(id);

  try {
    const params = ENDPOINTS.matchDetail(category, id);
    const response = await fetchWithCache<unknown>(`/`, params as Record<string, string>);
    const data = response as { data?: any };
    if (data && data.data) {
      // Fetch and inject real-time scores Map
      const scoresMap = await fetchRealTimeScoresMap();
      return mapApiMatchDetail(data.data, scoresMap);
    }
    return null;
  } catch {
    return null;
  }
}

