// // components/Dashboard.js
// "use client";
// import { useState, useEffect } from 'react';
// import { ArrowUpRight, ArrowDownLeft, RotateCw, Bell, User, ChevronRight, Activity } from 'lucide-react';

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState('all');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showNotification, setShowNotification] = useState(false);
//   const [pulseNotification, setPulseNotification] = useState(false);
//   const [animateHeader, setAnimateHeader] = useState(false);
  
//   // Simulates loading state
//   useEffect(() => {
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
    
//     // Show a notification after 3 seconds
//     setTimeout(() => {
//       setShowNotification(true);
//       setPulseNotification(true);
      
//       // Stop pulsing after 5 seconds
//       setTimeout(() => {
//         setPulseNotification(false);
//       }, 5000);
//     }, 3000);
    
//     // Trigger header animation
//     setTimeout(() => {
//       setAnimateHeader(true);
//     }, 500);
//   }, []);
  
//   const transactions = [
//     { id: 'B11E199C-4D2C-4DAA-8024-25C363C21D49', type: 'deposit', amount: 'XOF 200', date: '04/27/2025', time: '04:45 PM', status: 'pending' },
//     { id: 'ZTAY745595714', type: 'withdrawal', amount: 'XOF', date: '04/25/2025', time: '04:41 PM', status: 'pending' },
//     { id: 'HZRM745595557', type: 'withdrawal', amount: 'XOF', date: '04/25/2025', time: '04:39 PM', status: 'pending' },
//     { id: '6E76C4FA-10FF-4D3F-BBD6-B9D723294B3F', type: 'deposit', amount: 'XOF 200', date: '04/25/2025', time: '03:35 PM', status: 'pending' },
//     { id: 'WINS745582036', type: 'deposit', amount: 'XOF 200', date: '04/25/2025', time: '12:53 PM', status: 'pending' },
//   ];

//   // Filter transactions based on active tab
//   const filteredTransactions = transactions.filter(transaction => {
//     if (activeTab === 'all') return true;
//     if (activeTab === 'deposits') return transaction.type === 'deposit';
//     if (activeTab === 'withdrawals') return transaction.type === 'withdrawal';
//     return true;
//   });

//   return (
//     <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
//       {/* Background gradient effects */}
//       <div className="absolute top-20 -left-10 w-40 h-40 bg-red-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
//       <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-700/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
//       {/* Loading overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-gray-900/90 z-50 flex items-center justify-center">
//           <div className="flex flex-col items-center gap-3">
//             <div className="w-16 h-16 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin"></div>
//             <p className="text-gray-400">Loading LamedCash...</p>
//           </div>
//         </div>
//       )}
      
//       {/* Header */}
//       <header className={`py-4 px-6 flex items-center justify-between border-b border-gray-800 transition-all duration-700 ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center relative group">
//             <span className="text-sm font-bold group-hover:scale-110 transition-transform">L</span>
//             <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75 duration-1000 hidden group-hover:block"></div>
//           </div>
//           <div className="flex items-center">
//             <p className="text-sm">Hello, <span className="text-red-500 font-medium relative after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-red-500 hover:after:w-full after:transition-all">rash boy</span>!</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className={`relative ${showNotification ? 'animate-bounce' : ''} ${pulseNotification ? 'animate-pulse' : ''}`}>
//             <Bell size={20} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
//             <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs">
//               2
//             </span>
//           </div>
//           <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer group">
//             <User size={16} className="text-gray-400 group-hover:text-white transition-colors group-hover:scale-110 duration-300" />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="py-6 px-6">
//         <h1 className={`text-2xl font-bold mb-6 relative inline-block ${animateHeader ? 'animate-fadeIn' : 'opacity-0'}`}>
//           Welcome to yapson
//           <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 animate-widthExpand"></span>
//         </h1>
        
//         {/* Action Buttons */}
//         <div className={`flex gap-4 mb-8 ${animateHeader ? 'animate-slideInRight' : 'opacity-0'}`} style={{animationDelay: '300ms'}}>
//           <button className="group relative flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 w-40 overflow-hidden">
//             <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
//             <span className="absolute -inset-px bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-30 group-hover:animate-pulse rounded-lg"></span>
//             <span className="relative z-10 flex items-center gap-2">
//               DEPOSIT
//               <ArrowDownLeft size={16} className="transition-transform group-hover:translate-y-1 group-hover:animate-bounce" />
//             </span>
//           </button>
//           <button className="group relative flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 w-40 border border-gray-700 overflow-hidden">
//             <span className="absolute inset-0 w-0 h-full bg-red-600/20 transition-all duration-300 group-hover:w-full"></span>
//             <span className="relative z-10 flex items-center gap-2">
//               WITHDRAW
//               <ArrowUpRight size={16} className="transition-transform group-hover:translate-y-1 group-hover:-translate-x-1 group-hover:animate-pulse" />
//             </span>
//           </button>
//         </div>
        
//         {/* Transaction History */}
//         <div className={`bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/30 shadow-xl relative overflow-hidden ${animateHeader ? 'animate-fadeIn' : 'opacity-0'}`} style={{animationDelay: '600ms'}}>
//           {/* Animated glowing corner effect */}
//           <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/10 rounded-full blur-xl animate-pulse-slow"></div>
          
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2 group">
//               <Activity size={18} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
//               <h2 className="text-lg font-semibold group-hover:translate-x-1 transition-transform">Transaction history</h2>
//               <RotateCw size={16} className="text-gray-400 cursor-pointer hover:text-white transition-colors hover:rotate-180 duration-500" />
            
//             <div className="flex gap-4 text-sm">
//               <button 
//                 className={`${activeTab === 'all' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1`}
//                 onClick={() => setActiveTab('all')}
//               >
//                 See All 
//                 <span className="text-xs text-gray-500">•</span>
//               </button>
//               <button 
//                 className={`${activeTab === 'deposits' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1`}
//                 onClick={() => setActiveTab('deposits')}
//               >
//                 See Deposits 
//                 <span className="text-xs text-gray-500">•</span>
//               </button>
//               <button 
//                 className={`${activeTab === 'withdrawals' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1`}
//                 onClick={() => setActiveTab('withdrawals')}
//               >
//                 See Withdrawals 
//                 <span className="text-xs text-gray-500">•</span>
//               </button>
//             </div>
//           </div>
          
//           {/* Transactions List */}
//           <div className="space-y-3">
//             {filteredTransactions.map((transaction, index) => (
//               <div 
//                 key={transaction.id} 
//                 className="flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-750 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/10 group cursor-pointer animate-fadeIn"
//                 style={{ animationDelay: `${(index + 1) * 150}ms` }}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === 'deposit' ? 'bg-red-500/20 text-red-500' : 'bg-gray-700/50 text-gray-300'} relative overflow-hidden group-hover:scale-110 transition-transform`}>
//                     {transaction.type === 'deposit' ? 
//                       <ArrowDownLeft size={20} className="group-hover:animate-bounce" /> : 
//                       <ArrowUpRight size={20} className="group-hover:animate-pulse" />
//                     }
//                     <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
//                   </div>
//                   <div className="group-hover:translate-x-1 transition-transform">
//                     <p className="text-sm font-medium uppercase">{transaction.type} || <span className="group-hover:text-red-400 transition-colors">{transaction.id.substring(0, 20)}{transaction.id.length > 20 ? '...' : ''}</span> || {transaction.amount}</p>
//                     <p className="text-xs text-gray-400">{transaction.date} {transaction.time}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <span className={`text-sm font-medium ${transaction.status === 'pending' ? 'text-amber-500' : transaction.status === 'completed' ? 'text-green-500' : 'text-red-500'} group-hover:scale-110 transition-transform relative`}>
//                     {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
//                     <span className={`absolute -bottom-1 left-0 h-0.5 w-0 ${transaction.status === 'pending' ? 'bg-amber-500' : transaction.status === 'completed' ? 'bg-green-500' : 'bg-red-500'} group-hover:w-full transition-all duration-300`}></span>
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {/* See More Button */}
//           <div className="flex justify-end mt-6">
//             <button className="group flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 relative overflow-hidden">
//               <span className="absolute inset-0 bg-gradient-to-r from-red-800/40 to-transparent w-0 group-hover:w-full transition-all duration-300"></span>
//               <span className="relative z-10 flex items-center gap-1">
//                 See more
//                 <ChevronRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
//               </span>
//             </button>
//           </div>
//         </div>
//         </div>
//       </main>
//     </div>
//   );
// }














// "use client";
// import { useState, useEffect } from 'react';
// import { ArrowUpRight, ArrowDownLeft, RotateCw, ChevronRight, Activity, Menu, X } from 'lucide-react';
// import DashboardHeader from '@/components/DashboardHeader';


// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState('all');
//   const [isLoading, setIsLoading] = useState(true);
//   const [animateHeader, setAnimateHeader] = useState(false);
//   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'dark';
//     document.documentElement.classList.toggle('dark', savedTheme === 'dark');
//   }, []);
  
//   // Simulates loading state
//   useEffect(() => {

//     setAnimateHeader(true);


//     setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
    
//     // Show a notification after 3 seconds
   
    
//     // Trigger header animation
//     setTimeout(() => {
//       setAnimateHeader(true);
//     }, 500);
//   }, []);
  
//   const transactions = [
//     { id: 'B11E199C-4D2C-4DAA-8024-25C363C21D49', type: 'deposit', amount: 'XOF 200', date: '04/27/2025', time: '04:45 PM', status: 'pending' },
//     { id: 'ZTAY745595714', type: 'withdrawal', amount: 'XOF', date: '04/25/2025', time: '04:41 PM', status: 'pending' },
//     { id: 'HZRM745595557', type: 'withdrawal', amount: 'XOF', date: '04/25/2025', time: '04:39 PM', status: 'pending' },
//     { id: '6E76C4FA-10FF-4D3F-BBD6-B9D723294B3F', type: 'deposit', amount: 'XOF 200', date: '04/25/2025', time: '03:35 PM', status: 'pending' },
//     { id: 'WINS745582036', type: 'deposit', amount: 'XOF 200', date: '04/25/2025', time: '12:53 PM', status: 'pending' },
//   ];

//   // Filter transactions based on active tab
//   const filteredTransactions = transactions.filter(transaction => {
//     if (activeTab === 'all') return true;
//     if (activeTab === 'deposits') return transaction.type === 'deposit';
//     if (activeTab === 'withdrawals') return transaction.type === 'withdrawal';
//     return true;
//   });

//   // Mobile filter toggle
//   const toggleMobileFilter = () => {
//     setMobileFilterOpen(!mobileFilterOpen);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white font-sans relative overflow-hidden">
//       {/* Background gradient effects */}
//       <div className="absolute top-20 -left-10 w-40 h-40 bg-orange-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
//       <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-700/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
//       {/* Loading overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-gray-900/90 z-50 flex items-center justify-center">
//           <div className="flex flex-col items-center gap-3">
//             <div className="w-16 h-16 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
//             <p className="text-gray-400">Loading Yapson...</p>
//           </div>
//         </div>
//       )}
      
//       {/* Header */}
//       <DashboardHeader />

//       {/* Main Content */}
//       <main className="py-4 md:py-6 px-4 md:px-6">
//         <h1 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 relative inline-block ${animateHeader ? 'animate-fadeIn' : 'opacity-0'}`}>
//           Welcome to yapson
//           <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 animate-widthExpand"></span>
//         </h1>
        
//         {/* Action Buttons */}
//         <div className={`flex gap-2 md:gap-4 mb-6 md:mb-8 ${animateHeader ? 'animate-slideInRight' : 'opacity-0'}`} style={{animationDelay: '300ms'}} >
//           <a className="group relative flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 md:w-40 overflow-hidden text-sm md:text-base" href="/deposit">
//             <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
//             <span className="absolute -inset-px bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-30 group-hover:animate-pulse rounded-lg"></span>
//             <span className="relative z-10 flex items-center gap-1 md:gap-2">
//               DEPOSIT
//               <ArrowDownLeft size={16} className="transition-transform group-hover:translate-y-1 group-hover:animate-bounce" />
//             </span>
//           </a>
//           <a className="group relative flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 md:w-40 border border-gray-700 overflow-hidden text-sm md:text-base" href='/withdraw'>
//             <span className="absolute inset-0 w-0 h-full bg-orange-600/20 transition-all duration-300 group-hover:w-full"></span>
//             <span className="relative z-10 flex items-center gap-1 md:gap-2">
//               WITHDRAW
//               <ArrowUpRight size={16} className="transition-transform group-hover:translate-y-1 group-hover:-translate-x-1 group-hover:animate-pulse" />
//             </span>
//           </a>
//         </div>
        
//         {/* Transaction History */}
//         <div className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-gray-700/30 shadow-xl relative overflow-hidden ${animateHeader ? 'animate-fadeIn' : 'opacity-0'}`} style={{animationDelay: '600ms'}}>
// /          <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse-slow"></div>
          
//            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
//              <div className="flex items-center gap-2 group">
//                <Activity size={18} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
//                <h2 className="text-lg font-semibold group-hover:translate-x-1 transition-transform">Transaction history</h2>
//                <RotateCw size={16} className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors hover:rotate-180 duration-500" />
//              </div>
            

//              <div className="hidden md:flex gap-4 text-sm">
//                <button 
//                 className={`${activeTab === 'all' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1`}
//                 onClick={() => setActiveTab('all')}
//               >
//                 See All 
//                 <span className="text-xs text-gray-500">•</span>
//               </button>
//               <button 
//                 className={`${activeTab === 'deposits' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1`}
//                 onClick={() => setActiveTab('deposits')}
//               >
//                 See Deposits 
//                 <span className="text-xs text-gray-500">•</span>
//               </button>
//               <button 
//                 className={`${activeTab === 'withdrawals' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1`}
//                 onClick={() => setActiveTab('withdrawals')}
//               >
//                 See Withdrawals 
//                 <span className="text-xs text-gray-500">•</span>
//               </button>
//             </div>
            

//             <div className="md:hidden">
//               <button 
//                 onClick={toggleMobileFilter}
//                 className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 rounded-lg text-sm"
//               >
//                 <span>{activeTab === 'all' ? 'All Transactions' : activeTab === 'deposits' ? 'Deposits' : 'Withdrawals'}</span>
//                 <Menu size={18} className={`transition-transform ${mobileFilterOpen ? 'hidden' : 'block'}`} />
//                 <X size={18} className={`transition-transform ${mobileFilterOpen ? 'block' : 'hidden'}`} />
//               </button>
              

//               {mobileFilterOpen && (
//                 <div className="absolute z-10 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 animate-fadeIn">
//                   <button 
//                     className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'all' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                     onClick={() => {
//                       setActiveTab('all');
//                       setMobileFilterOpen(false);
//                     }}
//                   >
//                     All Transactions
//                   </button>
//                   <button 
//                     className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'deposits' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                     onClick={() => {
//                       setActiveTab('deposits');
//                       setMobileFilterOpen(false);
//                     }}
//                   >
//                     Deposits Only
//                   </button>
//                   <button 
//                     className={`w-full text-left px-4 py-2 text-sm ${activeTab === 'withdrawals' ? 'text-orange-500 bg-gray-700/50' : 'text-gray-300'}`}
//                     onClick={() => {
//                       setActiveTab('withdrawals');
//                       setMobileFilterOpen(false);
//                     }}
//                   >
//                     Withdrawals Only
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
          

//           <div className="space-y-3">
//             {filteredTransactions.map((transaction, index) => (
//               <div 
//                 key={transaction.id} 
//                 className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 rounded-lg bg-gray-100 hover:bg-gray-750 transition-all duration-300 hover:shadow-lg hover:shadow-orange-900/10 group cursor-pointer animate-fadeIn"
//                 style={{ animationDelay: `${(index + 1) * 150}ms` }}
//               >
//                 <div className="flex items-center gap-3 md:gap-4">
//                   <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${transaction.type === 'deposit' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700/50 text-gray-300'} relative overflow-hidden group-hover:scale-110 transition-transform`}>
//                     {transaction.type === 'deposit' ? 
//                       <ArrowDownLeft size={18} className="group-hover:animate-bounce" /> : 
//                       <ArrowUpRight size={18} className="group-hover:animate-pulse" />
//                     }
//                     <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
//                   </div>
//                   <div className="group-hover:translate-x-1 transition-transform flex-1 truncate">
//                     <p className="text-xs md:text-sm font-medium uppercase">
//                       <span className="inline md:hidden">{transaction.type}</span>
//                       <span className="hidden md:inline">{transaction.type} || </span>
//                       <span className="group-hover:text-orange-400 transition-colors hidden md:inline">{transaction.id.substring(0, 20)}{transaction.id.length > 20 ? '...' : ''}</span>
//                       <span className="group-hover:text-orange-400 transition-colors inline md:hidden">{transaction.id.substring(0, 8)}...</span>
//                       <span className="ml-1">{transaction.amount}</span>
//                     </p>
//                     <p className="text-xs text-gray-400">{transaction.date} {transaction.time}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-end md:justify-center mt-2 md:mt-0">
//                   <span className={`text-xs md:text-sm font-medium ${transaction.status === 'pending' ? 'text-amber-500' : transaction.status === 'completed' ? 'text-green-500' : 'text-orange-500'} group-hover:scale-110 transition-transform relative`}>
//                     {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
//                     <span className={`absolute -bottom-1 left-0 h-0.5 w-0 ${transaction.status === 'pending' ? 'bg-amber-500' : transaction.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'} group-hover:w-full transition-all duration-300`}></span>
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
          

//           <div className="flex justify-center md:justify-end mt-4 md:mt-6">
//             <button className="group flex items-center gap-1 text-xs md:text-sm text-gray-400 hover:text-white transition-all duration-300 py-2 px-3 md:px-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 hover:bg-gray-200 relative overflow-hidden w-full md:w-auto">
//               <span className="absolute inset-0 bg-gradient-to-r from-orange-800/40 to-transparent w-0 group-hover:w-full transition-all duration-300"></span>
//               <span className="relative z-10 flex items-center gap-1 justify-center md:justify-start w-full">
//                 See more
//                 <ChevronRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
//               </span>
//             </button>
//           </div>
//         </div>

//       </main>
//     </div>
//   );
// }

















"use client"
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import TransactionHistory from '@/components/TransactionHistory';
import { useTranslation } from 'react-i18next';
import Footer from '@/components/footer';
import Advertisement_Hero from '@/components/Advertisement_Hero';


export default function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);

  

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);
  
  
  // Simulates loading state
  useEffect(() => {

    setAnimateHeader(true);


    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Show a notification after 3 seconds
   
    
    // Trigger header animation
    setTimeout(() => {
      setAnimateHeader(true);
    }, 500);
  }, []);
 

  return (
   
    <div className="min-h-screen font-sans relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-orange-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-700/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/90 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading Yapson...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <DashboardHeader />

       <Advertisement_Hero />

      {/* Main Content */}
      <main className="py-4 md:py-6 px-4 md:px-6">
        <h1 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 relative inline-block ${animateHeader ? 'animate-fadeIn' : 'opacity-0'}`}>
          {t("Welcome to Yapson")}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 animate-widthExpand"></span>
        </h1>
        
        {/* Action Buttons */}
        <div className={`flex gap-2 md:gap-4 mb-6 md:mb-8 ${animateHeader ? 'animate-slideInRight' : 'opacity-0'}`} style={{animationDelay: '300ms'}} >
          <a className="group relative flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 md:w-40 overflow-hidden text-sm md:text-base" href="/deposit">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute -inset-px bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-30 group-hover:animate-pulse rounded-lg"></span>
            <span className="relative z-10 flex items-center gap-1 md:gap-2">
              {t("DEPOSIT")}
              <ArrowDownLeft size={16} className="transition-transform group-hover:translate-y-1 group-hover:animate-bounce" />
            </span>
          </a>
          <a className="group relative flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 md:w-40 border border-gray-700 overflow-hidden text-sm md:text-base" href='/withdraw'>
            <span className="absolute inset-0 w-0 h-full bg-orange-600/20 transition-all duration-300 group-hover:w-full"></span>
            <span className="relative z-10 flex items-center gap-1 md:gap-2">
              {t("WITHDRAW")}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-y-1 group-hover:-translate-x-1 group-hover:animate-pulse" />
            </span>
          </a>
          
        </div>
        
        {/* Transaction History */}
        <TransactionHistory/>
        
          <Footer/>
        
      </main>
    </div>

  );
}