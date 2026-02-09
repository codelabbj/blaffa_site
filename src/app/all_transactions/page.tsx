'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowDownLeft, ArrowUpRight, RotateCw, X, Copy, Smartphone, Phone, CreditCard, Hash, Calendar, Activity, Search, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../components/ThemeProvider'; // Adjust path as needed
import axios from 'axios'
import api from '@/lib/axios';
import DashboardHeader from '@/components/DashboardHeader';

type Transaction = {
  id: string;
  amount: number;
  reference: string;
  type_trans: string;
  status: string;
  created_at: string;
  phone_number: string;
  transaction_reference: string | null;
  error_message: string | null;
  net_payable_amount: number | null;
  app: {
    id: string;
    name: string;
    public_name: string;
  };
  network: {
    id: number;
    name: string;
    public_name: string;
  };
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: string;
    user: string;
    created_at: string;
    transaction: Transaction;
  }>;
};

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // const lastTransactionRef = useRef<HTMLDivElement | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [tempCategory, setTempCategory] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [tempStatus, setTempStatus] = useState<string>('all');
  const { theme } = useTheme();
  const router = useRouter();

  // Add this near the top of your component, after the state declarations

  // Fetch transactions from API
  const fetchTransactions = useCallback(async (pageNumber: number, category: string = 'all') => {
    if (pageNumber === 1) setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        setTransactions([]);
        setHasMore(false);
        return;
      }

      let apiUrl = `/blaffa/historic?page=${pageNumber}`;
      if (category === 'deposit') apiUrl += '&type=deposit';
      if (category === 'withdrawal') apiUrl += '&type=withdrawal';

      if (activeStatus !== 'all') {
        const apiStatusMap: Record<string, string> = {
          'success': 'completed',
          'en attente': 'pending',
          'echec': 'failed'
        };
        const statusToFetch = apiStatusMap[activeStatus.toLowerCase()] || activeStatus;
        apiUrl += `&status=${statusToFetch}`;
      }

      const response = await api.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // With axios, the data is already parsed
      const data: ApiResponse = response.data;
      console.log('Received data:', data);
      console.log('Received data for page:', pageNumber, data);

      const newTransactions = data.results
        .map(item => item.transaction)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setTransactions(prev => pageNumber === 1 ? newTransactions : [...prev, ...newTransactions]);
      setHasMore(!!data.next);
      setError(null);
    } catch (err) {
      console.error('Error in fetchTransactions:', err);
      let errorMessage = 'Failed to load transactions';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      if (errorMessage.toLowerCase().includes('authenticat')) {
        console.log('Authentication error, redirecting to login...');
        // window.location.href = '/login'; // Uncomment this if you want to redirect to login
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const lastTransactionElement = useCallback((node: HTMLDivElement | null) => {
    if (loading || !node) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    observerRef.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchTransactions(page, activeCategory);
    }
  }, [page, activeCategory, fetchTransactions]);

  useEffect(() => {
    setPage(1); // Reset page when category or status changes
    fetchTransactions(1, activeCategory);
  }, [activeCategory, activeStatus, fetchTransactions]);

  const handleApplyFilter = () => {
    setActiveCategory(tempCategory);
    setIsFilterOpen(false);
  };

  const handleApplyStatusFilter = () => {
    setActiveStatus(tempStatus);
    setIsStatusFilterOpen(false);
  };

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleRefresh = () => {
    setPage(1); // Reset to first page
    fetchTransactions(1, activeCategory);
  };


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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-BJ', {
      style: 'currency',
      currency: 'XOF',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionTypeIcon = (type: string) => {
    if (type === 'deposit' || type === 'buy') {
      return <ArrowDownLeft size={16} />;
    }
    return <ArrowUpRight size={16} />;
  };

  const StatusBadge = ({ status, type_trans }: { status: string, type_trans: string }) => {
    if ((type_trans === 'sale' || type_trans === 'buy') && status === 'payment_init_success') {
      return <span className="bg-green-500/10 text-green-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded">payment_init_success</span>;
    }
    const statusMap: Record<string, { text: string; className: string }> = {
      completed: { text: 'success', className: 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' },
      accept: { text: 'success', className: 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' },
      pending: { text: 'En cours', className: 'bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300' },
      failed: { text: 'Échoué', className: 'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300' },
      error: { text: 'Échoué', className: 'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300' },
      default: { text: status, className: 'bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300' },
      Approve: { text: 'success', className: 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' },
    };
    const { text, className } = statusMap[status.toLowerCase()] || statusMap.default;
    return <span className={className}>{text}</span>;
  };

  function copyToClipboard(text: string) {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  if (loading && transactions.length === 0 && !isFilterOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && !isFilterOpen) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={handleRefresh}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <RotateCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} relative pb-20`}>
      {/* Inline Header matching reference */}
      <div className="px-6 pt-10 pb-4">
        <h1 className={`text-2xl font-bold ${theme.colors.text} tracking-tight`}>Historique</h1>
      </div>
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
          
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes backdropFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(8px);
            }
          }
          
          .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }
          
          .modal-backdrop {
            animation: backdropFadeIn 0.3s ease-out;
          }
          
          .modal-content {
            animation: modalSlideIn 0.4s ease-out;
          }
        `}
      </style>

      <div className="w-full px-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsStatusFilterOpen(false);
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <span className={`text-xl font-medium ${theme.colors.text}`}>Categories</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${isFilterOpen ? 'text-blue-600' : 'text-gray-400'}`}>
              <path d="M3 6H21M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => {
              setIsStatusFilterOpen(!isStatusFilterOpen);
              setIsFilterOpen(false);
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <span className={`text-xl font-medium ${theme.colors.text}`}>Tout</span>
            <ChevronDown className={`w-5 h-5 ${isStatusFilterOpen ? 'text-blue-600' : 'text-gray-400'} group-hover:text-blue-500 transition-colors`} />
          </button>
        </div>
        {isFilterOpen ? (
          /* Category Filter Menu View */
          <div className="px-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className={`text-2xl font-bold ${theme.colors.text} mb-6`}>Filtre rapide</h3>

            <div className="flex flex-wrap gap-4 mb-12">
              {[
                { label: 'Tout', value: 'all' },
                { label: 'Retrait', value: 'withdrawal' },
                { label: 'Recharge', value: 'deposit' }
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setTempCategory(cat.value as any)}
                  className={`px-8 py-3 rounded-xl border-2 font-medium text-lg transition-all
                    ${tempCategory === cat.value
                      ? 'border-[#3b82f6] text-[#3b82f6] bg-blue-50/50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 text-gray-400'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleApplyFilter}
              className="w-full py-4 bg-[#1a4a90] hover:bg-[#153a70] text-white rounded-2xl text-xl font-bold transition-colors shadow-lg shadow-blue-900/20"
            >
              Appliquer
            </button>
          </div>
        ) : isStatusFilterOpen ? (
          /* Status Filter Menu View */
          <div className="px-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className={`text-2xl font-bold ${theme.colors.text} mb-6`}>All Status</h3>

            <div className="space-y-4 mb-12">
              {[
                { label: 'Tout', value: 'all' },
                { label: 'success', value: 'success' },
                { label: 'En attente', value: 'En attente' },
                { label: 'Echec', value: 'Echec' }
              ].map((stat) => (
                <button
                  key={stat.value}
                  onClick={() => setTempStatus(stat.value)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between
                            ${tempStatus === stat.value
                      ? 'border-[#1a4a90] bg-[#f8faff] dark:bg-blue-900/10'
                      : 'border-gray-200 dark:border-gray-700'
                    }`}
                >
                  <span className={`text-xl font-medium ${tempStatus === stat.value ? 'text-[#1a4a90] dark:text-blue-400' : theme.colors.text}`}>
                    {stat.label}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center p-1
                            ${tempStatus === stat.value ? 'border-[#1a4a90]' : 'border-gray-300'}
                        `}>
                    {tempStatus === stat.value && (
                      <div className="w-full h-full rounded-full bg-[#1a4a90]"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleApplyStatusFilter}
              className="w-full py-4 bg-[#1a4a90] hover:bg-[#153a70] text-white rounded-2xl text-xl font-bold transition-colors shadow-lg shadow-blue-900/20"
            >
              Appliquer
            </button>
          </div>
        ) : (
          /* Transactions List View */
          <div className="grid gap-0">
            {loading && page === 1 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">Chargement...</p>
              </div>
            ) : transactions.length === 0 ? (
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
              transactions.map((tx, index) => {
                const isLastElement = index === transactions.length - 1;
                return (
                  <div
                    key={tx.id}
                    ref={isLastElement ? lastTransactionElement : null}
                    className={`group relative w-full overflow-hidden ${theme.colors.c_background} dark:bg-transparent transition-all duration-300 cursor-pointer`}
                    style={{
                      animation: `slideInUp 0.6s ease-out ${index * 100}ms both`,
                    }}
                    onClick={() => {
                      router.push(`/transaction/detail?id=${tx.id}`);
                    }}
                  >
                    <div className="relative p-5 w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          {/* Stylized Icon based on type and status */}
                          {['completed', 'accept', 'approve', 'success', 'successful', 'payment_init_success'].includes(tx.status?.toLowerCase()) ? (
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-500">
                              {tx.type_trans === 'deposit' ? (
                                <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                              )}
                            </div>
                          ) : (
                            /* Stylized Dots Icon - Light gray circle with 3 blue dots for other statuses */
                            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                              <div className="flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col">
                            <h3 className={`font-semibold text-lg ${theme.colors.text} leading-tight`}>
                              {tx.type_trans === 'deposit' ? 'Dépôt' : tx.type_trans === 'withdrawal' ? 'Retrait' : tx.type_trans}
                            </h3>
                            <p className="text-sm text-gray-500 font-normal">
                              {formatDate(tx.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`font-bold text-lg ${theme.colors.text}`}>
                            XOF {tx.amount}
                          </div>
                          <p className={`text-sm font-medium ${['completed', 'accept', 'approve', 'success', 'successful', 'payment_init_success'].includes(tx.status?.toLowerCase())
                            ? 'text-green-500'
                            : ['pending', 'en attente'].includes(tx.status?.toLowerCase())
                              ? 'text-orange-400'
                              : 'text-red-500'
                            }`}>
                            {['completed', 'accept', 'approve', 'success', 'successful', 'payment_init_success'].includes(tx.status?.toLowerCase()) ? 'success' : tx.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-20 right-0 h-[1px] bg-gray-100 dark:bg-gray-800/50"></div>
                  </div>
                )
              })
            )}
            {loading && hasMore && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}