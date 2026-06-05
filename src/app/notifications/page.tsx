'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, Check, CheckCheck, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../components/ThemeProvider';
import api from '@/lib/axios';
// import DashboardHeader from '@/components/DashboardHeader';
//import { markNotificationAsRead } from '../../utils/notifications';


interface Notification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface ExtendedWebSocket extends WebSocket {
  pingInterval?: NodeJS.Timeout;
}

/**
 * Client-side only function to mark a notification as read
 * This function can be exported and used anywhere in the application
 * @param notificationId - The ID of the notification to mark as read
 * @returns boolean indicating success
 */


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const wsRef = useRef<ExtendedWebSocket | null>(null);
  const wsReconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // const lastNotificationRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();

  // Store read notifications in client-side cache
  const markedAsReadCache = useRef<Set<string>>(new Set());

  // Load marked-as-read cache from localStorage on mount
  useEffect(() => {
    const cachedReadIds = localStorage.getItem('markedAsReadNotifications');
    if (cachedReadIds) {
      try {
        const readIdsArray = JSON.parse(cachedReadIds);
        markedAsReadCache.current = new Set(readIdsArray);
      } catch (err) {
        console.error('Failed to parse cached read notifications', err);
        localStorage.removeItem('markedAsReadNotifications');
      }
    }
  }, []);

  // Save marked-as-read cache to localStorage
  const updateReadCache = (id: string) => {
    markedAsReadCache.current.add(id);
    localStorage.setItem(
      'markedAsReadNotifications',
      JSON.stringify(Array.from(markedAsReadCache.current))
    );
  };

  const fetchNotifications = async (pageNum = 1) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      setNotifications([]);
      setHasMore(false);
      return;
    }

    // Don't fetch if we've fetched within the last second (prevents duplicate fetches)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 1000 && pageNum === 1) {
      return;
    }
    lastFetchTimeRef.current = now;

    try {
      setLoading(true);
      const res = await api.get(`/blaffa/notification?page=${pageNum}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

      const data = await res.data;

      if (data?.results?.length > 0) {
        // Apply local read status to the fetched notifications
        const cleaned = data.results.map((n: Notification) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          created_at: n.created_at,
          // Mark as read if it's in our local cache OR if API says it's read
          is_read: n.is_read || markedAsReadCache.current.has(n.id),
        }));

        // If it's page 1, replace notifications, otherwise append
        if (pageNum === 1) {
          setNotifications(cleaned);
        } else {
          setNotifications(prev => [...prev, ...cleaned]);
        }

        // Check if there are more pages available
        setHasMore(data.next !== null);
      } else {
        if (pageNum === 1) {
          setNotifications([]);
        }
        setHasMore(false);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Client-side only implementation for marking notifications as read
  const markAsRead = (id: string) => {
    try {
      // Update local state immediately
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );

      // Add to local cache
      updateReadCache(id);

      console.log(`Notification ${id} marked as read locally`);
      return true;
    } catch (err) {
      console.error('Failed to mark notification as read locally:', err);
      return false;
    }
  };

  // Client-side only implementation for marking all notifications as read
  const markAllAsRead = () => {
    try {
      // Update UI immediately
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      // Add all to local cache
      notifications.forEach(notification => {
        updateReadCache(notification.id);
      });

      console.log('All notifications marked as read locally');
      return true;
    } catch (err) {
      console.error('Failed to mark all notifications as read locally:', err);
      return false;
    }
  };

  // Mark selected notifications as read
  const markSelectedAsRead = () => {
    try {
      setNotifications((prev) =>
        prev.map((n) =>
          selectedNotifications.has(n.id) ? { ...n, is_read: true } : n
        )
      );

      // Add selected to local cache
      selectedNotifications.forEach(id => {
        updateReadCache(id);
      });

      // Clear selection
      setSelectedNotifications(new Set());
      setIsSelectionMode(false);

      console.log('Selected notifications marked as read locally');
      return true;
    } catch (err) {
      console.error('Failed to mark selected notifications as read locally:', err);
      return false;
    }
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotifications(new Set());
  };

  // Toggle notification selection
  const toggleNotificationSelection = (id: string) => {
    const newSelection = new Set(selectedNotifications);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedNotifications(newSelection);
  };

  // Select all notifications
  const selectAllNotifications = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setSelectedNotifications(allIds);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedNotifications(new Set());
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'AM' : 'PM';
    const displayHours = hours % 12 || 12;
    
    return `${day} ${month}, ${year} : ${displayHours}:${minutes} ${ampm}`;
  };

  // Render notification content, parsing HTML if present, or linkifying plain text
  const renderNotificationContent = (content: string) => {
    if (!content || typeof content !== 'string') return null;

    // Check if content contains HTML tags (e.g. <ul>, <p>, <strong>, etc.)
    const hasHtml = /<[a-z][\s\S]*>/i.test(content);

    if (hasHtml) {
      return (
        <div
          className="break-words [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:hover:underline [&_a]:font-medium [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p]:last:mb-0 whitespace-pre-wrap text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.closest('a')) {
              e.stopPropagation();
            }
          }}
        />
      );
    }

    // Split plain text by double newlines (\n\n or \r\n\r\n) to get paragraph blocks
    const paragraphs = content.replace(/\r\n/g, '\n').split('\n\n');

    return (
      <div className="text-[15px] leading-relaxed">
        {paragraphs.map((para, paraIndex) => {
          if (para.trim() === '') return null;

          // URL regex pattern
          const urlPattern = /(https?:\/\/[^\s]+)/g;
          const parts = para.split(urlPattern);

          return (
            <p key={paraIndex} className="mb-3.5 last:mb-0 whitespace-pre-wrap leading-relaxed">
              {parts.map((part, index) => {
                if (part.match(urlPattern)) {
                  return (
                    <a
                      key={index}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {part}
                    </a>
                  );
                }
                return <span key={index}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  // Setup WebSocket (same as in NotificationBell)
  const setupWebSocket = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No access token found for WebSocket connection');
      setError(t('You must be logged in to receive real-time updates.'));
      setWsStatus('error');
      return;
    }

    try {
      // Close existing connection if any
      if (wsRef.current) {
        if (wsRef.current.pingInterval) {
          clearInterval(wsRef.current.pingInterval);
        }
        wsRef.current.close();
      }

      const wsUrl = `wss://api.blaffa.net/ws/socket?token=${encodeURIComponent(accessToken)}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setWsStatus('connected');
        setError(null);
        wsReconnectAttempts.current = 0;

        wsRef.current!.pingInterval = setInterval(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'pong') {
            return;
          }


          const newNotification: Notification = {
            id: data.id,
            title: data.title,
            content: data.content,
            created_at: data.created_at,
            is_read: data.is_read || markedAsReadCache.current.has(data.id),
          };

          setNotifications((prev) => [newNotification, ...prev]);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsStatus('error');
      };

      wsRef.current.onclose = () => {
        setWsStatus('disconnected');

        const reconnectDelay = Math.min(30000, 1000 * Math.pow(2, wsReconnectAttempts.current));
        reconnectTimeoutRef.current = setTimeout(() => {
          wsReconnectAttempts.current++;
          setupWebSocket();
        }, reconnectDelay);
      };
    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
      setWsStatus('error');
    }
  };


  // Add this function before the return statement
  const lastNotificationElement = (node: HTMLDivElement | null) => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
        fetchNotifications(page + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  };




  // Initial fetch and WebSocket setup
  useEffect(() => {
    fetchNotifications(1);
    setupWebSocket();

    return () => {
      if (wsRef.current) {
        if (wsRef.current.pingInterval) {
          clearInterval(wsRef.current.pingInterval);
        }
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Add this line for observer cleanup
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

    };
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className={`bg-gradient-to-br ${theme.colors.a_background}`}>
      {/* Header */}
      {/* <DashboardHeader /> */}
      <div className={`bg-gradient-to-br ${theme.colors.a_background} shadow-sm border-b border-gray-200 dark:border-gray-700`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">Notification</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                {/* <div className={`w-2 h-2 rounded-full ${
                  wsStatus === 'connected' ? 'bg-green-500' : 
                  wsStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span>{wsStatus === 'connected' ? 'Live' : 'Offline'}</span> */}
              </div>

              <button
                onClick={() => fetchNotifications(1)}
                disabled={loading}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {notifications.length > 0 && (
        <div className={` bg-gradient-to-br ${theme.colors.s_background} border-b border-gray-200 dark:border-gray-700`}>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleSelectionMode}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {isSelectionMode ? 'Annuler' : 'Sélectionner'}
                </button>

                {isSelectionMode && (
                  <>
                    <button
                      onClick={selectAllNotifications}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Sélectionner tout
                    </button>
                    <button
                      onClick={clearAllSelections}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Clair
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {isSelectionMode && selectedNotifications.size > 0 && (
                  <button
                    onClick={markSelectedAsRead}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
                  >
                    <Check className="h-3 w-3" />
                    <span>Marquer comme lu ({selectedNotifications.size})</span>
                  </button>
                )}

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark All Read</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
            <div className="mb-8 text-gray-200 dark:text-gray-800">
              <svg width="180" height="220" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 3C4 1.89543 4.89543 1 6 1H14L20 7V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V3Z" stroke="currentColor" strokeWidth="0.5" />
                <path d="M14 1V5C14 6.10457 14.8954 7 16 7H20" stroke="currentColor" strokeWidth="0.5" />
                <path d="M4 22C4.5 21 5.5 20.5 6 21C6.5 21.5 7.5 21.5 8 21C8.5 20.5 9.5 20.5 10 21C10.5 21.5 11.5 21.5 12 21C12.5 20.5 13.5 20.5 14 21C14.5 21.5 15.5 21.5 16 21C16.5 20.5 17.5 20.5 18 21C18.5 21.5 19.5 21 20 22" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                ref={index === notifications.length - 1 ? lastNotificationElement : null}
                className={`group relative bg-[#f0f1f3] dark:bg-slate-800/80 rounded-[20px] transition-all duration-300 ease-out px-6 py-5 hover:bg-[#e7e8eb] dark:hover:bg-slate-700/80 cursor-pointer ${
                  selectedNotifications.has(notification.id) ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                onClick={() => {
                  if (isSelectionMode) {
                    toggleNotificationSelection(notification.id);
                  } else if (!notification.is_read) {
                    markAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  {isSelectionMode && (
                    <div className="flex-shrink-0 mt-1.5">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={() => toggleNotificationSelection(notification.id)}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Card Main Area */}
                  <div className="flex-1 min-w-0">
                    {/* Card Header (Icon & Title) */}
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-5 w-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                      <h3 className={`text-[16px] font-semibold text-gray-900 dark:text-gray-100 leading-snug tracking-tight`}>
                        {notification.title}
                      </h3>
                      {!notification.is_read && !isSelectionMode && (
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 ml-1.5 ring-2 ring-blue-100 dark:ring-blue-900/50 animate-pulse" />
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="notification-content text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 mt-1">
                      {renderNotificationContent(notification.content)}
                    </div>

                    {/* Card Footer (Date) */}
                    <span className="text-[12px] text-gray-500 dark:text-gray-400 mt-4 block">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>

                  {/* Mark as Read Button */}
                  {!isSelectionMode && !notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="absolute right-4 top-4 z-10 flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Marquer comme lu"
                    >
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {/* {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className={`px-6 py-2 bg-gradient-to-br ${theme.colors.a_background} text-white rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )} */}
            {loading && hasMore && (
              <div className="flex justify-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}