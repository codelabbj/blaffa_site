import api from './axios';
import { getCache, setCache, CACHE_KEYS } from './cache';

export const READ_CACHE_KEY = 'markedAsReadNotifications';

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export function loadReadCache(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(READ_CACHE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw).map(String));
  } catch {
    return new Set();
  }
}

export function saveReadCache(ids: Set<string>) {
  localStorage.setItem(READ_CACHE_KEY, JSON.stringify([...ids]));
}

export function applyReadState(
  notifications: AppNotification[],
  readCache: Set<string> = loadReadCache()
): AppNotification[] {
  return notifications.map((n) => ({
    ...n,
    id: String(n.id),
    is_read: Boolean(n.is_read) || readCache.has(String(n.id)),
  }));
}

export function countUnread(notifications: AppNotification[]): number {
  return notifications.filter((n) => !n.is_read).length;
}

function syncNotificationsCache(notifications: AppNotification[]) {
  setCache(CACHE_KEYS.NOTIFICATIONS, notifications);
}

export async function fetchNotificationsPage(page = 1): Promise<{
  results: AppNotification[];
  hasMore: boolean;
}> {
  const res = await api.get(`/blaffa/notification?page=${page}`);
  const data = res.data;
  const readCache = loadReadCache();
  const results = applyReadState(
    (data?.results || []).map((n: AppNotification) => ({
      id: String(n.id),
      title: n.title,
      content: n.content,
      created_at: n.created_at,
      is_read: n.is_read,
    })),
    readCache
  );

  if (page === 1) {
    syncNotificationsCache(results);
  }

  return { results, hasMore: data?.next != null };
}

async function patchNotificationRead(sid: string): Promise<void> {
  try {
    await api.patch(`/blaffa/notification/${sid}/`, { is_read: true });
    return;
  } catch {
    await api.patch(`/blaffa/notification/${sid}`, { is_read: true });
  }
}

export async function markNotificationRead(id: string | number): Promise<void> {
  const sid = String(id);
  const cache = loadReadCache();
  cache.add(sid);
  saveReadCache(cache);

  const cached = getCache<AppNotification[]>(CACHE_KEYS.NOTIFICATIONS);
  if (cached) {
    syncNotificationsCache(
      cached.map((n) => (String(n.id) === sid ? { ...n, is_read: true } : n))
    );
  }

  try {
    await patchNotificationRead(sid);
  } catch {
    // Garder l'état local même si l'API échoue
  }
  emitNotificationRead();
}

export async function markAllNotificationsRead(
  notificationIds: Array<string | number>
): Promise<void> {
  const cache = loadReadCache();
  notificationIds.forEach((id) => cache.add(String(id)));
  saveReadCache(cache);

  const idSet = new Set(notificationIds.map(String));
  const cached = getCache<AppNotification[]>(CACHE_KEYS.NOTIFICATIONS);
  if (cached) {
    syncNotificationsCache(cached.map((n) => (idSet.has(String(n.id)) ? { ...n, is_read: true } : n)));
  }

  try {
    await api.post('/blaffa/read-notification');
  } catch {
    // Garder l'état local
  }
  emitNotificationRead();
}

export function emitNotificationRead() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('blaffa:notification-read'));
}

export function getUnreadCountFromCache(): number {
  const cached = getCache<AppNotification[]>(CACHE_KEYS.NOTIFICATIONS);
  if (!cached?.length) return 0;
  return countUnread(applyReadState(cached));
}
