import api from './axios';
import { CACHE_KEYS, withCache } from './cache';

export const SETTINGS_V2 = '/blaffa/v2/setting/';
export const APP_NAME_V2 = '/blaffa/v2/app_name';
export const CHATBOT_MESSAGE_V2 = '/blaffa/v2/chatbot/message/';
export const CHATBOT_HUMAN_MESSAGES_V2 = '/blaffa/v2/chatbot/human-messages/';
export const CHATBOT_MARK_READ_V2 = '/blaffa/v2/chatbot/mark-read/';
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
    images?: Array<{ url?: string; caption?: string }>;
  };
}

export async function sendChatbotAudio(
  file: File,
  payload: {
    conversation_id?: string | null;
    page_key?: string;
    route?: string;
    screen_title?: string;
  }
) {
  const form = new FormData();
  form.append('audio', file);
  if (payload.conversation_id) form.append('conversation_id', payload.conversation_id);
  if (payload.page_key) form.append('page_key', payload.page_key);
  if (payload.route) form.append('route', payload.route);
  if (payload.screen_title) form.append('screen_title', payload.screen_title);
  const res = await api.post(CHATBOT_MESSAGE_V2, form, {
    timeout: 120_000,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as {
    conversation_id?: string;
    message?: string;
    detail?: string;
    escalated?: boolean;
    silent?: boolean;
    user_media_type?: string | null;
    user_media_url?: string | null;
  };
}

export type ChatbotHumanMessage = {
  id: string;
  conversation_id: string;
  content: string;
  media_type?: string;
  media_url?: string;
  file_name?: string;
  created_at: string;
};

/** Réponses d'un conseiller (webhook My Customer) — récupérées via polling. */
export async function fetchChatbotHumanMessages(
  conversationId: string,
  after?: string | null
): Promise<ChatbotHumanMessage[]> {
  const res = await api.get(CHATBOT_HUMAN_MESSAGES_V2, {
    params: { conversation_id: conversationId, ...(after ? { after } : {}) },
    timeout: 15_000,
  });
  const data = res.data as { messages?: ChatbotHumanMessage[] };
  return Array.isArray(data.messages) ? data.messages : [];
}

/** Upload image → URL publique (My Customer ne consomme que des liens). */

/** Accusé de lecture client → ticks « lu » côté app agent. */
export async function markChatbotRead(conversationId: string): Promise<{
  agent_last_read_at?: string | null;
  customer_last_read_at?: string | null;
}> {
  const cid = (conversationId || '').trim();
  if (!cid) return {};
  const res = await api.post(CHATBOT_MARK_READ_V2, { conversation_id: cid }, { timeout: 15_000 });
  return (res.data || {}) as {
    agent_last_read_at?: string | null;
    customer_last_read_at?: string | null;
  };
}

/** Statut lecture (ticks « lu » sur les messages envoyés par le client). */
export async function fetchChatbotReadStatus(conversationId: string): Promise<{
  agent_last_read_at?: string | null;
  customer_last_read_at?: string | null;
}> {
  const cid = (conversationId || '').trim();
  if (!cid) return {};
  const res = await api.get(CHATBOT_MARK_READ_V2, {
    params: { conversation_id: cid },
    timeout: 15_000,
  });
  return (res.data || {}) as {
    agent_last_read_at?: string | null;
    customer_last_read_at?: string | null;
  };
}

export async function uploadChatImage(file: File): Promise<string> {
  const form = new FormData();
  // Backend UploadFileSerializer attend le champ « file » (pas « image »).
  form.append('file', file);
  const res = await api.post(UPLOAD_FILE, form, {
    timeout: 60_000,
    // Laisser axios/browser poser multipart + boundary (ne pas forcer Content-Type).
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
