import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { fetchSettings, fetchAppNames, type AppNameOperation } from '@/lib/blaffa-api';
import { fetchNotificationsPage, type AppNotification } from '@/lib/notifications';
import api from '@/lib/axios';
import { subscribeRealtimeEvents } from '@/lib/realtime-events';
import { useEffect } from 'react';

export function useSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => fetchSettings(),
    staleTime: 5 * 60_000,
  });
}

export function useAppNamesQuery(operation: AppNameOperation) {
  return useQuery({
    queryKey: queryKeys.appNames(operation),
    queryFn: () => fetchAppNames(operation),
    staleTime: 5 * 60_000,
  });
}

export function useNotificationsQuery(page = 1) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.notifications(page),
    queryFn: () => fetchNotificationsPage(page),
    staleTime: 30_000,
  });

  useEffect(() => {
    const unsubscribe = subscribeRealtimeEvents((event) => {
      if (event.kind !== 'notification') return;
      queryClient.setQueryData<{ results: AppNotification[]; hasMore: boolean }>(
        queryKeys.notifications(1),
        (old) => {
          if (!old) return { results: [event.notification], hasMore: false };
          if (old.results.some((n) => n.id === event.notification.id)) return old;
          return { ...old, results: [event.notification, ...old.results] };
        }
      );
    });
    return unsubscribe;
  }, [queryClient]);

  return query;
}

export type HistoricParams = {
  page?: number;
  category?: 'all' | 'deposit' | 'withdrawal';
  status?: string;
};

export async function fetchHistoricPage({
  page = 1,
  category = 'all',
  status = 'all',
}: HistoricParams) {
  let url = page === 1 ? '/blaffa/historic' : `/blaffa/historic?page=${page}`;
  if (category === 'deposit') url += `${url.includes('?') ? '&' : '?'}type=deposit`;
  if (category === 'withdrawal') url += `${url.includes('?') ? '&' : '?'}type=withdrawal`;
  if (status !== 'all') {
    const statusMap: Record<string, string> = {
      success: 'completed',
      'en attente': 'pending',
      echec: 'failed',
    };
    const apiStatus = statusMap[status.toLowerCase()] || status;
    url += `${url.includes('?') ? '&' : '?'}status=${apiStatus}`;
  }
  const res = await api.get(url);
  return res.data as {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{ id: string; created_at: string; transaction: Record<string, unknown> }>;
  };
}

export function useHistoricQuery(params: HistoricParams) {
  const page = params.page ?? 1;
  const category = params.category ?? 'all';
  const status = params.status ?? 'all';

  return useQuery({
    queryKey: queryKeys.historic(page, category, status),
    queryFn: () => fetchHistoricPage({ page, category, status }),
    staleTime: 60_000,
  });
}

export function useInvalidateHistoric() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['historic'] });
}
