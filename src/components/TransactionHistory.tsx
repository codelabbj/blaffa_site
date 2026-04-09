'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowDownLeft, ArrowUpRight, X, Activity, Copy, CheckCircle, Clock, XCircle, AlertCircle, ChevronRight, Smartphone, Phone, CreditCard, Hash, Calendar, } from 'lucide-react';
import { useRouter } from 'next/navigation';
//import Footer from '../components/footer';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';
import api from '@/lib/axios';
import { useWebSocket } from '@/context/WebSocketContext';

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
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const { addMessageHandler } = useWebSocket();
  // Transactions map to track unique transactions
  const transactionsMapRef = useRef(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);


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
  const fetchTransactions = async (pageNumber: number, activeFilter: string, silent = false) => {
    if (!silent) setLoading(true);

    try {
      const apiUrl = getApiUrl(pageNumber, activeFilter);
      console.log('Fetching transactions from:', apiUrl);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        setError('You must be logged in to view transactions.');
        if (!silent) setLoading(false);
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
      if (pageNumber === 1 && !silent) {
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
        // For pagination or silent polling, add/update transactions
        const newTransactions: HistoricItem[] = [];
        data.results.forEach((tx: HistoricItem) => {
          const key = getTransactionKey(tx);
          if (!transactionsMapRef.current.has(key)) {
            transactionsMapRef.current.set(key, tx);
            newTransactions.push(tx);
          } else if (silent) {
            transactionsMapRef.current.set(key, tx);
          }
        });

        setTransactions(prev => {
          // If silent polling, update existing ones
          const updatedPrev = silent ? prev.map(item => {
            const key = getTransactionKey(item);
            const fresh = data.results.find((t: HistoricItem) => getTransactionKey(t) === key);
            return fresh || item;
          }) : prev;
          
          return [...newTransactions, ...updatedPrev].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
      }

      setHasMore(!!data.next);
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
      if (!silent) setLoading(false);
    }
  };

  // Initial fetch and WebSocket listener setup
  useEffect(() => {
    fetchTransactions(1, 'all');

    // Subscribe to global WebSocket messages
    const removeHandler = addMessageHandler((data) => {
      switch (data.type) {
        case 'transaction_update':
          handleTransactionUpdate(data.transaction);
          break;
        case 'new_transaction':
          handleNewTransaction(data.transaction);
          break;
        case 'error':
          console.error('WebSocket server error:', data.message);
          setError(data.message);
          break;
        default:
          if (data.transaction) {
            const key = getTransactionKey(data.transaction);
            const exists = transactionsMapRef.current.has(key);
            if (exists) {
              handleTransactionUpdate(data.transaction);
            } else {
              handleNewTransaction(data.transaction);
            }
          }
      }
    });

    return () => {
      removeHandler();
    };
  }, []);

  // Polling for real-time status updates in history
  useEffect(() => {
    const hasPending = transactions.some(item => 
      item.transaction && ['pending', 'payment_init_success', 'en attente'].includes(item.transaction.status.toLowerCase() || '')
    );

    if (!hasPending) return;

    const intervalId = setInterval(() => {
      fetchTransactions(1, 'all', true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [transactions]);

  // Handle scroll for infinite loading
  const handleScroll = () => {
    if (!scrollContainerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(nextPage, 'all');
    }
  };




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
    <div className={`mt-4 ${theme.colors.a_background} rounded-3xl overflow-hidden`}>
      <div className="w-full">
        {/* Header with title and controls */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h3 className={`text-xl font-medium ${theme.colors.text}`}>Activités récentes</h3>
          <a className={`hover:text-blue-700 font-bold text-sm`} style={{ color: theme.colors.primary }} href="/all_transactions">
            voir tout
          </a>
        </div>

        {/* Transaction list with internal scroll */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-[320px] overflow-y-scroll space-y-2 px-1 relative custom-scrollbar section-scroll"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
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
                {transactions.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 flex items-center justify-between ${theme.colors.hover} transition-colors cursor-pointer`}
                    onClick={() => openTransactionDetails(item)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Stylized Icon based on type and status */}
                      {['completed', 'accept', 'success', 'successful'].includes(item.transaction.status.toLowerCase()) ? (
                        <div className={`w-12 h-12 rounded-full ${theme.mode === 'dark' ? 'bg-red-950/20' : 'bg-[#fff1f1]'} flex items-center justify-center flex-shrink-0`}>
                          <svg className={`w-6 h-6 text-[#FF4D4D] ${item.transaction.type_trans === 'deposit' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                          </svg>
                        </div>
                      ) : (
                        /* Processing Icon - 3 blue dots */
                        <div className={`w-12 h-12 rounded-full ${theme.mode === 'dark' ? 'bg-slate-800' : 'bg-neutral-100'} flex items-center justify-center flex-shrink-0`}>
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className={`font-bold text-base ${theme.colors.text} leading-tight`}>
                          {item.transaction.type_trans === 'deposit' ? 'Dépot' : 'Retrait'}
                        </h4>
                        <p className={`text-sm ${theme.mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'} font-medium`}>
                          {formatDate(item.transaction.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-bold text-base ${theme.colors.text} whitespace-nowrap`}>
                        XOF {item.transaction.amount < 0 ? '-' : ''} {Math.abs(item.transaction.amount)}
                      </div>
                      <p className={`text-sm font-bold capitalize ${
                        ['completed', 'accept', 'success', 'successful'].includes(item.transaction.status.toLowerCase()) 
                        ? 'text-green-500' 
                        : 'text-red-500'
                      }`}>
                        {item.transaction.status === 'pending' ? 'en cours' : item.transaction.status.toLowerCase() === 'completed' ? 'success' : item.transaction.status}
                      </p>
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

