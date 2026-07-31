import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  settings: ['settings'] as const,
  appNames: (operation: string) => ['appNames', operation] as const,
  notifications: (page = 1) => ['notifications', page] as const,
  historic: (page: number, category: string, status: string) =>
    ['historic', page, category, status] as const,
  userProfile: ['userProfile'] as const,
};
