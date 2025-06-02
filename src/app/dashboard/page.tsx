
"use client"

import { useState, useEffect } from 'react';
//import DashboardHeader from '@/components/DashboardHeader';
import TransactionHistory from '@/components/TransactionHistory';
import { useTranslation } from 'react-i18next';
import Footer from '@/components/footer';
import { useTheme } from '../../components/ThemeProvider';
import DashboardHeader from '@/components/DashboardHeader';

//import Advertisement_Hero from '@/components/Advertisement_Hero';
//import { ArrowDownLeft, ArrowUpRight, Ticket, CreditCard } from 'lucide-react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift, 
  User, 
  Bell,
  
} from 'lucide-react';
import Image from 'next/image'
import ThemeToggle from '../../components/ThemeToggle';
import Advertisement_Hero from '../../components/Advertisement_Hero';
//import notifications from '../notifications/page'


export default function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);
  const { theme } = useTheme();

  
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
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} font-sans relative overflow-hidden`}>
      {/* Background gradient effects */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-blue-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-700/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/90 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading Blaffa...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="py-4 md:py-6 px-4 md:px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur Blaffa</h1>
          <p className=" ">Gérez vos finances en toute simplicité</p>
        </div>

        <div className={`relative overflow-hidden rounded-3xl p-8 `}>
         <Advertisement_Hero />
        </div>

          <div className="grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Card */}
              <div className={`relative overflow-hidden bg-gradient-to-br ${theme.colors.a_background} rounded-3xl p-8 text-white`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
                <div className="relative z-10">
                  <div className="grid grid-cols-4 gap-4">
                    {/* Déposer */}
                    <a href="/deposit" className="bg-gradient-to-br from-red-400 to-red-600 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer group border border-white/5 hover:border-white/20">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                        <div className="relative mb-3 lg:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-red-500/25">
                            <ArrowUpRight className="w-6 h-6 text-white drop-shadow-sm" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-300 rounded-full opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        </div>
                        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                          {t("Deposit")}
                        </span>
                      </div>
                    </a>
                  
                    {/* Retirer */}
                    <a href="/withdraw" className="bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer group border border-white/5 hover:border-white/20">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                        <div className="relative mb-3 lg:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                            <ArrowDownLeft className="w-6 h-6 text-white drop-shadow-sm" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-300 rounded-full opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        </div>
                        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                          {t("Withdraw")}
                        </span>
                      </div>
                    </a>
                  
                    {/* Coupon */}
                    <a href="/coupon" className="bg-gradient-to-br from-orange-400 to-orange-600 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer group border border-white/5 hover:border-white/20">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                        <div className="relative mb-3 lg:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-orange-500/25">
                            <Gift className="w-6 h-6 text-white drop-shadow-sm" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-300 rounded-full opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        </div>
                        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                          {t("Coupon")}
                        </span>
                      </div>
                    </a>
                  
                    {/* Mon ID */}
                    <a href="/bet_id" className="bg-gradient-to-br from-purple-400 to-purple-600 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer group border border-white/5 hover:border-white/20">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                        <div className="relative mb-3 lg:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                            <User className="w-6 h-6 text-white drop-shadow-sm" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-300 rounded-full opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        </div>
                        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                          {t("Mon ID")}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br/>

        {/**/}
        {/* Transaction History */}
        <TransactionHistory/>
        
        <Footer/>
        
      </main>
    </div>
  );
}