import type { AppNotification } from './notifications';

export type RealtimeEvent =
  | { kind: 'notification'; notification: AppNotification }
  | { kind: 'transaction'; transaction: Record<string, unknown> };

const EVENT_NAME = 'blaffa:realtime';

export function emitRealtimeEvent(event: RealtimeEvent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<RealtimeEvent>(EVENT_NAME, { detail: event }));
}

export function subscribeRealtimeEvents(handler: (event: RealtimeEvent) => void) {
  if (typeof window === 'undefined') return () => undefined;

  const listener = (ev: Event) => {
    handler((ev as CustomEvent<RealtimeEvent>).detail);
  };

  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
