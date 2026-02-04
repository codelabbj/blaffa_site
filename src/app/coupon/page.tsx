"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useTheme } from '../../components/ThemeProvider';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, Copy, Check, Plus, Link as LinkIcon, Trophy } from 'lucide-react';

// Unified interfaces matching the actual JSON response
interface BetApp {
  id: string;
  name: string;
  image: string;
  public_name: string;
}

interface Coupon {
  id: string;
  created_at: string;
  code: string;
  bet_app: BetApp;
  author_first_name: string;
  author_last_name: string;
  author_rating: number;
  coupon_type: 'combine' | 'single';
  cote: string;
  match_count: number;
  average_rating: number;
  total_ratings: number;
  likes_count: number;
  dislikes_count: number;
  user_rating: number | null;
  can_rate: boolean;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  can_publish_coupons: boolean;
  can_rate_coupons: boolean;
  is_staff: boolean;
}

const CouponPage = () => {
  const [platforms, setPlatforms] = useState<BetApp[]>([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [couponStats, setCouponStats] = useState({ total_published: 0 });
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [platformsLoading, setPlatformsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { theme } = useTheme();
  const router = useRouter();

  const fetchPlatforms = async () => {
    try {
      const response = await api.get('/blaffa/app_name?operation_type=coupon');
      if (response.status === 200) {
        setPlatforms(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching platforms:', err);
    } finally {
      setPlatformsLoading(false);
    }
  };

  const fetchCoupons = async (platformId: string | null = null) => {
    setLoading(true);
    try {
      const url = platformId ? `/blaffa/coupon?bet_app=${platformId}` : `/blaffa/coupon`;
      const response = await api.get(url);
      if (response.status === 200) {
        const data = response.data;
        setCoupons(data.results || data || []);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const response = await api.get(`/auth/me`);
      if (response.status === 200) {
        const profileData = response.data;
        setUserProfile({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          can_publish_coupons: profileData.can_publish_coupons,
          can_rate_coupons: profileData.can_rate_coupons,
          is_staff: profileData.is_staff
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchCouponStats = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const response = await api.get('/blaffa/user/coupon-stats/');
      if (response.status === 200) {
        setCouponStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching coupon stats:', err);
    }
  };

  const fetchWallet = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const response = await api.get('/blaffa/coupon-wallet/');
      if (response.status === 200) {
        setWalletBalance(response.data.balance || 0);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  };

  useEffect(() => {
    fetchPlatforms();
    fetchCoupons();
    fetchUserProfile();
    fetchCouponStats();
    fetchWallet();
  }, []);

  useEffect(() => {
    if (selectedPlatformId !== null) {
      fetchCoupons(selectedPlatformId);
    } else {
      // Re-fetch all if selection cleared, but we need to avoid the initial mount double call if possible
      // However, for simplicity here, we re-fetch if it changes to null after first load
      fetchCoupons();
    }
  }, [selectedPlatformId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRate = async (couponId: string, rating: number) => {
    if (!userProfile?.can_rate_coupons) {
      setError("Vous n'avez pas l'autorisation de noter des coupons. Pour noter, vous devez avoir au moins 1 mois d'ancienneté et 15 000 FCFA de transactions acceptées.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      const response = await api.post(`/blaffa/coupons/${couponId}/rate/`, { rating });
      if (response.status === 201 || response.status === 200) {
        // Clear any previous error on success
        setError(null);
        // Update local state for the specific coupon
        setCoupons(prevCoupons => prevCoupons.map(c => {
          if (c.id === couponId) {
            return {
              ...c,
              average_rating: response.data.new_average || c.average_rating,
              total_ratings: c.total_ratings + 1,
              likes_count: rating === 5 ? c.likes_count + 1 : c.likes_count,
              dislikes_count: rating === 1 ? c.dislikes_count + 1 : c.dislikes_count,
              user_rating: rating,
              can_rate: false
            };
          }
          return c;
        }));
      }
    } catch (err: any) {
      console.error('Error rating coupon:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || 'Erreur lors de la notation.';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  const getInitials = (first?: string, last?: string) => {
    if (!first && !last) return '??';
    return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`${theme.colors.a_background} font-sans`}>
      <Head>
        <title>Coupons - Blaffa</title>
      </Head>

      {/* Header */}
      <header className={`bg-transparent sticky top-0 z-50`}>
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className={`p-2 -ml-2 rounded-full ${theme.colors.hover} transition-colors`}>
            <ArrowLeft className={theme.colors.text} size={24} />
          </button>
          <h1 className={`text-lg font-bold ${theme.colors.text}`}>Coupon</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="w-full p-6 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="fixed top-20 left-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className={`p-4 rounded-2xl border ${theme.mode === 'dark' ? 'bg-red-900/20 border-red-500/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'} flex items-center gap-3 shadow-lg backdrop-blur-md`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* User Card */}
        <div className={`${theme.colors.a_background} p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-6 border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-[#E8E8E8]'} flex items-center justify-center ${theme.mode === 'dark' ? 'text-slate-300' : 'text-[#999999]'} font-bold text-lg`}>
                {getInitials(userProfile?.first_name, userProfile?.last_name)}
              </div>
              <div>
                <h3 className={`font-bold text-base ${theme.colors.text}`}>
                  {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Anonyme'}
                </h3>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={14} className={i <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
              </div>
            </div>
            {(userProfile?.can_publish_coupons || userProfile?.is_staff) && (
              <button
                onClick={() => router.push('/coupon/create')}
                className="w-10 h-10 rounded-xl bg-[#002d72] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex gap-3">
            <div className={`flex-1 ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-2xl p-3 text-center`}>
              <div className={`text-xl font-black ${theme.mode === 'dark' ? 'text-blue-400' : 'text-[#002d72]'} leading-none`}>
                {couponStats.total_published || 0}
              </div>
              <div className={`text-xs ${theme.colors.d_text} opacity-60 font-medium mt-1`}>Mes coupons</div>
            </div>
            <div className={`flex-1 ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-2xl p-3 text-center`}>
              <div className="text-xl font-black text-green-600 leading-none">{walletBalance} FCFA</div>
              <div className={`text-xs ${theme.colors.d_text} opacity-60 font-medium mt-1`}>Bonus</div>
            </div>
          </div>
        </div>

        {/* Platform Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {/* "Tous" Category */}
          <button
            onClick={() => setSelectedPlatformId(null)}
            className={`flex-shrink-0 ${theme.colors.a_background} px-4 py-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-2 border transition-all
              ${selectedPlatformId === null
                ? 'border-blue-600 ring-2 ring-blue-600/20'
                : theme.mode === 'dark' ? 'border-slate-800' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <div className={`w-8 h-8 rounded-lg ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-gray-50'} flex items-center justify-center`}>
              <Trophy className={selectedPlatformId === null ? "text-blue-600" : "text-gray-400"} size={16} />
            </div>
            <span className={`font-bold text-sm ${selectedPlatformId === null ? 'text-blue-600' : theme.colors.text}`}>Tous</span>
          </button>

          {platformsLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className={`flex-shrink-0 w-32 h-14 ${theme.mode === 'dark' ? 'bg-slate-800' : 'bg-gray-100'} rounded-2xl animate-pulse`}></div>
            ))
          ) : (
            platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatformId(platform.id)}
                className={`flex-shrink-0 ${theme.colors.a_background} px-4 py-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-2 border transition-all
                  ${selectedPlatformId === platform.id
                    ? 'border-blue-600 ring-2 ring-blue-600/20'
                    : theme.mode === 'dark' ? 'border-slate-800' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-8 h-8 rounded-lg ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-gray-50'} flex items-center justify-center p-1`}>
                  {platform.image ? (
                    <img src={platform.image} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-[10px]">
                      {platform.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className={`font-bold text-sm ${selectedPlatformId === platform.id ? 'text-blue-600' : theme.colors.text}`}>
                  {platform.public_name || platform.name}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Day's Header */}
        <div className="flex justify-between items-center pt-2">
          <h2 className={`text-2xl font-bold ${theme.colors.text}`}>Prédicitions du jour</h2>
          <span className={`text-lg font-medium ${theme.colors.d_text} opacity-60`}>{formatDate()}</span>
        </div>

        {/* Coupon List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">Chargement des coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Trophy size={64} className="mx-auto text-gray-200" />
            <p className="text-gray-500">Aucune prédiction pour aujourd'hui.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {coupons.map((coupon) => (
              <div key={coupon.id} className={`${theme.colors.a_background} rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-transparent'} transition-all hover:shadow-lg`}>
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-[#E8E8E8]'} ${theme.mode === 'dark' ? 'text-slate-400' : 'text-[#999999]'} flex items-center justify-center font-bold text-lg`}>
                    {getInitials(coupon.author_first_name, coupon.author_last_name)}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${theme.colors.text}`}>{coupon.author_first_name} {coupon.author_last_name}</h3>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={14} className={i <= Math.round(coupon.author_rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bet Type Pill */}
                <div className="inline-flex items-center gap-1.5 bg-[#E9F3FF] dark:bg-blue-900/30 text-[#1976D2] dark:text-blue-300 text-xs px-3 py-1.5 rounded-lg font-bold mb-4">
                  <LinkIcon size={14} />
                  {coupon.coupon_type === 'combine'
                    ? `Combiné (${coupon.match_count} matchs)`
                    : `Simple (${coupon.match_count} match)`}
                </div>

                {/* Côte & Platform */}
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <div className={`${theme.colors.d_text} opacity-60 text-xs uppercase tracking-wide font-medium leading-none`}>Côte totale: <span className={`text-2xl font-black ml-1 ${theme.colors.text}`}>{coupon.cote}</span></div>
                  </div>
                  <div className={`flex items-center gap-2 ${theme.mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-[#F8F9FA] border-gray-100'} py-1.5 px-3 rounded-xl shadow-sm border`}>
                    <div className="w-5 h-5 rounded flex items-center justify-center overflow-hidden">
                      <img src={coupon.bet_app.image} alt="app" className="w-full h-full object-contain" />
                    </div>
                    <span className={`font-bold text-xs ${theme.colors.text}`}>{coupon.bet_app.public_name}</span>
                  </div>
                </div>

                <hr className={`border-gray-50 ${theme.mode === 'dark' ? 'border-slate-700/50' : ''} mb-4`} />

                {/* Footer Actions */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-4 ${theme.mode === 'dark' ? 'text-slate-400' : 'text-[#999999]'}`}>
                    <button
                      onClick={() => coupon.can_rate && handleRate(coupon.id, 5)}
                      disabled={!coupon.can_rate}
                      className={`flex items-center gap-1.5 transition-colors ${coupon.user_rating === 5 ? "text-blue-500" : coupon.can_rate ? "hover:text-blue-500" : "opacity-50 cursor-not-allowed"}`}
                    >
                      <ThumbsUp size={18} className={coupon.user_rating === 5 ? "fill-blue-500" : ""} />
                      <span className="font-bold text-sm">{coupon.likes_count || 0}</span>
                    </button>
                    <button
                      onClick={() => coupon.can_rate && handleRate(coupon.id, 1)}
                      disabled={!coupon.can_rate}
                      className={`flex items-center gap-1.5 transition-colors ${coupon.user_rating === 1 ? "text-red-500" : coupon.can_rate ? "hover:text-red-500" : "opacity-50 cursor-not-allowed"}`}
                    >
                      <ThumbsDown size={18} className={coupon.user_rating === 1 ? "fill-red-500" : ""} />
                      <span className="font-bold text-sm">{coupon.dislikes_count || 0}</span>
                    </button>
                    <div className="flex items-center gap-1 ml-1">
                      <Star size={18} className="fill-yellow-400 text-yellow-400" />
                      <span className={`font-bold text-sm ${theme.colors.text}`}>
                        {typeof coupon.average_rating === 'number' ? coupon.average_rating.toFixed(1) : coupon.average_rating}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(coupon.code, coupon.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all shadow-sm active:scale-95
                      ${copiedId === coupon.id
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-[#ECF2FF] text-[#002d72] dark:text-blue-300'}`}
                  >
                    {copiedId === coupon.id ? <Check size={16} strokeWidth={3} /> : <div className="p-0.5 rounded bg-white/60 dark:bg-gray-800/60"><Copy size={14} /></div>}
                    <span>{coupon.code}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CouponPage;
