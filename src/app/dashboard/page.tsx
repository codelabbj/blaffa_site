"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TransactionHistory from '@/components/TransactionHistory';
import { useTranslation } from 'react-i18next';
// import Footer from '@/components/footer';
import { useTheme } from '../../components/ThemeProvider';
import api from '@/lib/axios';
import { transformDriveLink, formatWhatsAppLink } from '@/lib/link-utils';

import {
  MessageCircle,
  X,
  BitcoinIcon,
  Send,
  Headset,
} from 'lucide-react';

import Advertisement_Hero from '../../components/Advertisement_Hero';
import AndroidDownloadButton from '../../components/AndroidDownloadButton';




export default function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [telegramUrl, setTelegramUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [downloadApkLink, setDownloadApkLink] = useState('');
  const [cryptoEnable, setCryptoEnable] = useState(true);
  const [depositEnable, setDepositEnable] = useState(true);
  const [withdrawEnable, setWithdrawEnable] = useState(true);
  const [couponEnable, setCouponEnable] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Fetch settings to get links and configurations
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/blaffa/setting/');

        if (response.status === 200) {
          const settingsData = response.data;
          const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;

          if (settings?.telegram) {
            setTelegramUrl(settings.telegram);
          }

          const rawDownloadLink = settings?.dowload_apk_link || settings?.download_apk_link;
          if (rawDownloadLink) {
            setDownloadApkLink(rawDownloadLink);
          }

          if (settings?.whatsapp_phone) {
            setWhatsappUrl(formatWhatsAppLink(settings.whatsapp_phone_indi, settings.whatsapp_phone));
          }

          if (Object.prototype.hasOwnProperty.call(settings, 'crypto_enable')) {
            setCryptoEnable(settings.crypto_enable);
          }
          if (Object.prototype.hasOwnProperty.call(settings, 'deposit_enable')) {
            setDepositEnable(settings.deposit_enable);
          }
          if (Object.prototype.hasOwnProperty.call(settings, 'withdraw_enable')) {
            setWithdrawEnable(settings.withdraw_enable);
          }
          if (Object.prototype.hasOwnProperty.call(settings, 'coupon_enable')) {
            setCouponEnable(settings.coupon_enable);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Simulates loading state
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className={`min-h-screen ${theme.colors.a_background} font-sans relative flex flex-col`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className={`fixed inset-0 ${theme.mode === 'dark' ? 'bg-slate-950' : 'bg-white'} z-[100] flex items-center justify-center`}>
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 border-4 ${theme.mode === 'dark' ? 'border-neutral-800' : 'border-neutral-100'} border-t-blue-600 rounded-full animate-spin`}></div>
            <p className={`${theme.mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'} font-medium`}>Blaffa...</p>
          </div>
        </div>
      )}

      {/* Dashboard Header - Clean & Premium */}
      <header className={`sticky top-0 z-50 ${theme.colors.a_background} pt-[env(safe-area-inset-top)] border-b ${theme.mode === 'dark' ? 'border-slate-800' : 'border-transparent'}`}>
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Image src="/logo.jpg" alt="BLAFFA Logo" width={65} height={65} className="object-contain" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link href="/contact" className={`${theme.mode === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
              <Headset className="w-6 h-6 stroke-[1.5]" />
            </Link>
            <Link href="/notifications" className="relative text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                2
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-32">
        <div className="px-6 space-y-8">
          <div className="flex justify-center md:justify-end mt-4">
            <AndroidDownloadButton downloadLink={downloadApkLink} />
          </div>
          {/* Hero Banner Area */}
          <div className="mt-2 rounded-3xl overflow-hidden shadow-sm">
            <Advertisement_Hero />
          </div>

          {/* Action Buttons Section */}
          {cryptoEnable && (
            <div className={`mt-2 bg-transparent border-b ${theme.mode === 'dark' ? 'border-slate-800' : 'border-neutral-100'} rounded-none p-6`}>
              <div className="flex gap-4">
                {/* Achat Button */}
                <Link
                  href="/crypto/buy"
                  className="flex-1 bg-[#144692] text-white rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <BitcoinIcon className="w-5 h-5" />
                  <span className="text-base font-bold">Achat</span>
                </Link>

                {/* Vente Button */}
                <Link
                  href="/crypto/sell"
                  className={`flex-1 bg-transparent border-2 border-[#144692] text-[#144692] rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform`}
                >
                  <BitcoinIcon className="w-5 h-5" />
                  <span className="text-base font-bold">Vente</span>
                </Link>
              </div>
            </div>
          )}

          {/* Activity Center */}
          <section className="mt-8 px-2">
            <h2 className={`text-xl font-semibold ${theme.mode === 'dark' ? 'text-white' : 'text-neutral-900'} mb-8 tracking-tight`}>Centre d&apos; activite</h2>
            <div className="flex justify-between items-start">
              {/* Depot */}
              {depositEnable && (
                <Link href="/deposit" className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-full ${theme.mode === 'dark' ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#fdf2f2]'} flex items-center justify-center active:scale-90 transition-transform`}>
                    <svg className="w-7 h-7 text-[#f36b6b] rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-semibold ${theme.mode === 'dark' ? 'text-white' : 'text-neutral-800'}`}>Depôt</span>
                </Link>
              )}

              {/* Retrait */}
              {withdrawEnable && (
                <Link href="/withdraw" className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-full ${theme.mode === 'dark' ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#fdf2f2]'} flex items-center justify-center active:scale-90 transition-transform`}>
                    <svg className="w-7 h-7 text-[#f36b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-semibold ${theme.mode === 'dark' ? 'text-white' : 'text-neutral-800'}`}>Retrait</span>
                </Link>
              )}

              {/* Coupon */}
              {couponEnable && (
                <Link href="/coupon" className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-full ${theme.mode === 'dark' ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#fdf2f2]'} flex items-center justify-center active:scale-90 transition-transform`}>
                    <svg className="w-7 h-7 text-[#f36b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path d="M14 6H4a2 2 0 00-2 2v8a2 2 0 002 2h10l6-6-6-6z" />
                      <path d="M16 12h.01" strokeWidth={2} strokeLinecap="round" />
                      <path d="M6 10l4 4m0-4l-4 4" strokeWidth={1} />
                      <circle cx="6" cy="10" r="0.5" />
                      <circle cx="10" cy="14" r="0.5" />
                    </svg>
                  </div>
                  <span className={`text-sm font-semibold ${theme.mode === 'dark' ? 'text-white' : 'text-neutral-800'}`}>Coupon</span>
                </Link>
              )}
            </div>
          </section>

          {/* Recent Activities */}
          <section>
            <TransactionHistory />
          </section>
        </div>
      </main>

      {/* Floating Action Button (FAB) - Chat */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
          className="w-14 h-14 bg-[#002d72] rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90 overflow-hidden"
        >
          {isContactMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white" />
              <rect x="6" y="6" width="12" height="2" rx="1" fill="#002d72" />
              <rect x="6" y="10" width="12" height="2" rx="1" fill="#002d72" />
              <rect x="6" y="14" width="8" height="2" rx="1" fill="#002d72" />
            </svg>
          )}
        </button>

        {isContactMenuOpen && (
          <div className="absolute bottom-20 right-0 flex flex-col items-end gap-3 mb-4 animate-in fade-in slide-in-from-bottom-5">
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className={`${theme.mode === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-neutral-200 text-neutral-800'} border px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-bold whitespace-nowrap`}>
              <span>Telegram</span>
              <Send className="w-5 h-5 text-blue-500" />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${theme.mode === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-neutral-200 text-neutral-800'} border px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-bold whitespace-nowrap`}>
              <span>WhatsApp</span>
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                <Image src="/whatsapp.png" width={16} height={16} alt="WA" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
