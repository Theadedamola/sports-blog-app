import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// In-memory cache
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 30_000; // 30 seconds

const sportsrcClient = axios.create({
  baseURL: process.env.SPORTSRC_BASE_URL || "https://api.sportsrc.org",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: inject API key
sportsrcClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const apiKey = process.env.SPORTSRC_API_KEY;
  if (apiKey) {
    config.headers.set("X-API-KEY", apiKey);
  }
  return config;
});

// Response interceptor: normalize errors
sportsrcClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };

    if (!config) return Promise.reject(error);

    config._retryCount = config._retryCount || 0;

    if (config._retryCount < MAX_RETRIES && isRetryable(error)) {
      config._retryCount++;
      const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1);
      await new Promise((r) => setTimeout(r, delay));
      return sportsrcClient(config);
    }

    return Promise.reject({
      message: error.message,
      status: error.response?.status || 500,
      data: error.response?.data || null,
    });
  }
);

function isRetryable(error: AxiosError): boolean {
  if (!error.response) return true; // network error
  const status = error.response.status;
  return status === 429 || status >= 500;
}

// Cached fetch helper
export async function fetchWithCache<T>(
  url: string,
  params?: Record<string, string>,
  ttl = CACHE_TTL
): Promise<T> {
  const cacheKey = `${url}?${JSON.stringify(params || {})}`;

  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data as T;
  }

  const response = await sportsrcClient.get<T>(url, { params });
  cache.set(cacheKey, { data: response.data, expiry: Date.now() + ttl });
  return response.data;
}

export function clearCache() {
  cache.clear();
}

export default sportsrcClient;
