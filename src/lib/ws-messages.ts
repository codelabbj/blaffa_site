import type { AppNotification } from './notifications';
import { emitRealtimeEvent } from './realtime-events';

function parseLooseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizePayload(data: unknown): Record<string, unknown> | null {
  if (!data) return null;
  if (typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  if (typeof data === 'string') {
    const parsed = parseLooseJson(data);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  }
  return null;
}

function toNotification(payload: Record<string, unknown>): AppNotification | null {
  if (!payload.id) return null;
  return {
    id: String(payload.id),
    title: String(payload.title || 'Notification'),
    content: String(payload.content || ''),
    created_at: String(payload.created_at || new Date().toISOString()),
    is_read: Boolean(payload.is_read),
  };
}

export function handleWebSocketMessage(message: { type?: string; data?: unknown }) {
  const type = message?.type;
  const payload = normalizePayload(message?.data);
  if (!type || !payload) return;

  if (type === 'new_notification') {
    const notification = toNotification(payload);
    if (notification) {
      emitRealtimeEvent({ kind: 'notification', notification });
    }
    return;
  }

  if (type === 'transaction' || type === 'transaction_update' || type === 'new_transaction') {
    const transaction =
      (payload.transaction as Record<string, unknown> | undefined) || payload;
    if (transaction?.id) {
      emitRealtimeEvent({ kind: 'transaction', transaction });
    }
  }
}
