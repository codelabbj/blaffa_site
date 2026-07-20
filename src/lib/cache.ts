/**
 * Cache de session EN MÉMOIRE : les données API vivent en RAM pendant la
 * navigation (client-side). Rien n'est écrit sur disque ; localStorage ne
 * garde que les préférences légères (tokens, theme, langue, notifs lues).
 */

type CacheEntry = {
  data: unknown;
  timestamp: number;
};

const memoryCache = new Map<string, CacheEntry>();
const pendingFetches = new Map<string, Promise<unknown>>();

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export const CACHE_KEYS = {
  SETTINGS: 'settings',
  DEPOSIT_PLATFORMS: 'deposit_platforms',
  WITHDRAW_PLATFORMS: 'withdraw_platforms',
  COUPON_PLATFORMS: 'coupon_platforms',
  NOTIFICATIONS: 'notifications',
  RECENT_TRANSACTIONS: 'recent_transactions',
  ADVERTISEMENTS: 'advertisements',
  USER_PROFILE: 'user_profile',
};

// Migration : purge l'ancien cache disque des versions précédentes.
if (typeof window !== 'undefined') {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (
        key.startsWith('blaffa_cache_') ||
        key === 'advertisementCache' ||
        key === 'settingsCache'
      ) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // localStorage indisponible : rien à purger
  }
}

export const setCache = (key: string, data: unknown) => {
  memoryCache.set(key, { data, timestamp: Date.now() });
};

export const getCache = <T>(key: string): T | null => {
  const entry = memoryCache.get(key);
  return entry ? (entry.data as T) : null;
};

/** Vide toute la session (à appeler au logout / suppression de compte). */
export const clearCache = () => {
  memoryCache.clear();
  pendingFetches.clear();
};

export const isCacheFresh = (key: string, ttlMs = DEFAULT_TTL_MS): boolean => {
  const entry = memoryCache.get(key);
  if (!entry) return false;
  return Date.now() - entry.timestamp < ttlMs;
};

export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh = false,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> => {
  if (!forceRefresh && isCacheFresh(key, ttlMs)) {
    const cached = getCache<T>(key);
    if (cached !== null) return cached;
  }

  const pending = pendingFetches.get(key);
  if (pending) return pending as Promise<T>;

  const fetchPromise = fetcher()
    .then((data) => {
      setCache(key, data);
      return data;
    })
    .finally(() => {
      pendingFetches.delete(key);
    });

  pendingFetches.set(key, fetchPromise);
  return fetchPromise;
};

export const withCacheSWR = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> => {
  const cached = getCache<T>(key);

  if (cached !== null && isCacheFresh(key, ttlMs)) {
    return cached;
  }

  if (cached !== null) {
    if (!pendingFetches.has(key)) {
      const refresh = fetcher()
        .then((data) => {
          setCache(key, data);
          return data as unknown;
        })
        .finally(() => {
          pendingFetches.delete(key);
        });
      pendingFetches.set(key, refresh);
      refresh.catch(() => undefined);
    }
    return cached;
  }

  return withCache(key, fetcher, true, ttlMs);
};
