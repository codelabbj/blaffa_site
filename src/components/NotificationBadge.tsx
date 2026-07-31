'use client';

import { useNotificationsQuery } from '@/hooks/useBlaffaQueries';
import { countUnread } from '@/lib/notifications';

export default function NotificationBadge({ className = '' }: { className?: string }) {
  const { data } = useNotificationsQuery(1);
  const unread = data?.results ? countUnread(data.results) : 0;

  if (unread === 0) return null;

  return (
    <span
      className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white shadow-sm ${className}`}
    >
      {unread > 9 ? '9+' : unread}
    </span>
  );
}
