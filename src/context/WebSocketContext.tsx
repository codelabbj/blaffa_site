// src/contexts/WebSocketContext.tsx
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { handleWebSocketMessage } from '@/lib/ws-messages';

const WS_URL = 'wss://api.blaffa.net/ws/socket';
const FALLBACK_POLL_MS = 3 * 60 * 1000;

interface WebSocketContextType {
  addMessageHandler: (handler: (data: unknown) => void) => () => void;
  sendMessage: (message: unknown) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const messageHandlers = useRef<Array<(data: unknown) => void>>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsConnected(false);
      return;
    }

    if (ws.current) {
      if (ws.current.readyState === WebSocket.OPEN) return;
      if (ws.current.readyState === WebSocket.CONNECTING) return;
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.close();
    }

    try {
      const wsUrl = new URL(WS_URL);
      wsUrl.searchParams.set('token', token);
      ws.current = new WebSocket(wsUrl.toString());

      ws.current.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          handleWebSocketMessage(data);
          messageHandlers.current.forEach((handler) => handler(data));
        } catch (error) {
          console.error('[WS] Error processing message:', error);
        }
      };

      ws.current.onclose = (event) => {
        setIsConnected(false);
        ws.current = null;

        if (event.code !== 1000) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
          reconnectAttempts.current += 1;
          if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = setTimeout(connect, delay);
        }
      };

      ws.current.onerror = () => {
        if (ws.current?.readyState !== WebSocket.OPEN) {
          setIsConnected(false);
        }
      };
    } catch (error) {
      console.error('[WS] Setup error:', error);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        connect();
      }
    };

    const handleFocus = () => {
      const token = localStorage.getItem('accessToken');
      if (token && (!ws.current || ws.current.readyState === WebSocket.CLOSED)) {
        connect();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    const heartbeat = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        connect();
      }
    }, FALLBACK_POLL_MS);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(heartbeat);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) {
        ws.current.close(1000);
      }
    };
  }, [connect]);

  const addMessageHandler = useCallback((handler: (data: unknown) => void) => {
    messageHandlers.current.push(handler);
    return () => {
      messageHandlers.current = messageHandlers.current.filter((h) => h !== handler);
    };
  }, []);

  const sendMessage = useCallback((message: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ addMessageHandler, sendMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export { FALLBACK_POLL_MS };
