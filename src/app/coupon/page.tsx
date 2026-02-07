"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useTheme } from '../../components/ThemeProvider';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, Copy, Check, Plus, Link as LinkIcon, Trophy, MessageCircle, X, Send } from 'lucide-react';

// Unified interfaces matching the actual JSON response
interface BetApp {
  id: string;
  name: string;
  image: string;
  public_name: string;
}

interface CommentAuthor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: CommentAuthor;
  parent_id: string | null;
  replies?: Comment[];
}

interface Coupon {
  id: string;
  created_at: string;
  code: string;
  bet_app: BetApp;
  author: string;
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
  user_liked: boolean;
  user_disliked: boolean;
  can_rate: boolean;
  total_comments?: number;
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
  const [loading, setLoading] = useState(true);
  const [platformsLoading, setPlatformsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Comment-related state
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

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
        const results = data.results || data || [];
        const mappedCoupons = results.map((c: any) => ({
          ...c,
          // Map legacy user_rating to new booleans if explicit booleans aren't present
          user_liked: c.user_liked ?? (c.user_rating === 5),
          user_disliked: c.user_disliked ?? (c.user_rating === 1),
        }));
        setCoupons(mappedCoupons);
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


  useEffect(() => {
    fetchPlatforms();
    fetchCoupons();
    fetchUserProfile();
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

  const handleVote = async (couponId: string, voteType: 'like' | 'dislike') => {
    if (!userProfile?.can_rate_coupons) {
      setError("Vous n'avez pas l'autorisation de noter des coupons. Pour noter, vous devez avoir au moins 1 mois d'ancienneté et 15 000 FCFA de transactions acceptées.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      const response = await api.post(`/blaffa/coupons/${couponId}/vote/`, { vote_type: voteType });
      if (response.status === 200) {
        // Clear any previous error on success
        setError(null);
        // Update local state for the specific coupon
        setCoupons(prevCoupons => prevCoupons.map(c => {
          if (c.id === couponId) {
            return {
              ...c,
              likes_count: response.data.coupon.likes,
              dislikes_count: response.data.coupon.dislikes,
              user_liked: response.data.coupon.user_liked,
              user_disliked: response.data.coupon.user_disliked,
              // If the backend returns updated can_rate, use it. Otherwise, rely on existing logic or assume voting toggles/updates it.
              // Documentation says if same vote -> delete (so maybe allow voting again? or just untoggle?)
              // For now, let's trust the response or just keep can_rate true if we want to allow changing vote?
              // The docs say "same vote -> delete", "opposed vote -> update". This implies we can vote again.
              // So we might NOT want to set can_rate to false permanently unless there's a limit.
              // BUT doc says "Un vote par jour et par auteur".
              // Let's assume response might carry state or we just update the counts.
              // can_rate might be complex to infer locally if it depends on "per day".
              // Let's try to keep can_rate as is or check if response has it.
              // The example response at line 231 doesn't show `can_rate` in the enclosed coupon object.
            };
          }
          return c;
        }));
      }
    } catch (err: any) {
      console.error('Error voting coupon:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || err.response?.data?.message || 'Erreur lors du vote.';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  const fetchComments = async (couponAuthorId: string) => {
    setCommentsLoading(true);
    try {
      const response = await api.get(`/blaffa/author-comments/list/?coupon_author_id=${couponAuthorId}`);
      if (response.status === 200) {
        setComments(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Erreur lors du chargement des commentaires.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setCommentsLoading(false);
    }
  };

  const createComment = async (couponId: string, content: string, parentId: string | null = null) => {
    if (!content.trim()) return;

    try {
      const payload: any = {
        coupon_id: couponId,
        content: content.trim()
      };

      if (parentId) {
        payload.parent_id = parentId;
      }

      const response = await api.post('/blaffa/author-comments/', payload);
      if (response.status === 200 || response.status === 201) {
        // Refresh comments after creating
        if (selectedCoupon) {
          await fetchComments(selectedCoupon.author);

          // Update comment count in the coupon list
          setCoupons(prevCoupons => prevCoupons.map(c => {
            if (c.id === couponId) {
              return {
                ...c,
                total_comments: (c.total_comments || 0) + 1
              };
            }
            return c;
          }));
        }

        setCommentText('');
        setReplyingTo(null);
      }
    } catch (err: any) {
      console.error('Error creating comment:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || 'Erreur lors de la création du commentaire.';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleOpenComments = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowCommentModal(true);
    fetchComments(coupon.author);
  };

  const handleCloseComments = () => {
    setShowCommentModal(false);
    setSelectedCoupon(null);
    setComments([]);
    setCommentText('');
    setReplyingTo(null);
  };

  const handleSendComment = () => {
    if (selectedCoupon && commentText.trim()) {
      createComment(selectedCoupon.id, commentText, replyingTo?.id || null);
    }
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => coupon.can_rate && handleVote(coupon.id, 'like')}
                      disabled={!coupon.can_rate && !coupon.user_liked && !coupon.user_disliked}
                      className={`flex items-center gap-1.5 transition-colors ${coupon.user_liked ? "text-blue-600" : "text-[#1976D2] opacity-80 hover:opacity-100"}`}
                    >
                      <ThumbsUp size={20} className={coupon.user_liked ? "fill-blue-600" : ""} />
                      <span className="text-sm font-medium">{coupon.likes_count || 0}</span>
                    </button>
                    <button
                      onClick={() => coupon.can_rate && handleVote(coupon.id, 'dislike')}
                      disabled={!coupon.can_rate && !coupon.user_liked && !coupon.user_disliked}
                      className={`flex items-center gap-1.5 transition-colors ${coupon.user_disliked ? "text-red-400" : "text-[#EF9A9A] opacity-80 hover:opacity-100"}`}
                    >
                      <ThumbsDown size={20} className={coupon.user_disliked ? "fill-red-400" : ""} />
                      <span className="text-sm font-medium">{coupon.dislikes_count || 0}</span>
                    </button>
                    <button
                      onClick={() => handleOpenComments(coupon)}
                      className="flex items-center gap-1.5 transition-colors text-[#999999] hover:text-gray-600"
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm font-medium">{coupon.total_comments || 0} Com.</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(coupon.code, coupon.id)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95
                      ${copiedId === coupon.id
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-[#ECF2FF] text-[#002d72] dark:text-[#002d72]'}`}
                  >
                    {copiedId === coupon.id ? <Check size={16} strokeWidth={3} /> : <div className="flex items-center gap-2"><Copy size={16} /> <span className="uppercase">{coupon.code}</span></div>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment Modal */}
        {showCommentModal && selectedCoupon && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseComments}
            />

            {/* Modal */}
            <div className={`relative w-full sm:max-w-lg sm:mx-4 ${theme.colors.a_background} sm:rounded-3xl flex flex-col max-h-[90vh] sm:max-h-[80vh] h-full sm:h-auto shadow-2xl`}>
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-100'}`}>
                <h2 className={`text-xl font-bold ${theme.colors.text}`}>Commentaires</h2>
                <button
                  onClick={handleCloseComments}
                  className={`p-2 rounded-full ${theme.colors.hover} transition-colors`}
                >
                  <X size={24} className={theme.colors.text} />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {commentsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">Chargement des commentaires...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <MessageCircle size={48} className="text-gray-300" />
                    <p className="text-gray-400 text-sm">Aucun commentaire pour le moment</p>
                    <p className="text-gray-400 text-xs">Soyez le premier à commenter !</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="space-y-3">
                      {/* Main Comment */}
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} flex items-center justify-center flex-shrink-0`}>
                          <span className={`font-bold text-sm ${theme.mode === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                            {getInitials(comment.author.first_name, comment.author.last_name)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={`font-bold text-sm ${theme.colors.text}`}>
                              {comment.author.first_name} {comment.author.last_name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatCommentDate(comment.created_at)}
                            </span>
                          </div>
                          <p className={`text-sm ${theme.colors.text} leading-relaxed`}>
                            {comment.content}
                          </p>
                          <button
                            onClick={() => setReplyingTo(comment)}
                            className="text-xs text-blue-500 hover:text-blue-600 mt-2 font-medium"
                          >
                            Répondre
                          </button>
                        </div>
                      </div>

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-12 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <div className={`w-8 h-8 rounded-full ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} flex items-center justify-center flex-shrink-0`}>
                                <span className={`font-bold text-xs ${theme.mode === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                                  {getInitials(reply.author.first_name, reply.author.last_name)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                  <span className={`font-bold text-sm ${theme.colors.text}`}>
                                    {reply.author.first_name} {reply.author.last_name}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {formatCommentDate(reply.created_at)}
                                  </span>
                                </div>
                                <p className={`text-sm ${theme.colors.text} leading-relaxed`}>
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Reply Indicator */}
              {replyingTo && (
                <div className={`px-6 py-2 border-t ${theme.mode === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-100 bg-gray-50'} flex items-center justify-between`}>
                  <span className="text-sm text-gray-500">
                    Répondre à <span className="font-semibold">{replyingTo.author.first_name}</span>
                  </span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Annuler
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className={`p-6 border-t ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                    placeholder="Écrire un commentaire..."
                    className={`flex-1 px-4 py-3 rounded-xl border ${theme.mode === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  <button
                    onClick={handleSendComment}
                    disabled={!commentText.trim()}
                    className={`p-3 rounded-xl transition-all ${commentText.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                      : 'bg-gray-300 cursor-not-allowed'
                      }`}
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CouponPage;
