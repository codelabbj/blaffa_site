'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowDownLeft, ArrowUpRight,  X,  Activity,  Copy, CheckCircle, Clock, XCircle, AlertCircle, ChevronRight, Smartphone, Phone, CreditCard, Hash, Calendar, } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
 // const [ setHasMore] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<HistoricItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [isNewTransaction, setIsNewTransaction] = useState<Record<string, boolean>>({});
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [animateHeader, setAnimateHeader] = useState(false);
  const {t} = useTranslation();
  const { theme } = useTheme();

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
    if (!isRealTimeEnabled) {
      cleanupWebSocket();
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Authentication required for real-time updates');
      console.log(error);
      setWsStatus('error');
      window.location.href = '/auth';
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
        setWsStatus('connected');
        setError(null);
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
      setWsStatus('error');
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
    setWsStatus('disconnected');
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
    setWsStatus('error');
    setError(message);
    
    // Implement exponential backoff
    const backoffDelay = Math.min(1000 * Math.pow(2, webSocketReconnectAttempts.current), 30000);
    webSocketReconnectAttempts.current++;

    reconnectTimeoutRef.current = setTimeout(() => {
      if (isRealTimeEnabled) {
        setupWebSocket();
      }
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

      setLastFetchTime(new Date().toISOString());
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  const handleWebSocketClose = (event: CloseEvent) => {
    cleanupWebSocket();
    
    const reason = getCloseReason(event.code);
    console.log(`WebSocket closed: ${reason}`);

    if (isRealTimeEnabled && event.code !== 1000) {
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
        // Mark as new for animation
        setIsNewTransaction(prev => ({
          ...prev,
          [key]: true
        }));
        
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
        
        // Remove animation after 5 seconds
        setTimeout(() => {
          setIsNewTransaction(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
          });
        }, 5000);
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
    
    // Highlight the updated transaction
    setIsNewTransaction(prev => ({
      ...prev,
      [key]: true
    }));
    
    // Remove highlight after 5 seconds
    setTimeout(() => {
      setIsNewTransaction(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }, 5000);
  };
  
  // Filter transactions based on current filter
  const shouldShowTransaction = (item: HistoricItem | Transaction) => {
    const transaction = 'transaction' in item ? item.transaction : item;
    
    if (!transaction) return false;
    
    if (activeTab === 'all') {
      return true;
    } else if (activeTab === 'deposits') {
      return transaction.type_trans === 'deposit';
    } else if (activeTab === 'withdrawals') {
      return transaction.type_trans === 'withdrawal';
    }
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
      
      // Update last fetch time
      setLastFetchTime(new Date().toISOString());
      
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
      
      //setHasMore(data.next !== null);
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
    // Trigger animation
    setTimeout(() => {
      setAnimateHeader(true);
    }, 500);
    
    fetchTransactions(page, activeTab);
    
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
  
  // Update WebSocket when real-time setting changes
  useEffect(() => {
    setupWebSocket();
  }, [isRealTimeEnabled]);
  
  // Reset page when tab changes to refetch from the beginning
  useEffect(() => {
    setPage(1);
    fetchTransactions(1, activeTab);
  }, [activeTab]);
 
  
  // Show transaction details in modal
  const openTransactionDetails = (transaction: HistoricItem) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
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
        case 'pending':
          return <Clock className="w-4 h-4 text-yellow-500" />;
        case 'failed':
          return <XCircle className="w-4 h-4 text-red-500" />;
        default:
          return <AlertCircle className="w-4 h-4 text-gray-500" />;
      }
    };

  
    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'accept':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'failed':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      }
    };
  
  // Get status badge class based on transaction status
  // const getStatusBadgeClass = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case 'completed':
  //     case 'success':
  //       return 'text-green-500';
  //     case 'pending':
  //       return 'text-amber-500';
  //     case 'failed':
  //     case 'error':
  //       return 'text-red-500';
  //     default:
  //       return 'text-gray-500';
  //   }
  // };
  
  // Get transaction type icon based on type
  // const getTransactionTypeIcon = (type: string) => {
  //   if (type === 'deposit') {
  //     return <ArrowDownLeft className="w-5 h-5 text-orange-500 group-hover:animate-bounce" />;
  //   } else if (type === 'withdrawal') {
  //     return <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:animate-pulse" />;
  //   }
  //   return null;
  // };
  
  return (
    <div className={`rounded-2xl shadow-sm border border-gray-200 bg-gradient-to-br ${theme.colors.a_background} ${theme.colors.text}`}>
      {/* Background gradient effects */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-orange-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-700/10 rounded-full blur-3xl animate-pulse-slow"></div>
     <div className={`${theme.colors.c_background} shadow-md rounded-2xl p-6 w-full overflow-hidden`}>
        {/* Header with title and controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Historique</h3>
            <a className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1" href="/all_transactions">
              <span>Voir tout</span>
              {/* <ChevronRight className="w-4 h-4" /> */}
            </a>
          </div>
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
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                background-size: 200px 100%;
                animation: shimmer 2s infinite;
              }
            `}
          </style>

          {loading && page === 1 ? (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 shadow-2xl border border-slate-600/50">
                <Activity className="w-12 h-12 text-slate-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold  mb-3">Aucune transaction trouvée</h3>
              <p className="text-slate-400 text-center max-w-md leading-relaxed">
                {activeTab === 'all' 
                  ? "Your transaction history will appear here once you start making payments."
                  : activeTab === 'deposits'
                  ? "No deposits have been recorded yet."
                  : "No withdrawals have been recorded yet."}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid gap-4">
                {transactions.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/50 hover:border-purple-500/50 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10`}
                    onClick={() => openTransactionDetails(item)}
                    style={{
                      animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
                    }}
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-6 w-full">
                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center w-full">
                        {/* Left Section - Icon and Details */}
                        <div className="flex items-center space-x-4 flex-1 min-w-0 pr-4">
                          {/* Icon with enhanced styling */}
                          <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                            item.transaction.type_trans === 'deposit'
                              ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20'
                              : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                          }`}>
                            {getTransactionTypeIcon(item.transaction.type_trans)}
                            <div className={`absolute inset-0 rounded-2xl ${
                              item.transaction.type_trans === 'deposit' 
                                ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10' 
                                : 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10'
                            } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                          </div>

                          {/* Transaction Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg transition-colors duration-300">
                                {item.transaction.type_trans === 'deposit' ? t('Deposit') : t('Withdraw')}
                              </h3>
                              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusBadgeClass(item.transaction.status)} group-hover:scale-105`}>
                                {getStatusIcon(item.transaction.status)}
                                <span className="ml-1 capitalize">{item.transaction.status}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                              <span className="font-mono">{item.transaction.phone_number}</span>
                              <span>•</span>
                              <span>{formatDate(item.transaction.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Amount and Reference */}
                        <div className="text-right space-y-2 flex-shrink-0">
                          <div className={`font-bold text-2xl transition-all duration-300 group-hover:scale-105 ${
                            item.transaction.type_trans === 'deposit'
                              ? 'text-green-400 group-hover:text-green-300'
                              : 'text-blue-400 group-hover:text-blue-300'
                          }`}>
                            {item.transaction.type_trans === 'deposit' ? '+' : '-'}
                            {formatAmount(item.transaction.amount)}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            #{item.transaction.reference.substring(0, 12)}...
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0">
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="sm:hidden space-y-4">
                        {/* Top Row - Icon, Title, Status */}
                        <div className="flex items-center space-x-3">
                          <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                            item.transaction.type_trans === 'deposit'
                              ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20'
                              : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                          }`}>
                            {getTransactionTypeIcon(item.transaction.type_trans)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">
                              {item.transaction.type_trans === 'deposit' ? t('Deposit') : t('Withdraw')}
                            </h3>
                          </div>
                          
                          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.transaction.status)}`}>
                            {getStatusIcon(item.transaction.status)}
                            <span className="ml-1 capitalize">{item.transaction.status}</span>
                          </div>
                        </div>

                        {/* Bottom Row - Amount, Details */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-400 font-mono">{item.transaction.phone_number}</div>
                            <div className="text-sm text-slate-400">{formatDate(item.transaction.created_at)}</div>
                            <div className="text-xs text-slate-500 font-mono">
                              #{item.transaction.reference.substring(0, 12)}...
                            </div>
                          </div>
                          
                          <div className={`font-bold text-xl ${
                            item.transaction.type_trans === 'deposit'
                              ? 'text-green-400'
                              : 'text-blue-400'
                          }`}>
                            {item.transaction.type_trans === 'deposit' ? '+' : '-'}
                            {formatAmount(item.transaction.amount)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gradient border effect on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-sm"></div>
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
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-500/30 border-t-purple-500"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Transaction detail modal */}
        {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-backdrop">
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl w-full max-w-lg shadow-2xl border border-slate-600/50 modal-content">
              {/* Header */}
              <div className="relative p-6 pb-0">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Transaction Details</h3>
                    <p className="text-slate-400 text-sm">Review your transaction information</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center group"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
                
                {/* Transaction Type & Status Card */}
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      selectedTransaction.transaction.type_trans === 'deposit' 
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20' 
                        : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                    }`}>
                      {getTransactionTypeIcon(selectedTransaction.transaction.type_trans)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-xl text-white">
                          {selectedTransaction.transaction.type_trans === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </h4>
                        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedTransaction.transaction.status)}`}>
                          {getStatusIcon(selectedTransaction.transaction.status)}
                          <span className="ml-1 capitalize">{selectedTransaction.transaction.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(selectedTransaction.transaction.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Amount Section */}
              <div className="px-6 py-4">
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/30">
                  <div className="text-center">
                    <div className="text-slate-400 text-sm mb-2 font-medium">Transaction Amount</div>
                    <div className={`text-4xl font-bold mb-2 ${
                      selectedTransaction.transaction.type_trans === 'deposit' 
                        ? 'text-green-400' 
                        : 'text-blue-400'
                    }`}>
                      {selectedTransaction.transaction.type_trans === 'deposit' ? '+' : '-'}
                      {formatAmount(selectedTransaction.transaction.amount)}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {selectedTransaction.transaction.type_trans === 'deposit' ? 'Received' : 'Sent'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Details Grid */}
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  {/* Transaction ID */}
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-slate-400 text-sm font-medium">
                        <Hash className="w-4 h-4 mr-2" />
                        Transaction ID
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-mono">{selectedTransaction.transaction.reference.substring(0, 16)}...</span>
                        <button 
                          onClick={() => copyToClipboard(selectedTransaction.id)}
                          className="w-8 h-8 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center group"
                        >
                          <Copy size={14} className="group-hover:scale-110 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reference */}
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-slate-400 text-sm font-medium">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Reference
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-mono">{selectedTransaction.transaction.reference}</span>
                        <button 
                          onClick={() => copyToClipboard(selectedTransaction.transaction.reference)}
                          className="w-8 h-8 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center group"
                        >
                          <Copy size={14} className="group-hover:scale-110 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone Number */}
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-slate-400 text-sm font-medium">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Number
                      </div>
                      <span className="text-white text-sm font-mono">{selectedTransaction.transaction.phone_number}</span>
                    </div>
                  </div>
                  
                  {/* Network (if available) */}
                  {selectedTransaction.transaction.network && (
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-slate-400 text-sm font-medium">
                          <Smartphone className="w-4 h-4 mr-2" />
                          Network
                        </div>
                        <span className="text-white text-sm">{selectedTransaction.transaction.network.public_name || selectedTransaction.transaction.network.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all duration-300 font-medium border border-slate-600/30 hover:border-slate-500/50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedTransaction.transaction.reference)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2"
                  >
                    <Copy size={16} />
                    Copy Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

