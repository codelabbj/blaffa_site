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
  Coins,
  MessageCircle,
  X,
  Send,
  Download,
  // Bell,
  
} from 'lucide-react';
import Image from 'next/image'
//import ThemeToggle from '../../components/ThemeToggle';
import Advertisement_Hero from '../../components/Advertisement_Hero';
//import notifications from '../notifications/page'


export default function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  // const [animateHeader, setAnimateHeader] = useState(false);
  const { theme } = useTheme();

  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);
  
  
  
  // Simulates loading state
  useEffect(() => {
    // setAnimateHeader(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Show a notification after 3 seconds
   
    
    // Trigger header animation
    setTimeout(() => {
      // setAnimateHeader(true);
    }, 500);
  }, []);
 
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} font-sans relative overflow-hidden`}>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Background gradient effects */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-blue-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-blue-700/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/90 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
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
          <p className=" ">
            <a 
              href="https://api.blaffa.net/download_apk" 
              download
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              <Download size={18} />
              Télécharger l'application mobile
            </a>
          </p>
        </div>

        <div className={`relative overflow-hidden rounded-3xl -mx-4 px-4 md:mx-0 md:px-8 py-4 md:py-8 `}>
         <Advertisement_Hero />
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Card */}
              {/* relative overflow-hidden bg-gradient-to-br ${theme.colors.a_background} rounded-3xl p-8 text-white */}
              <div className={`md:relative md:overflow-hidden md:bg-gradient-to-br md:${theme.colors.a_background} md:rounded-3xl p-4 md:p-8 md:text-white`}>
                <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="hidden md:block absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
                <div className="relative z-10">
                  {/* Mobile Layout (5 buttons in a row with square icons) */}
                  <div className="flex gap-1 justify-center md:hidden">
                    {/* Crypto Button */}
                    <a href="/crypto" className="group relative flex-1 flex flex-col items-center justify-center p-2 transition-all duration-300 active:scale-95">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-1 group-active:scale-90 transition-transform shadow-lg shadow-yellow-500/25">
                        <Coins size={20} className="text-white drop-shadow-sm" />
                      </div>
                      <span className="font-medium text-[10px] ">{t("Crypto")}</span>
                    </a>
                    {/* Deposit Button */}
                    <a href="/deposit" className="group relative flex-1 flex flex-col items-center justify-center p-2 transition-all duration-300 active:scale-95">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-1 group-active:scale-90 transition-transform shadow-lg shadow-red-500/25">
                        <ArrowUpRight size={20} className="text-white drop-shadow-sm" />
                      </div>
                      <span className="font-medium text-[10px] ">{t("Deposit")}</span>
                    </a>
                    {/* Withdraw Button */}
                    <a href="/withdraw" className="group relative flex-1 flex flex-col items-center justify-center p-2 transition-all duration-300 active:scale-95">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-1 group-active:scale-90 transition-transform shadow-lg shadow-blue-500/25">
                        <ArrowDownLeft size={20} className="text-white drop-shadow-sm" />
                      </div>
                      <span className="font-medium text-[10px] ">{t("Withdraw")}</span>
                    </a>
                    {/* Coupon Button */}
                    <a href="/coupon" className="group relative flex-1 flex flex-col items-center justify-center p-2 transition-all duration-300 active:scale-95">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-1 group-active:scale-90 transition-transform shadow-lg shadow-orange-500/25">
                        <Gift size={20} className="text-white drop-shadow-sm" />
                      </div>
                      <span className="font-medium text-[10px] ">{t("Coupon")}</span>
                    </a>
                  </div>

                  {/* Desktop Layout (Grid) - Same as first code */}
                  <div className="hidden md:grid grid-cols-4 gap-4">
                    {/* Crypto */}
                    <a href="/crypto" className="bg-gradient-to-br from-yellow-400 to-yellow-600 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer group border border-white/5 hover:border-white/20">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                        <div className="relative mb-3 lg:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-500/25">
                            <Coins className="w-6 h-6 text-white drop-shadow-sm" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        </div>
                        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                          {t("Crypto")}
                        </span>
                      </div>
                    </a>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br/>

        {/**/}
        {/* Transaction History */}
        <TransactionHistory/>

        {/* Floating Contact Button */}
        <div className="fixed bottom-24 right-6 z-40">
          {/* Expanded Menu */}
          {isContactMenuOpen && (
            <div className="absolute bottom-20 right-0 flex flex-col-reverse gap-3 mb-2">
              {/* Telegram Button */}
              <a
                href="https://t.me/manosservice"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white hover:bg-blue-50 rounded-full px-4 py-2 shadow-lg transition-all duration-300 animate-[slideIn_0.3s_ease-out] transform hover:scale-105"
                onClick={() => setIsContactMenuOpen(false)}
              >
                <span className="text-sm font-medium text-gray-700">Telegram</span>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <Send className="w-6 h-6 text-white" />
                </div>
              </a>
              
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/+2250566643821"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white hover:bg-green-50 rounded-full px-4 py-2 shadow-lg transition-all duration-300 animate-[slideIn_0.3s_ease-out_0.1s_backwards] transform hover:scale-105"
                onClick={() => setIsContactMenuOpen(false)}
              >
                <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <Image src='/whatsapp.png' width="24" height="24" className="w-6 h-6" alt='whatsapp' />
                </div>
              </a>
            </div>
          )}
          
          {/* Main FAB Button */}
          <button
            onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
            className="group flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-blue-600 hover:bg-blue-700 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
          >
            {/* Icon rotates when menu opens */}
            <div className={`transform transition-transform duration-300 ${isContactMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isContactMenuOpen ? (
                <X className="w-8 h-8 text-white" />
              ) : (
                <MessageCircle className="w-8 h-8 text-white" />
              )}
            </div>
          </button>
        </div>
        
        <Footer/>
        
      </main>
    </div>
  );
}