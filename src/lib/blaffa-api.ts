import api from './axios';
import { CACHE_KEYS, withCache } from './cache';

export const SETTINGS_V2 = '/blaffa/v2/setting/';
export const APP_NAME_V2 = '/blaffa/v2/app_name';
export const CHATBOT_MESSAGE_V2 = '/blaffa/v2/chatbot/message/';
export const UPLOAD_FILE = '/blaffa/upload/file';

export function parseSettingsPayload(data: unknown): Record<string, unknown> {
  if (!data) return {};
  if (Array.isArray(data)) return (data[0] as Record<string, unknown>) || {};
  return data as Record<string, unknown>;
}


export async function sendChatbotMessage(payload: {
  message: string;
  conversation_id?: string | null;
  page_key?: string;
  route?: string;
  screen_title?: string;
}) {
  const res = await api.post(CHATBOT_MESSAGE_V2, payload, { timeout: 120_000 });
  return res.data as {
    conversation_id?: string;
    message?: string;
    detail?: string;
    escalated?: boolean;
    silent?: boolean;
  };
}

/** Upload image → URL publique (My Customer ne consomme que des liens). */
export async function uploadChatImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const res = await api.post(UPLOAD_FILE, form, {
    timeout: 60_000,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const data = res.data as { image?: string | null; file?: string | null };
  const url = (data.image || data.file || '').trim();
  if (!url) {
    throw new Error('Upload réussi mais aucune URL renvoyée.');
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://api.blaffa.net/${url.replace(/^\//, '')}`;
}

export async function fetchSettings(forceRefresh = false) {
  return withCache(
    CACHE_KEYS.SETTINGS,
    async () => {
      const res = await api.get(SETTINGS_V2);
      return parseSettingsPayload(res.data);
    },
    forceRefresh
  );
}

export type AppNameOperation = 'deposit' | 'withdrawal' | 'coupon';

const APP_NAME_CACHE_KEY: Record<AppNameOperation, string> = {
  deposit: CACHE_KEYS.DEPOSIT_PLATFORMS,
  withdrawal: CACHE_KEYS.WITHDRAW_PLATFORMS,
  coupon: CACHE_KEYS.COUPON_PLATFORMS,
};

export async function fetchAppNames(
  operationType: AppNameOperation,
  forceRefresh = false
) {
  const cacheKey = APP_NAME_CACHE_KEY[operationType];
  return withCache(
    cacheKey,
    async () => {
      const res = await api.get(APP_NAME_V2, {
        params: { operation_type: operationType },
      });
      return Array.isArray(res.data) ? res.data : res.data?.results || [];
    },
    forceRefresh
  );
}
