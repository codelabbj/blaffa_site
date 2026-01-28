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
  likes: number;
  dislikes: number;
  average_rating: number;
  user_liked: boolean;
  user_disliked: boolean;
  can_rate: boolean;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
}

const CouponPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const promises: Promise<any>[] = [api.get(`/blaffa/coupon`)];

        if (token) {
          promises.push(api.get(`/auth/me`));
        }

        const results = await Promise.allSettled(promises);

        // Handle Coupons
        if (results[0].status === 'fulfilled') {
          const data = results[0].value.data;
          setCoupons(data.results || data || []);
        }

        // Handle Profile
        if (results[1] && results[1].status === 'fulfilled') {
          const profileData = results[1].value.data;
          setUserProfile({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
    <div className={`min-h-screen ${theme.colors.a_background} font-sans pb-20`}>
      <Head>
        <title>Coupons - Blaffa</title>
      </Head>

      {/* Header */}
      <header className={`bg-transparent sticky top-0 z-50`}>
        <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => router.back()} className={`p-2 -ml-2 rounded-full ${theme.colors.hover} transition-colors`}>
            <ArrowLeft className={theme.colors.text} size={28} />
          </button>
          <h1 className={`text-2xl font-bold ${theme.colors.text}`}>Coupon</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* User Card */}
        <div className={`${theme.colors.a_background} p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-8 border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-[#E8E8E8]'} flex items-center justify-center ${theme.mode === 'dark' ? 'text-slate-300' : 'text-[#999999]'} font-bold text-2xl`}>
                {getInitials(userProfile?.first_name, userProfile?.last_name)}
              </div>
              <div>
                <h3 className={`font-bold text-xl ${theme.colors.text}`}>
                  {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Anonyme'}
                </h3>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={18} className={i <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
              </div>
            </div>
            <button className="w-12 h-12 rounded-xl bg-[#002d72] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
              <Plus size={28} strokeWidth={3} />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4">
            <div className={`flex-1 ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-2xl p-4 text-center`}>
              <div className={`text-3xl font-black ${theme.mode === 'dark' ? 'text-blue-400' : 'text-[#002d72]'} leading-none`}>0</div>
              <div className={`text-[0.8rem] ${theme.colors.d_text} opacity-60 font-medium mt-2`}>Mes coupons</div>
            </div>
            <div className={`flex-1 ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-2xl p-4 text-center`}>
              <div className="text-3xl font-black text-green-600 leading-none">0 FCFA</div>
              <div className={`text-[0.8rem] ${theme.colors.d_text} opacity-60 font-medium mt-2`}>Bonus</div>
            </div>
          </div>
        </div>

        {/* Platform Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {['1xBet', 'MELBET', 'BETWINNER'].map((name, idx) => (
            <div key={idx} className={`flex-shrink-0 ${theme.colors.a_background} px-5 py-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-3 border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-transparent'}`}>
              <div className={`w-10 h-10 rounded-lg ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-gray-50'} flex items-center justify-center p-1`}>
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-xs ${name === '1xBet' ? 'bg-blue-600' : name === 'MELBET' ? 'bg-black' : 'bg-green-700'}`}>
                  {name.charAt(0)}
                </div>
              </div>
              <span className={`font-bold text-lg ${theme.colors.text}`}>{name}</span>
            </div>
          ))}
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
              <div key={coupon.id} className={`${theme.colors.a_background} rounded-[2.5rem] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-transparent'} transition-all hover:shadow-lg`}>
                {/* Author Info */}
                <div className="flex items-center gap-5 mb-6">
                  <div className={`w-16 h-16 rounded-[1.25rem] ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-[#E8E8E8]'} ${theme.mode === 'dark' ? 'text-slate-400' : 'text-[#999999]'} flex items-center justify-center font-bold text-2xl`}>
                    {getInitials(coupon.author_first_name, coupon.author_last_name)}
                  </div>
                  <div>
                    <h3 className={`font-bold text-[1.3rem] ${theme.colors.text}`}>{coupon.author_first_name} {coupon.author_last_name}</h3>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={18} className={i <= Math.round(coupon.author_rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bet Type Pill */}
                <div className="inline-flex items-center gap-2 bg-[#E9F3FF] dark:bg-blue-900/30 text-[#1976D2] dark:text-blue-300 text-[1rem] px-5 py-2.5 rounded-xl font-bold mb-6">
                  <LinkIcon size={16} />
                  {coupon.coupon_type === 'combine' ? `Combiné (${coupon.match_count} matchs)` : 'Simple'}
                </div>

                {/* Côte & Platform */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className={`${theme.colors.d_text} opacity-60 text-[1.1rem] font-medium leading-none`}>Côte totale: <span className={`text-[1.8rem] font-black ml-1 ${theme.colors.text}`}>{coupon.cote}</span></div>
                  </div>
                  <div className={`flex items-center gap-3 ${theme.mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-[#F8F9FA] border-gray-100'} py-2.5 px-5 rounded-[1.5rem] shadow-sm border`}>
                    <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden">
                      <img src={coupon.bet_app.image} alt="app" className="w-full h-full object-contain" />
                    </div>
                    <span className={`font-bold text-sm ${theme.colors.text}`}>{coupon.bet_app.public_name}</span>
                  </div>
                </div>

                <hr className={`border-gray-50 ${theme.mode === 'dark' ? 'border-slate-700/50' : ''} mb-6`} />

                {/* Footer Actions */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-6 ${theme.mode === 'dark' ? 'text-slate-400' : 'text-[#999999]'}`}>                    <div className="flex items-center gap-2">
                    <ThumbsUp size={24} className={coupon.user_liked ? "text-blue-500 fill-blue-500" : ""} />
                    <span className="font-bold text-lg">{coupon.likes}</span>
                  </div>
                    <div className="flex items-center gap-2">
                      <ThumbsDown size={24} className={coupon.user_disliked ? "text-red-500 fill-red-500" : ""} />
                      <span className="font-bold text-lg">{coupon.dislikes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-1">
                      <Star size={24} className="fill-yellow-400 text-yellow-400" />
                      <span className={`font-bold text-lg ${theme.colors.text}`}>{coupon.average_rating || '4.5'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(coupon.code, coupon.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-[1.25rem] text-[1.1rem] font-black transition-all shadow-sm active:scale-95
                      ${copiedId === coupon.id
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-[#ECF2FF] text-[#002d72] dark:text-blue-300'}`}
                  >
                    {copiedId === coupon.id ? <Check size={20} strokeWidth={3} /> : <div className="p-1 rounded bg-white/60 dark:bg-gray-800/60"><Copy size={18} /></div>}
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
