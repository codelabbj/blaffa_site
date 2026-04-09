// src/contexts/WebSocketContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

interface WebSocketContextType {
  addMessageHandler: (handler: (data: any) => void) => () => void;
  sendMessage: (message: any) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const messageHandlers = useRef<((data: any) => void)[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('⚠️ [WS] No access token, skipping connection');
      setIsConnected(false);
      return;
    }

    // Prevent duplicate connection attempts
    if (ws.current) {
      if (ws.current.readyState === WebSocket.OPEN) {
        console.log('ℹ️ [WS] Already connected, skipping redundant attempt');
        return;
      }
      if (ws.current.readyState === WebSocket.CONNECTING) {
        console.log('ℹ️ [WS] Connection already in progress, waiting...');
        return;
      }
      // If it's in any other state (CLOSING or CLOSED), clean it up before a new attempt
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.close();
    }

    try {
      // Use URLSearchParams for robust encoding of the JWT token
      const wsUrl = new URL('wss://api.blaffa.net/ws/socket/');
      wsUrl.searchParams.set('token', token);
      
      const tokenPreview = `${token.substring(0, 5)}...${token.substring(token.length - 4)}`;
      console.log(`🔌 [WS] Attempting connection with token: ${tokenPreview}`);
      
      ws.current = new WebSocket(wsUrl.toString());

      ws.current.onopen = () => {
        console.log('✅ [WS] Connected successfully');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          messageHandlers.current.forEach(handler => handler(data));
        } catch (error) {
          console.error('⚠️ [WS] Error processing message:', error);
        }
      };

      ws.current.onclose = (event) => {
        setIsConnected(false);
        const code = event.code;
        const reason = event.reason || 'No reason';
        
        // Don't auto-reconnect if it was a clean logout (1000)
        if (code !== 1000) {
          console.log(`📡 [WS] Connection closed (Code: ${code}, Reason: ${reason}). Retrying...`);
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current++;
          
          if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = setTimeout(connect, delay);
        } else {
          console.log('👋 [WS] Connection closed normally');
        }
        ws.current = null;
      };

      ws.current.onerror = (error) => {
        // Only log errors if we aren't already transitioning to a successful state
        if (ws.current?.readyState !== WebSocket.OPEN) {
          console.error('❌ [WS] Connection failure');
        }
      };

    } catch (error) {
      console.error('❌ [WS] Setup error:', error);
    }
  };

  useEffect(() => {
    connect();

    // Watch for token changes in localStorage (e.g. from other tabs or login)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        console.log('Auth token changed, reconnecting WebSocket...');
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        connect();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Periodic check for connection (pulse)
    const interval = setInterval(() => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        const token = localStorage.getItem('accessToken');
        if (token) connect();
      }
    }, 10000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
      if (ws.current) {
        ws.current.close(1000); // Normal closure
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  const addMessageHandler = (handler: (data: any) => void) => {
    messageHandlers.current.push(handler);
    return () => {
      messageHandlers.current = messageHandlers.current.filter(h => h !== handler);
    };
  };

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <WebSocketContext.Provider 
      value={{ 
        addMessageHandler, 
        sendMessage, 
        isConnected 
      }}
    >
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