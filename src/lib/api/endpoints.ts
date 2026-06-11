// SportsFC API endpoint builders

export const ENDPOINTS = {
  sports: () => ({ data: "sports" }),
  matches: (category: string, options?: { status?: string; date?: string }) => ({
    data: "matches",
    category,
    badge: "true",
    type: "matches",
    sport: category,
    ...(options?.status && { status: options.status }),
    ...(options?.date && { date: options.date }),
  }),
  matchDetail: (category: string, id: string) => ({
    data: "detail",
    category,
    id,
    matchID: id,
    type: "detail",
    badge: "true",
  }),
  results: (category?: string) => ({
    data: "results",
    ...(category && { category }),
  }),
  leagues: () => ({ data: "results", category: "leagues" }),
} as const;

// V2 endpoints (alternative)
export const V2_ENDPOINTS = {
  matches: (apiKey: string) => ({
    type: "matches",
    api_key: apiKey,
  }),
} as const;
