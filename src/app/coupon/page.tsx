"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../components/ThemeProvider'; 
import api from '@/lib/axios';
import DashboardHeader from '@/components/DashboardHeader';

// Define the type for a single coupon object
interface BetApp {
  id: string;
  name: string;
  image: string;
  is_active: boolean;
  order: number;
  city: string;
  street: string;
  deposit_tuto_content: string;
  deposit_link: string | null;
  withdrawal_tuto_content: string;
  withdrawal_link: string | null;
  public_name: string;
  minimun_deposit: number;
  max_deposit: number;
  minimun_with: number;
  max_win: number;
}

interface Coupon {
  id: string;
  images: string[];
  created_at: string;
  code: string;
  bet_app: BetApp;
}

const CouponPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.error(t('No access token found.'));
        window.location.href = '/';
        return;
    }
    fetchCoupons(accessToken);
  }, []);

  const fetchCoupons = async (accessToken: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/blaffa/coupon`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const errorData = await response.data.catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      const data = await response.data;
      if (Array.isArray(data.results)) {
         setCoupons(data.results);
      } else {
         console.error('API response results is not an array:', data);
         setCoupons([]);
      }

    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Coupons - blaffa</title>
          <meta name="description" content="View all available coupons" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} flex items-center justify-center p-4`}>
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"></div>
            </div>
            <p className="text-slate-300 text-lg font-medium">Loading coupons...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Coupons - blaffa</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} flex items-center justify-center p-4`}>
          <div className="text-center max-w-md bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400 shadow-lg shadow-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Coupons</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => {
                 const accessToken = localStorage.getItem('accessToken');
                 if (accessToken) {
                    fetchCoupons(accessToken);
                 } else {
                    console.error(t('No access token found for retry.'));
                    window.location.href = '/';
                 }
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Coupons - blaffa</title>
        <meta name="description" content="View all available coupons from blaffa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} p-4`}>
        <DashboardHeader/>
        
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t("Available Coupons")}</h1>
              <p className="text-slate-400">Discover amazing deals and offers</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-white bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t("Back")}
              </button>
            </div>
          </div>

                    {/* Main Content */}
          <div className={`bg-gradient-to-r ${theme.colors.s_background} backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden`}>
            <div className="p-8">
              {coupons.length === 0 ? (
                <div className={`rounded-2xl shadow p-6 text-center bg-gradient-to-br ${theme.colors.s_background}`} style={{ borderRadius: '1rem' }}>
                  <div className=" font-semibold">Aucun coupon disponible.</div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {coupons.map((coupon, idx) => (
                    <div key={idx} className={`rounded-2xl shadow p-6 bg-gradient-to-br ${theme.colors.s_background}`} style={{ borderRadius: '1rem' }}>
                      <div className="flex flex-col gap-4">
                        {/* App Row */}
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-base text-white">App</span>
                          <span className="text-base text-white">{coupon.bet_app?.public_name || coupon.bet_app?.name || 'Unknown'}</span>
                        </div>
                        {/* Code Row */}
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-base text-white">Code</span>
                          <span className="flex items-center gap-2">
                            <span className="text-base tracking-widest text-white">{coupon.code || coupon.id.slice(0, 8)}</span>
                            <button
                              onClick={() => handleCopy(coupon.code || coupon.id.slice(0, 8))}
                              className="p-1 rounded hover:bg-gray-200"
                              aria-label="Copy code"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </button>
                            {copied && <span className="text-xs text-green-600 ml-1">Copied!</span>}
                          </span>
                        </div>
                        {/* Date Row */}
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-base text-white">Date</span>
                          <span className="text-base text-white">{coupon.created_at ? coupon.created_at.slice(0, 10) : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponPage;