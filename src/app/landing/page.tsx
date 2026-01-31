"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import StaticTransactionHistory from '@/components/StaticTransactionHistory';
import { useTranslation } from 'react-i18next';
// import Footer from '@/components/footer';
import { useTheme } from '../../components/ThemeProvider';

//import Advertisement_Hero from '@/components/Advertisement_Hero';
//import { ArrowDownLeft, ArrowUpRight, Ticket, CreditCard } from 'lucide-react';
import {
  MessageCircle,
  X,
  BitcoinIcon,
  Send,
  Headset,
} from 'lucide-react';

import Advertisement_Hero from '../../components/Advertisement_Hero';



export default function LandingPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/manosservice'); // Default fallback
  // const [animateHeader, setAnimateHeader] = useState(false);
  const { theme } = useTheme();


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);


  // Fetch settings to get telegram URL (without token) - with cache fallback
  useEffect(() => {
    const fetchTelegramUrl = async () => {
      try {
        const response = await fetch('https://api.blaffa.net/blaffa/setting/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const settingsData = await response.json();
        const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;

        if (settings?.telegram) {
          setTelegramUrl(settings.telegram);
          // Save to localStorage for offline/fallback use
          localStorage.setItem('settingsCache', JSON.stringify(settings));
        }
      } catch (error) {
        console.error('Error fetching telegram URL from settings:', error);
        // Try to load from cache
        const cachedSettings = localStorage.getItem('settingsCache');
        if (cachedSettings) {
          try {
            const settings = JSON.parse(cachedSettings);
            if (settings?.telegram) {
              setTelegramUrl(settings.telegram);
              console.log('Loaded settings from cache');
            }
          } catch (parseErr) {
            console.error('Failed to parse cached settings:', parseErr);
          }
        }
        // Keep default fallback URL if no cache
      }
    };

    fetchTelegramUrl();
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

      {/* Dashboard Header - Matching Reference Image */}
      {/* Dashboard Header - Updated with Login/Register buttons */}
      <header className={`bg-gradient-to-br ${theme.colors.a_background} border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50`}>
        <div className="w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo Only */}
            <div className="flex items-center">
              <Image src="/logo.jpg" alt="BLAFFA Logo" width={65} height={65} className="object-contain" />
            </div>

            {/* Right - Auth Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="bg-[#002d72] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00255e] transition-colors"
              >
                Connexion
              </a>
              <a
                href="/register"
                className="bg-transparent text-[#002d72] dark:text-blue-400 border border-[#002d72] dark:border-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002d72]/5 transition-colors"
              >
                Inscription
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4 px-6 w-full">
        {/* Hero Banner & Download button */}
        <div className="mb-6 space-y-4">
          {/* Smart Professional Android Download Action */}
          <div className="flex justify-center md:justify-end">
            <a
              href="https://blaffa.net/blaffa.apk"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 dark:bg-slate-800/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full hover:bg-white/20 transition-all duration-300 group shadow-sm`}
            >
              <div className="bg-green-500/10 p-1 rounded-full group-hover:bg-green-500/20 transition-colors">
                <svg className="w-4 h-4 fill-current text-green-500" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414C18.1109 15.3414 18.587 14.8653 18.587 14.2774C18.587 13.6896 18.1109 13.2135 17.523 13.2135C16.9351 13.2135 16.459 13.6896 16.459 14.2774C16.459 14.8653 16.9351 15.3414 17.523 15.3414ZM6.47702 15.3414C7.0649 15.3414 7.541 14.8653 7.541 14.2774C7.541 13.6896 7.0649 13.2135 6.47702 13.2135C5.88914 13.2135 5.41304 13.6896 5.41304 14.2774C5.41304 14.8653 5.88914 15.3414 6.47702 15.3414ZM17.9234 10.7495L19.7821 7.5303C19.9126 7.30424 19.8354 7.0152 19.6094 6.88478C19.3833 6.75436 19.0943 6.83147 18.9639 7.05753L17.0768 10.3251C15.6558 9.67812 14.0754 9.32431 12.4206 9.32431C10.7659 9.32431 9.18548 9.67812 7.76449 10.3251L5.87739 7.05753C5.74697 6.83147 5.45793 6.75436 5.23186 6.88478C5.0058 7.0152 4.9286 7.30424 5.05903 7.5303L6.91771 10.7495C3.89944 12.3385 1.8413 15.4294 1.77734 19.0494H23.0637C22.9997 15.4294 20.9416 12.3385 17.9234 10.7495Z" />
                </svg>
              </div>
              <span className={`text-[10px] md:text-xs font-bold ${theme.colors.text} tracking-wide`}>
                APPLICATION ANDROID
              </span>
              <div className="ml-1 w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
            </a>
          </div>

          <Advertisement_Hero />
        </div>

        {/* Achat and Vente Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Achat Button - Filled */}
          <a
            href="/crypto/buy"
            className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-3xl py-4 px-6 flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-lg"
          >
            <BitcoinIcon className="w-6 h-6" />
            <span className="font-semibold text-lg">Achat</span>
          </a>

          {/* Vente Button - Outlined */}
          <a
            href="/crypto/sell"
            className="bg-transparent border-2 border-[#1e3a8a] text-[#1e3a8a] dark:text-white dark:border-white hover:bg-[#1e3a8a]/5 rounded-3xl py-4 px-6 flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
          >
            <BitcoinIcon className="w-6 h-6" />
            <span className="font-semibold text-lg">Vente</span>
          </a>
        </div>

        {/* Centre d'activité Section */}
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-4 ${theme.colors.text}`}>Centre d&apos; activite</h2>

          <div className="flex justify-around items-start gap-4">
            {/* Depot - Stylized Receive/Hand Icon */}
            <a href="/deposit" className="flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 rounded-full bg-[#FFF0F0] dark:bg-red-900/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#FF4D4D] dark:text-red-400 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </div>
              <span className={`text-sm font-medium ${theme.colors.text}`}>Depot</span>
            </a>

            {/* Retrait - Stylized Sent/Paper Plane Icon */}
            <a href="/withdraw" className="flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 rounded-full bg-[#FFF0F0] dark:bg-red-900/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#FF4D4D] dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </div>
              <span className={`text-sm font-medium ${theme.colors.text}`}>Retrait</span>
            </a>

            {/* Coupon - Stylized Ticket with % Icon */}
            <a href="/coupon" className="flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 rounded-full bg-[#FFF0F0] dark:bg-red-900/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#FF4D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01" />
                  <text x="12" y="16" fontSize="10" fill="currentColor" textAnchor="middle" fontWeight="bold" stroke="none">%</text>
                </svg>
              </div>
              <span className={`text-sm font-medium ${theme.colors.text}`}>Coupon</span>
            </a>
          </div>
        </div>

        {/* Activités récentes Section */}
        <div className="mb-6">
          <StaticTransactionHistory />
        </div>

        {/* Floating Contact Button */}
        <div className="fixed bottom-24 right-6 z-40">
          {/* Expanded Menu */}
          {isContactMenuOpen && (
            <div className="absolute bottom-20 right-0 flex flex-col-reverse gap-3 mb-2">
              {/* Telegram Button */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 bg-gradient-to-br ${theme.colors.background} ${theme.colors.hover} rounded-full px-4 py-2 shadow-lg transition-all duration-300 transform hover:scale-105`}
                onClick={() => setIsContactMenuOpen(false)}
              >
                <span className={`text-sm font-medium ${theme.colors.text}`}>Telegram</span>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <Send className="w-6 h-6 text-white" />
                </div>
              </a>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/+2250566643821"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 bg-gradient-to-br ${theme.colors.background} ${theme.colors.hover} rounded-full px-4 py-2 shadow-lg transition-all duration-300 transform hover:scale-105`}
                onClick={() => setIsContactMenuOpen(false)}
              >
                <span className={`text-sm font-medium ${theme.colors.text}`}>WhatsApp</span>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <Image src='/whatsapp.png' width="24" height="24" className="w-6 h-6" alt='whatsapp' />
                </div>
              </a>
            </div>
          )}

          {/* Main FAB Button */}
          <button
            onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
            className={`group flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#002d72] dark:bg-blue-600 hover:bg-[#00255e] dark:hover:bg-blue-500 rounded-full shadow-[0_10px_30px_rgba(0,45,114,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95`}
          >
            {/* Icon - Custom square chat bubble with lines */}
            <div className={`transform transition-all duration-300 ${isContactMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isContactMenuOpen ? (
                <X className="w-8 h-8 text-white" />
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white" />
                  <rect x="6" y="6" width="12" height="2" rx="1" fill="currentColor" className="text-[#002d72] dark:text-blue-600" />
                  <rect x="6" y="10" width="12" height="2" rx="1" fill="currentColor" className="text-[#002d72] dark:text-blue-600" />
                  <rect x="6" y="14" width="8" height="2" rx="1" fill="currentColor" className="text-[#002d72] dark:text-blue-600" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* <Footer /> */}

      </main>
    </div>
  );
}
