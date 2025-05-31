// "use client"
// import React, { useState } from 'react';
// import { Activity, ArrowUpRight, ArrowDownLeft, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// // Mock data for demonstration
// const mockTransactions = [
//   {
//     id: '1',
//     transaction: {
//       type_trans: 'deposit',
//       status: 'completed',
//       phone_number: '+229 97 12 34 56',
//       created_at: '2024-05-29T10:30:00Z',
//       amount: 50000,
//       reference: 'TXN123456789ABCDEF'
//     }
//   },
//   {
//     id: '2',
//     transaction: {
//       type_trans: 'withdrawal',
//       status: 'pending',
//       phone_number: '+229 96 87 65 43',
//       created_at: '2024-05-29T09:15:00Z',
//       amount: 25000,
//       reference: 'TXN987654321FEDCBA'
//     }
//   },
//   {
//     id: '3',
//     transaction: {
//       type_trans: 'deposit',
//       status: 'failed',
//       phone_number: '+229 95 11 22 33',
//       created_at: '2024-05-28T16:45:00Z',
//       amount: 75000,
//       reference: 'TXN456789123GHIJKL'
//     }
//   }
// ];

// const TransactionList = () => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [transactions] = useState(mockTransactions);

//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: 'short',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getTransactionTypeIcon = (type) => {
//     return type === 'deposit' ? (
//       <ArrowDownLeft className="w-5 h-5" />
//     ) : (
//       <ArrowUpRight className="w-5 h-5" />
//     );
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'completed':
//         return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'pending':
//         return <Clock className="w-4 h-4 text-yellow-500" />;
//       case 'failed':
//         return <XCircle className="w-4 h-4 text-red-500" />;
//       default:
//         return <AlertCircle className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
//       case 'failed':
//         return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
//     }
//   };

//   const openTransactionDetails = (transaction) => {
//     console.log('Opening transaction details:', transaction);
//   };

//   const getTransactionKey = (item) => item.id;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
//           <p className="text-slate-400">Track all your financial activities</p>
//         </div>

//         {/* Tab Navigation */}
//         {/* <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl mb-6 backdrop-blur-sm border border-slate-700/50">
//           {['all', 'deposits', 'withdrawals'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
//                 activeTab === tab
//                   ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
//                   : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div> */}

//         {/* Transaction List */}
//         <div className="space-y-4">
//           <style>
//             {`
//               @keyframes slideInUp {
//                 from {
//                   opacity: 0;
//                   transform: translateY(20px) scale(0.95);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0) scale(1);
//                 }
//               }
              
//               @keyframes shimmer {
//                 0% { background-position: -200px 0; }
//                 100% { background-position: calc(200px + 100%) 0; }
//               }
              
//               .shimmer-effect {
//                 background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
//                 background-size: 200px 100%;
//                 animation: shimmer 2s infinite;
//               }
//             `}
//           </style>

//           {loading && page === 1 ? (
//             <div className="flex justify-center items-center py-16">
//               <div className="relative">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500"></div>
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
//               </div>
//             </div>
//           ) : transactions.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 px-6">
//               <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 shadow-2xl border border-slate-600/50">
//                 <Activity className="w-12 h-12 text-slate-400 mx-auto" />
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-3">No transactions found</h3>
//               <p className="text-slate-400 text-center max-w-md leading-relaxed">
//                 {activeTab === 'all' 
//                   ? "Your transaction history will appear here once you start making payments."
//                   : activeTab === 'deposits'
//                   ? "No deposits have been recorded yet."
//                   : "No withdrawals have been recorded yet."}
//               </p>
//             </div>
//           ) : (
//             <div className="grid gap-4">
//               {transactions.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 hover:border-purple-500/50 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10"
//                   onClick={() => openTransactionDetails(item)}
//                   style={{
//                     animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
//                   }}
//                 >
//                   {/* Hover shimmer effect */}
//                   <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
//                   <div className="relative p-6">
//                     <div className="flex items-center justify-between">
//                       {/* Left Section */}
//                       <div className="flex items-center space-x-4 flex-1">
//                         {/* Icon with enhanced styling */}
//                         <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
//                           item.transaction.type_trans === 'deposit'
//                             ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20'
//                             : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
//                         }`}>
//                           {getTransactionTypeIcon(item.transaction.type_trans)}
//                           <div className={`absolute inset-0 rounded-2xl ${
//                             item.transaction.type_trans === 'deposit' 
//                               ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10' 
//                               : 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10'
//                           } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
//                         </div>

//                         {/* Transaction Details */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center space-x-3 mb-2">
//                             <h3 className="font-semibold text-lg text-white group-hover:text-purple-200 transition-colors duration-300">
//                               {item.transaction.type_trans === 'deposit' ? 'Deposit' : 'Withdrawal'}
//                             </h3>
//                             <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusBadgeClass(item.transaction.status)} group-hover:scale-105`}>
//                               {getStatusIcon(item.transaction.status)}
//                               <span className="ml-1 capitalize">{item.transaction.status}</span>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center space-x-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
//                             <span className="font-mono">{item.transaction.phone_number}</span>
//                             <span>•</span>
//                             <span>{formatDate(item.transaction.created_at)}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Right Section */}
//                       <div className="text-right space-y-2">
//                         <div className={`font-bold text-2xl transition-all duration-300 group-hover:scale-105 ${
//                           item.transaction.type_trans === 'deposit'
//                             ? 'text-green-400 group-hover:text-green-300'
//                             : 'text-blue-400 group-hover:text-blue-300'
//                         }`}>
//                           {item.transaction.type_trans === 'deposit' ? '+' : '-'}
//                           {formatAmount(item.transaction.amount)}
//                         </div>
//                         <div className="text-xs text-slate-500 font-mono">
//                           #{item.transaction.reference.substring(0, 12)}...
//                         </div>
//                       </div>

//                       {/* Arrow Icon */}
//                       <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
//                         <ChevronRight className="w-5 h-5 text-slate-400" />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Gradient border effect on hover */}
//                   <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
//                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-sm"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Load More Indicator */}
//           {loading && page > 1 && (
//             <div className="flex justify-center items-center py-8">
//               <div className="relative">
//                 <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-500/30 border-t-purple-500"></div>
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse"></div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionList;

















// "use client"
// import React, { useState } from 'react';
// import { Activity, ArrowUpRight, ArrowDownLeft, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, X, Copy, Check, Phone, CreditCard, Calendar, Hash, Smartphone } from 'lucide-react';

// // Mock data for demonstration
// const mockTransactions = [
//   {
//     id: '1',
//     transaction: {
//       type_trans: 'deposit',
//       status: 'completed',
//       phone_number: '+229 97 12 34 56',
//       created_at: '2024-05-29T10:30:00Z',
//       amount: 50000,
//       reference: 'TXN123456789ABCDEF'
//     }
//   },
//   {
//     id: '2',
//     transaction: {
//       type_trans: 'withdrawal',
//       status: 'pending',
//       phone_number: '+229 96 87 65 43',
//       created_at: '2024-05-29T09:15:00Z',
//       amount: 25000,
//       reference: 'TXN987654321FEDCBA'
//     }
//   },
//   {
//     id: '3',
//     transaction: {
//       type_trans: 'deposit',
//       status: 'failed',
//       phone_number: '+229 95 11 22 33',
//       created_at: '2024-05-28T16:45:00Z',
//       amount: 75000,
//       reference: 'TXN456789123GHIJKL'
//     }
//   }
// ];

// const TransactionList = () => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [transactions] = useState(mockTransactions);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);

//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: 'short',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getTransactionTypeIcon = (type) => {
//     return type === 'deposit' ? (
//       <ArrowDownLeft className="w-5 h-5" />
//     ) : (
//       <ArrowUpRight className="w-5 h-5" />
//     );
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'completed':
//         return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'pending':
//         return <Clock className="w-4 h-4 text-yellow-500" />;
//       case 'failed':
//         return <XCircle className="w-4 h-4 text-red-500" />;
//       default:
//         return <AlertCircle className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
//       case 'failed':
//         return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
//     }
//   };

//   const openTransactionDetails = (transaction) => {
//     setSelectedTransaction(transaction);
//     setIsModalOpen(true);
//   };

//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       // You could add a toast notification here
//       console.log('Copied to clipboard:', text);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   const getTransactionKey = (item) => item.id;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
//           <p className="text-slate-400">Track all your financial activities</p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl mb-6 backdrop-blur-sm border border-slate-700/50">
//           {['all', 'deposits', 'withdrawals'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
//                 activeTab === tab
//                   ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
//                   : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* Transaction List */}
//         <div className="space-y-4">
//           <style>
//             {`
//               @keyframes slideInUp {
//                 from {
//                   opacity: 0;
//                   transform: translateY(20px) scale(0.95);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0) scale(1);
//                 }
//               }
              
//               @keyframes shimmer {
//                 0% { background-position: -200px 0; }
//                 100% { background-position: calc(200px + 100%) 0; }
//               }
              
//               @keyframes modalSlideIn {
//                 from {
//                   opacity: 0;
//                   transform: translateY(30px) scale(0.9);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0) scale(1);
//                 }
//               }
              
//               @keyframes backdropFadeIn {
//                 from {
//                   opacity: 0;
//                   backdrop-filter: blur(0px);
//                 }
//                 to {
//                   opacity: 1;
//                   backdrop-filter: blur(8px);
//                 }
//               }
              
//               .shimmer-effect {
//                 background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
//                 background-size: 200px 100%;
//                 animation: shimmer 2s infinite;
//               }
              
//               .modal-backdrop {
//                 animation: backdropFadeIn 0.3s ease-out;
//               }
              
//               .modal-content {
//                 animation: modalSlideIn 0.4s ease-out;
//               }
//             `}
//           </style>

//           {loading && page === 1 ? (
//             <div className="flex justify-center items-center py-16">
//               <div className="relative">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500"></div>
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
//               </div>
//             </div>
//           ) : transactions.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 px-6">
//               <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 shadow-2xl border border-slate-600/50">
//                 <Activity className="w-12 h-12 text-slate-400 mx-auto" />
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-3">No transactions found</h3>
//               <p className="text-slate-400 text-center max-w-md leading-relaxed">
//                 {activeTab === 'all' 
//                   ? "Your transaction history will appear here once you start making payments."
//                   : activeTab === 'deposits'
//                   ? "No deposits have been recorded yet."
//                   : "No withdrawals have been recorded yet."}
//               </p>
//             </div>
//           ) : (
//             <div className="grid gap-4">
//               {transactions.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 hover:border-purple-500/50 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10"
//                   onClick={() => openTransactionDetails(item)}
//                   style={{
//                     animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
//                   }}
//                 >
//                   {/* Hover shimmer effect */}
//                   <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
//                   <div className="relative p-6">
//                     <div className="flex items-center justify-between">
//                       {/* Left Section */}
//                       <div className="flex items-center space-x-4 flex-1">
//                         {/* Icon with enhanced styling */}
//                         <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
//                           item.transaction.type_trans === 'deposit'
//                             ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20'
//                             : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
//                         }`}>
//                           {getTransactionTypeIcon(item.transaction.type_trans)}
//                           <div className={`absolute inset-0 rounded-2xl ${
//                             item.transaction.type_trans === 'deposit' 
//                               ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10' 
//                               : 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10'
//                           } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
//                         </div>

//                         {/* Transaction Details */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center space-x-3 mb-2">
//                             <h3 className="font-semibold text-lg text-white group-hover:text-purple-200 transition-colors duration-300">
//                               {item.transaction.type_trans === 'deposit' ? 'Deposit' : 'Withdrawal'}
//                             </h3>
//                             <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusBadgeClass(item.transaction.status)} group-hover:scale-105`}>
//                               {getStatusIcon(item.transaction.status)}
//                               <span className="ml-1 capitalize">{item.transaction.status}</span>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center space-x-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
//                             <span className="font-mono">{item.transaction.phone_number}</span>
//                             <span>•</span>
//                             <span>{formatDate(item.transaction.created_at)}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Right Section */}
//                       <div className="text-right space-y-2">
//                         <div className={`font-bold text-2xl transition-all duration-300 group-hover:scale-105 ${
//                           item.transaction.type_trans === 'deposit'
//                             ? 'text-green-400 group-hover:text-green-300'
//                             : 'text-blue-400 group-hover:text-blue-300'
//                         }`}>
//                           {item.transaction.type_trans === 'deposit' ? '+' : '-'}
//                           {formatAmount(item.transaction.amount)}
//                         </div>
//                         <div className="text-xs text-slate-500 font-mono">
//                           #{item.transaction.reference.substring(0, 12)}...
//                         </div>
//                       </div>

//                       {/* Arrow Icon */}
//                       <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
//                         <ChevronRight className="w-5 h-5 text-slate-400" />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Gradient border effect on hover */}
//                   <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
//                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-sm"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Load More Indicator */}
//           {loading && page > 1 && (
//             <div className="flex justify-center items-center py-8">
//               <div className="relative">
//                 <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-500/30 border-t-purple-500"></div>
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse"></div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Enhanced Transaction Details Modal */}
//         {isModalOpen && selectedTransaction && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-backdrop">
//             <div className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-3xl w-full max-w-lg shadow-2xl border border-slate-600/50 modal-content">
//               {/* Header */}
//               <div className="relative p-6 pb-0">
//                 <div className="flex justify-between items-start mb-6">
//                   <div>
//                     <h3 className="text-2xl font-bold text-white mb-1">Transaction Details</h3>
//                     <p className="text-slate-400 text-sm">Review your transaction information</p>
//                   </div>
//                   <button 
//                     onClick={() => setIsModalOpen(false)}
//                     className="w-10 h-10 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center group"
//                   >
//                     <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
//                   </button>
//                 </div>
                
//                 {/* Transaction Type & Status Card */}
//                 <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30">
//                   <div className="flex items-center gap-4">
//                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
//                       selectedTransaction.transaction.type_trans === 'deposit' 
//                         ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20' 
//                         : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
//                     }`}>
//                       {getTransactionTypeIcon(selectedTransaction.transaction.type_trans)}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h4 className="font-semibold text-xl text-white">
//                           {selectedTransaction.transaction.type_trans === 'deposit' ? 'Deposit' : 'Withdrawal'}
//                         </h4>
//                         <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedTransaction.transaction.status)}`}>
//                           {getStatusIcon(selectedTransaction.transaction.status)}
//                           <span className="ml-1 capitalize">{selectedTransaction.transaction.status}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center text-slate-400 text-sm">
//                         <Calendar className="w-4 h-4 mr-2" />
//                         {formatDate(selectedTransaction.transaction.created_at)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Amount Section */}
//               <div className="px-6 py-4">
//                 <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/30">
//                   <div className="text-center">
//                     <div className="text-slate-400 text-sm mb-2 font-medium">Transaction Amount</div>
//                     <div className={`text-4xl font-bold mb-2 ${
//                       selectedTransaction.transaction.type_trans === 'deposit' 
//                         ? 'text-green-400' 
//                         : 'text-blue-400'
//                     }`}>
//                       {selectedTransaction.transaction.type_trans === 'deposit' ? '+' : '-'}
//                       {formatAmount(selectedTransaction.transaction.amount)}
//                     </div>
//                     <div className="text-slate-500 text-xs">
//                       {selectedTransaction.transaction.type_trans === 'deposit' ? 'Received' : 'Sent'}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Details Grid */}
//               <div className="px-6 pb-6">
//                 <div className="space-y-4">
//                   {/* Transaction ID */}
//                   <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center text-slate-400 text-sm font-medium">
//                         <Hash className="w-4 h-4 mr-2" />
//                         Transaction ID
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-white text-sm font-mono">{selectedTransaction.transaction.reference.substring(0, 16)}...</span>
//                         <button 
//                           onClick={() => copyToClipboard(selectedTransaction.id)}
//                           className="w-8 h-8 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center group"
//                         >
//                           <Copy size={14} className="group-hover:scale-110 transition-transform duration-300" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Reference */}
//                   <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center text-slate-400 text-sm font-medium">
//                         <CreditCard className="w-4 h-4 mr-2" />
//                         Reference
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-white text-sm font-mono">{selectedTransaction.transaction.reference}</span>
//                         <button 
//                           onClick={() => copyToClipboard(selectedTransaction.transaction.reference)}
//                           className="w-8 h-8 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center group"
//                         >
//                           <Copy size={14} className="group-hover:scale-110 transition-transform duration-300" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Phone Number */}
//                   <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center text-slate-400 text-sm font-medium">
//                         <Phone className="w-4 h-4 mr-2" />
//                         Phone Number
//                       </div>
//                       <span className="text-white text-sm font-mono">{selectedTransaction.transaction.phone_number}</span>
//                     </div>
//                   </div>
                  
//                   {/* Network (if available) */}
//                   {selectedTransaction.transaction.network && (
//                     <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center text-slate-400 text-sm font-medium">
//                           <Smartphone className="w-4 h-4 mr-2" />
//                           Network
//                         </div>
//                         <span className="text-white text-sm">{selectedTransaction.transaction.network.public_name || selectedTransaction.transaction.network.name}</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Footer */}
//               <div className="px-6 pb-6">
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setIsModalOpen(false)}
//                     className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all duration-300 font-medium border border-slate-600/30 hover:border-slate-500/50"
//                   >
//                     Close
//                   </button>
//                   <button
//                     onClick={() => copyToClipboard(selectedTransaction.transaction.reference)}
//                     className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2"
//                   >
//                     <Copy size={16} />
//                     Copy Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TransactionList;



"use client"
import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, X, Copy, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle, Calendar, Hash, CreditCard, Phone, Smartphone, Activity } from 'lucide-react';

// Mock data for demonstration
const mockTransactions = [
  {
    id: '1',
    type_trans: 'deposit',
    status: 'completed',
    phone_number: '+229 97 12 34 56',
    created_at: '2024-05-29T10:30:00Z',
    amount: 50000,
    reference: 'TXN123456789ABCDEF',
    network: { public_name: 'MTN Mobile Money', name: 'MTN' }
  },
  {
    id: '2',
    type_trans: 'withdrawal',
    status: 'pending',
    phone_number: '+229 96 87 65 43',
    created_at: '2024-05-29T09:15:00Z',
    amount: 25000,
    reference: 'TXN987654321FEDCBA',
    network: { public_name: 'Moov Money', name: 'Moov' }
  },
  {
    id: '3',
    type_trans: 'deposit',
    status: 'failed',
    phone_number: '+229 95 11 22 33',
    created_at: '2024-05-28T16:45:00Z',
    amount: 75000,
    reference: 'TXN456789123GHIJKL',
    error_message: 'Insufficient funds in sender account'
  }
];

const ModernTransactionList = () => {
  const [transactions] = useState(mockTransactions);
  const [loading, setLoading] = useState(false);
  const [hasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const lastTransactionElement = useRef();

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeIcon = (type) => {
    return type === 'deposit' ? (
      <ArrowDownLeft className="w-5 h-5" />
    ) : (
      <ArrowUpRight className="w-5 h-5" />
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const StatusBadge = ({ status }) => (
    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusBadgeClass(status)}`}>
      {getStatusIcon(status)}
      <span className="ml-1 capitalize">{status}</span>
    </div>
  );

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
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
            <h1 className="text-3xl font-bold text-white mb-2">Toutes les transactions</h1>
            <p className="text-slate-400">Suivez toutes vos activités financières</p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-white bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden">
          {/* Mobile View */}
          <div className="block md:hidden">
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
              <div className="divide-y divide-slate-600/30">
                {transactions.map((tx, index) => (
                  <div 
                    key={tx.id} 
                    ref={index === transactions.length - 1 ? lastTransactionElement : null}
                    className="group relative overflow-hidden p-6 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 cursor-pointer transition-all duration-500"
                    onClick={() => {
                      setSelectedTransaction(tx);
                      setIsModalOpen(true);
                    }}
                    style={{
                      animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
                    }}
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                            tx.type_trans === 'deposit'
                              ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20'
                              : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                          }`}>
                            {getTransactionTypeIcon(tx.type_trans)}
                          </div>
                          <div>
                            <div className="text-white font-semibold group-hover:text-purple-200 transition-colors duration-300">
                              {tx.type_trans === 'deposit' ? 'Dépôt' : 'Retrait'}
                            </div>
                            <div className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">
                              {tx.phone_number}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={tx.status} />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="text-slate-400 text-sm">Montant:</div>
                          <div className={`font-bold text-lg ${
                            tx.type_trans === 'deposit' 
                              ? 'text-green-400 group-hover:text-green-300' 
                              : 'text-blue-400 group-hover:text-blue-300'
                          } transition-colors duration-300`}>
                            {tx.type_trans === 'deposit' ? '+' : '-'}{formatAmount(tx.amount)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-slate-400 text-sm">Référence:</div>
                          <div className="text-white text-sm font-mono">{tx.reference.substring(0, 12)}...</div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-slate-400 text-sm">Date:</div>
                          <div className="text-white text-sm">{formatDate(tx.created_at)}</div>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
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
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-sm">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Montant
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Référence
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/30">
                  {transactions.map((tx, index) => (
                    <tr 
                      key={tx.id} 
                      className="group hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-slate-600/30 transition-all duration-500 relative overflow-hidden"
                      style={{
                        animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
                      }}
                    >
                      {/* Hover shimmer effect */}
                      <td colSpan="6" className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></td>
                      
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                            tx.type_trans === 'deposit' 
                              ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20' 
                              : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                          }`}>
                            {getTransactionTypeIcon(tx.type_trans)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors duration-300">
                              {tx.type_trans === 'deposit' ? 'Dépôt' : 'Retrait'}
                            </div>
                            <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                              {tx.phone_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className={`text-sm font-bold transition-all duration-300 group-hover:scale-105 ${
                          tx.type_trans === 'deposit' 
                            ? 'text-green-400 group-hover:text-green-300' 
                            : 'text-blue-400 group-hover:text-blue-300'
                        }`}>
                          {tx.type_trans === 'deposit' ? '+' : '-'}{formatAmount(tx.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className="text-sm text-white font-mono group-hover:text-purple-200 transition-colors duration-300">
                          {tx.reference}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white group-hover:text-purple-200 transition-colors duration-300 relative">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={() => {
                            setSelectedTransaction(tx);
                            setIsModalOpen(true);
                          }}
                          className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {loading && hasMore && (
            <div className="flex justify-center p-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500/30 border-t-purple-500"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
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
                    <p className="text-red-400 font-medium text-sm mb-2">Message d'erreur</p>
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
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTransactionList;