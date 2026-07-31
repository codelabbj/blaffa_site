'use client';

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotificationsQuery } from '@/hooks/useBlaffaQueries';
import { countUnread } from '@/lib/notifications';

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className }: NotificationBellProps) {
  const router = useRouter();
  const { data } = useNotificationsQuery(1);
  const unread = data?.results ? countUnread(data.results) : 0;

  return (
    <div className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => router.push('/notifications')}
        className="relative rounded-full bg-transparent p-1"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </div>
  );
}
