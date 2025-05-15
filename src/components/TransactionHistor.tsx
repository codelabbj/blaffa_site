// "use client";
// import { useState } from 'react';
// import { ArrowUpRight, ArrowDownLeft, Activity, RotateCw } from 'lucide-react';

// const TransactionHistory = () => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

//   const transactions = [
//     // Add your transaction data here
//   ];

//   const filteredTransactions = transactions.filter(transaction => {
//     if (activeTab === 'all') return true;
//     if (activeTab === 'deposits') return transaction.type === 'deposit';
//     if (activeTab === 'withdrawals') return transaction.type === 'withdrawal';
//     return true;
//   });

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 md:p-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
//         <div className="flex items-center gap-2 group">
//           <Activity size={18} className="text-orange-500" />
//           <h2 className="text-lg font-semibold">Transaction History</h2>
//           <RotateCw size={16} className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" />
//         </div>

//         <div className="flex gap-4 text-sm">
//           <button
//             className={`${activeTab === 'all' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Transactions
//           </button>
//           <button
//             className={`${activeTab === 'deposits' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
//             onClick={() => setActiveTab('deposits')}
//           >
//             Deposits
//           </button>
//           <button
//             className={`${activeTab === 'withdrawals' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
//             onClick={() => setActiveTab('withdrawals')}
//           >
//             Withdrawals
//           </button>
//         </div>
//       </div>

//       <div className="space-y-3">
//         {filteredTransactions.map((transaction) => (
//           <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
//             <div className="flex items-center gap-4">
//               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                 transaction.type === 'deposit' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
//               }`}>
//                 {transaction.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
//               </div>
//               <div>
//                 <p className="text-sm font-medium">{transaction.type}</p>
//                 <p className="text-xs text-gray-400">{transaction.date}</p>
//               </div>
//             </div>
//             <span className={`text-sm font-medium ${
//               transaction.status === 'pending' ? 'text-yellow-500' : 'text-green-500'
//             }`}>
//               {transaction.amount}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;







// import React, { useState, useEffect, useRef } from 'react';

// // Extend the WebSocket type to include custom properties
// interface CustomWebSocket extends WebSocket {
//   pingInterval?: NodeJS.Timeout;
// }

// // Define API response interfaces
// interface User {
//   id: string;
//   email: string;
//   first_name: string;
//   last_name: string;
// }

// interface App {
//   id: string;
//   name: string;
//   image: string;
//   public_name: string;
//   is_active: boolean;
// }

// interface Network {
//   id: number;
//   name: string;
//   public_name: string;
//   image: string;
//   country_code: string;
//   indication: string;
// }

// interface Transaction {
//   id: string;
//   amount: number;
//   reference: string;
//   type_trans: string;
//   status: string;
//   created_at: string;
//   phone_number: string;
//   app: App;
//   network: Network;
//   user: User;
//   user_app_id: string;
//   transaction_reference: string | null;
//   error_message: string | null;
//   net_payable_amout: number | null;
// }

// interface HistoricItem {
//   id: string;
//   user: string;
//   created_at: string;
//   transaction: Transaction;
// }

// interface ApiResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: HistoricItem[];
// }

// const TransactionHistory: React.FC = () => {
//   // Translation replacement
//   const t = (key: string) => {
//     const translations: Record<string, string> = {
//       'All': 'All',
//       'Deposits': 'Deposits',
//       'Withdrawals': 'Withdrawals',
//       'Transaction History': 'Transaction History',
//       'Refresh transactions': 'Refresh transactions',
//       'See more': 'See more',
//       'No transactions found': 'No transactions found',
//       'You must be logged in to receive real-time updates.': 'You must be logged in to receive real-time updates.',
//       'You must be logged in to view transactions.': 'You must be logged in to view transactions.',
//       'Failed to fetch transactions': 'Failed to fetch transactions',
//       'Close': 'Close',
//       'Transaction details': 'Transaction details',
//       'Payment Method': 'Payment Method',
//       'Status': 'Status',
//       'Reference': 'Reference',
//       'Phone Number': 'Phone Number',
//       'User App ID': 'User App ID',
//       'Transaction Date': 'Transaction Date',
//       'Error Message': 'Error Message',
//       'Copy': 'Copy',
//       'Deposit': 'Deposit',
//       'Withdrawal': 'Withdrawal'
//     };
//     return translations[key] || key;
//   };

//   const [transactions, setTransactions] = useState<HistoricItem[]>([]);
//   const [active, setActive] = useState('All');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [selectedTransaction, setSelectedTransaction] = useState<HistoricItem | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isNewTransaction, setIsNewTransaction] = useState<Record<string, boolean>>({});
//   const [wsHealth, setWsHealth] = useState({
//     lastMessageTime: 0,
//     messageCount: 0
//   });

//   const webSocketRef = useRef<CustomWebSocket | null>(null);
//   const webSocketReconnectAttempts = useRef<number>(0);
//   const transactionsMapRef = useRef<Map<string, HistoricItem>>(new Map());
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
//   const filters = [t('All'), t('Deposits'), t('Withdrawals')];

//   // Helper function to format date
//   const formatDate = (isoDate: string) => {
//     const date = new Date(isoDate);
//     return date.toLocaleDateString('en-US', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     }).replace(',', '');
//   };

//   // Generate a unique key for transactions
//   const getTransactionKey = (transaction: HistoricItem | Transaction): string => {
//     const id = transaction.id || 
//               ('transaction_id' in transaction ? transaction.transaction_id : undefined);
    
//     if (!id) {
//       console.error('Could not extract ID from transaction:', transaction);
//       return `unknown-${Math.random().toString(36).substring(2, 11)}`;
//     }
    
//     return id.toString();
//   };

//   //i want you to

//   // Helper functions for UI
//   const getTransactionTypeIcon = (type: string) => {
//     return type === 'deposit' ? (
//       <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-5-5 5-5M10 17l-5-5 5-5" />
//       </svg>
//     ) : (
//       <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 7l5 5-5 5" />
//       </svg>
//     );
//   };

//   const getStatusClass = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'failed':
//       case 'error': 
//         return 'text-red-600';
//       case 'pending':
//         return 'text-yellow-500';
//       case 'completed':
//       case 'success':
//         return 'text-green-600';
//       default:
//         return 'text-green-700';
//     }
//   };

//   const formatStatus = (status: string) => {
//     if (status.toLowerCase() === 'error') {
//       return 'Failed';
//     }
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   // Refresh and action icons
//   const RefreshIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//     </svg>
//   );

//   const ClipboardIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//     </svg>
//   );

//   const CloseIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//     </svg>
//   );

//   // WebSocket setup function (kept same as before)
//   const setupWebSocket = () => {
//     // ... (same implementation as in previous version)
//   };

//   // Fetch transactions from API
//   const fetchTransactions = async (pageNumber: number, activeFilter: string) => {
//     setLoading(true);
    
//     try {
//       // Simulate API call with fetch (replace with actual API endpoint)
//       const apiUrl = `https://api.example.com/transactions?page=${pageNumber}&filter=${activeFilter}`;
//       const token = localStorage.getItem('accessToken');
      
//       if (!token) {
//         setError(t('You must be logged in to view transactions.'));
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(apiUrl, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
        
//       if (!response.ok) {
//         throw new Error(t('Failed to fetch transactions'));
//       }
  
//       const data: ApiResponse = await response.json();
      
//       // Update transactions state
//       if (pageNumber === 1) {
//         setTransactions(data.results);
//       } else {
//         setTransactions(prev => [...prev, ...data.results]);
//       }
  
//       setHasMore(data.next !== null);
//       setError(null);
//     } catch (error: unknown) {
//       console.error('Error fetching transactions:', error);
//       setError(error instanceof Error ? error.message : t('Failed to fetch transactions'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial effects for fetching and WebSocket
//   useEffect(() => {
//     fetchTransactions(page, active);
//     setupWebSocket();

//     return () => {
//       // Cleanup WebSocket and other resources
//       if (webSocketRef.current) {
//         webSocketRef.current.close();
//       }
//     };
//   }, []);

//   // Handlers for interactions
//   const openTransactionDetails = (tx: HistoricItem) => {
//     setSelectedTransaction(tx);
//     setIsModalOpen(true);
//     document.body.style.overflow = 'hidden';
//   };

//   const closeTransactionDetails = () => {
//     setIsModalOpen(false);
//     document.body.style.overflow = 'auto';
//   };

//   const loadMoreTransactions = () => {
//     if (!loading && hasMore) {
//       setPage(prevPage => prevPage + 1);
//     }
//   };

//   const handleFilterChange = (filter: string) => {
//     setActive(filter);
//     setPage(1);
//   };

//   const refreshTransactions = () => {
//     setPage(1);
//     fetchTransactions(1, active);
//   };

//   return (
//     <div className="bg-white/10 dark:bg-gray-900/900 shadow-md rounded-2xl p-6 w-full overflow-hidden">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold flex items-center gap-1">
//           {t("Transaction History")}
//           <button
//             onClick={refreshTransactions}
//             className="ml-2"
//             title={t("Refresh transactions")}
//           >
//             <RefreshIcon />
//           </button>
//         </h2>
//       </div>

//       {/* Filters */}
//       <div className="flex justify-end items-center space-x-6 border-b mb-4 gap-3 md:gap-9 pb-2 overflow-x-auto">
//         {filters.map((filter) => (
//           <button
//             key={filter}
//             onClick={() => handleFilterChange(filter)}
//             className={`relative pb-2 text-sm md:text-base font-bold whitespace-nowrap ${
//               active === filter
//                 ? "text-green-600"
//                 : "dark:text-gray-100/00"
//             }`}
//           >
//             {`See ${filter}`}
//             <span
//               className={`ml-1 inline-block w-2 h-2 rounded-full ${
//                 active === filter ? "bg-green-600" : "bg-gray-400 opacity-50"
//               }`}
//             />
//             {active === filter && (
//               <span className="absolute left-0 bottom-0 w-full h-0.5 bg-green-600" />
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Loading State */}
//       {loading && page === 1 && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="text-center py-6 text-red-500">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && transactions.length === 0 && (
//         <div className="text-center py-10">
//           <p className="text-gray-500">{t("No transactions found")}</p>
//         </div>
//       )}

//       {/* Transactions List */}
//       <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 transition-all duration-300">
//         {transactions.map((item, index) => {
//           const tx = item.transaction;
//           const key = getTransactionKey(item);
//           const isNew = isNewTransaction[key];

//           return (
//             <div
//               key={`${key}-${index}`}
//               onClick={() => openTransactionDetails(item)}
//               className={`flex justify-between items-center border-b pb-4 hover:bg-gray-100 transition-all duration-300 rounded-md cursor-pointer p-3 ${
//                 isNew ? "bg-green-50 animate-pulse" : ""
//               }`}
//             >
//               {/* Transaction item content */}
//               <div className="flex items-center font-medium gap-3 md:gap-7">
//                 <div
//                   className={`rounded-md p-2 ${
//                     tx.type_trans === "deposit"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   {getTransactionTypeIcon(tx.type_trans)}
//                 </div>
//                 <div className="text-xs md:text-sm">
//                   {formatDate(tx.created_at)}
//                 </div>
//               </div>

//               <div className="hidden md:block flex-grow ml-4 font-bold">
//                 <p className="text-sm font-bold uppercase">
//                   {tx.type_trans === "deposit" ? t("Deposit") : t("Withdrawal")}{" "}
//                   || <span>{tx.reference}</span> ||{" "}
//                   <span className="text-sm font-semibold">XOF {tx.amount}</span>
//                 </p>
//               </div>

//               <div className="md:hidden flex-grow ml-2">
//                 <p className="text-xs font-bold">
//                   {tx.type_trans === "deposit" ? t("Deposit") : t("Withdrawal")}
//                 </p>
//                 <p className="text-xs">XOF {tx.amount}</p>
//               </div>

//               <div
//                 className={`text-xs md:text-sm font-bold ${getStatusClass(
//                   tx.status
//                 )}`}
//               >
//                 {formatStatus(tx.status)}
//               </div>
//             </div>
//           );
//         })}

//         {/* Loading more indicator */}
//         {loading && page > 1 && (
//           <div className="text-center py-4">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
//           </div>
//         )}
//       </div>

//       {/* See more button */}
//       {hasMore && !loading && (
//         <div className="flex justify-end pt-4">
//           <button
//             onClick={loadMoreTransactions}
//             className="flex items-center gap-1 text-sm font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
//           >
//             {t("See more")} →
//           </button>
//         </div>
//       )}

//       {/* Transaction Details Modal */}
//       {isModalOpen && selectedTransaction && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Backdrop with blur effect */}
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={closeTransactionDetails}
//           ></div>

//           {/* Modal content */}
//           <div className="bg-white text-black rounded-2xl w-full max-w-md z-10 overflow-hidden shadow-xl">
//             {/* Header */}
//             <div className="relative bg-gray-200 dark:bg-gray-700 p-6">
//               <button
//                 onClick={closeTransactionDetails}
//                 className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//               >
//                 <CloseIcon />
//               </button>

//               <div className="flex flex-col items-center">
//                 {selectedTransaction.transaction.app && (
//                   <div className="w-16 h-16 mb-4 rounded-full overflow-hidden bg-white flex items-center justify-center p-2">
//                     <img
//                       src={selectedTransaction.transaction.app.image}
//                       alt={selectedTransaction.transaction.app.name}
//                       className="max-w-full max-h-full object-contain"
//                     />
//                   </div>
//                 )}

//                 <div
//                   className={`rounded-full p-3 mb-2 ${
//                     selectedTransaction.transaction.type_trans === "deposit"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-300 text-gray-600"
//                   }`}
//                 >
//                   {getTransactionTypeIcon(
//                     selectedTransaction.transaction.type_trans
//                   )}
//                 </div>

//                 <h3 className="text-xl font-bold">
//                   XOF {selectedTransaction.transaction.amount}
//                 </h3>

//                 <div
//                   className={`mt-1 px-3 py-1 rounded-full text-sm font-medium ${
//                     selectedTransaction.transaction.status === "failed" ||
//                     selectedTransaction.transaction.status === "error"
//                       ? "bg-red-100 text-red-800"
//                       : selectedTransaction.transaction.status === "pending"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   {formatStatus(selectedTransaction.transaction.status)}
//                 </div>

//                 <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//                   {selectedTransaction.transaction.type_trans === "deposit"
//                     ? t("Deposit")
//                     : t("Withdrawal")}
//                   {selectedTransaction.transaction.app &&
//                     ` - ${selectedTransaction.transaction.app.public_name}`}
//                 </p>

//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   {formatDate(selectedTransaction.transaction.created_at)}
//                 </p>
//               </div>
//             </div>

//             {/* Transaction details */}
//             <div className="p-6 text-black ">
//               <h4 className="text-lg font-bold mb-4">
//                 {t("Transaction details")}
//               </h4>

//               <div className="space-y-4">
//                 {selectedTransaction.transaction.network && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-500">{t("Payment Method")}</span>
//                     <div className="flex items-center">
//                       <img
//                         src={selectedTransaction.transaction.network.image}
//                         alt={selectedTransaction.transaction.network.name}
//                         className="w-6 h-6 mr-2 object-contain"
//                       />
//                       <span className="font-medium">
//                         {selectedTransaction.transaction.network.public_name}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-between">
//                   <span className="text-gray-500">{t("Status")}</span>
//                   <span
//                     className={`font-medium ${getStatusClass(
//                       selectedTransaction.transaction.status
//                     )}`}
//                   >
//                     {formatStatus(selectedTransaction.transaction.status)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-500">{t("Reference")}</span>
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium">
//                       {selectedTransaction.transaction.reference}
//                     </span>
//                     <button
//                       onClick={() =>
//                         navigator.clipboard.writeText(
//                           selectedTransaction.transaction.reference
//                         )
//                       }
//                       className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//                       title={t("Copy")}
//                     >
//                       <ClipboardIcon />
//                     </button>
//                   </div>
//                 </div>

//                 {selectedTransaction.transaction.phone_number && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">{t("Phone Number")}</span>
//                     <span className="font-medium">
//                       {selectedTransaction.transaction.phone_number}
//                     </span>
//                   </div>
//                 )}

//                 {selectedTransaction.transaction.user_app_id && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">{t("User App ID")}</span>
//                     <span className="font-medium">
//                       {selectedTransaction.transaction.user_app_id}
//                     </span>
//                   </div>
//                 )}

//                 <div className="flex justify-between">
//                   <span className="text-gray-500">{t("Transaction Date")}</span>
//                   <span className="font-medium">
//                     {formatDate(selectedTransaction.transaction.created_at)}
//                   </span>
//                 </div>

//                 {selectedTransaction.transaction.error_message && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">{t("Error Message")}</span>
//                     <span className="font-medium text-red-500">
//                       {selectedTransaction.transaction.error_message}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer with action buttons */}
//             <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-3">
//               <button
//                 onClick={closeTransactionDetails}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition"
//               >
//                 {t("Close")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransactionHistory;





















































// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { ArrowDownLeft, ArrowUpRight, RotateCw, ChevronRight, X, ClipboardCopy } from 'lucide-react';

// // Define the App interface
// interface App {
//   id: string;
//   name: string;
//   image: string;
//   public_name: string;
//   is_active: boolean;
// }

// // Define API response interfaces
// /**
//  * @typedef {Object} User
//  * @property {string} id
//  * @property {string} email
//  * @property {string} first_name
//  * @property {string} last_name
//  */
// interface User {
//   id: string;
//   email: string;
//   first_name: string;
//   last_name: string;
// }

// /**
//  * @typedef {Object} App
//  * @property {string} id
//  * @property {string} name
//  * @property {string} image
//  * @property {string} public_name
//  * @property {boolean} is_active
//  */

// /**
//  * @typedef {Object} Network
//  * @property {number} id
//  * @property {string} name
//  * @property {string} public_name
//  * @property {string} image
//  * @property {string} country_code
//  * @property {string} indication
//  */
// interface Network {
//   id: number;
//   name: string;
//   public_name: string;
//   image: string;
//   country_code: string;
//   indication: string;
// }

// /**
//  * @typedef {Object} Network
//  * @property {number} id
//  * @property {string} name
//  * @property {string} public_name
//  * @property {string} image
//  * @property {string} country_code
//  * @property {string} indication
//  */

// interface Transaction {
//   id: string;
//   amount: number;
//   reference: string;
//   type_trans: string;
//   status: string;
//   created_at: string;
//   phone_number: string;
//   app: App;
//   network: Network;
//   user: User;
//   user_app_id: string;
//   transaction_reference: string | null;
//   error_message: string | null;
//   net_payable_amount: number | null;
// }

// // Define the HistoricItem type
// type HistoricItem = {
//   id: string;
//   user: string;
//   created_at: string;
//   transaction: Transaction;
// };

// /**
//  * @typedef {Object} ApiResponse
//  * @property {number} count
//  * @property {string|null} next
//  * @property {string|null} previous
//  * @property {HistoricItem[]} results
//  */

// export default function TransactionHistory() {
//   const [transactions, setTransactions] = useState<HistoricItem[]>([]);
//   const [activeTab, setActiveTab] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [selectedTransaction, setSelectedTransaction] = useState<HistoricItem | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);
//   const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
//   const [isNewTransaction, setIsNewTransaction] = useState<Record<string, boolean>>({});
//   const [wsStatus, setWsStatus] = useState('disconnected');
//   const webSocketRef = useRef<WebSocket | null>(null);
//   const wsHealth = useRef({
//     lastMessageTime: 0,
//     messageCount: 0
//   });
  
//   // WebSocket reference
//   const webSocketReconnectAttempts = useRef(0);
//   // Transactions map to track unique transactions
//   const transactionsMapRef = useRef(new Map());
//   // Reconnect timeout reference for WebSocket
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
//   // Format date from ISO string to readable format
//   const formatDate = (isoDate: string) => {
//     const date = new Date(isoDate);
//     return date.toLocaleDateString('en-US', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     }).replace(',', '');
//   };
  
//   // Build API URL based on filters and pagination
//   const getApiUrl = (pageNumber: number, activeFilter: string) => {
//     let apiUrl = `https://api.lamedcash.com/lamedcash/historic${pageNumber > 1 ? `?page=${pageNumber}` : ''}`;
    
//     if (activeFilter === 'deposits') {
//       apiUrl = `https://api.lamedcash.com/lamedcash/historic${pageNumber > 1 ? `?page=${pageNumber}&` : '?'}type=deposit`;
//     } else if (activeFilter === 'withdrawals') {
//       apiUrl = `https://api.lamedcash.com/lamedcash/historic${pageNumber > 1 ? `?page=${pageNumber}&` : '?'}type=withdrawal`;
//     }
    
//     return apiUrl;
//   };
  
//   // Create a function to generate a composite key for transactions
//   const getTransactionKey = (transaction: HistoricItem | Transaction) => {
//       // Check for different possible properties to handle various formats
//       const id = 'transaction' in transaction
//         ? transaction.transaction.id
//         : transaction.id;
      
//       if (!id) {
//         console.error('Could not extract ID from transaction:', transaction);
//         // Generate a fallback ID to prevent errors
//         return `unknown-${Math.random().toString(36).substring(2, 11)}`;
//       }
      
//       return id.toString();
//     };
  
//   // Setup WebSocket connection
//   const setupWebSocket = () => {
//     if (!isRealTimeEnabled) {
//       if (webSocketRef.current) {
//         webSocketRef.current.close();
//         webSocketRef.current = null;
//         setWsStatus('disconnected');
//       }
//       return;
//     }
    
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       console.error('No access token found for WebSocket connection');
//       setError('You must be logged in to receive real-time updates.');
//       setWsStatus('error');
//       return;
//     }
    
//     // Validate token format to avoid obvious connection errors
//     if (!token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
//       console.error('Invalid token format');
//       setError('Authentication error. Please try logging in again.');
//       setWsStatus('error');
//       return;
//     }
    
//     try {
//       // Close existing connection if any
//       if (webSocketRef.current) {
//         if (webSocketRef.current.pingInterval) {
//           clearInterval(webSocketRef.current.pingInterval); // Clear the ping interval
//         }
//         webSocketRef.current.close();
//       }
      
//       // Set a connection timeout
//       const connectionTimeoutId = setTimeout(() => {
//         console.error('WebSocket connection timeout');
//         if (webSocketRef.current && webSocketRef.current.readyState !== WebSocket.OPEN) {
//           webSocketRef.current.close();
//           setWsStatus('disconnected');
//           console.log('Connection timeout. Attempting to reconnect...');
//         }
//       }, 10000); // 10 seconds timeout
      
//       // Create new WebSocket connection
//       const wsUrl = `wss://api.lamedcash.com/ws/socket?token=${encodeURIComponent(token)}`;
//       console.log('Connecting to WebSocket:', wsUrl);
//       webSocketRef.current = new WebSocket(wsUrl);
      
//       webSocketRef.current.onopen = () => {
//         console.log('WebSocket connected successfully');
//         clearTimeout(connectionTimeoutId);
//         setWsStatus('connected');
//         setError(null);
        
//         // Set a ping interval to keep connection alive
//         webSocketRef.current.pingInterval = setInterval(() => {
//           if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
//             webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
//           }
//         }, 30000); // Send ping every 30 seconds
//       };
      
//       webSocketRef.current.onmessage = (event) => {
//         // Update health metrics
//         wsHealth.current = {
//           lastMessageTime: Date.now(),
//           messageCount: wsHealth.current.messageCount + 1
//         };
        
//         console.log('Raw WebSocket message received:', event.data);
//         try {
//           const data = JSON.parse(event.data);
//           console.log('Parsed WebSocket message:', data);
          
//           // Check if the data has a transaction property directly
//           const transaction = data.transaction || data;
          
//           // Handle different message types from WebSocket with fallback
//           if (data.type === 'transaction_update') {
//             handleTransactionUpdate(transaction);
//           } else if (data.type === 'new_transaction') {
//             handleNewTransaction(transaction);
//           } else if (data.type === 'pong') {
//             console.log('WebSocket connection is alive');
//           } else if (data.type === 'error') {
//             console.error('WebSocket server error:', data.message);
//             setError('Server error: ' + data.message);
//           } else if (transaction.id || transaction.transaction_id) {
//             // Fallback for messages without specific type but containing transaction data
//             console.log('Processing untyped transaction update:', transaction);
//             if (transactionsMapRef.current.has(getTransactionKey(transaction))) {
//               handleTransactionUpdate(transaction);
//             } else {
//               handleNewTransaction(transaction);
//             }
//           }
          
//           // Update last fetch time for real-time tracking
//           setLastFetchTime(new Date().toISOString());
//         } catch (error) {
//           console.error('Error processing WebSocket message:', error, event.data);
//         }
//       };
      
//       webSocketRef.current.onclose = (event) => {
//         console.log('WebSocket connection closed', event);
//         clearTimeout(connectionTimeoutId);
        
//         // Clear ping interval if exists
//         if (webSocketRef.current && webSocketRef.current.pingInterval) {
//           clearInterval(webSocketRef.current.pingInterval);
//         }
        
//         setWsStatus('disconnected');
        
//         // Provide more context about the closure
//         let reason = 'Connection closed';
//         if (event.code) {
//           // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
//           switch (event.code) {
//             case 1000:
//               reason = 'Normal closure';
//               break;
//             case 1001:
//               reason = 'Server going down or browser navigating away';
//               break;
//             case 1002:
//               reason = 'Protocol error';
//               break;
//             case 1003:
//               reason = 'Unsupported data';
//               break;
//             case 1006:
//               reason = 'Abnormal closure, possibly network issue';
//               break;
//             case 1008:
//               reason = 'Policy violation';
//               break;
//             case 1011:
//               reason = 'Server error';
//               break;
//             case 1012:
//               reason = 'Service restart';
//               break;
//             case 1013:
//               reason = 'Service unavailable temporarily';
//               break;
//             default:
//               reason = `Close code ${event.code}`;
//           }
//         }
        
//         console.log('WebSocket close reason:', reason);
        
//         // Attempt to reconnect after delay if real-time is still enabled
//         // Use exponential backoff for reconnection attempts
//         if (isRealTimeEnabled) {
//           const reconnectDelay = Math.min(30000, 1000 * Math.pow(2, webSocketReconnectAttempts.current));
//           console.log(`Reconnecting in ${reconnectDelay / 1000} seconds...`);
          
//           reconnectTimeoutRef.current = setTimeout(() => {
//             webSocketReconnectAttempts.current++;
//             setupWebSocket();
//           }, reconnectDelay);
//         }
//       };
      
//       webSocketRef.current.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         setWsStatus('error');
//       };
//     } catch (error) {
//       console.error('Failed to setup WebSocket:', error);
//       setWsStatus('error');
//       setError('Failed to establish real-time connection. Please try again.');
//     }
//   };
  
//   // Handle new transaction from WebSocket
//   const handleNewTransaction = (transaction: Transaction) => {
//     const key = getTransactionKey(transaction);
    
//     // Only add if it matches the current filter
//     if (shouldShowTransaction(transaction)) {
//       // Check if we already have this transaction
//       if (!transactionsMapRef.current.has(key)) {
//         // Mark as new for animation
//         setIsNewTransaction(prev => ({
//           ...prev,
//           [key]: true
//         }));
        
//         // Add to our map
//         transactionsMapRef.current.set(key, transaction);
        
//         // Add to state (at the beginning)
//         setTransactions(prev => [{ id: transaction.id, user: '', created_at: transaction.created_at, transaction }, ...prev]);
        
//         // Remove animation after 5 seconds
//         setTimeout(() => {
//           setIsNewTransaction(prev => {
//             const updated = { ...prev };
//             delete updated[key];
//             return updated;
//           });
//         }, 5000);
//       }
//     }
//   };
  
//   // Handle transaction updates from WebSocket
//   const handleTransactionUpdate = (updatedTransaction: Transaction) => {
//     const key = getTransactionKey(updatedTransaction);
    
//     console.log('Received update for transaction:', key, updatedTransaction);
//     console.log('Does this transaction exist in our map?', transactionsMapRef.current.has(key));
    
//     // Update the transaction in our map
//     transactionsMapRef.current.set(key, updatedTransaction);
    
//     // Update the transaction in our state
//     setTransactions(prev => 
//       prev.map(item => 
//         getTransactionKey(item) === key 
//           ? { ...item, transaction: updatedTransaction } 
//           : item
//       )
//     );
    
//     // Highlight the updated transaction
//     setIsNewTransaction(prev => ({
//       ...prev,
//       [key]: true
//     }));
    
//     // Remove highlight after 5 seconds
//     setTimeout(() => {
//       setIsNewTransaction(prev => {
//         const updated = { ...prev };
//         delete updated[key];
//         return updated;
//       });
//     }, 5000);
//   };
  
//   // Filter transactions based on current filter
//   const shouldShowTransaction = (item: HistoricItem | Transaction) => {
//       const transaction = 'transaction' in item ? item.transaction : item;
      
//       if (!transaction) return false;
      
//       if (activeTab === 'all') {
//         return true;
//       } else if (activeTab === 'deposits') {
//         return transaction.type_trans === 'deposit';
//       } else if (activeTab === 'withdrawals') {
//         return transaction.type_trans === 'withdrawal';
//       }
//       return true;
//     };
  
//   // Fetch initial transactions from API
//   const fetchTransactions = async (pageNumber: number, activeFilter: string) => {
//     setLoading(true);
    
//     try {
//       const apiUrl = getApiUrl(pageNumber, activeFilter);
//       console.log('Fetching transactions from:', apiUrl);
      
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         console.error('No access token found');
//         setError('You must be logged in to view transactions.');
//         setLoading(false);
//         return;
//       }
      
//       const response = await fetch(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error Data:', errorData);
//         throw new Error(errorData.message || 'Failed to fetch transactions');
//       }
      
//       const data = await response.json();
//       console.log('Fetched Transactions:', data);
      
//       // Update last fetch time
//       setLastFetchTime(new Date().toISOString());
      
//       // Process the fetched transactions
//       if (pageNumber === 1) {
//         // Reset the transactions map for first page
//         transactionsMapRef.current.clear();
        
//         // Add each transaction to the map
//         data.results.forEach((tx: HistoricItem) => {
//           const key = getTransactionKey(tx);
//           transactionsMapRef.current.set(key, tx);
//         });
        
//         setTransactions(data.results);
//       } else {
//         // For pagination, only add transactions that don't already exist
//         const newTransactions = data.results.filter((tx: HistoricItem) => {
//           const key = getTransactionKey(tx);
//           if (!transactionsMapRef.current.has(key)) {
//             transactionsMapRef.current.set(key, tx);
//             return true;
//           }
//           return false;
//         });
        
//         setTransactions(prev => [...prev, ...newTransactions]);
//       }
      
//       setHasMore(data.next !== null);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       if (error instanceof Error) {
//         setError(error.message || 'Failed to load transactions. Please try again.');
//       } else {
//         setError('Failed to load transactions. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Initial fetch and WebSocket setup
//   useEffect(() => {
//     fetchTransactions(page, activeTab);
    
//     // Setup WebSocket connection
//     setupWebSocket();
    
//     // Add health check interval for WebSocket
//     const healthCheckInterval = setInterval(() => {
//       const now = Date.now();
//       const minutesSinceLastMessage = (now - wsHealth.current.lastMessageTime) / (1000 * 60);
      
//       if (wsHealth.current.lastMessageTime > 0 && minutesSinceLastMessage > 5) {
//         console.warn('No WebSocket messages received in 5 minutes, reconnecting...');
//         setupWebSocket(); // Force reconnection
//       }
//     }, 60000); // Check every minute
    
//     // Cleanup function
//     return () => {
//       clearInterval(healthCheckInterval);
//       if (webSocketRef.current) {
//         // Clear ping interval if exists
//         if (webSocketRef.current.pingInterval) {
//           clearInterval(webSocketRef.current.pingInterval);
//         }
        
//         webSocketRef.current.close();
//         webSocketRef.current = null;
//       }
      
//       // Clear any pending reconnection timeouts
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, []);
  
//   // Verify WebSocket connection after initial setup
//   useEffect(() => {
//     // Verify connection after initial setup
//     const verifyConnectionTimeout = setTimeout(() => {
//       // If we haven't received any messages after 10 seconds of setup
//       if (wsHealth.current.messageCount === 0 && webSocketRef.current && 
//           webSocketRef.current.readyState === WebSocket.OPEN) {
//         console.log('Testing WebSocket connection with manual ping...');
//         try {
//           webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
//         } catch (error) {
//           console.error('Failed to send ping, reconnecting WebSocket:', error);
//           setupWebSocket();
//         }
//       }
//     }, 10000);
    
//     return () => clearTimeout(verifyConnectionTimeout);
//   }, []);
  
//   // Update WebSocket when real-time setting changes
//   useEffect(() => {
//     setupWebSocket();
//   }, [isRealTimeEnabled]);
  
//   // Fetch new data when filter changes
//   useEffect(() => {
//     if (page === 1) {
//       fetchTransactions(1, activeTab);
//     } else {
//       setPage(1); // This will trigger the fetch in the next effect
//     }
//   }, [activeTab]);
  
//   // Fetch data when page changes
//   useEffect(() => {
//     if (page > 1) {
//       fetchTransactions(page, activeTab);
//     }
//   }, [page]);
  
//   // Refresh transactions manually
//   const refreshTransactions = () => {
//     setPage(1);
//     fetchTransactions(1, activeTab);
//   };
  
//   // Toggle real-time updates
//   const toggleRealTimeUpdates = () => {
//     setIsRealTimeEnabled(prev => !prev);
//   };
  
//   // Open transaction details modal
//   const openTransactionDetails = (tx: HistoricItem) => {
//     setSelectedTransaction(tx);
//     setIsModalOpen(true);
//     document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
//   };
  
//   // Close transaction details modal
//   const closeTransactionDetails = () => {
//     setIsModalOpen(false);
//     document.body.style.overflow = 'auto'; // Restore scrolling
//   };
  
//   // Get transaction type icon
//   const getTransactionTypeIcon = (type: string) => {
//     return type === 'deposit' ? (
//       <ArrowDownLeft size={18} />
//     ) : (
//       <ArrowUpRight size={18} />
//     );
//   };

//   // Get formatted status with appropriate color
//   const getStatusClass = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'failed':
//       case 'error': 
//         return 'text-red-500';
//       case 'pending':
//         return 'text-amber-500';
//       case 'completed':
//       case 'success':
//         return 'text-green-500';
//       default:
//         return 'text-green-500';
//     }
//   };
  
//   const formatStatus = (status: string) => {
//     // Convert 'error' to 'failed' for display purposes
//     if (status.toLowerCase() === 'error') {
//       return 'Failed';
//     }
//     // Otherwise capitalize the first letter of the status
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };
  
//   // Load more transactions
//   const loadMoreTransactions = () => {
//     if (!loading && hasMore) {
//       setPage(prevPage => prevPage + 1);
//     }
//   };
  
//   // Filter tabs
//   const filters = [
//     { key: 'all', label: 'All' },
//     { key: 'deposits', label: 'Deposits' },
//     { key: 'withdrawals', label: 'Withdrawals' }
//   ];

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-gray-700/30 shadow-xl relative overflow-hidden">
//       {/* Background gradient effect */}
//       <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse-slow"></div>
      
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
//         <div className="flex items-center gap-2 group">
//           <h2 className="text-lg font-semibold group-hover:translate-x-1 transition-transform">Transaction history</h2>
//           <RotateCw 
//             size={16} 
//             className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors hover:rotate-180 duration-500"
//             onClick={refreshTransactions}
//           />
//         </div>
        
//         {/* Real-time indicator */}
//         <div className="hidden md:flex items-center gap-2">
//           <span className="text-xs flex items-center">
//             {isRealTimeEnabled ? (
//               <>
//                 <span className={`w-2 h-2 rounded-full inline-block mr-1 ${
//                   wsStatus === 'connected' ? 'bg-green-500' : 
//                   wsStatus === 'disconnected' ? 'bg-amber-500' : 'bg-red-500'
//                 }`}></span>
//                 {wsStatus === 'connected' ? 'Real-time ON' : 
//                  wsStatus === 'disconnected' ? 'Reconnecting...' : 'Connection error'}
//               </>
//             ) : (
//               <>Real-time OFF</>
//             )}
//           </span>
//           <button
//             onClick={toggleRealTimeUpdates}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               isRealTimeEnabled ? 'bg-green-600' : 'bg-gray-300'
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 isRealTimeEnabled ? 'translate-x-6' : 'translate-x-1'
//               }`}
//             />
//           </button>
//         </div>
        
//         {/* Filter tabs */}
//         <div className="hidden md:flex gap-4 text-sm">
//           {filters.map((filter) => (
//             <button 
//               key={filter.key}
//               className={`${activeTab === filter.key ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1`}
//               onClick={() => setActiveTab(filter.key)}
//             >
//               {`See ${filter.label}`}
//               <span className="text-xs text-gray-500">•</span>
//             </button>
//           ))}
//         </div>
        
//         {/* Mobile filter dropdown */}
//         <div className="md:hidden">
//           <select 
//             value={activeTab}
//             onChange={(e) => setActiveTab(e.target.value)}
//             className="w-full px-3 py-2 bg-gray-800 rounded-lg text-sm"
//           >
//             {filters.map((filter) => (
//               <option key={filter.key} value={filter.key}>
//                 {filter.label} Transactions
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
      
//       {/* Last update time */}
//       {lastFetchTime && (
//         <div className="text-xs mb-2 text-right text-gray-400">
//           Last updated: {formatDate(lastFetchTime)}
//         </div>
//       )}
      
//       {/* Loading State */}
//       {loading && page === 1 && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
//         </div>
//       )}
      
//       {/* Error State */}
//       {error && page === 1 && (
//         <div className="text-center py-6 text-red-500">
//           <p>{error}</p>
//         </div>
//       )}
      
//       {/* Empty State */}
//       {!loading && transactions.length === 0 && (
//         <div className="text-center py-10">
//           <p className="text-gray-500">No transactions found</p>
//         </div>
//       )}
      
//       {/* Transactions List */}
//       <div className="space-y-3">
//         {transactions.map((item, index) => {
//           const tx = (item as HistoricItem).transaction;
//           const key = getTransactionKey(item);
//           const isNew = isNewTransaction[key];
          
//           if (!tx) return null;
          
//           return (
//             <div 
//               key={`${key}-${index}`}
//               onClick={() => openTransactionDetails(item)}
//               className={`flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 rounded-lg bg-gray-100 hover:bg-gray-750 dark:bg-gray-800/50 dark:hover:bg-gray-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-orange-900/10 group cursor-pointer ${
//                 isNew ? 'animate-pulse border-l-4 border-orange-500' : ''
//               }`}
//               style={{ animationDelay: `${(index + 1) * 150}ms` }}
//             >
//               <div className="flex items-center gap-3 md:gap-4">
//                 <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
//                   tx.type_trans === 'deposit' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700/50 text-gray-300'
//                 } relative overflow-hidden group-hover:scale-110 transition-transform`}>
//                   {tx.type_trans === 'deposit' ? 
//                     <ArrowDownLeft size={18} className="group-hover:animate-bounce" /> : 
//                     <ArrowUpRight size={18} className="group-hover:animate-pulse" />
//                   }
//                   <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
//                 </div>
//                 <div className="group-hover:translate-x-1 transition-transform flex-1 truncate">
//                   <p className="text-xs md:text-sm font-medium uppercase">
//                     <span className="inline md:hidden">{tx.type_trans}</span>
//                     <span className="hidden md:inline">{tx.type_trans} || </span>
//                     <span className="group-hover:text-orange-400 transition-colors hidden md:inline">
//                       {tx.reference && tx.reference.substring(0, 20)}{tx.reference && tx.reference.length > 20 ? '...' : ''}
//                     </span>
//                     <span className="group-hover:text-orange-400 transition-colors inline md:hidden">
//                       {tx.reference && tx.reference.substring(0, 8)}...
//                     </span>
//                     <span className="ml-1">XOF {tx.amount}</span>
//                   </p>
//                   <p className="text-xs text-gray-400">{formatDate(tx.created_at)}</p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-end md:justify-center mt-2 md:mt-0">
//                 <span className={`text-xs md:text-sm font-medium ${getStatusClass(tx.status)} group-hover:scale-110 transition-transform relative`}>
//                   {formatStatus(tx.status)}
//                   <span className={`absolute -bottom-1 left-0 h-0.5 w-0 ${getStatusClass(tx.status)} group-hover:w-full transition-all duration-300`}></span>
//                 </span>
//               </div>
//             </div>
//           );
//         })}
        
//         {/* Loading more indicator */}
//         {loading && page > 1 && (
//           <div className="text-center py-4">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
//           </div>
//         )}
//       </div>
      
//       {/* See more button */}
//       {hasMore && !loading && (
//         <div className="flex justify-center md:justify-end mt-4 md:mt-6">
//           <button 
//             onClick={loadMoreTransactions}
//             className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
//           >
//             Load more <ChevronRight size={14} />
//           </button>
//         </div>
//       )}
      
//       {/* Transaction Details Modal */}
//       {isModalOpen && selectedTransaction && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeTransactionDetails}>
//           <div 
//             className="bg-gray-900 rounded-xl p-5 max-w-lg w-full shadow-2xl border border-gray-700 transform transition-all relative max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close button */}
//             <button 
//               onClick={closeTransactionDetails}
//               className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
//             >
//               <X size={18} />
//             </button>
            
//             {/* Modal content */}
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <h3 className="text-xl font-bold flex items-center gap-2">
//                   {getTransactionTypeIcon(selectedTransaction.transaction.type_trans)}
//                   <span className="capitalize">{selectedTransaction.transaction.type_trans}</span>
//                   <span className={`text-sm ${getStatusClass(selectedTransaction.transaction.status)}`}>
//                     • {formatStatus(selectedTransaction.transaction.status)}
//                   </span>
//                 </h3>
//                 <p className="text-2xl font-semibold text-orange-500">
//                   XOF {selectedTransaction.transaction.amount.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   {formatDate(selectedTransaction.transaction.created_at)}
//                 </p>
//               </div>
              
//               {/* Transaction details */}
//               <div className="space-y-3 mt-4">
//                 {/* Reference */}
//                 <div className="flex justify-between items-center group bg-gray-800/50 rounded-lg p-3">
//                   <div>
//                     <p className="text-xs text-gray-400">Reference</p>
//                     <p className="text-sm font-medium text-white/90 break-all">
//                       {selectedTransaction.transaction.reference}
//                     </p>
//                   </div>
//                   <button 
//                     onClick={() => {
//                       navigator.clipboard.writeText(selectedTransaction.transaction.reference);
//                       // Show toast or notification here
//                     }}
//                     className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
//                   >
//                     <ClipboardCopy size={16} />
//                   </button>
//                 </div>
                
//                 {/* Phone Number */}
//                 {selectedTransaction.transaction.phone_number && (
//                   <div className="bg-gray-800/50 rounded-lg p-3">
//                     <p className="text-xs text-gray-400">Phone Number</p>
//                     <p className="text-sm font-medium text-white/90">
//                       {selectedTransaction.transaction.phone_number}
//                     </p>
//                   </div>
//                 )}
                
//                 {/* Network Info */}
//                 {selectedTransaction.transaction.network && (
//                   <div className="bg-gray-800/50 rounded-lg p-3">
//                     <p className="text-xs text-gray-400">Network</p>
//                     <div className="flex items-center gap-2">
//                       {selectedTransaction.transaction.network.image && (
//                         <img 
//                           src={selectedTransaction.transaction.network.image} 
//                           alt={selectedTransaction.transaction.network.name}
//                           className="w-5 h-5 rounded-full"
//                         />
//                       )}
//                       <p className="text-sm font-medium text-white/90">
//                         {selectedTransaction.transaction.network.public_name || selectedTransaction.transaction.network.name}
//                       </p>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* App Info */}
//                 {selectedTransaction.transaction.app && (
//                   <div className="bg-gray-800/50 rounded-lg p-3">
//                     <p className="text-xs text-gray-400">App</p>
//                     <div className="flex items-center gap-2">
//                       {selectedTransaction.transaction.app.image && (
//                         <img 
//                           src={selectedTransaction.transaction.app.image} 
//                           alt={selectedTransaction.transaction.app.name}
//                           className="w-5 h-5 rounded-full"
//                         />
//                       )}
//                       <p className="text-sm font-medium text-white/90">
//                         {selectedTransaction.transaction.app.public_name || selectedTransaction.transaction.app.name}
//                       </p>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Transaction Reference (if available) */}
//                 {selectedTransaction.transaction.transaction_reference && (
//                   <div className="flex justify-between items-center group bg-gray-800/50 rounded-lg p-3">
//                     <div>
//                       <p className="text-xs text-gray-400">Transaction Reference</p>
//                       <p className="text-sm font-medium text-white/90 break-all">
//                         {selectedTransaction.transaction.transaction_reference}
//                       </p>
//                     </div>
//                     <button 
//                       onClick={() => {
//                         if (selectedTransaction.transaction.transaction_reference) {
//                           navigator.clipboard.writeText(selectedTransaction.transaction.transaction_reference);
//                         }
//                         // Show toast or notification here
//                       }}
//                       className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
//                     >
//                       <ClipboardCopy size={16} />
//                     </button>
//                   </div>
//                 )}
                
//                 {/* Error Message (if failed) */}
//                 {selectedTransaction.transaction.error_message && (
//                   <div className="bg-red-900/20 border border-red-900 rounded-lg p-3">
//                     <p className="text-xs text-red-400">Error Message</p>
//                     <p className="text-sm font-medium text-red-300">
//                       {selectedTransaction.transaction.error_message}
//                     </p>
//                   </div>
//                 )}
                
//                 {/* Net Payable Amount (if available) */}
//                 {selectedTransaction.transaction.net_payable_amount !== null && (
//                   <div className="bg-gray-800/50 rounded-lg p-3">
//                     <p className="text-xs text-gray-400">Net Payable Amount</p>
//                     <p className="text-sm font-medium text-white/90">
//                       XOF {selectedTransaction.transaction.net_payable_amount.toLocaleString()}
//                     </p>
//                   </div>
//                 )}
                
//                 {/* User Info */}
//                 {selectedTransaction.transaction.user && (
//                   <div className="bg-gray-800/50 rounded-lg p-3">
//                     <p className="text-xs text-gray-400">User</p>
//                     <p className="text-sm font-medium text-white/90">
//                       {selectedTransaction.transaction.user.first_name} {selectedTransaction.transaction.user.last_name}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       {selectedTransaction.transaction.user.email}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






























// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { ArrowDownLeft, ArrowUpRight, RotateCw, ChevronRight, X, ClipboardCopy, Activity, Menu } from 'lucide-react';
// import Footer from '../components/footer';
// import { useTranslation } from 'react-i18next';
// import { useTheme } from './ThemeProvider';
// // Define the App interface
// interface App {
//   id: string;
//   name: string;
//   image: string;
//   public_name: string;
//   is_active: boolean;
// }

// // Define API response interfaces
// /**
//  * @typedef {Object} User
//  * @property {string} id
//  * @property {string} email
//  * @property {string} first_name
//  * @property {string} last_name
//  */
// interface User {
//   id: string;
//   email: string;
//   first_name: string;
//   last_name: string;
// }

// /**
//  * @typedef {Object} App
//  * @property {string} id
//  * @property {string} name
//  * @property {string} image
//  * @property {string} public_name
//  * @property {boolean} is_active
//  */

// /**
//  * @typedef {Object} Network
//  * @property {number} id
//  * @property {string} name
//  * @property {string} public_name
//  * @property {string} image
//  * @property {string} country_code
//  * @property {string} indication
//  */
// interface Network {
//   id: number;
//   name: string;
//   public_name: string;
//   image: string;
//   country_code: string;
//   indication: string;
// }

// /**
//  * @typedef {Object} Network
//  * @property {number} id
//  * @property {string} name
//  * @property {string} public_name
//  * @property {string} image
//  * @property {string} country_code
//  * @property {string} indication
//  */

// interface Transaction {
//   id: string;
//   amount: number;
//   reference: string;
//   type_trans: string;
//   status: string;
//   created_at: string;
//   phone_number: string;
//   app: App;
//   network: Network;
//   user: User;
//   user_app_id: string;
//   transaction_reference: string | null;
//   error_message: string | null;
//   net_payable_amount: number | null;
// }

// // Define the HistoricItem type
// type HistoricItem = {
//   id: string;
//   user: string;
//   created_at: string;
//   transaction: Transaction;
// };

// /**
//  * @typedef {Object} ApiResponse
//  * @property {number} count
//  * @property {string|null} next
//  * @property {string|null} previous
//  * @property {HistoricItem[]} results
//  */

// export default function TransactionHistory() {
//   const [transactions, setTransactions] = useState<HistoricItem[]>([]);
//   const [activeTab, setActiveTab] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [selectedTransaction, setSelectedTransaction] = useState<HistoricItem | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);
//   const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
//   const [isNewTransaction, setIsNewTransaction] = useState<Record<string, boolean>>({});
//   const [wsStatus, setWsStatus] = useState('disconnected');
//   // const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
//   const [animateHeader, setAnimateHeader] = useState(false);
//   const {t} = useTranslation();
//   const { theme } = useTheme();
  
//   interface CustomWebSocket extends WebSocket {
//     pingInterval?: NodeJS.Timeout | null;
//   }
  
//   const webSocketRef = useRef<CustomWebSocket | null>(null);
//   const wsHealth = useRef({
//     lastMessageTime: 0,
//     messageCount: 0
//   });
  
//   // WebSocket reference
//   const webSocketReconnectAttempts = useRef(0);
//   // Transactions map to track unique transactions
//   const transactionsMapRef = useRef(new Map());
//   // Reconnect timeout reference for WebSocket
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
//   // Example transactions to show when there are no actual transactions
//   const exampleTransactions: HistoricItem[] = [
//     { 
//       id: 'B11E199C-4D2C-4DAA-8024-25C363C21D49', 
//       user: 'example-user',
//       created_at: '2025-04-27T16:45:00.000Z',
//       transaction: {
//         id: 'B11E199C-4D2C-4DAA-8024-25C363C21D49',
//         amount: 200,
//         reference: 'B11E199C-4D2C-4DAA-8024-25C363C21D49',
//         type_trans: 'deposit',
//         status: 'pending',
//         created_at: '2025-04-27T16:45:00.000Z',
//         phone_number: '+22961234567',
//         app: { id: '1', name: 'Yapson', image: '', public_name: 'Yapson', is_active: true },
//         network: { id: 1, name: 'MTN', public_name: 'MTN', image: '', country_code: 'BJ', indication: '' },
//         user: { id: '1', email: 'user@example.com', first_name: 'John', last_name: 'Doe' },
//         user_app_id: '1',
//         transaction_reference: null,
//         error_message: null,
//         net_payable_amount: 200
//       }
//     },
//     { 
//       id: 'ZTAY745595714',
//       user: 'example-user',
//       created_at: '2025-04-25T16:41:00.000Z',
//       transaction: {
//         id: 'ZTAY745595714',
//         amount: 300,
//         reference: 'ZTAY745595714',
//         type_trans: 'withdrawal',
//         status: 'pending',
//         created_at: '2025-04-25T16:41:00.000Z',
//         phone_number: '+22961234567',
//         app: { id: '1', name: 'Yapson', image: '', public_name: 'Yapson', is_active: true },
//         network: { id: 1, name: 'MTN', public_name: 'MTN', image: '', country_code: 'BJ', indication: '' },
//         user: { id: '1', email: 'user@example.com', first_name: 'John', last_name: 'Doe' },
//         user_app_id: '1',
//         transaction_reference: null,
//         error_message: null,
//         net_payable_amount: 300
//       }
//     },
//     { 
//       id: 'HZRM745595557',
//       user: 'example-user',
//       created_at: '2025-04-25T16:39:00.000Z',
//       transaction: {
//         id: 'HZRM745595557',
//         amount: 450,
//         reference: 'HZRM745595557',
//         type_trans: 'withdrawal',
//         status: 'pending',
//         created_at: '2025-04-25T16:39:00.000Z',
//         phone_number: '+22961234567',
//         app: { id: '1', name: 'Yapson', image: '', public_name: 'Yapson', is_active: true },
//         network: { id: 1, name: 'MTN', public_name: 'MTN', image: '', country_code: 'BJ', indication: '' },
//         user: { id: '1', email: 'user@example.com', first_name: 'John', last_name: 'Doe' },
//         user_app_id: '1',
//         transaction_reference: null,
//         error_message: null,
//         net_payable_amount: 450
//       }
//     },
//     { 
//       id: '6E76C4FA-10FF-4D3F-BBD6-B9D723294B3F',
//       user: 'example-user',
//       created_at: '2025-04-25T15:35:00.000Z',
//       transaction: {
//         id: '6E76C4FA-10FF-4D3F-BBD6-B9D723294B3F',
//         amount: 200,
//         reference: '6E76C4FA-10FF-4D3F-BBD6-B9D723294B3F',
//         type_trans: 'deposit',
//         status: 'pending',
//         created_at: '2025-04-25T15:35:00.000Z',
//         phone_number: '+22961234567',
//         app: { id: '1', name: 'Yapson', image: '', public_name: 'Yapson', is_active: true },
//         network: { id: 1, name: 'MTN', public_name: 'MTN', image: '', country_code: 'BJ', indication: '' },
//         user: { id: '1', email: 'user@example.com', first_name: 'John', last_name: 'Doe' },
//         user_app_id: '1',
//         transaction_reference: null,
//         error_message: null,
//         net_payable_amount: 200
//       }
//     },
//     { 
//       id: 'WINS745582036',
//       user: 'example-user',
//       created_at: '2025-04-25T12:53:00.000Z',
//       transaction: {
//         id: 'WINS745582036',
//         amount: 200,
//         reference: 'WINS745582036',
//         type_trans: 'deposit',
//         status: 'pending',
//         created_at: '2025-04-25T12:53:00.000Z',
//         phone_number: '+22961234567',
//         app: { id: '1', name: 'Yapson', image: '', public_name: 'Yapson', is_active: true },
//         network: { id: 1, name: 'MTN', public_name: 'MTN', image: '', country_code: 'BJ', indication: '' },
//         user: { id: '1', email: 'user@example.com', first_name: 'John', last_name: 'Doe' },
//         user_app_id: '1',
//         transaction_reference: null,
//         error_message: null,
//         net_payable_amount: 200
//       }
//     }
//   ];
  
//   // Format date from ISO string to readable format
//   const formatDate = (isoDate: string) => {
//     const date = new Date(isoDate);
//     return date.toLocaleDateString('en-US', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     }).replace(',', '');
//   };
  
//   // Build API URL based on filters and pagination
//   const getApiUrl = (pageNumber: number, activeFilter: string) => {
//     let apiUrl = `https://api.yapson.net/yapson/historic${pageNumber > 1 ? `?page=${pageNumber}` : ''}`;
    
//     if (activeFilter === 'deposits') {
//       apiUrl = `https://api.yapson.net/yapson/historic${pageNumber > 1 ? `?page=${pageNumber}&` : '?'}type=deposit`;
//     } else if (activeFilter === 'withdrawals') {
//       apiUrl = `https://api.yapson.net/yapson/historic${pageNumber > 1 ? `?page=${pageNumber}&` : '?'}type=withdrawal`;
//     }
    
//     return apiUrl;
//   };
  
//   // Create a function to generate a composite key for transactions
//   const getTransactionKey = (transaction: HistoricItem | Transaction) => {
//     // Check for different possible properties to handle various formats
//     const id = 'transaction' in transaction
//       ? transaction.transaction.id
//       : transaction.id;
    
//     if (!id) {
//       console.error('Could not extract ID from transaction:', transaction);
//       // Generate a fallback ID to prevent errors
//       return `unknown-${Math.random().toString(36).substring(2, 11)}`;
//     }
    
//     return id.toString();
//   };
  
//   // Toggle mobile filter dropdown
//   // const toggleMobileFilter = () => {
//   //   setMobileFilterOpen(!mobileFilterOpen);
//   // };


//   // Add this function to cycle through filter options
// const cycleMobileFilter = () => {
//   if (activeTab === 'all') {
//     handleTabChange('deposits');
//   } else if (activeTab === 'deposits') {
//     handleTabChange('withdrawals');
//   } else {
//     handleTabChange('all');
//   }
// };
  
//   // Setup WebSocket connection


//   // Update the setupWebSocket function with better error handling and fallback
// const setupWebSocket = () => {
//   if (!isRealTimeEnabled) {
//     cleanupWebSocket();
//     return;
//   }

//   const token = localStorage.getItem('access');
//   if (!token) {
//     setError('Authentication required for real-time updates');
//     setWsStatus('error');
//     return;
//   }

//   // Clean up existing connection
//   cleanupWebSocket();

//   try {
//     const wsUrl = `wss://api.yapson.net/ws/socket?token=${encodeURIComponent(token)}`;
//     webSocketRef.current = new WebSocket(wsUrl);

//     // Set connection timeout
//     const connectionTimeout = setTimeout(() => {
//       if (webSocketRef.current?.readyState !== WebSocket.OPEN) {
//         handleConnectionFailure('Connection timeout');
//       }
//     }, 5000);

//     webSocketRef.current.onopen = () => {
//       clearTimeout(connectionTimeout);
//       console.log('WebSocket connected successfully');
//       setWsStatus('connected');
//       setError(null);
//       webSocketReconnectAttempts.current = 0;
//       startPingInterval();
//     };

//     webSocketRef.current.onclose = (event) => {
//       clearTimeout(connectionTimeout);
//       handleWebSocketClose(event);
//     };

//     webSocketRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       handleConnectionFailure('Connection failed');
//     };

//     webSocketRef.current.onmessage = handleWebSocketMessage;

//   } catch (error) {
//     console.error('WebSocket setup failed:', error);
//     setError(error instanceof Error ? error.message : 'Failed to establish connection');
//     setWsStatus('error');
//     handleConnectionFailure('Failed to initialize WebSocket');
  
//   }
// };

// // Add these helper functions
// const cleanupWebSocket = () => {
//   if (webSocketRef.current) {
//     webSocketRef.current.close();
//     webSocketRef.current = null;
//   }
//   if (reconnectTimeoutRef.current) {
//     clearTimeout(reconnectTimeoutRef.current);
//   }
//   setWsStatus('disconnected');
// };

// const startPingInterval = () => {
//   const pingInterval = setInterval(() => {
//     if (webSocketRef.current?.readyState === WebSocket.OPEN) {
//       try {
//         webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
//       } catch (error) {
//         console.error('Failed to send ping:', error);
//         cleanupWebSocket();
//         setupWebSocket();
//       }
//     } else {
//       clearInterval(pingInterval);
//     }
//   }, 30000);

//   // Store the interval ID for cleanup
//   if (webSocketRef.current) {
//     webSocketRef.current.pingInterval = pingInterval;
//   }
// };

// const handleConnectionFailure = (message: string) => {
//   console.error(message);
//   setWsStatus('error');
//   setError(message);
  
//   // Implement exponential backoff
//   const backoffDelay = Math.min(1000 * Math.pow(2, webSocketReconnectAttempts.current), 30000);
//   webSocketReconnectAttempts.current++;

//   reconnectTimeoutRef.current = setTimeout(() => {
//     if (isRealTimeEnabled) {
//       setupWebSocket();
//     }
//   }, backoffDelay);
// };

// const handleWebSocketMessage = (event: MessageEvent) => {
//   try {
//     const data = JSON.parse(event.data);
//     wsHealth.current = {
//       lastMessageTime: Date.now(),
//       messageCount: wsHealth.current.messageCount + 1
//     };

//     switch (data.type) {
//       case 'transaction_update':
//         handleTransactionUpdate(data.transaction);
//         break;
//       case 'new_transaction':
//         handleNewTransaction(data.transaction);
//         break;
//       case 'pong':
//         console.log('Received pong from server');
//         break;
//       case 'error':
//         console.error('Server error:', data.message);
//         setError(data.message);
//         break;
//       default:
//         if (data.transaction) {
//           const existingTransaction = transactionsMapRef.current.has(getTransactionKey(data.transaction));
//           if (existingTransaction) {
//             handleTransactionUpdate(data.transaction);
//           } else {
//             handleNewTransaction(data.transaction);
//           }
//         }
//     }

//     setLastFetchTime(new Date().toISOString());
//   } catch (error) {
//     console.error('Error processing message:', error);
//   }
// };

// const handleWebSocketClose = (event: CloseEvent) => {
//   cleanupWebSocket();
  
//   const reason = getCloseReason(event.code);
//   console.log(`WebSocket closed: ${reason}`);

//   if (isRealTimeEnabled && event.code !== 1000) {
//     handleConnectionFailure(reason);
//   }
// };

// const getCloseReason = (code: number): string => {
//   const closeReasons: Record<number, string> = {
//     1000: 'Normal closure',
//     1001: 'Going away',
//     1002: 'Protocol error',
//     1003: 'Unsupported data',
//     1005: 'No status received',
//     1006: 'Abnormal closure',
//     1007: 'Invalid frame payload data',
//     1008: 'Policy violation',
//     1009: 'Message too big',
//     1010: 'Mandatory extension',
//     1011: 'Internal server error',
//     1012: 'Service restart',
//     1013: 'Try again later',
//     1014: 'Bad gateway',
//     1015: 'TLS handshake'
//   };

//   return closeReasons[code] || `Unknown reason (${code})`;
// };

//   // const setupWebSocket = () => {
//   //   if (!isRealTimeEnabled) {
//   //     if (webSocketRef.current) {
//   //       webSocketRef.current.close();
//   //       webSocketRef.current = null;
//   //       setWsStatus('disconnected');
//   //     }
//   //     return;
//   //   }
    
//   //   const token = localStorage.getItem('access');
//   //   if (!token) {
//   //     console.error('No access token found for WebSocket connection');
//   //     setError('You must be logged in to receive real-time updates.');
//   //     setWsStatus('error');
//   //     return;
//   //   }
    
//   //   // Validate token format to avoid obvious connection errors
//   //   if (!token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
//   //     console.error('Invalid token format');
//   //     setError('Authentication error. Please try logging in again.');
//   //     setWsStatus('error');
//   //     return;
//   //   }
    
//   //   try {
//   //     // Close existing connection if any
//   //     if (webSocketRef.current) {
//   //       if (webSocketRef.current.pingInterval) {
//   //         clearInterval(webSocketRef.current.pingInterval); // Clear the ping interval
//   //       }
//   //       webSocketRef.current.close();
//   //     }
      
//   //     // Set a connection timeout
//   //     const connectionTimeoutId = setTimeout(() => {
//   //       console.error('WebSocket connection timeout');
//   //       if (webSocketRef.current && webSocketRef.current.readyState !== WebSocket.OPEN) {
//   //         webSocketRef.current.close();
//   //         setWsStatus('disconnected');
//   //         console.log('Connection timeout. Attempting to reconnect...');
//   //         // Attempt reconnection immediately after timeout
//   //         if (isRealTimeEnabled) {
//   //           setupWebSocket();
//   //         }
//   //       }
//   //     }, 10000); // 10 seconds timeout
      
//   //     // Create new WebSocket connection
//   //     const wsUrl = `wss://api.yapson.net/ws/socket?token=${encodeURIComponent(token)}`;
//   //     console.log('Connecting to WebSocket:', wsUrl);
//   //     webSocketRef.current = new WebSocket(wsUrl);
      
//   //     // Add pingInterval property to WebSocket
//   //     webSocketRef.current.pingInterval = null;
      
//   //     webSocketRef.current.onopen = () => {
//   //       console.log('WebSocket connected successfully');
//   //       clearTimeout(connectionTimeoutId);
//   //       setWsStatus('connected');
//   //       setError(null);
//   //       webSocketReconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
        
//   //       // Set a ping interval to keep connection alive
//   //       if (webSocketRef.current) {
//   //         webSocketRef.current.pingInterval = setInterval(() => {
//   //         if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
//   //           try {
//   //             webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
//   //             console.log('Ping sent to WebSocket server');
//   //           } catch (error) {
//   //             console.error('Failed to send ping:', error);
//   //             // If ping fails, attempt to reconnect
//   //             if (webSocketRef.current.pingInterval) {
//   //               clearInterval(webSocketRef.current.pingInterval);
//   //             }
//   //             setupWebSocket();
//   //           }
//   //         }
//   //       }, 30000); // Send ping every 30 seconds
//   //       }
//   //        // Send ping every 30 seconds
//   //     };
      
//   //     webSocketRef.current.onmessage = (event) => {
//   //       // Update health metrics
//   //       wsHealth.current = {
//   //         lastMessageTime: Date.now(),
//   //         messageCount: wsHealth.current.messageCount + 1
//   //       };
        
//   //       console.log('Raw WebSocket message received:', event.data);
//   //       try {
//   //         const data = JSON.parse(event.data);
//   //         console.log('Parsed WebSocket message:', data);
          
//   //         // Check if the data has a transaction property directly
//   //         const transaction = data.transaction || data;
          
//   //         // Handle different message types from WebSocket with fallback
//   //         if (data.type === 'transaction_update') {
//   //           handleTransactionUpdate(transaction);
//   //         } else if (data.type === 'new_transaction') {
//   //           handleNewTransaction(transaction);
//   //         } else if (data.type === 'pong') {
//   //           console.log('WebSocket connection is alive');
//   //         } else if (data.type === 'error') {
//   //           console.error('WebSocket server error:', data.message);
//   //           setError('Server error: ' + data.message);
//   //         } else if (transaction.id || transaction.transaction_id) {
//   //           // Fallback for messages without specific type but containing transaction data
//   //           console.log('Processing untyped transaction update:', transaction);
//   //           if (transactionsMapRef.current.has(getTransactionKey(transaction))) {
//   //             handleTransactionUpdate(transaction);
//   //           } else {
//   //             handleNewTransaction(transaction);
//   //           }
//   //         }
          
//   //         // Update last fetch time for real-time tracking
//   //         setLastFetchTime(new Date().toISOString());
//   //       } catch (error) {
//   //         console.error('Error processing WebSocket message:', error, event.data);
//   //       }
//   //     };
      
//   //     webSocketRef.current.onclose = (event) => {
//   //       console.log('WebSocket connection closed', event);
//   //       clearTimeout(connectionTimeoutId);
        
//   //       // Clear ping interval if exists
//   //       if (webSocketRef.current && webSocketRef.current.pingInterval) {
//   //         clearInterval(webSocketRef.current.pingInterval);
//   //       }
        
//   //       setWsStatus('disconnected');
        
//   //       // Provide more context about the closure
//   //       let reason = 'Connection closed';
//   //       if (event.code) {
//   //         // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
//   //         switch (event.code) {
//   //           case 1000:
//   //             reason = 'Normal closure';
//   //             break;
//   //           case 1001:
//   //             reason = 'Server going down or browser navigating away';
//   //             break;
//   //           case 1002:
//   //             reason = 'Protocol error';
//   //             break;
//   //           case 1003:
//   //             reason = 'Unsupported data';
//   //             break;
//   //           case 1006:
//   //             reason = 'Abnormal closure, possibly network issue';
//   //             break;
//   //           case 1008:
//   //             reason = 'Policy violation';
//   //             break;
//   //           case 1011:
//   //             reason = 'Server error';
//   //             break;
//   //           case 1012:
//   //             reason = 'Service restart';
//   //             break;
//   //           case 1013:
//   //             reason = 'Service unavailable temporarily';
//   //             break;
//   //           default:
//   //             reason = `Close code ${event.code}`;
//   //         }
//   //       }
        
//   //       console.log('WebSocket close reason:', reason);
        
//   //       // Attempt to reconnect after delay if real-time is still enabled
//   //       // Use exponential backoff for reconnection attempts
//   //       if (isRealTimeEnabled) {
//   //         const reconnectDelay = Math.min(30000, 1000 * Math.pow(2, webSocketReconnectAttempts.current));
//   //         console.log(`Reconnecting in ${reconnectDelay / 1000} seconds...`);
          
//   //         reconnectTimeoutRef.current = setTimeout(() => {
//   //           webSocketReconnectAttempts.current++;
//   //           setupWebSocket();
//   //         }, reconnectDelay);
//   //       }
//   //     };
      
//   //     webSocketRef.current.onerror = (error) => {
//   //       console.error('WebSocket error:', error);
//   //       setWsStatus('error');
        
//   //       // Close the connection on error to trigger the onclose handler for reconnection
//   //       if (webSocketRef.current) {
//   //         webSocketRef.current.close();
//   //       }
//   //     };
//   //   } catch (error) {
//   //     console.error('Failed to setup WebSocket:', error);
//   //     setWsStatus('error');
//   //     setError('Failed to establish real-time connection. Please try again.');
//   //     console.log('Error setting up WebSocket:', wsStatus);
      
//   //     // Attempt to reconnect after a short delay
//   //     if (isRealTimeEnabled) {
//   //       setTimeout(() => {
//   //         setupWebSocket();
//   //       }, 5000);
//   //     }
//   //   }
//   // };
  
//   // Handle new transaction from WebSocket
//   const handleNewTransaction = (transaction: Transaction) => {
//     const key = getTransactionKey(transaction);
    
//     // Only add if it matches the current filter
//     if (shouldShowTransaction(transaction)) {
//       // Check if we already have this transaction
//       if (!transactionsMapRef.current.has(key)) {
//         // Mark as new for animation
//         setIsNewTransaction(prev => ({
//           ...prev,
//           [key]: true
//         }));
        
//         // Create a proper HistoricItem
//         const historicItem: HistoricItem = {
//           id: transaction.id,
//           user: transaction.user?.id || '',
//           created_at: transaction.created_at,
//           transaction: transaction
//         };
        
//         // Add to our map
//         transactionsMapRef.current.set(key, historicItem);
        
//         // Add to state (at the beginning)
//         setTransactions(prev => [historicItem, ...prev]);
        
//         // Remove animation after 5 seconds
//         setTimeout(() => {
//           setIsNewTransaction(prev => {
//             const updated = { ...prev };
//             delete updated[key];
//             return updated;
//           });
//         }, 5000);
//       }
//     }
//   };
  
//   // Handle transaction updates from WebSocket
//   const handleTransactionUpdate = (updatedTransaction: Transaction) => {
//     const key = getTransactionKey(updatedTransaction);
    
//     console.log('Received update for transaction:', key, updatedTransaction);
//     console.log('Does this transaction exist in our map?', transactionsMapRef.current.has(key));
    
//     // Update the transaction in our state
//     setTransactions(prev => 
//       prev.map(item => {
//         if (getTransactionKey(item) === key) {
//           // Create updated item with new transaction data
//           return { 
//             ...item, 
//             transaction: updatedTransaction 
//           };
//         }
//         return item;
//       })
//     );
    
//     // Update the transaction in our map
//     if (transactionsMapRef.current.has(key)) {
//       const existingItem = transactionsMapRef.current.get(key);
//       if (existingItem) {
//         const updatedItem = {
//           ...existingItem,
//           transaction: updatedTransaction
//         };
//         transactionsMapRef.current.set(key, updatedItem);
//       }
//     }
    
//     // Highlight the updated transaction
//     setIsNewTransaction(prev => ({
//       ...prev,
//       [key]: true
//     }));
    
//     // Remove highlight after 5 seconds
//     setTimeout(() => {
//       setIsNewTransaction(prev => {
//         const updated = { ...prev };
//         delete updated[key];
//         return updated;
//       });
//     }, 5000);
//   };
  
//   // Filter transactions based on current filter
//   const shouldShowTransaction = (item: HistoricItem | Transaction) => {
//     const transaction = 'transaction' in item ? item.transaction : item;
    
//     if (!transaction) return false;
    
//     if (activeTab === 'all') {
//       return true;
//     } else if (activeTab === 'deposits') {
//       return transaction.type_trans === 'deposit';
//     } else if (activeTab === 'withdrawals') {
//       return transaction.type_trans === 'withdrawal';
//     }
//     return true;
//   };
  
//   // Fetch initial transactions from API
//   const fetchTransactions = async (pageNumber: number, activeFilter: string) => {
//     setLoading(true);
    
//     try {
//       const apiUrl = getApiUrl(pageNumber, activeFilter);
//       console.log('Fetching transactions from:', apiUrl);
      
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         console.error('No access token found');
//         setError('You must be logged in to view transactions.');
//         setLoading(false);
        
//         // Use example transactions if no token
//         if (pageNumber === 1) {
//           const filteredExamples = exampleTransactions.filter(tx => {
//             if (activeFilter === 'all') return true;
//             if (activeFilter === 'deposits') return tx.transaction.type_trans === 'deposit';
//             if (activeFilter === 'withdrawals') return tx.transaction.type_trans === 'withdrawal';
//             return true;
//           });
          
//           setTransactions(filteredExamples);
//           transactionsMapRef.current.clear();
//           filteredExamples.forEach(tx => {
//             const key = getTransactionKey(tx);
//             transactionsMapRef.current.set(key, tx);
//           });
//         }
        
//         return;
//       }
      
//       const response = await fetch(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error Data:', errorData);
//         throw new Error(errorData.message);
//       }
      
//       const data = await response.json();
//       console.log('Fetched Transactions:', data);
      
//       // Update last fetch time
//       setLastFetchTime(new Date().toISOString());
      
//       // Process the fetched transactions
//       if (pageNumber === 1) {
//         // Reset the transactions map for first page
//         transactionsMapRef.current.clear();
        
//         // Check if we got any transactions
//         if (data.results && data.results.length > 0) {
//           // Add each transaction to the map
//           data.results.forEach((tx: HistoricItem) => {
//             const key = getTransactionKey(tx);
//             transactionsMapRef.current.set(key, tx);
//           });
          
//           setTransactions(data.results);
//         } else {
//           // Use example transactions if API returned empty array
//           const filteredExamples = exampleTransactions.filter(tx => {
//             if (activeFilter === 'all') return true;
//             if (activeFilter === 'deposits') return tx.transaction.type_trans === 'deposit';
//             if (activeFilter === 'withdrawals') return tx.transaction.type_trans === 'withdrawal';
//             return true;
//           });
          
//           filteredExamples.forEach(tx => {
//             const key = getTransactionKey(tx);
//             transactionsMapRef.current.set(key, tx);
//           });
          
//           setTransactions(filteredExamples);
//         }
//       } else {
//         // For pagination, only add transactions that don't already exist
//         const newTransactions = data.results.filter((tx: HistoricItem) => {
//           const key = getTransactionKey(tx);
//           if (!transactionsMapRef.current.has(key)) {
//             transactionsMapRef.current.set(key, tx);
//             return true;
//           }
//           return false;
//         });
        
//         setTransactions(prev => [...prev, ...newTransactions]);
//       }
      
//       setHasMore(data.next !== null);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       if (error instanceof Error) {
//         setError(error.message || 'Failed to load transactions. Please try again.');
//         console.error('Error message:', error.message);
//       } else {
//         setError('Failed to load transactions. Please try again.');
//         console.error('Unknown error:', error);
//       }
      
//       // Use example transactions if API failed
//       if (pageNumber === 1) {
//         const filteredExamples = exampleTransactions.filter(tx => {
//           if (activeFilter === 'all') return true;
//           if (activeFilter === 'deposits') return tx.transaction.type_trans === 'deposit';
//           if (activeFilter === 'withdrawals') return tx.transaction.type_trans === 'withdrawal';
//           return true;
//         });
        
//         transactionsMapRef.current.clear();
//         filteredExamples.forEach(tx => {
//           const key = getTransactionKey(tx);
//           transactionsMapRef.current.set(key, tx);
//         });
        
//         setTransactions(filteredExamples);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Initial fetch and WebSocket setup
//   useEffect(() => {
//     // Trigger animation
//     setTimeout(() => {
//       setAnimateHeader(true);
//     }, 500);
    
//     fetchTransactions(page, activeTab);
    
//     // Setup WebSocket connection
//     setupWebSocket();
    
//     // Add health check interval for WebSocket
//     const healthCheckInterval = setInterval(() => {
//       const now = Date.now();
//       const minutesSinceLastMessage = (now - wsHealth.current.lastMessageTime) / (1000 * 60);
      
//       if (wsHealth.current.lastMessageTime > 0 && minutesSinceLastMessage > 5) {
//         console.warn('No WebSocket messages received in 5 minutes, reconnecting...');
//         setupWebSocket(); // Force reconnection
//       }
//     }, 60000); // Check every minute
    
//     // Cleanup function
//     return () => {
//       clearInterval(healthCheckInterval);
//       if (webSocketRef.current) {
//         // Clear ping interval if exists
//         if (webSocketRef.current.pingInterval) {
//           clearInterval(webSocketRef.current.pingInterval);
//         }
        
//         webSocketRef.current.close();
//         webSocketRef.current = null;
//       }
      
//       // Clear any pending reconnection timeouts
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, []);
  
//   // Verify WebSocket connection after initial setup
//   useEffect(() => {
//     // Verify connection after initial setup
//     const verifyConnectionTimeout = setTimeout(() => {
//       // If we haven't received any messages after 10 seconds of setup
//       if (wsHealth.current.messageCount === 0 && webSocketRef.current && 
//           webSocketRef.current.readyState === WebSocket.OPEN) {
//         console.log('Testing WebSocket connection with manual ping...');
//         try {
//           webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
//         } catch (error) {
//           console.error('Failed to send ping, reconnecting WebSocket:', error);
//           setupWebSocket();
//         }
//       }
//     }, 10000);
    
//     return () => clearTimeout(verifyConnectionTimeout);
//   }, []);
  
//   // Update WebSocket when real-time setting changes
//   useEffect(() => {
//     setupWebSocket();
//   }, [isRealTimeEnabled]);
  
//   // Reset page when tab changes to refetch from the beginning
//   // Reset page when tab changes to refetch from the beginning
//   useEffect(() => {
//     setPage(1);
//     fetchTransactions(1, activeTab);
//   }, [activeTab]);
  
//   // Load more transactions when scrolling to bottom
//   const loadMore = () => {
//     if (!loading && hasMore) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       fetchTransactions(nextPage, activeTab);
//     }
//   };
  
//   // Handle tab change
//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//     // setMobileFilterOpen(false); // Close mobile filter when tab changes
//   };
  
//   // Toggle real-time updates
//   const toggleRealTimeUpdates = () => {
//     const newState = !isRealTimeEnabled;
//     setIsRealTimeEnabled(newState);
//     // Update localStorage preference
//     localStorage.setItem('realTimeEnabled', newState.toString());
//   };
  
//   // Function to refresh transactions manually
//   const refreshTransactions = () => {
//     setPage(1);
//     fetchTransactions(1, activeTab);
//   };
  
//   // Show transaction details in modal
//   const openTransactionDetails = (transaction: HistoricItem) => {
//     setSelectedTransaction(transaction);
//     setIsModalOpen(true);
//   };
  
//   // Copy transaction ID or reference to clipboard
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//       .then(() => {
//         // Could add a toast notification here
//         console.log('Copied to clipboard:', text);
//       })
//       .catch(err => {
//         console.error('Failed to copy:', err);
//       });
//   };
  
//   // Format the transaction amount with currency symbol
//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('fr-BJ', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };
  
//   // Get status badge class based on transaction status
//   const getStatusBadgeClass = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//       case 'success':
//         return 'text-green-500';
//       case 'pending':
//         return 'text-amber-500';
//       case 'failed':
//       case 'error':
//         return 'text-red-500';
//       default:
//         return 'text-gray-500';
//     }
//   };
  
//   // Get transaction type icon based on type
//   const getTransactionTypeIcon = (type: string) => {
//     if (type === 'deposit') {
//       return <ArrowDownLeft className="w-5 h-5 text-orange-500 group-hover:animate-bounce" />;
//     } else if (type === 'withdrawal') {
//       return <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:animate-pulse" />;
//     }
//     return null;
//   };
  
//   // Check if real-time is working properly
//   // const isRealTimeWorking = wsStatus === 'connected';
  
//   return (
//     <div className={`flex flex-col h-full min-h-screen bg-gradient-to-br ${theme.colors.c_background} ${theme.colors.text} font-sans relative overflow-hidden`}>
//       {/* Background gradient effects */}
//       <div className="absolute top-20 -left-10 w-40 h-40 bg-orange-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
//       <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-700/10 rounded-full blur-3xl animate-pulse-slow"></div>
//      <div className="bg-white/10 dark:bg-gray-900/900 shadow-md rounded-2xl p-6 w-full overflow-hidden">
//         {/* Header with title and controls */}
//         <div className={`bg-gradient-to-br from-gray-50 ${theme.colors.c_background} p-4 flex flex-col sm:flex-row justify-between items-center mb-2 transition-all duration-500 backdrop-blur-sm border border-gray-700/30 shadow-xl relative overflow-hidden ${animateHeader ? 'animate-fadeIn' : 'opacity-0'}`} style={{animationDelay: '600ms'}}>
//         <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse-slow"></div>
        
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-9 md:space-y-0">
//               {/* Left side - Title and refresh button */}
//               <div className="flex items-center gap-2 group mb-4 md:mb-0">
//                 <Activity size={18} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
//                 <h2 className="text-lg font-semibold group-hover:translate-x-1 transition-transform">{t("Transaction History")}</h2>
//                 <RotateCw 
//                   size={16} 
//                   className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors hover:rotate-180 duration-500"
//                   onClick={refreshTransactions}
//                 />
//               </div>

//               {/* Right side - Navigation tabs with added margin-top */}
//               <div className="hidden md:flex gap-4 text-sm mt-4 md:mt-0 md:ml-8">
//                 <button 
//                   className={`${activeTab === 'all' ? 'text-black dark:text-white' : 'text-gray-400'} hover:text-black dark:hover:text-white transition-colors flex items-center gap-1`}
//                   onClick={() => setActiveTab('all')}
//                 >
//                   {t("See All ")}
//                   <span className="text-xs text-gray-500">•</span>
//                 </button>
//                 <button 
//                   className={`${activeTab === 'deposits' ? 'text-black dark:text-white' : 'text-gray-400'} hover:text-black dark:hover:text-white transition-colors flex items-center gap-1`}
//                   onClick={() => handleTabChange('deposits')}
//                 >
//                   {t("See Deposits ")}
//                   <span className="text-xs text-gray-500">•</span>
//                 </button>
//                 <button 
//                   className={`${activeTab === 'withdrawals' ? 'text-black dark:text-white' : 'text-gray-400'} hover:text-black dark:hover:text-white transition-colors flex items-center gap-1`}
//                   onClick={() => handleTabChange('withdrawals')}
//                 >
//                   {t("See Withdrawals")} 
//                   <span className="text-xs text-gray-500">•</span>
//                 </button>
//               </div>
//             </div>

//               <div className="md:hidden">
//                 <button 
//                   onClick={cycleMobileFilter}
//                   className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
//                 >
//                   <span>
//                     {activeTab === 'all' 
//                       ? t('All Transactions')
//                       : activeTab === 'deposits' 
//                         ? t('Deposits Only') 
//                         : t('Withdrawals Only')
//                     }
//                   </span>
//                   <Menu size={18} className="transition-transform hover:rotate-180 duration-300" />
//                 </button>
//               </div>
                          

//               {/* <div className="md:hidden">
//                 <button 
//                   onClick={toggleMobileFilter}
//                   className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
//                 >
//                   <span>{activeTab === 'all' ? 'All Transactions' : activeTab === 'deposits' ? 'Deposits' : 'Withdrawals'}</span>
//                   <Menu size={18} className={`transition-transform ${mobileFilterOpen ? 'hidden' : 'block'}`} />
//                   <X size={18} className={`transition-transform ${mobileFilterOpen ? 'block' : 'hidden'}`} />
//                 </button>
                

//                 {mobileFilterOpen && (
//                   <div className="absolute left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 animate-fadeIn z-50">
//                     <div className="relative bg-gray-800 rounded-lg shadow-lg">
//                     <button 
//                       className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'all' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                       onClick={() => {
//                         handleTabChange('all');
//                         setMobileFilterOpen(false);
//                       }}
//                     >
//                       All Transactions
//                     </button>
//                     <button 
//                       className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'deposits' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                       onClick={() => {
//                         handleTabChange('deposits');
//                         setMobileFilterOpen(false);
//                       }}
//                     >
//                       Deposits Only
//                     </button>
//                     <button 
//                       className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'withdrawals' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                       onClick={() => {
//                         handleTabChange('withdrawals');
//                         setMobileFilterOpen(false);
//                       }}
//                     >
//                       Withdrawals Only
//                     </button>
//                     </div>
//                   </div>
//                 )}
//               </div> */}
//             </div>
//             {/* <div className="ml-2 flex items-center">
//               {isRealTimeEnabled && (
//                 <div className={`ml-2 flex items-center ${isRealTimeWorking ? 'text-green-500' : 'text-red-500'}`}>
//                   <Activity className="w-4 h-4 animate-pulse" />
//                   <span className="ml-1 text-xs">{isRealTimeWorking ? 'Live' : 'Connecting...'}</span>
//                 </div>
//               )}
//             </div> */}
          
          
//           {/* <div className="flex items-center space-x-2">
//             <button
//               onClick={refreshTransactions}
//               className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md flex items-center hover:bg-gray-700 transition-colors hover:text-white"
//               disabled={loading}
//             >
//               <RotateCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : 'hover:rotate-180 duration-500'}`} />
//               <span className="text-sm">Refresh</span>
//             </button>
            
//             <button
//               onClick={toggleRealTimeUpdates}
//               className={`px-3 py-1 rounded-md flex items-center transition-colors ${
//                 isRealTimeEnabled 
//                   ? 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/30' 
//                   : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
//               }`}
//             >
//               <span className="text-sm">{isRealTimeEnabled ? 'Live Updates On' : 'Live Updates Off'}</span> 
//             </button> */}
            
//             {/* <button
//               onClick={toggleMobileFilter}
//               className="sm:hidden px-2 py-1 bg-gray-800 text-gray-300 rounded-md flex items-center hover:bg-gray-700 transition-colors"
//             >
//               {mobileFilterOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
//             </button>
//           </div>
//         </div> */}
        
//         {/* Filter Tabs - Desktop */}
//         {/* <div className="hidden sm:flex px-4 mb-2">
//           <div className="space-x-4 flex text-sm">
//             <button
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === 'all'
//                   ? 'text-white'
//                   : 'text-gray-400 hover:text-white'
//               }`}
//               onClick={() => handleTabChange('all')}
//             >
//               All Transactions
//               {activeTab === 'all' && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-orange-500 transition-all duration-300"></span>}
//             </button>
//             <button
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === 'deposits'
//                   ? 'text-white'
//                   : 'text-gray-400 hover:text-white'
//               }`}
//               onClick={() => handleTabChange('deposits')}
//             >
//               Deposits
//               {activeTab === 'deposits' && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-orange-500 transition-all duration-300"></span>}
//             </button>
//             <button
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === 'withdrawals'
//                   ? 'text-white'
//                   : 'text-gray-400 hover:text-white'
//               }`}
//               onClick={() => handleTabChange('withdrawals')}
//             >
//               Withdrawals
//               {activeTab === 'withdrawals' && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-orange-500 transition-all duration-300"></span>}
//             </button>
//           </div>
//         </div> */}
        
//         {/* Filter Tabs - Mobile */}
//         {/* {mobileFilterOpen && (
//           <div className="sm:hidden px-4 mb-2">
//             <div className="absolute z-10 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 animate-fadeIn">
//               <button
//                 className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'all' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                 onClick={() => handleTabChange('all')}
//               >
//                 All Transactions
//               </button>
//               <button
//                 className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'deposits' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                 onClick={() => handleTabChange('deposits')}
//               >
//                 Deposits Only
//               </button>
//               <button
//                 className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'withdrawals' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                 onClick={() => handleTabChange('withdrawals')}
//               >
//                 Withdrawals Only
//               </button>
//             </div>
//           </div>
//         )} */}
        
//         {/* Last updated info */}
//         {/* {lastFetchTime && (
//           <div className="px-4 mb-2 text-xs text-gray-500 dark:text-gray-400">
//             Last updated: {formatDate(lastFetchTime)}
//           </div>
//         )} */}
        
//         {/* Error message */}
//         {/* {error && (
//           // <div className="p-4 mb-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
//           //   {error}
//           // </div>
//         )} */}
        
//         {/* Transaction list */}
//         <div className="space-y-3 pb-4">
//               {loading && page === 1 ? (
//                 <div className="flex justify-center items-center py-10">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
//                 </div>
//               ) : transactions.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-10 px-4">
//                   <div className="bg-gray-800/50 rounded-full p-4 mb-4">
//                     <Activity className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-400 mb-2">No transactions found</h3>
//                   <p className="text-sm text-gray-500 text-center">
//                     {activeTab === 'all' 
//                       ? t("You haven't made any transactions yet.")
//                       : activeTab === 'deposits'
//                       ? t("No deposits have been made yet.")
//                       : t("No withdrawals have been made yet.")}
//                   </p>
//                 </div>
//             ) : ( 
//               transactions.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className={`rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-900/10 group animate-fadeIn bg-gradient-to-br ${theme.colors.c_background} ${theme.colors.hover} ${
//                     isNewTransaction[getTransactionKey(item)] ? 'animate-highlight' : ''
//                   }`}
//                   onClick={() => openTransactionDetails(item)}
//                   style={{ animationDelay: `${(index + 1) * 150}ms` }}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-center">
//                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                         item.transaction.type_trans === 'deposit' 
//                           ? 'bg-orange-500/20 text-orange-500' 
//                           : 'bg-gray-700/50 text-gray-300'
//                         } relative overflow-hidden group-hover:scale-110 transition-transform`}>
//                         {getTransactionTypeIcon(item.transaction.type_trans)}
//                         <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
//                       </div>
//                       <div className="ml-3 group-hover:translate-x-1 transition-transform">
//                         <div className="flex items-center">
//                           <span className="font-medium dark:text-white">
//                             {item.transaction.type_trans === 'deposit' ? 'Deposit' : 'Withdrawal'}
//                           </span>
//                           <span className={`text-xs ml-2 px-2 py-0.5 rounded-full whitespace-nowrap ${getStatusBadgeClass(item.transaction.status)} group-hover:scale-110 transition-transform relative`}>
//                             {item.transaction.status}
//                             <span className={`absolute -bottom-1 left-0 h-0.5 w-0 ${
//                               item.transaction.status.toLowerCase() === 'pending' 
//                                 ? 'bg-amber-500' 
//                                 : item.transaction.status.toLowerCase() === 'completed' || item.transaction.status.toLowerCase() === 'success'
//                                   ? 'bg-green-500' 
//                                   : 'bg-red-500'
//                             } group-hover:w-full transition-all duration-300`}></span>
//                           </span>
//                         </div>
//                         <div className="text-sm text-gray-500 dark:text-gray-400">
//                           {item.transaction.phone_number}
//                         </div>
//                         <div className="text-xs text-gray-400 dark:text-gray-500">
//                           {formatDate(item.transaction.created_at)}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className={`font-bold ${
//                         item.transaction.type_trans === 'deposit' 
//                           ? 'text-orange-600 dark:text-orange-400' 
//                           : 'text-blue-600 dark:text-blue-400'
//                       }`}>
//                         {formatAmount(item.transaction.amount)}
//                       </div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 group-hover:text-orange-400 transition-colors">
//                         Ref: {item.transaction.reference.substring(0, 8)}...
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
              
//               {/* Loading more indicator */}
//               {loading && page > 1 && (
//                 <div className="flex justify-center items-center h-16">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
//                 </div>
//               )}
              
//               {/* Load more button */}
//               {!loading && hasMore && (
//                 <div className="flex justify-center mt-4">
//                   <button
//                     onClick={loadMore}
//                     className={`group flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg bg-gradient-to-br ${theme.colors.background} hover:bg-gray-800 relative overflow-hidden`}
//                   >
//                     <span className="absolute inset-0 bg-gradient-to-r from-orange-800/40 to-transparent w-0 group-hover:w-full transition-all duration-300"></span>
//                     <span className="relative z-10 flex items-center gap-1">
//                       See More
//                       <ChevronRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
//                     </span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
        
      
//       <Footer/>
      
//       {/* Transaction Details Modal */}
//       {isModalOpen && selectedTransaction && (
//         <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
//           <div className={`bg-gradient-to-br ${theme.colors.background} rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto border border-gray-700/30 shadow-2xl animate-fadeIn`}>
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//               <h2 className={`text-lg font-bold ${theme.colors.text}`}>Transaction Details</h2>
//               <button 
//                 onClick={() => setIsModalOpen(false)} 
//                 className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//               </button>
//             </div>
            
//             <div className="p-4">
//               {/* Transaction Type and Status */}
//               <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center">
//                   <div className={`rounded-full p-2 ${
//                     selectedTransaction.transaction.type_trans === 'deposit' 
//                       ? 'bg-orange-500/20 text-orange-500'
//                       : 'bg-gray-700/50 text-gray-300'
//                   }`}>
//                     {getTransactionTypeIcon(selectedTransaction.transaction.type_trans)}
//                   </div>
//                   <div className="ml-3">
//                     <div className="font-medium text-lg dark:text-white">
//                       {selectedTransaction.transaction.type_trans === 'deposit' ? 'Deposit' : 'Withdrawal'}
//                     </div>
//                     <div className="text-sm text-gray-500 dark:text-gray-400">
//                       {formatDate(selectedTransaction.transaction.created_at)}
//                     </div>
//                   </div>
//                 </div>
//                 <div className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   getStatusBadgeClass(selectedTransaction.transaction.status)
//                 }`}>
//                   {selectedTransaction.transaction.status}
//                 </div>
//               </div>
              
//               {/* Amount */}
//               <div className="bg-gray-200/50 dark:bg-gray-800/50 p-4 rounded-lg mb-4">
//                 <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</div>
//                 <div className="text-2xl font-bold dark:text-white">
//                   {formatAmount(selectedTransaction.transaction.amount)}
//                 </div>
//                 {selectedTransaction.transaction.net_payable_amount && 
//                  selectedTransaction.transaction.net_payable_amount !== selectedTransaction.transaction.amount && (
//                   <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                     Net payable: {formatAmount(selectedTransaction.transaction.net_payable_amount)}
//                   </div>
//                 )}
//               </div>
              
//               {/* Details list */}
//               <div className="space-y-4">
//                 {/* Reference */}
//                 <div className="flex justify-between">
//                   <div className="text-sm text-gray-500 dark:text-gray-400">Reference</div>
//                   <div className="text-right font-medium dark:text-white flex items-center">
//                     <span className="mr-2">{selectedTransaction.transaction.reference}</span>
//                     <button 
//                       onClick={() => copyToClipboard(selectedTransaction.transaction.reference)}
//                       className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-400"
//                     >
//                       <ClipboardCopy className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Transaction ID */}
//                 <div className="flex justify-between">
//                   <div className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</div>
//                   <div className="text-right font-medium dark:text-white flex items-center">
//                     <span className="mr-2">{selectedTransaction.transaction.id}</span>
//                     <button 
//                       onClick={() => copyToClipboard(selectedTransaction.transaction.id)}
//                       className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-400"
//                     >
//                       <ClipboardCopy className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Phone Number */}
//                 <div className="flex justify-between">
//                   <div className="text-sm text-gray-500 dark:text-gray-400">Phone Number</div>
//                   <div className="text-right font-medium dark:text-white">
//                     {selectedTransaction.transaction.phone_number}
//                   </div>
//                 </div>
                
//                 {/* Network */}
//                 <div className="flex justify-between">
//                   <div className="text-sm text-gray-500 dark:text-gray-400">Network</div>
//                   <div className="text-right font-medium dark:text-white">
//                     {selectedTransaction.transaction.network.public_name}
//                   </div>
//                 </div>
                
//                 {/* App */}
//                 <div className="flex justify-between">
//                   <div className="text-sm text-gray-500 dark:text-gray-400">Application</div>
//                   <div className="text-right font-medium dark:text-white">
//                     {selectedTransaction.transaction.app.public_name}
//                   </div>
//                 </div>
                
//                 {/* User */}
//                 <div className="flex justify-between">
//                   <div className="text-sm text-gray-500 dark:text-gray-400">User</div>
//                   <div className="text-right font-medium dark:text-white">
//                     {selectedTransaction.transaction.user.first_name} {selectedTransaction.transaction.user.last_name}
//                   </div>
//                 </div>
                
//                 {/* User Email */}
//                 <div className="flex justify-between">
//                   <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
//                   <div className="text-right font-medium dark:text-white">
//                     {selectedTransaction.transaction.user.email}
//                   </div>
//                 </div>
                
//                 {/* Error Message if any */}
//                 {selectedTransaction.transaction.error_message && (
//                   <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
//                     <div className="text-sm font-medium mb-1">Error Message:</div>
//                     <div className="text-sm">{selectedTransaction.transaction.error_message}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="group relative flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden border border-gray-700"
//               >
//                 <span className="absolute inset-0 w-0 h-full bg-orange-600/20 transition-all duration-300 group-hover:w-full"></span>
//                 <span className="relative z-10">Close</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Add global CSS for animations */}
//       <style jsx>{`
//         @keyframes highlight {
//           0% { background-color: rgba(249, 115, 22, 0.1); }
//           50% { background-color: rgba(249, 115, 22, 0.2); }
//           100% { background-color: rgba(249, 115, 22, 0); }
//         }
        
//         .animate-highlight {
//           animation: highlight 3s ease-in-out;
//         }
        
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out forwards;
//         }
        
//         @keyframes widthExpand {
//           from { transform: scaleX(0); }
//           to { transform: scaleX(1); }
//         }
        
//         .animate-widthExpand {
//           animation: widthExpand 0.5s ease-out forwards;
//         }
        
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 0.5; }
//           50% { opacity: 0.8; }
//         }
        
//         .animate-pulse-slow {
//           animation: pulse-slow 4s ease-in-out infinite;
//         }
        
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(-20px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
        
//         .animate-slideInRight {
//           animation: slideInRight 0.5s ease-out forwards;
//         }
        
//         .bg-gray-750 {
//           background-color: rgba(55, 65, 81, 0.5);
//         }
//       `}</style>
//     </div>
//   );
// }



















































// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { ArrowDownLeft, ArrowUpRight, RotateCw, ChevronDown, X, Activity, Menu, Copy, } from 'lucide-react';
// //import Footer from '../components/footer';
// import { useTranslation } from 'react-i18next';
// import { useTheme } from './ThemeProvider';
// // Define the App interface
// interface App {
//   id: string;
//   name: string;
//   image: string;
//   public_name: string;
//   is_active: boolean;
// }

// // Define API response interfaces
// /**
//  * @typedef {Object} User
//  * @property {string} id
//  * @property {string} email
//  * @property {string} first_name
//  * @property {string} last_name
//  */
// interface User {
//   id: string;
//   email: string;
//   first_name: string;
//   last_name: string;
// }

// /**
//  * @typedef {Object} App
//  * @property {string} id
//  * @property {string} name
//  * @property {string} image
//  * @property {string} public_name
//  * @property {boolean} is_active
//  */

// /**
//  * @typedef {Object} Network
//  * @property {number} id
//  * @property {string} name
//  * @property {string} public_name
//  * @property {string} image
//  * @property {string} country_code
//  * @property {string} indication
//  */
// interface Network {
//   id: number;
//   name: string;
//   public_name: string;
//   image: string;
//   country_code: string;
//   indication: string;
// }

// /**
//  * @typedef {Object} Network
//  * @property {number} id
//  * @property {string} name
//  * @property {string} public_name
//  * @property {string} image
//  * @property {string} country_code
//  * @property {string} indication
//  */

// interface Transaction {
//   id: string;
//   amount: number;
//   reference: string;
//   type_trans: string;
//   status: string;
//   created_at: string;
//   phone_number: string;
//   app: App;
//   network: Network;
//   user: User;
//   user_app_id: string;
//   transaction_reference: string | null;
//   error_message: string | null;
//   net_payable_amount: number | null;
// }

// // Define the HistoricItem type
// type HistoricItem = {
//   id: string;
//   user: string;
//   created_at: string;
//   transaction: Transaction;
// };

// /**
//  * @typedef {Object} ApiResponse
//  * @property {number} count
//  * @property {string|null} next
//  * @property {string|null} previous
//  * @property {HistoricItem[]} results
//  */


// export default function TransactionHistory() {
//   const [transactions, setTransactions] = useState<HistoricItem[]>([]);
//   const [activeTab, setActiveTab] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [selectedTransaction, setSelectedTransaction] = useState<HistoricItem | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);
//   const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
//   const [isNewTransaction, setIsNewTransaction] = useState<Record<string, boolean>>({});
//   const [wsStatus, setWsStatus] = useState('disconnected');
//   const [animateHeader, setAnimateHeader] = useState(false);
//   const {t} = useTranslation();
//   const { theme } = useTheme();
  
//   interface CustomWebSocket extends WebSocket {
//     pingInterval?: NodeJS.Timeout | null;
//   }
  
//   const webSocketRef = useRef<CustomWebSocket | null>(null);
//   const wsHealth = useRef({
//     lastMessageTime: 0,
//     messageCount: 0
//   });
  
//   // WebSocket reference
//   const webSocketReconnectAttempts = useRef(0);
//   // Transactions map to track unique transactions
//   const transactionsMapRef = useRef(new Map());
//   // Reconnect timeout reference for WebSocket
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
//   // Format date from ISO string to readable format
//   const formatDate = (isoDate: string) => {
//     const date = new Date(isoDate);
//     return date.toLocaleDateString('en-US', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     }).replace(',', '');
//   };
  
//   // Build API URL based on filters and pagination
//   const getApiUrl = (pageNumber: number, activeFilter: string) => {
//     let apiUrl = `https://api.yapson.net/yapson/historic${pageNumber > 1 ? `?page=${pageNumber}` : ''}`;
    
//     if (activeFilter === 'deposits') {
//       apiUrl = `https://api.yapson.net/yapson/historic${pageNumber > 1 ? `?page=${pageNumber}&` : '?'}type=deposit`;
//     } else if (activeFilter === 'withdrawals') {
//       apiUrl = `https://api.yapson.net/yapson/historic${pageNumber > 1 ? `?page=${pageNumber}&` : '?'}type=withdrawal`;
//     }
    
//     return apiUrl;
//   };
  
//   // Create a function to generate a composite key for transactions
//   const getTransactionKey = (transaction: HistoricItem | Transaction) => {
//     // Check for different possible properties to handle various formats
//     const id = 'transaction' in transaction
//       ? transaction.transaction.id
//       : transaction.id;
    
//     if (!id) {
//       console.error('Could not extract ID from transaction:', transaction);
//       // Generate a fallback ID to prevent errors
//       return `unknown-${Math.random().toString(36).substring(2, 11)}`;
//     }
    
//     return id.toString();
//   };
  
//   // Add this function to cycle through filter options
//   const cycleMobileFilter = () => {
//     if (activeTab === 'all') {
//       handleTabChange('deposits');
//     } else if (activeTab === 'deposits') {
//       handleTabChange('withdrawals');
//     } else {
//       handleTabChange('all');
//     }
//   };
  
//   // Update the setupWebSocket function with better error handling and fallback
//   const setupWebSocket = () => {
//     if (!isRealTimeEnabled) {
//       cleanupWebSocket();
//       return;
//     }

//     const token = localStorage.getItem('access');
//     if (!token) {
//       setError('Authentication required for real-time updates');
//       setWsStatus('error');
//       return;
//     }

//     // Clean up existing connection
//     cleanupWebSocket();

//     try {
//       const wsUrl = `wss://api.yapson.net/ws/socket?token=${encodeURIComponent(token)}`;
//       webSocketRef.current = new WebSocket(wsUrl);

//       // Set connection timeout
//       const connectionTimeout = setTimeout(() => {
//         if (webSocketRef.current?.readyState !== WebSocket.OPEN) {
//           handleConnectionFailure('Connection timeout');
//         }
//       }, 5000);

//       webSocketRef.current.onopen = () => {
//         clearTimeout(connectionTimeout);
//         console.log('WebSocket connected successfully');
//         setWsStatus('connected');
//         setError(null);
//         webSocketReconnectAttempts.current = 0;
//         startPingInterval();
//       };

//       webSocketRef.current.onclose = (event) => {
//         clearTimeout(connectionTimeout);
//         handleWebSocketClose(event);
//       };

//       webSocketRef.current.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         handleConnectionFailure('Connection failed');
//       };

//       webSocketRef.current.onmessage = handleWebSocketMessage;

//     } catch (error) {
//       console.error('WebSocket setup failed:', error);
//       setError(error instanceof Error ? error.message : 'Failed to establish connection');
//       setWsStatus('error');
//       handleConnectionFailure('Failed to initialize WebSocket');
//     }
//   };

//   // Add these helper functions
//   const cleanupWebSocket = () => {
//     if (webSocketRef.current) {
//       webSocketRef.current.close();
//       webSocketRef.current = null;
//     }
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//     }
//     setWsStatus('disconnected');
//   };

//   const startPingInterval = () => {
//     const pingInterval = setInterval(() => {
//       if (webSocketRef.current?.readyState === WebSocket.OPEN) {
//         try {
//           webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
//         } catch (error) {
//           console.error('Failed to send ping:', error);
//           cleanupWebSocket();
//           setupWebSocket();
//         }
//       } else {
//         clearInterval(pingInterval);
//       }
//     }, 30000);

//     // Store the interval ID for cleanup
//     if (webSocketRef.current) {
//       webSocketRef.current.pingInterval = pingInterval;
//     }
//   };

//   const handleConnectionFailure = (message: string) => {
//     console.error(message);
//     setWsStatus('error');
//     setError(message);
    
//     // Implement exponential backoff
//     const backoffDelay = Math.min(1000 * Math.pow(2, webSocketReconnectAttempts.current), 30000);
//     webSocketReconnectAttempts.current++;

//     reconnectTimeoutRef.current = setTimeout(() => {
//       if (isRealTimeEnabled) {
//         setupWebSocket();
//       }
//     }, backoffDelay);
//   };

//   const handleWebSocketMessage = (event: MessageEvent) => {
//     try {
//       const data = JSON.parse(event.data);
//       wsHealth.current = {
//         lastMessageTime: Date.now(),
//         messageCount: wsHealth.current.messageCount + 1
//       };

//       switch (data.type) {
//         case 'transaction_update':
//           handleTransactionUpdate(data.transaction);
//           break;
//         case 'new_transaction':
//           handleNewTransaction(data.transaction);
//           break;
//         case 'pong':
//           console.log('Received pong from server');
//           break;
//         case 'error':
//           console.error('Server error:', data.message);
//           setError(data.message);
//           break;
//         default:
//           if (data.transaction) {
//             const existingTransaction = transactionsMapRef.current.has(getTransactionKey(data.transaction));
//             if (existingTransaction) {
//               handleTransactionUpdate(data.transaction);
//             } else {
//               handleNewTransaction(data.transaction);
//             }
//           }
//       }

//       setLastFetchTime(new Date().toISOString());
//     } catch (error) {
//       console.error('Error processing message:', error);
//     }
//   };

//   const handleWebSocketClose = (event: CloseEvent) => {
//     cleanupWebSocket();
    
//     const reason = getCloseReason(event.code);
//     console.log(`WebSocket closed: ${reason}`);

//     if (isRealTimeEnabled && event.code !== 1000) {
//       handleConnectionFailure(reason);
//     }
//   };

//   const getCloseReason = (code: number): string => {
//     const closeReasons: Record<number, string> = {
//       1000: 'Normal closure',
//       1001: 'Going away',
//       1002: 'Protocol error',
//       1003: 'Unsupported data',
//       1005: 'No status received',
//       1006: 'Abnormal closure',
//       1007: 'Invalid frame payload data',
//       1008: 'Policy violation',
//       1009: 'Message too big',
//       1010: 'Mandatory extension',
//       1011: 'Internal server error',
//       1012: 'Service restart',
//       1013: 'Try again later',
//       1014: 'Bad gateway',
//       1015: 'TLS handshake'
//     };

//     return closeReasons[code] || `Unknown reason (${code})`;
//   };

//   // Handle new transaction from WebSocket
//   const handleNewTransaction = (transaction: Transaction) => {
//     const key = getTransactionKey(transaction);
    
//     // Only add if it matches the current filter
//     if (shouldShowTransaction(transaction)) {
//       // Check if we already have this transaction
//       if (!transactionsMapRef.current.has(key)) {
//         // Mark as new for animation
//         setIsNewTransaction(prev => ({
//           ...prev,
//           [key]: true
//         }));
        
//         // Create a proper HistoricItem
//         const historicItem: HistoricItem = {
//           id: transaction.id,
//           user: transaction.user?.id || '',
//           created_at: transaction.created_at,
//           transaction: transaction
//         };
        
//         // Add to our map
//         transactionsMapRef.current.set(key, historicItem);
        
//         // Add to state (at the beginning)
//         setTransactions(prev => [historicItem, ...prev]);
        
//         // Remove animation after 5 seconds
//         setTimeout(() => {
//           setIsNewTransaction(prev => {
//             const updated = { ...prev };
//             delete updated[key];
//             return updated;
//           });
//         }, 5000);
//       }
//     }
//   };
  
//   // Handle transaction updates from WebSocket
//   const handleTransactionUpdate = (updatedTransaction: Transaction) => {
//     const key = getTransactionKey(updatedTransaction);
    
//     console.log('Received update for transaction:', key, updatedTransaction);
//     console.log('Does this transaction exist in our map?', transactionsMapRef.current.has(key));
    
//     // Update the transaction in our state
//     setTransactions(prev => 
//       prev.map(item => {
//         if (getTransactionKey(item) === key) {
//           // Create updated item with new transaction data
//           return { 
//             ...item, 
//             transaction: updatedTransaction 
//           };
//         }
//         return item;
//       })
//     );
    
//     // Update the transaction in our map
//     if (transactionsMapRef.current.has(key)) {
//       const existingItem = transactionsMapRef.current.get(key);
//       if (existingItem) {
//         const updatedItem = {
//           ...existingItem,
//           transaction: updatedTransaction
//         };
//         transactionsMapRef.current.set(key, updatedItem);
//       }
//     }
    
//     // Highlight the updated transaction
//     setIsNewTransaction(prev => ({
//       ...prev,
//       [key]: true
//     }));
    
//     // Remove highlight after 5 seconds
//     setTimeout(() => {
//       setIsNewTransaction(prev => {
//         const updated = { ...prev };
//         delete updated[key];
//         return updated;
//       });
//     }, 5000);
//   };
  
//   // Filter transactions based on current filter
//   const shouldShowTransaction = (item: HistoricItem | Transaction) => {
//     const transaction = 'transaction' in item ? item.transaction : item;
    
//     if (!transaction) return false;
    
//     if (activeTab === 'all') {
//       return true;
//     } else if (activeTab === 'deposits') {
//       return transaction.type_trans === 'deposit';
//     } else if (activeTab === 'withdrawals') {
//       return transaction.type_trans === 'withdrawal';
//     }
//     return true;
//   };
  
//   // Fetch transactions from API
//   const fetchTransactions = async (pageNumber: number, activeFilter: string) => {
//     setLoading(true);
    
//     try {
//       const apiUrl = getApiUrl(pageNumber, activeFilter);
//       console.log('Fetching transactions from:', apiUrl);
      
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         console.error('No access token found');
//         setError('You must be logged in to view transactions.');
//         setLoading(false);
//         return;
//       }
      
//       const response = await fetch(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error Data:', errorData);
//         throw new Error(errorData.message);
//       }
      
//       const data = await response.json();
//       console.log('Fetched Transactions:', data);
      
//       // Update last fetch time
//       setLastFetchTime(new Date().toISOString());
      
//       // Process the fetched transactions
//       if (pageNumber === 1) {
//         // Reset the transactions map for first page
//         transactionsMapRef.current.clear();
        
//         // Check if we got any transactions
//         if (data.results && data.results.length > 0) {
//           // Add each transaction to the map
//           data.results.forEach((tx: HistoricItem) => {
//             const key = getTransactionKey(tx);
//             transactionsMapRef.current.set(key, tx);
//           });
          
//           setTransactions(data.results);
//         } else {
//           // No transactions found
//           setTransactions([]);
//         }
//       } else {
//         // For pagination, only add transactions that don't already exist
//         const newTransactions = data.results.filter((tx: HistoricItem) => {
//           const key = getTransactionKey(tx);
//           if (!transactionsMapRef.current.has(key)) {
//             transactionsMapRef.current.set(key, tx);
//             return true;
//           }
//           return false;
//         });
        
//         setTransactions(prev => [...prev, ...newTransactions]);
//       }
      
//       setHasMore(data.next !== null);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       if (error instanceof Error) {
//         setError(error.message || 'Failed to load transactions. Please try again.');
//         console.error('Error message:', error.message);
//       } else {
//         setError('Failed to load transactions. Please try again.');
//         console.error('Unknown error:', error);
//       }
      
//       // Set empty transactions if API failed
//       if (pageNumber === 1) {
//         setTransactions([]);
//         transactionsMapRef.current.clear();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Initial fetch and WebSocket setup
//   useEffect(() => {
//     // Trigger animation
//     setTimeout(() => {
//       setAnimateHeader(true);
//     }, 500);
    
//     fetchTransactions(page, activeTab);
    
//     // Setup WebSocket connection
//     setupWebSocket();
    
//     // Add health check interval for WebSocket
//     const healthCheckInterval = setInterval(() => {
//       const now = Date.now();
//       const minutesSinceLastMessage = (now - wsHealth.current.lastMessageTime) / (1000 * 60);
      
//       if (wsHealth.current.lastMessageTime > 0 && minutesSinceLastMessage > 5) {
//         console.warn('No WebSocket messages received in 5 minutes, reconnecting...');
//         setupWebSocket(); // Force reconnection
//       }
//     }, 60000); // Check every minute
    
//     // Cleanup function
//     return () => {
//       clearInterval(healthCheckInterval);
//       if (webSocketRef.current) {
//         // Clear ping interval if exists
//         if (webSocketRef.current.pingInterval) {
//           clearInterval(webSocketRef.current.pingInterval);
//         }
        
//         webSocketRef.current.close();
//         webSocketRef.current = null;
//       }
      
//       // Clear any pending reconnection timeouts
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, []);
  
//   // Verify WebSocket connection after initial setup
//   useEffect(() => {
//     // Verify connection after initial setup
//     const verifyConnectionTimeout = setTimeout(() => {
//       // If we haven't received any messages after 10 seconds of setup
//       if (wsHealth.current.messageCount === 0 && webSocketRef.current && 
//           webSocketRef.current.readyState === WebSocket.OPEN) {
//         console.log('Testing WebSocket connection with manual ping...');
//         try {
//           webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
//         } catch (error) {
//           console.error('Failed to send ping, reconnecting WebSocket:', error);
//           setupWebSocket();
//         }
//       }
//     }, 10000);
    
//     return () => clearTimeout(verifyConnectionTimeout);
//   }, []);
  
//   // Update WebSocket when real-time setting changes
//   useEffect(() => {
//     setupWebSocket();
//   }, [isRealTimeEnabled]);
  
//   // Reset page when tab changes to refetch from the beginning
//   useEffect(() => {
//     setPage(1);
//     fetchTransactions(1, activeTab);
//   }, [activeTab]);
  
//   // Load more transactions when scrolling to bottom
//   const loadMore = () => {
//     if (!loading && hasMore) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       fetchTransactions(nextPage, activeTab);
//     }
//   };
  
//   // Handle tab change
//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//   };
  
//   // Toggle real-time updates
//   const toggleRealTimeUpdates = () => {
//     const newState = !isRealTimeEnabled;
//     setIsRealTimeEnabled(newState);
//     // Update localStorage preference
//     localStorage.setItem('realTimeEnabled', newState.toString());
//   };
  
//   // Function to refresh transactions manually
//   const refreshTransactions = () => {
//     setPage(1);
//     fetchTransactions(1, activeTab);
//   };
  
//   // Show transaction details in modal
//   const openTransactionDetails = (transaction: HistoricItem) => {
//     setSelectedTransaction(transaction);
//     setIsModalOpen(true);
//   };
  
//   // Copy transaction ID or reference to clipboard
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//       .then(() => {
//         // Could add a toast notification here
//         console.log('Copied to clipboard:', text);
//       })
//       .catch(err => {
//         console.error('Failed to copy:', err);
//       });
//   };
  
//   // Format the transaction amount with currency symbol
//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('fr-BJ', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };
  
//   // Get status badge class based on transaction status
//   const getStatusBadgeClass = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//       case 'success':
//         return 'text-green-500';
//       case 'pending':
//         return 'text-amber-500';
//       case 'failed':
//       case 'error':
//         return 'text-red-500';
//       default:
//         return 'text-gray-500';
//     }
//   };
  
//   // Get transaction type icon based on type
//   const getTransactionTypeIcon = (type: string) => {
//     if (type === 'deposit') {
//       return <ArrowDownLeft className="w-5 h-5 text-orange-500 group-hover:animate-bounce" />;
//     } else if (type === 'withdrawal') {
//       return <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:animate-pulse" />;
//     }
//     return null;
//   };
  
//   return (
//     <div className={`flex flex-col h-full min-h-screen bg-gradient-to-br ${theme.colors.c_background} ${theme.colors.text} font-sans relative overflow-hidden`}>
//       {/* Background gradient effects */}
//       <div className="absolute top-20 -left-10 w-40 h-40 bg-orange-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
//       <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-700/10 rounded-full blur-3xl animate-pulse-slow"></div>
//      <div className="bg-white/10 dark:bg-gray-900/900 shadow-md rounded-2xl p-6 w-full overflow-hidden">
//         {/* Header with title and controls */}
//         <div className={`bg-gradient-to-br from-gray-50 ${theme.colors.c_background} p-4 flex flex-col sm:flex-row justify-between items-center mb-2 transition-all duration-500 backdrop-blur-sm border border-gray-700/30 shadow-xl relative overflow-hidden ${animateHeader ? 'animate-fadeIn' : 'opacity-0'}`} style={{animationDelay: '600ms'}}>
//         <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse-slow"></div>
        
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-9 md:space-y-0">
//               {/* Left side - Title and refresh button */}
//               <div className="flex items-center gap-2 group mb-4 md:mb-0">
//                 <Activity size={18} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
//                 <h2 className="text-lg font-semibold group-hover:translate-x-1 transition-transform">{t("Transaction History")}</h2>
//                 <RotateCw 
//                   size={16} 
//                   className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors hover:rotate-180 duration-500"
//                   onClick={refreshTransactions}
//                 />
//               </div>

//               {/* Right side - Navigation tabs with added margin-top */}
//               <div className="hidden md:flex gap-4 text-sm mt-4 md:mt-0 md:ml-8">
//                 <button 
//                   className={`${activeTab === 'all' ? 'text-black dark:text-white' : 'text-gray-400'} hover:text-black dark:hover:text-white transition-colors flex items-center gap-1`}
//                   onClick={() => setActiveTab('all')}
//                 >
//                   {t("See All ")}
//                   <span className="text-xs text-gray-500">•</span>
//                 </button>
//                 <button 
//                   className={`${activeTab === 'deposits' ? 'text-black dark:text-white' : 'text-gray-400'} hover:text-black dark:hover:text-white transition-colors flex items-center gap-1`}
//                   onClick={() => handleTabChange('deposits')}
//                 >
//                   {t("See Deposits ")}
//                   <span className="text-xs text-gray-500">•</span>
//                 </button>
//                 <button 
//                   className={`${activeTab === 'withdrawals' ? 'text-black dark:text-white' : 'text-gray-400'} hover:text-black dark:hover:text-white transition-colors flex items-center gap-1`}
//                   onClick={() => handleTabChange('withdrawals')}
//                 >
//                   {t("See Withdrawals")} 
//                   <span className="text-xs text-gray-500">•</span>
//                 </button>
//               </div>
//             </div>

//               <div className="md:hidden">
//                 <button 
//                   onClick={cycleMobileFilter}
//                   className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
//                 >
//                   <span>
//                     {activeTab === 'all' 
//                       ? t('All Transactions')
//                       : activeTab === 'deposits' 
//                         ? t('Deposits Only') 
//                         : t('Withdrawals Only')
//                     }
//                   </span>
//                   <Menu size={18} className="transition-transform hover:rotate-180 duration-300" />
//                 </button>
//               </div>
        
//         {/* Transaction list */}
//         <div className="space-y-3 pb-4">
//               {loading && page === 1 ? (
//                 <div className="flex justify-center items-center py-10">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
//                 </div>
//               ) : transactions.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-10 px-4">
//                   <div className="bg-gray-800/50 rounded-full p-4 mb-4">
//                     <Activity className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-400 mb-2">No transactions found</h3>
//                   <p className="text-sm text-gray-500 text-center">
//                     {activeTab === 'all' 
//                       ? t("You haven't made any transactions yet.")
//                       : activeTab === 'deposits'
//                       ? t("No deposits have been made yet.")
//                       : t("No withdrawals have been made yet.")}
//                   </p>
//                 </div>
//             ) : ( 
//               transactions.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className={`rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-900/10 group animate-fadeIn bg-gradient-to-br ${theme.colors.c_background} ${theme.colors.hover} ${
//                     isNewTransaction[getTransactionKey(item)] ? 'animate-highlight' : ''
//                   }`}
//                   onClick={() => openTransactionDetails(item)}
//                   style={{ animationDelay: `${(index + 1) * 150}ms` }}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-center">
//                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                         item.transaction.type_trans === 'deposit' 
//                           ? 'bg-orange-500/20 text-orange-500' 
//                           : 'bg-gray-700/50 text-gray-300'
//                         } relative overflow-hidden group-hover:scale-110 transition-transform`}>
//                         {getTransactionTypeIcon(item.transaction.type_trans)}
//                         <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
//                       </div>
//                       <div className="ml-3 group-hover:translate-x-1 transition-transform">
//                         <div className="flex items-center">
//                           <span className="font-medium dark:text-white">
//                             {item.transaction.type_trans === 'deposit' ? 'Deposit' : 'Withdrawal'}
//                           </span>
//                           <span className={`text-xs ml-2 px-2 py-0.5 rounded-full whitespace-nowrap ${getStatusBadgeClass(item.transaction.status)} group-hover:scale-110 transition-transform relative`}>
//                             {item.transaction.status}
//                             <span className={`absolute -bottom-1 left-0 h-0.5 w-0 ${
//                               item.transaction.status.toLowerCase() === 'pending' 
//                                 ? 'bg-amber-500' 
//                                 : item.transaction.status.toLowerCase() === 'completed' || item.transaction.status.toLowerCase() === 'success'
//                                   ? 'bg-green-500' 
//                                   : 'bg-red-500'
//                             } group-hover:w-full transition-all duration-300`}></span>
//                           </span>
//                         </div>
//                         <div className="text-sm text-gray-500 dark:text-gray-400">
//                           {item.transaction.phone_number}
//                         </div>
//                         <div className="text-xs text-gray-400 dark:text-gray-500">
//                           {formatDate(item.transaction.created_at)}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className={`font-bold ${
//                         item.transaction.type_trans === 'deposit' 
//                           ? 'text-orange-600 dark:text-orange-400' 
//                           : 'text-blue-600 dark:text-blue-400'
//                       }`}>
//                         {formatAmount(item.transaction.amount)}
//                       </div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 group-hover:text-orange-400 transition-colors">
//                         Ref: {item.transaction.reference.substring(0, 8)}...
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
              
//               {/* Loading more indicator */}
//               {loading && page > 1 && (
//                 <div className="flex justify-center items-center h-16">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
//                 </div>
//               )}
              
//               {/* Load more button */}
//               {!loading && hasMore && (
//                 <div className="flex justify-center mt-4">
//                   <button 
//                     onClick={loadMore}
//                     className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
//                   >
//                     {t("Load More")}
//                     <ChevronDown size={16} />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
      
//       {/* WebSocket status indicator */}
//       <div className="fixed bottom-4 right-4 flex items-center space-x-2">
//         <div className={`h-2 w-2 rounded-full ${
//           wsStatus === 'connected' ? 'bg-green-500' : 
//           wsStatus === 'disconnected' ? 'bg-gray-500' : 'bg-red-500'
//         } ${wsStatus === 'connected' ? 'animate-pulse' : ''}`}></div>
//         <span className="text-xs text-gray-500">
//           {wsStatus === 'connected' ? 'Live' : 
//            wsStatus === 'disconnected' ? 'Offline' : 'Error'}
//         </span>
//         <button 
//           onClick={toggleRealTimeUpdates}
//           className={`text-xs ${isRealTimeEnabled ? 'text-green-500' : 'text-gray-500'} hover:underline`}
//         >
//           {isRealTimeEnabled ? t('Real-time On') : t('Real-time Off')}
//         </button>
//       </div>
      
//       {/* Last updated indicator */}
//       {lastFetchTime && (
//         <div className="text-xs text-gray-500 text-center mt-2">
//           {t("Last updated")}: {formatDate(lastFetchTime)}
//         </div>
//       )}
      
//       {/* Error message */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
//           <strong className="font-bold">{t("Error")}:</strong>
//           <span className="block sm:inline"> {error}</span>
//           <button 
//             className="absolute top-0 bottom-0 right-0 px-4 py-3"
//             onClick={() => setError(null)}
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}
      
//       {/* Transaction detail modal */}
//       {isModalOpen && selectedTransaction && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeInUp ${theme.colors.c_background}`}>
//             <button 
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//             >
//               <X size={20} />
//             </button>
            
//             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//               {getTransactionTypeIcon(selectedTransaction.transaction.type_trans)}
//               {selectedTransaction.transaction.type_trans === 'deposit' ? t('Deposit Details') : t('Withdrawal Details')}
//             </h3>
            
//             <div className="space-y-4">
//               <div className="flex flex-col">
//                 <span className="text-sm text-gray-500 dark:text-gray-400">{t("Status")}</span>
//                 <span className={`font-medium ${getStatusBadgeClass(selectedTransaction.transaction.status)}`}>
//                   {selectedTransaction.transaction.status}
//                 </span>
//               </div>
              
//               <div className="flex flex-col">
//                 <span className="text-sm text-gray-500 dark:text-gray-400">{t("Amount")}</span>
//                 <span className="font-bold text-lg">
//                   {formatAmount(selectedTransaction.transaction.amount)}
//                 </span>
//               </div>
              
//               <div className="flex flex-col">
//                 <span className="text-sm text-gray-500 dark:text-gray-400">{t("Date & Time")}</span>
//                 <span className="font-medium">
//                   {formatDate(selectedTransaction.transaction.created_at)}
//                 </span>
//               </div>
              
//               <div className="flex flex-col">
//                 <span className="text-sm text-gray-500 dark:text-gray-400">{t("Phone Number")}</span>
//                 <span className="font-medium">
//                   {selectedTransaction.transaction.phone_number}
//                 </span>
//               </div>
              
//               <div className="flex flex-col">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500 dark:text-gray-400">{t("Transaction Reference")}</span>
//                   <button 
//                     onClick={() => copyToClipboard(selectedTransaction.transaction.reference)}
//                     className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
//                   >
//                     <Copy size={12} />
//                     {t("Copy")}
//                   </button>
//                 </div>
//                 <span className="font-medium text-sm overflow-hidden text-ellipsis">
//                   {selectedTransaction.transaction.reference}
//                 </span>
//               </div>
              
//               <div className="flex flex-col">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500 dark:text-gray-400">{t("Transaction ID")}</span>
//                   <button 
//                     onClick={() => copyToClipboard(selectedTransaction.transaction.id.toString())}
//                     className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
//                   >
//                     <Copy size={12} />
//                     {t("Copy")}
//                   </button>
//                 </div>
//                 <span className="font-medium text-sm">
//                   {selectedTransaction.transaction.id}
//                 </span>
//               </div>
              
//             </div>
            
//             <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//               >
//                 {t("Close")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// }