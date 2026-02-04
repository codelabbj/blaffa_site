"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { useTheme } from '../../../components/ThemeProvider';
import api from '@/lib/axios';

interface BetApp {
    id: string;
    name: string;
    image: string;
    public_name: string;
}

const CreateCouponPage = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [platforms, setPlatforms] = useState<BetApp[]>([]);
    const [platformsLoading, setPlatformsLoading] = useState(true);

    // Form State
    const [couponCode, setCouponCode] = useState('');
    const [couponType, setCouponType] = useState<'single' | 'combine'>('single');
    const [cote, setCote] = useState('');
    const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
    const [matchCount, setMatchCount] = useState('1');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
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

        fetchPlatforms();
    }, []);

    useEffect(() => {
        const count = parseInt(matchCount) || 0;
        if (count > 1) {
            setCouponType('combine');
        } else {
            setCouponType('single');
        }
    }, [matchCount]);

    const handleSubmit = async () => {
        if (!selectedPlatformId || !cote) return;

        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/blaffa/coupon', {
                bet_app_id: selectedPlatformId,
                code: couponCode,
                cote: cote,
                coupon_type: couponType,
                match_count: parseInt(matchCount) || 1
            });

            if (response.status === 201) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/coupon');
                }, 2000);
            }
        } catch (err: any) {
            console.error('Error creating coupon:', err);
            const errorMessage = err.response?.data?.error ||
                err.response?.data?.detail ||
                'Une erreur est survenue lors de la création du coupon.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${theme.colors.a_background} font-sans pb-24`}>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-transparent">
                <div className="w-full px-6 h-20 flex items-center">
                    <button onClick={() => router.back()} className={`p-2 -ml-2 rounded-full ${theme.colors.hover} transition-colors`}>
                        <ArrowLeft className={theme.colors.text} size={28} />
                    </button>
                    <h1 className={`flex-1 text-center text-xl font-bold ${theme.colors.text} pr-8`}>
                        Informations de base
                    </h1>
                </div>
            </header>

            <main className="w-full px-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    <div className="space-y-8">
                        {/* Coupon Code */}
                        <div className="space-y-3">
                            <label className={`block text-sm font-semibold ${theme.colors.text}`}>
                                Code du coupon
                            </label>
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Ex: COUP123"
                                className={`w-full p-5 rounded-2xl border ${theme.mode === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400`}
                            />
                        </div>

                        {/* Nombre de matchs */}
                        <div className="space-y-3">
                            <label className={`block text-sm font-semibold ${theme.colors.text}`}>
                                Nombre de matchs
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={matchCount}
                                onChange={(e) => setMatchCount(e.target.value)}
                                placeholder="Ex: 5"
                                className={`w-full p-5 rounded-2xl border ${theme.mode === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400`}
                            />
                        </div>

                        {/* Type de Coupon (Display only) */}
                        <div className="space-y-3">
                            <label className={`block text-sm font-semibold ${theme.colors.text}`}>
                                Type de coupon
                            </label>
                            <div className="space-y-3">
                                {[
                                    { id: 'single', label: 'Simple' },
                                    { id: 'combine', label: 'Combiné' }
                                ].map((type) => (
                                    <div
                                        key={type.id}
                                        className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all ${couponType === type.id
                                            ? 'border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 opacity-100'
                                            : 'opacity-40 grayscale border-slate-200 dark:border-slate-800'
                                            }`}
                                    >
                                        <span className={`font-medium ${theme.colors.text}`}>{type.label}</span>
                                        {couponType === type.id && (
                                            <CheckCircle2 size={24} className="text-[#002d72]" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Côte Totale */}
                        <div className="space-y-3">
                            <label className={`block text-sm font-semibold ${theme.colors.text}`}>
                                Côte totale
                            </label>
                            <input
                                type="text"
                                value={cote}
                                onChange={(e) => setCote(e.target.value)}
                                placeholder="Ex: 2.50"
                                className={`w-full p-5 rounded-2xl border ${theme.mode === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400`}
                            />
                        </div>
                    </div>

                    {/* Bookmaker Section */}
                    <div className="space-y-4">
                        <label className={`block text-sm font-semibold ${theme.colors.text}`}>
                            Bookmaker
                        </label>
                        <div className="space-y-3">
                            {platformsLoading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className={`h-20 rounded-2xl animate-pulse ${theme.mode === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}></div>
                                ))
                            ) : (
                                platforms.map((platform) => (
                                    <button
                                        key={platform.id}
                                        onClick={() => setSelectedPlatformId(platform.id)}
                                        className={`w-full p-5 rounded-2xl border flex items-center transition-all ${selectedPlatformId === platform.id
                                            ? 'border-blue-700 bg-blue-50/50 dark:bg-blue-900/20'
                                            : theme.mode === 'dark' ? 'border-slate-800 bg-slate-800' : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100 shrink-0">
                                                <img src={platform.image} alt={platform.name} className="w-full h-full object-contain" />
                                            </div>
                                            <span className={`font-semibold text-lg ${theme.colors.text}`}>
                                                {platform.public_name || platform.name}
                                            </span>
                                        </div>
                                        {selectedPlatformId === platform.id ? (
                                            <CheckCircle2 size={24} className="text-[#002d72]" />
                                        ) : (
                                            <Circle size={24} className="text-gray-300" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        Coupon créé avec succès ! Redirection...
                    </div>
                )}
            </main>

            {/* Sticky Footer Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-transparent pointer-events-none">
                <div className="w-full pointer-events-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedPlatformId || !cote}
                        className={`w-full h-18 bg-[#002d72] active:bg-[#001d4a] text-white font-bold text-xl rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 py-5 flex items-center justify-center`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Suivant'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCouponPage;
