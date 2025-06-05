
'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowDownLeft, ArrowUpRight, RotateCw, X, Copy, Smartphone, Phone, CreditCard, Hash, Calendar, Activity, ChevronRight } from 'lucide-react';
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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();

  // Add this near the top of your component, after the state declarations

  const fetchTransactions = useCallback(async (pageNum = 1, isRefresh = false) => {
  if (!isRefresh) setLoading(true);
  else setIsRefreshing(true);
  
  try {
    console.log('Fetching transactions...');
    const token = localStorage.getItem('accessToken');
    console.log('Token exists:', !!token);
    
    if (!token) {
      console.error('No access token found');
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await api.get(
      `/blaffa/historic${pageNum > 1 ? `?page=${pageNum}` : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response status:', response.status);
    
    // With axios, the data is already parsed
    const data: ApiResponse = response.data;
    console.log('Received data:', data);
    console.log('Received data for page:', pageNum, data);
    
    const newTransactions = data.results
      .map(item => item.transaction)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setTransactions(prev => pageNum === 1 ? newTransactions : [...prev, ...newTransactions]);
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
    fetchTransactions(page, false);
  }
}, [page]);

useEffect(() => {
  fetchTransactions(1, false);
}, []);

 useEffect(() => {
  return () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  };
}, []);
  
 const handleRefresh = () => {
  setPage(1); // Reset to first page
  fetchTransactions(1, true);
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
    if (type === 'deposit') {
      return <ArrowDownLeft size={16} />;
    }
    return <ArrowUpRight size={16} />;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      completed: { text: 'Terminé', className: 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300' },
      payment_init_success: { text: 'Traitement', className: 'bg-green-500/10 text-green-500' },
      accept: { text: 'accepter', className: 'bg-green-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300' },
      pending: { text: 'En cours', className: 'bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300' },
      failed: { text: 'Échoué', className: 'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300' },
      error: { text: 'Échoué', className: 'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300' },
      default: { text: status, className: 'bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300' },
    };

    const { text, className } = statusMap[status.toLowerCase()] || statusMap.default;
    return <span className={className}>{text}</span>;
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
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

  function copyToClipboard(reference: string): void {
    throw new Error('Function not implemented.');
  }

 return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} p-4`}>
      <DashboardHeader/>
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

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold  mb-2">Toutes les transactions</h1>
            <p className="">Suivez toutes vos activités financières</p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center  bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
        
        <div className={`bg-gradient-to-r ${theme.colors.s_background} backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden`}>
          {/* Mobile View */}
          <div className=" space-y-4">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 shadow-2xl border border-slate-600/50">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Aucune transaction trouvée</h3>
                <p className="text-slate-400 text-center max-w-md leading-relaxed">
                  Votre historique de transactions apparaîtra ici une fois que vous commencerez à effectuer des paiements.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, index) => {
                  const isLastElement = index === transactions.length - 1;
                  return (
                    <div 
                      key={tx.id}
                      ref={isLastElement ? lastTransactionElement : null}
                      className={`bg-gradient-to-br ${theme.colors.s_background} rounded-2xl p-4 shadow-lg border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/70 transition-all duration-300 relative overflow-hidden`}
                      style={{
                        animation: `slideInUp 0.6s ease-out ${index * 100}ms both`,
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center ${
                            tx.type_trans === 'deposit' 
                              ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400' 
                              : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400'
                          }`}>
                            {getTransactionTypeIcon(tx.type_trans)}
                          </div>
                          <div>
                            <div className="font-medium ">
                              {tx.type_trans === 'deposit' ? 'Dépôt' : 'Retrait'}
                            </div>
                            <div className="text-sm ">
                              {tx.phone_number}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            tx.type_trans === 'deposit' ? 'text-green-400' : 'text-blue-400'
                          }`}>
                            {tx.type_trans === 'deposit' ? '+' : '-'}{formatAmount(tx.amount)}
                          </div>
                          <div className="text-xs ">
                            {formatDate(tx.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center">
                        <StatusBadge status={tx.status} />
                        <button
                          onClick={() => {
                            setSelectedTransaction(tx);
                            setIsModalOpen(true);
                          }}
                          className="text-xs bg-slate-700/50 hover:bg-slate-600/50 text-white px-3 py-1 rounded-lg transition-colors"
                        >
                          Voir détails
                        </button>
                      </div>
                    </div>
                  );
                })}
                {loading && hasMore && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop View */}
          {/* <div className="hidden md:block w-full h-full overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 shadow-2xl border border-slate-600/50">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Aucune transaction trouvée</h3>
                <p className="text-slate-400 text-center max-w-md leading-relaxed">
                  Votre historique de transactions apparaîtra ici une fois que vous commencerez à effectuer des paiements.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-fixed">
                  <colgroup>
                    <col className="w-[25%]" />
                    <col className="w-[15%]" />
                    <col className="w-[20%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                    <col className="w-[10%]" />
                  </colgroup>
                  <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-sm">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Montant
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Référence
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600/30">
                    {transactions.map((tx, index) => {
                      const isLastElement = index === transactions.length - 1;
                      return (
                        <tr 
                          key={tx.id}
                          ref={isLastElement ? lastTransactionElement : null}
                          className="group hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-slate-600/30 transition-all duration-500 relative overflow-hidden"
                          style={{
                            animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
                          }}
                        >
                          
                          <td className="px-4 py-3 whitespace-nowrap relative truncate max-w-[200px]">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                                tx.type_trans === 'deposit' 
                                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20' 
                                  : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                              }`}>
                                {getTransactionTypeIcon(tx.type_trans)}
                              </div>
                              <div className="ml-3 overflow-hidden">
                                <div className="text-sm font-medium group-hover:text-blue-200 transition-colors duration-300 truncate">
                                  {tx.type_trans === 'deposit' ? 'Dépôt' : 'Retrait'}
                                </div>
                                <div className="text-sm  group-hover:text-slate-300 transition-colors duration-300 truncate">
                                  {tx.phone_number}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap relative">
                            <div className={`text-sm font-bold transition-all duration-300 group-hover:scale-105 ${
                              tx.type_trans === 'deposit' 
                                ? 'text-green-400 group-hover:text-green-300' 
                                : 'text-blue-400 group-hover:text-blue-300'
                            }`}>
                              {tx.type_trans === 'deposit' ? '+' : '-'}{formatAmount(tx.amount)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap relative">
                            <div className="text-sm font-mono group-hover:text-blue-200 transition-colors duration-300 truncate max-w-[150px]">
                              {tx.reference}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap relative">
                            <StatusBadge status={tx.status} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm group-hover:text-blue-200 transition-colors duration-300 relative">
                            {formatDate(tx.created_at)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTransaction(tx);
                                setIsModalOpen(true);
                              }}
                              className="bg-gradient-to-r from-blue-600/80 to-blue-600/80 hover:from-blue-500 hover:to-blue-500  px-3 py-1.5 text-sm rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                            >
                              Détails
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {loading && hasMore && (
                      <tr>
                        <td colSpan={6} className="py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
          </div> */}
          
        </div>
       {/* {loading && hasMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )} */}
           
      </div>

      {/* Enhanced Transaction Details Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-backdrop">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl w-full max-w-lg shadow-2xl border border-slate-600/50 modal-content max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative p-6 pb-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Détails de la transaction</h3>
                  <p className="text-slate-400 text-sm">Consultez les informations de votre transaction</p>
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
                    selectedTransaction.type_trans === 'deposit' 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20' 
                      : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                  }`}>
                    {getTransactionTypeIcon(selectedTransaction.type_trans)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-xl text-white">
                        {selectedTransaction.type_trans === 'deposit' ? 'Dépôt' : 'Retrait'}
                      </h4>
                      <StatusBadge status={selectedTransaction.status} />
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(selectedTransaction.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Amount Section */}
            <div className="px-6 py-4">
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/30">
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-2 font-medium">Montant de la transaction</div>
                  <div className={`text-4xl font-bold mb-2 ${
                    selectedTransaction.type_trans === 'deposit' 
                      ? 'text-green-400' 
                      : 'text-blue-400'
                  }`}>
                    {selectedTransaction.type_trans === 'deposit' ? '+' : '-'}
                    {formatAmount(selectedTransaction.amount)}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {selectedTransaction.type_trans === 'deposit' ? 'Reçu' : 'Envoyé'}
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
                      ID Transaction
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">{selectedTransaction.id}</span>
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
                      Référence
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">{selectedTransaction.reference}</span>
                      <button 
                        onClick={() => copyToClipboard(selectedTransaction.reference)}
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
                      Téléphone
                    </div>
                    <span className="text-white text-sm font-mono">{selectedTransaction.phone_number}</span>
                  </div>
                </div>
                
                {/* Network */}
                {selectedTransaction.network && (
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-slate-400 text-sm font-medium">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Réseau
                      </div>
                      <span className="text-white text-sm">{selectedTransaction.network.public_name || selectedTransaction.network.name}</span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {selectedTransaction.error_message && (
                  <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-xl p-4 border border-red-600/30">
                <p className="text-red-400 font-medium text-sm mb-2">{("Message d'erreur")}</p>
                    <p className="text-red-300 text-sm">
                      {selectedTransaction.error_message}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}