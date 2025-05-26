// "use client";
// import { useState, useEffect } from 'react';
// import NotificationBell from './NotificationBell';
// import { User, Ticket, Menu, X, Download, Settings, LogOut } from 'lucide-react';
// import Image from 'next/image';
// import ThemeToggle from './ThemeToggle';
// import LanguageToggle from './LanguageToggle';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';

// const DashboardHeader = () => {
//   const [showNotification, setShowNotification] = useState(false);
//   const [pulseNotification, setPulseNotification] = useState(false);
//   const [animateHeader, setAnimateHeader] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const { t } = useTranslation();
//   const [userName, setUserName] = useState(''); // State to store the user's name

//   useEffect(() => {
//     const fetchUserName = async () => {
//       try {
//         const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token
//         if (!accessToken) {
//           console.error(t('No access token found.'));
//           window.location.href = '/';
//           return;
//         }

//         // Fetch user data from the backend
//         const response = await axios.get('https://api.yapson.net/auth/me', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         // Concatenate first_name and last_name to form the full name
//         const { first_name, last_name } = response.data;
//         setUserName(`${first_name} ${last_name}`); // Combine first_name and last_name
//       } catch (error) {
//         console.error('Failed to fetch user name:', error);
//       }
//     };

//     fetchUserName();
//   }, []);

//   useEffect(() => {
//     setAnimateHeader(true);
//     setTimeout(() => {
//       setShowNotification(true);
//       setPulseNotification(true);
//       setTimeout(() => {
//         setPulseNotification(false);
//       }, 5000);
//     }, 3000);
//   }, []);

//   // Close mobile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
//         setShowMobileMenu(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [showMobileMenu]);

//   const toggleMobileMenu = () => {
//     setShowMobileMenu(!showMobileMenu);
//   };

//   const handleMenuItemClick = (action) => {
//     setShowMobileMenu(false);
//     if (typeof action === 'function') {
//       action();
//     }
//   };

//   return (
//     <>
//       <header className={`py-4 px-4 md:px-6 flex items-center justify-between border-b border-gray-800 transition-all duration-700 relative z-50 ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
//         <div className="flex items-center gap-2">
//           <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
//           <p className="text-sm hidden sm:block">
//             {t("Hello")}, <span className="text-orange-500 font-medium">{userName || 'User'}</span>!
//           </p>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-4">
//           <button 
//             onClick={() => {
//               window.location.href = 'https://api.yapson.net/download_apk';
//             }}
//             className="bg-transparent hover:bg-orange-600 font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transform hover:scale-105 transition-all"
//           >
//             <Download className="w-5 h-5" />
//             <span>{t("Télécharger l'application")}</span>
//           </button>
          
//           <a href='/coupon' className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//             <Ticket size={20} />
//           </a>
          
//           <ThemeToggle />
//           <LanguageToggle />
          
//           <div className={`relative ${showNotification ? 'animate-bounce' : ''} ${pulseNotification ? 'animate-pulse' : ''}`}>
//             <NotificationBell />
//           </div>
          
//           <a className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center relative group" href='/profile'>
//             <User size={16} className="text-sm text-white font-bold group-hover:scale-110 transition-transform"/>
//             <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75 duration-1000 hidden group-hover:block"></div>
//           </a>
//         </div>

//         {/* Mobile Navigation */}
//         <div className="md:hidden flex items-center gap-2">
//           {/* Language Toggle */}
//           <div className="p-1">
//             <LanguageToggle />
//           </div>
          
//           {/* Notifications */}
//           <div className={`relative p-1 ${showNotification ? 'animate-bounce' : ''} ${pulseNotification ? 'animate-pulse' : ''}`}>
//             <NotificationBell />
//           </div>
          
//           {/* Mobile Menu Button */}
//           <div className="mobile-menu-container relative">
//             <button
//               onClick={toggleMobileMenu}
//               className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-105"
//               aria-label="Toggle menu"
//             >
//               {showMobileMenu ? (
//                 <X size={24} className="text-orange-500" />
//               ) : (
//                 <Menu size={24} className="text-gray-400" />
//               )}
//             </button>

//           {/* Mobile Dropdown Menu */}
//           <div className={`absolute right-0 top-full mt-2 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-top-right ${
//             showMobileMenu 
//               ? 'opacity-100 scale-100 translate-y-0' 
//               : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
//           }`}>
            
//             {/* User Info Section */}
//             <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-b border-gray-700">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
//                   <User size={20} className="text-white" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-white">
//                     {t("Hello")}, {userName || 'User'}!
//                   </p>
//                   <p className="text-xs text-gray-400">Welcome back</p>
//                 </div>
//               </div>
//             </div>

//             {/* Menu Items */}
//             <div className="py-2">
//               {/* Download App */}
//               <button
//                 onClick={() => handleMenuItemClick(() => {
//                   window.location.href = 'https://api.yapson.net/download_apk';
//                 })}
//                 className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left group"
//               >
//                 <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
//                   <Download size={16} className="text-orange-500" />
//                 </div>
//                 <span className="text-gray-300 group-hover:text-white transition-colors">
//                   {t("Télécharger l'application")}
//                 </span>
//               </button>

//               {/* Coupons */}
//               <a
//                 href='/coupon'
//                 onClick={() => setShowMobileMenu(false)}
//                 className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors group"
//               >
//                 <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
//                   <Ticket size={16} className="text-blue-500" />
//                 </div>
//                 <span className="text-gray-300 group-hover:text-white transition-colors">
//                   {t("Coupons")}
//                 </span>
//               </a>

//               {/* Profile */}
//               <a
//                 href='/profile'
//                 onClick={() => setShowMobileMenu(false)}
//                 className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors group"
//               >
//                 <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
//                   <User size={16} className="text-green-500" />
//                 </div>
//                 <span className="text-gray-300 group-hover:text-white transition-colors">
//                   {t("Profile")}
//                 </span>
//               </a>

//               {/* Notifications */}
//               {/* <div className="px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors group cursor-pointer">
//                 <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors relative">
//                   <div className={`${showNotification ? 'animate-bounce' : ''} ${pulseNotification ? 'animate-pulse' : ''}`}>
//                     <NotificationBell />
//                   </div>
//                 </div>
//                 <span className="text-gray-300 group-hover:text-white transition-colors">
//                   {t("Notifications")}
//                 </span>
//               </div> */}

//               {/* Divider */}
//               <hr className="my-2 border-gray-700" />

//               {/* Settings Section */}
//               <div className="px-4 py-2">
//                 <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
//                   {t("Settings")}
//                 </p>
                
//                 {/* Theme Toggle */}
//                 <div className="flex items-center justify-between py-2">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
//                       <Settings size={16} className="text-indigo-500" />
//                     </div>
//                     <span className="text-gray-300 text-sm">{t("Theme")}</span>
//                   </div>
//                   <ThemeToggle />
//                 </div>

//                 {/* Language Toggle */}
//                 {/* <div className="flex items-center justify-between py-2">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
//                       <span className="text-pink-500 text-xs font-bold">EN</span>
//                     </div>
//                     <span className="text-gray-300 text-sm">{t("Language")}</span>
//                   </div>
//                   <LanguageToggle />
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       </header>

//       {/* Backdrop */}
//       {showMobileMenu && (
//         <div 
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
//           onClick={() => setShowMobileMenu(false)}
//         />
//       )}

//     </>

//   );
// };

// export default DashboardHeader;