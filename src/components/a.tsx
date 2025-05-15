

// import React, { useState } from 'react';
// import { Eye, EyeOff, Lock, Mail, ArrowRight} from 'lucide-react';


// export default function A() {

//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('viralrarsh@gmail.com');
//   const [password, setPassword] = useState('••••••••');
//   const [activeTab, setActiveTab] = useState('login');
  
//   const [isLoading, setIsLoading] = useState(false);

//   // Animation effect
 

//   const handleLogin = (e) => {
//     setIsLoading(true);
//     console.log('Login attempt with:', { email, password });
//     // Simulate loading state for 1.5 seconds
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 1500);
//   };




// <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-center mb-8">Welcome to Yapson</h2>
            
//             {/* Tabs */}
//             <div className="flex mb-8">
//               <button 
//                 className={`flex-1 py-2 font-medium text-center transition-all ${activeTab === 'login' ? 'text-white bg-red-500 rounded-lg' : 'text-gray-400'}`}
//                 onClick={() => setActiveTab('login')}
//               >
//                 Login
//               </button>
//               <button 
//                 className={`flex-1 py-2 font-medium text-center transition-all ${activeTab === 'register' ? 'text-white bg-red-500 rounded-lg' : 'text-gray-400'}`}
//                 onClick={() => setActiveTab('register')}
//               >
//                 Registration
//               </button>
//             </div>
            
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-gray-300 mb-2">Email or Phone</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     value={emailOrPhone}
//                     onChange={(e) => setEmailOrPhone(e.target.value)}
//                     required
//                     placeholder={t("Enter your email or phone")}
//                     className="bg-gray-700 text-white w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-gray-300 mb-2">Password</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="bg-gray-700 text-white w-full pl-10 pr-10 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>
              
//               <div className="text-right">
//                 <a href="#" className="text-red-500 hover:text-red-400 text-sm transition-colors">
//                   Forgot your password?
//                 </a>
//               </div>
              
//               <button
//                 onClick={handleLogin}
//                 disabled={isLoading}
//                 className={`w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 ${isLoading ? 'animate-pulse' : ''} relative overflow-hidden group`}
//               >
//                 <span className="flex items-center justify-center relative z-10">
//                   {isLoading ? 'Processing...' : 'Log in'}
//                   <ArrowRight className={`ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 ${isLoading ? 'animate-bounce' : ''}`} />
//                 </span>
                
//                 {/* Button animation overlay */}
//                 <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
//               </button>
//             </div>
            
            
//           </div>

//                 );
//             }


// "use client";
// import { useState, useEffect } from 'react';
// import { ArrowUpRight, ArrowDownLeft, RotateCw, ChevronRight, Activity, Menu, X } from 'lucide-react';

// export default function transactions() {
//   const [activeTab, setActiveTab] = useState('all');
//   // const [isLoading, setIsLoading] = useState(true);
//   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
//   const [animateHeader, setAnimateHeader] = useState(false);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'dark';
//     document.documentElement.classList.toggle('dark', savedTheme === 'dark');
//     setAnimateHeader(true);
//   }, []);
  
//   // useEffect(() => {
//   //   setTimeout(() => {
//   //     setIsLoading(false);
//   //   }, 1000);
//   // }, []);
  
//   const transactions = [
//     { id: 'B11E199C-4D2C-4DAA-8024-25C363C21D49', type: 'deposit', amount: 'XOF 200', date: '04/27/2025', time: '04:45 PM', status: 'pending' },
//     { id: 'ZTAY745595714', type: 'withdrawal', amount: 'XOF', date: '04/25/2025', time: '04:41 PM', status: 'pending' },
//     { id: 'HZRM745595557', type: 'withdrawal', amount: 'XOF', date: '04/25/2025', time: '04:39 PM', status: 'pending' },
//     { id: '6E76C4FA-10FF-4D3F-BBD6-B9D723294B3F', type: 'deposit', amount: 'XOF 200', date: '04/25/2025', time: '03:35 PM', status: 'pending' },
//     { id: 'WINS745582036', type: 'deposit', amount: 'XOF 200', date: '04/25/2025', time: '12:53 PM', status: 'pending' },
//   ];

//   const filteredTransactions = transactions.filter(transaction => {
//     if (activeTab === 'all') return true;
//     if (activeTab === 'deposits') return transaction.type === 'deposit';
//     if (activeTab === 'withdrawals') return transaction.type === 'withdrawal';
//     return true;
//   });

//   const toggleMobileFilter = () => {
//     setMobileFilterOpen(!mobileFilterOpen);
//   };

//   return (
//     <>
//         <div className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-gray-700/30 shadow-xl relative overflow-hidden ${animateHeader ? 'animate-fadeIn' : 'opacity-0'}`} style={{animationDelay: '600ms'}}>
//           <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse-slow"></div>
          
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
//             <div className="flex items-center gap-2 group">
//               <Activity size={18} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
//               <h2 className="text-lg font-semibold group-hover:translate-x-1 transition-transform">Transaction history</h2>
//               <RotateCw size={16} className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors hover:rotate-180 duration-500" />
//             </div>
            

//             <div className="hidden md:flex gap-4 text-sm">
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
//     </>
//   );
// }