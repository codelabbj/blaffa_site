'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowDownLeft, ArrowUpRight, X, Activity, Copy, CheckCircle, Clock, XCircle, AlertCircle, ChevronRight, Smartphone, Phone, CreditCard, Hash, Calendar, } from 'lucide-react';
import { useRouter } from 'next/navigation';
//import Footer from '../components/footer';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';
import api from '@/lib/axios';
// Define the App interface
interface App {
  id: string;
  name: string;
  image: string;
  public_name: string;
  is_active: boolean;
}

// Define API response interfaces
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 */
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

/**
 * @typedef {Object} App
 * @property {string} id
 * @property {string} name
 * @property {string} image
 * @property {string} public_name
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} Network
 * @property {number} id
 * @property {string} name
 * @property {string} public_name
 * @property {string} image
 * @property {string} country_code
 * @property {string} indication
 */
interface Network {
  id: number;
  name: string;
  public_name: string;
  image: string;
  country_code: string;
  indication: string;
}

/**
 * @typedef {Object} Network
 * @property {number} id
 * @property {string} name
 * @property {string} public_name
 * @property {string} image
 * @property {string} country_code
 * @property {string} indication
 */

interface Transaction {
  id: string;
  amount: number;
  reference: string;
  type_trans: string;
  status: string;
  created_at: string;
  phone_number: string;
  app: App;
  network: Network;
  user: User;
  user_app_id: string;
  transaction_reference: string | null;
  error_message: string | null;
  net_payable_amount: number | null;
}

// Define the HistoricItem type
type HistoricItem = {
  id: string;
  user: string;
  created_at: string;
  transaction: Transaction;
};

/**
 * @typedef {Object} ApiResponse
 * @property {number} count
 * @property {string|null} next
 * @property {string|null} previous
 * @property {HistoricItem[]} results
 */

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<HistoricItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  // const [ setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  interface CustomWebSocket extends WebSocket {
    pingInterval?: NodeJS.Timeout | null;
  }

  const webSocketRef = useRef<CustomWebSocket | null>(null);

  const wsHealth = useRef({
    lastMessageTime: 0,
    messageCount: 0
  });


  // WebSocket reference
  const webSocketReconnectAttempts = useRef(0);
  // Transactions map to track unique transactions
  const transactionsMapRef = useRef(new Map());
  // Reconnect timeout reference for WebSocket
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format date from ISO string to readable format
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
  };

  // Build API URL based on filters and pagination
  const getApiUrl = (pageNumber: number, activeFilter: string) => {
    let apiUrl = `/blaffa/historic${pageNumber > 1 ? `?page=${pageNumber}` : ''}`;

    if (activeFilter === 'deposits') {
      apiUrl = `/blaffa/historic${pageNumber > 1 ? `?page=${pageNumber}&` : '?'}type=deposit`;
    } else if (activeFilter === 'withdrawals') {
      apiUrl = `/blaffa/historic${pageNumber > 1 ? `?page=${pageNumber}&` : '?'}type=withdrawal`;
    }

    return apiUrl;
  };

  // Create a function to generate a composite key for transactions
  const getTransactionKey = (transaction: HistoricItem | Transaction) => {
    // Check for different possible properties to handle various formats
    const id = 'transaction' in transaction
      ? transaction.transaction.id
      : transaction.id;

    if (!id) {
      console.error('Could not extract ID from transaction:', transaction);
      // Generate a fallback ID to prevent errors
      return `unknown-${Math.random().toString(36).substring(2, 11)}`;
    }

    return id.toString();
  };

  // Add this function to cycle through filter options


  // Update the setupWebSocket function with better error handling and fallback
  const setupWebSocket = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Authentication required for real-time updates');
      console.log(error);
      window.location.href = '/login';
      return;
    }

    // Clean up existing connection
    cleanupWebSocket();

    try {
      const wsUrl = `wss://api.blaffa.net/ws/socket?token=${encodeURIComponent(token)}`;
      webSocketRef.current = new WebSocket(wsUrl);

      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        if (webSocketRef.current?.readyState !== WebSocket.OPEN) {
          handleConnectionFailure('Connection timeout');
        }
      }, 5000);

      webSocketRef.current.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected successfully');
        webSocketReconnectAttempts.current = 0;
        startPingInterval();
      };

      webSocketRef.current.onclose = (event) => {
        clearTimeout(connectionTimeout);
        handleWebSocketClose(event);
      };

      webSocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        handleConnectionFailure('Connection failed');
      };

      webSocketRef.current.onmessage = handleWebSocketMessage;

    } catch (error) {
      console.error('WebSocket setup failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to establish connection');
      handleConnectionFailure('Failed to initialize WebSocket');
    }
  };

  // Add these helper functions
  const cleanupWebSocket = () => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
      webSocketRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  };

  const startPingInterval = () => {
    const pingInterval = setInterval(() => {
      if (webSocketRef.current?.readyState === WebSocket.OPEN) {
        try {
          webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          console.error('Failed to send ping:', error);
          cleanupWebSocket();
          setupWebSocket();
        }
      } else {
        clearInterval(pingInterval);
      }
    }, 30000);

    // Store the interval ID for cleanup
    if (webSocketRef.current) {
      webSocketRef.current.pingInterval = pingInterval;
    }
  };

  const handleConnectionFailure = (message: string) => {
    console.error(message);
    setError(message);

    // Implement exponential backoff
    const backoffDelay = Math.min(1000 * Math.pow(2, webSocketReconnectAttempts.current), 30000);
    webSocketReconnectAttempts.current++;

    reconnectTimeoutRef.current = setTimeout(() => {
      setupWebSocket();
    }, backoffDelay);
  };

  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      wsHealth.current = {
        lastMessageTime: Date.now(),
        messageCount: wsHealth.current.messageCount + 1
      };

      switch (data.type) {
        case 'transaction_update':
          handleTransactionUpdate(data.transaction);
          break;
        case 'new_transaction':
          handleNewTransaction(data.transaction);
          break;
        case 'pong':
          console.log('Received pong from server');
          break;
        case 'error':
          console.error('Server error:', data.message);
          setError(data.message);
          break;
        default:
          if (data.transaction) {
            const existingTransaction = transactionsMapRef.current.has(getTransactionKey(data.transaction));
            if (existingTransaction) {
              handleTransactionUpdate(data.transaction);
            } else {
              handleNewTransaction(data.transaction);
            }
          }
      }

    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  const handleWebSocketClose = (event: CloseEvent) => {
    cleanupWebSocket();

    const reason = getCloseReason(event.code);
    console.log(`WebSocket closed: ${reason}`);

    if (event.code !== 1000) {
      handleConnectionFailure(reason);
    }
  };

  const getCloseReason = (code: number): string => {
    const closeReasons: Record<number, string> = {
      1000: 'Normal closure',
      1001: 'Going away',
      1002: 'Protocol error',
      1003: 'Unsupported data',
      1005: 'No status received',
      1006: 'Abnormal closure',
      1007: 'Invalid frame payload data',
      1008: 'Policy violation',
      1009: 'Message too big',
      1010: 'Mandatory extension',
      1011: 'Internal server error',
      1012: 'Service restart',
      1013: 'Try again later',
      1014: 'Bad gateway',
      1015: 'TLS handshake'
    };

    return closeReasons[code] || `Unknown reason (${code})`;
  };

  // Handle new transaction from WebSocket
  const handleNewTransaction = (transaction: Transaction) => {
    const key = getTransactionKey(transaction);

    // Only add if it matches the current filter
    if (shouldShowTransaction(transaction)) {
      // Check if we already have this transaction
      if (!transactionsMapRef.current.has(key)) {
        // Create a proper HistoricItem
        const historicItem: HistoricItem = {
          id: transaction.id,
          user: transaction.user?.id || '',
          created_at: transaction.created_at,
          transaction: transaction
        };

        // Add to our map
        transactionsMapRef.current.set(key, historicItem);

        // Add to state (at the beginning)
        setTransactions(prev => [historicItem, ...prev]);
      }
    }
  };

  // Handle transaction updates from WebSocket
  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    const key = getTransactionKey(updatedTransaction);

    console.log('Received update for transaction:', key, updatedTransaction);
    console.log('Does this transaction exist in our map?', transactionsMapRef.current.has(key));

    // Update the transaction in our state
    setTransactions(prev =>
      prev.map(item => {
        if (getTransactionKey(item) === key) {
          // Create updated item with new transaction data
          return {
            ...item,
            transaction: updatedTransaction
          };
        }
        return item;
      })
    );

    // Update the transaction in our map
    if (transactionsMapRef.current.has(key)) {
      const existingItem = transactionsMapRef.current.get(key);
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          transaction: updatedTransaction
        };
        transactionsMapRef.current.set(key, updatedItem);
      }
    }
  };

  // Filter transactions based on current filter
  const shouldShowTransaction = (item: HistoricItem | Transaction) => {
    const transaction = 'transaction' in item ? item.transaction : item;

    if (!transaction) return false;

    return true;
  };

  // Fetch transactions from API
  const fetchTransactions = async (pageNumber: number, activeFilter: string) => {
    setLoading(true);

    try {
      const apiUrl = getApiUrl(pageNumber, activeFilter);
      console.log('Fetching transactions from:', apiUrl);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        setError('You must be logged in to view transactions.');
        setLoading(false);
        return;
      }

      const response = await api.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const errorData = await response.data;
        console.error('Error Data:', errorData);
        throw new Error(errorData.message);
      }

      const data = response.data;
      console.log('Fetched Transactions:', data);

      // Process the fetched transactions
      if (pageNumber === 1) {
        // Reset the transactions map for first page
        transactionsMapRef.current.clear();

        // Check if we got any transactions
        if (data.results && data.results.length > 0) {
          // Add each transaction to the map
          data.results.forEach((tx: HistoricItem) => {
            const key = getTransactionKey(tx);
            transactionsMapRef.current.set(key, tx);
          });

          setTransactions(data.results);
        } else {
          // No transactions found
          setTransactions([]);
        }
      } else {
        // For pagination, only add transactions that don't already exist
        const newTransactions = data.results.filter((tx: HistoricItem) => {
          const key = getTransactionKey(tx);
          if (!transactionsMapRef.current.has(key)) {
            transactionsMapRef.current.set(key, tx);
            return true;
          }
          return false;
        });

        setTransactions(prev => [...prev, ...newTransactions]);
      }

      setError(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to load transactions. Please try again.');
        console.error('Error message:', error.message);
      } else {
        setError('Failed to load transactions. Please try again.');
        console.error('Unknown error:', error);
      }

      // Set empty transactions if API failed
      if (pageNumber === 1) {
        setTransactions([]);
        transactionsMapRef.current.clear();
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and WebSocket setup
  useEffect(() => {
    fetchTransactions(page, 'all');

    // Setup WebSocket connection
    setupWebSocket();

    // Add health check interval for WebSocket
    const healthCheckInterval = setInterval(() => {
      const now = Date.now();
      const minutesSinceLastMessage = (now - wsHealth.current.lastMessageTime) / (1000 * 60);

      if (wsHealth.current.lastMessageTime > 0 && minutesSinceLastMessage > 5) {
        console.warn('No WebSocket messages received in 5 minutes, reconnecting...');
        setupWebSocket(); // Force reconnection
      }
    }, 60000); // Check every minute

    // Cleanup function
    return () => {
      clearInterval(healthCheckInterval);
      if (webSocketRef.current) {
        // Clear ping interval if exists
        if (webSocketRef.current.pingInterval) {
          clearInterval(webSocketRef.current.pingInterval);
        }

        webSocketRef.current.close();
        webSocketRef.current = null;
      }

      // Clear any pending reconnection timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Verify WebSocket connection after initial setup
  useEffect(() => {
    // Verify connection after initial setup
    const verifyConnectionTimeout = setTimeout(() => {
      // If we haven't received any messages after 10 seconds of setup
      if (wsHealth.current.messageCount === 0 && webSocketRef.current &&
        webSocketRef.current.readyState === WebSocket.OPEN) {
        console.log('Testing WebSocket connection with manual ping...');
        try {
          webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          console.error('Failed to send ping, reconnecting WebSocket:', error);
          setupWebSocket();
        }
      }
    }, 10000);

    return () => clearTimeout(verifyConnectionTimeout);
  }, []);

  // Reset page when tab changes to refetch from the beginning
  useEffect(() => {
    setPage(1);
    fetchTransactions(1, 'all');
  }, []);


  // Show transaction details in page
  const openTransactionDetails = (transaction: HistoricItem) => {
    router.push(`/transaction/detail?id=${transaction.transaction.id}`);
  };

  // Copy transaction ID or reference to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log('Copied to clipboard:', text);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Format the transaction amount with currency symbol
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-BJ', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionTypeIcon = (type: string) => {
    return type === 'deposit' ? (
      <ArrowDownLeft className="w-5 h-5" />
    ) : (
      <ArrowUpRight className="w-5 h-5" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'accept':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'payment_init_success':
        return <Clock className="w-4 h-4 text-blue500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatStatusText = (status: string) => {
    if (status === 'payment_init_success') return 'payment_init_success';
    const statusMap: Record<string, string> = {
      completed: 'Completed',
      accept: 'Accepted',
      pending: 'Pending',
      failed: 'Failed',
      error: 'Failed'
    };

    return statusMap[status.toLowerCase()] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
      case 'accept':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'payment_init_success':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className={`mt-4 ${theme.colors.a_background} rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden`}>
      <div className="w-full overflow-hidden">
        {/* Header with title and controls */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h3 className={`text-xl font-medium ${theme.colors.text}`}>Activités récentes</h3>
          <a className={`hover:text-blue-700 font-bold text-sm`} style={{ color: theme.colors.primary }} href="/all_transactions">
            voir tout
          </a>
        </div>

        {/* Transaction list */}
        <div className="space-y-4">
          <style>
            {`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
              
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
      `}
          </style>

          {loading && page === 1 ? (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"></div>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-6">
              <p className={`${theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mb-2 text-center font-normal`}>
                your recent activities will appear here
              </p>
              <h3 className={`text-xl font-semibold text-center ${theme.colors.text}`}>
                No recent activity yet
              </h3>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid gap-0">
                {transactions.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group relative w-full overflow-hidden bg-gradient-to-br ${theme.colors.background} transition-all duration-300 cursor-pointer`}
                    onClick={() => openTransactionDetails(item)}
                  >

                    <div className="relative p-4 w-full">
                      {/* Unified Layout (Simplified dots design for all screens) */}
                      <div className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            {/* Stylized Icon based on type and status */}
                            {['completed', 'accept', 'success', 'successful', 'payment_init_success'].includes(item.transaction.status.toLowerCase()) ? (
                              <div className={`w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-500`}>
                                {item.transaction.type_trans === 'deposit' ? (
                                  <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                  </svg>
                                )}
                              </div>
                            ) : (
                              /* Stylized Dots Icon - Light gray circle with 3 blue dots for other statuses */
                              <div className={`w-10 h-10 rounded-full ${theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-center flex-shrink-0`}>
                                <div className="flex gap-0.5">
                                  <div className={`w-1 h-1 rounded-full ${theme.mode === 'dark' ? 'bg-[#60a5fa]' : 'bg-[#3b82f6]'}`}></div>
                                  <div className={`w-1 h-1 rounded-full ${theme.mode === 'dark' ? 'bg-[#60a5fa]' : 'bg-[#3b82f6]'}`}></div>
                                  <div className={`w-1 h-1 rounded-full ${theme.mode === 'dark' ? 'bg-[#60a5fa]' : 'bg-[#3b82f6]'}`}></div>
                                </div>
                              </div>
                            )}

                            {/* Transaction Info */}
                            <div className="flex flex-col">
                              <h3 className={`font-semibold text-sm ${theme.colors.text} leading-tight`}>
                                {item.transaction.type_trans === 'deposit' ? 'Dépôt' : item.transaction.type_trans === 'withdrawal' ? 'Retrait' : item.transaction.type_trans}
                              </h3>
                              <p className={`text-xs ${theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-normal`}>
                                {formatDate(item.transaction.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Amount and Status */}
                          <div className="text-right">
                            <div className={`font-bold text-sm ${theme.colors.text}`}>
                              XOF {item.transaction.amount}
                            </div>
                            <p className={`text-[10px] md:text-xs tracking-wide ${item.transaction.status.toLowerCase() === 'expired'
                              ? 'text-red-500'
                              : ['completed', 'accept', 'success', 'successful'].includes(item.transaction.status.toLowerCase())
                                ? 'text-green-500'
                                : (theme.mode === 'dark' ? 'text-gray-500' : 'text-[#b3b3b3]')
                              } font-normal`}>
                              {item.transaction.status.toLowerCase() === 'expired'
                                ? 'EXPIRED'
                                : ['completed', 'accept', 'success', 'successful'].includes(item.transaction.status.toLowerCase())
                                  ? 'success'
                                  : item.transaction.status === 'pending'
                                    ? 'pending'
                                    : item.transaction.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gradient border effect on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-blue-500/20 to-blue-500/20 blur-sm"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Load More Indicator */}
          {loading && page > 1 && (
            <div className="flex justify-center items-center py-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500/30 border-t-blue-500"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-500/10 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

