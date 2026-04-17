'use client'

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Copy, RefreshCw, CheckCircle2, AlertCircle, Clock, Smartphone, Phone, CreditCard, Hash, Calendar, FileText, Contact } from 'lucide-react';
import { useTheme } from '../../../components/ThemeProvider';
import api from '@/lib/axios';

type Transaction = {
    id: string;
    amount: number;
    reference: string;
    type_trans: string;
    status: string;
    created_at: string;
    phone_number: string;
    transaction_reference: string | null;
    user_app_id?: string | null;
    error_message: string | null;
    net_payable_amount: number | null;
    payment_method?: string;
    issuer?: string;
    user?: {
        first_name: string;
        last_name: string;
    };
    app?: {
        id: string;
        name: string;
        public_name: string;
        image: string;
    };
    network?: {
        id: number;
        name: string;
        public_name: string;
        image?: string;
    };
    total_crypto?: string | number;
    wallet_link?: string | null;
    hash?: string | null;
    ussd_code?: string | null;
    crypto?: {
        id: number;
        name: string;
        symbol: string;
        logo: string;
        sale_adress?: string;
    } | null;
};

function TransactionDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const { theme } = useTheme();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fetchTransactionDetails = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Authentication required');

            // 1. Try direct transaction endpoints first
            const potentialEndpoints = [
                `/blaffa/transaction/${id}/`,
                `/blaffa/transaction/${id}`,
                `/blaffa/historic/${id}/`,
                `/blaffa/historic/${id}`
            ];

            for (const endpoint of potentialEndpoints) {
                try {
                    const directResponse = await api.get(endpoint, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (directResponse.data && (directResponse.data.id || directResponse.data.transaction?.id || directResponse.data.reference)) {
                        const data = directResponse.data.transaction || directResponse.data;
                        if (String(data.id) === String(id) ||
                            String(directResponse.data.id) === String(id) ||
                            data.reference === id) {
                            setTransaction(data);
                            setLoading(false);
                            return;
                        }
                    }
                } catch (e) { /* ignore and try next */ }
            }

            // 2. Fallback: Search in the recent history
            let page = 1;
            let found = null;
            let hasMore = true;

            while (!found && hasMore && page <= 5) {
                const response = await api.get(`/blaffa/historic${page > 1 ? `?page=${page}` : ''}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const results = response.data.results || [];
                found = results.find((item: any) =>
                    (item.transaction && String(item.transaction.id) === String(id)) ||
                    (String(item.id) === String(id)) ||
                    (item.transaction && item.transaction.reference === id)
                );

                if (found) {
                    setTransaction(found.transaction || found);
                    setLoading(false);
                    return;
                }

                hasMore = !!response.data.next;
                page++;
            }

            setError('Transaction introuvable');
        } catch (err: any) {
            console.error('Error fetching details:', err);
            setError(err.message || 'Failed to load transaction details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchUserProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;
            const response = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserProfile(response.data);
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchTransactionDetails();
            fetchUserProfile();
        }
    }, [id, fetchTransactionDetails, fetchUserProfile]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusIcon = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'completed':
            case 'accept':
            case 'approve':
            case 'success':
                return (
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-3 shadow-sm">
                        <CheckCircle2 size={32} className="text-white" />
                    </div>
                );
            case 'failed':
            case 'error':
            case 'fail':
            case 'echec':
                return (
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-3 shadow-sm">
                        <AlertCircle size={32} className="text-white" />
                    </div>
                );
            case 'pending':
            case 'payment_init_success':
            case 'en attente':
            default:
                return (
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                        <RefreshCw size={32} className="text-gray-400 animate-spin-slow" />
                    </div>
                );
        }
    };

    const getStatusText = (status: string) => {
        const s = status.toLowerCase();
        if (['pending', 'payment_init_success', 'en attente'].includes(s)) return 'En attente';
        if (['completed', 'accept', 'approve', 'success'].includes(s)) return 'Succès';
        if (['failed', 'error', 'fail', 'echec'].includes(s)) return 'Échec';
        return status;
    };

    const getStatusSubtext = (status: string, transType: string) => {
        const s = status.toLowerCase();
        const type = transType.charAt(0).toUpperCase() + transType.slice(1);
        if (['pending', 'payment_init_success', 'en attente'].includes(s)) return `${type} en cours`;
        if (['completed', 'accept', 'approve', 'success'].includes(s)) return `${type} réussi`;
        if (['failed', 'error', 'fail', 'echec'].includes(s)) return `${type} échoué`;
        return '';
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'accept':
            case 'approve':
            case 'success':
                return 'text-green-500';
            case 'failed':
            case 'error':
            case 'fail':
            case 'echec':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) + ' : ' + date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${theme.colors.a_background} flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!id || error || !transaction) {
        return (
            <div className={`min-h-screen ${theme.colors.a_background} flex flex-col`}>
                <div className="flex items-center px-4 py-6">
                    <button onClick={() => router.back()} className="p-2">
                        <ArrowLeft className={theme.colors.text} size={24} />
                    </button>
                    <h1 className={`flex-1 text-center text-xl font-bold ${theme.colors.text} mr-10`}>
                        Détails du paiement
                    </h1>
                </div>

                <div className="mx-auto w-full px-6 flex flex-col items-center justify-center pt-20">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-orange-400">
                        <AlertCircle size={95} className="stroke-[1.2]" />
                    </div>

                    <h2 className={`text-xl font-bold ${theme.colors.text} mb-4 text-center`}>
                        {error || (!id ? 'ID manquant' : 'Transaction introuvable')}
                    </h2>

                    <p className="text-gray-500 text-center mb-10 px-4">
                        Nous n'avons pas pu charger les informations. L'ID est <strong>{id || 'inconnu'}</strong>.
                    </p>

                    <button
                        onClick={() => fetchTransactionDetails()}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg mb-4"
                    >
                        Réessayer
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="w-full py-4 border-2 border-gray-200 dark:border-gray-800 text-gray-500 rounded-2xl font-bold text-lg"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.colors.a_background} flex flex-col`}>
            {/* Header */}
            <div className="flex items-center px-4 py-2">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className={theme.colors.text} size={24} />
                </button>
                <h1 className={`flex-1 text-center text-xl font-bold ${theme.colors.text} mr-10`}>
                    Détails du {transaction.type_trans}
                </h1>
            </div>

            <div className="mx-auto w-full px-4 pb-14 flex flex-col items-center">
                <div className="mt-1">
                    {getStatusIcon(transaction.status)}
                </div>

                <h2 className={`text-2xl font-bold ${getStatusColor(transaction.status)} mb-0.5`}>
                    {getStatusText(transaction.status)}
                </h2>
                <p className="text-gray-400 text-sm mb-3">
                    {getStatusSubtext(transaction.status, transaction.type_trans)}
                </p>
                <div className={`text-3xl font-black ${theme.colors.text} mb-4`}>
                    XOF {transaction.amount}
                </div>

                {/* Message Box */}
                <div className={`w-full ${theme.mode === 'dark' ? 'bg-blue-900/10 border-blue-900/30' : 'bg-[#EBF5FF] border-[#D1E9FF]'} rounded-2xl p-3 mb-4 border`}>
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle size={18} className="text-blue-400" />
                        <span className="font-bold text-[#1E3A8A] dark:text-blue-300">Message</span>
                    </div>
                    <p className="text-[#1E3A8A] dark:text-blue-200 text-sm">
                        {transaction.error_message || (['pending', 'payment_init_success', 'en attente'].includes(transaction.status?.toLowerCase()) ? `${transaction.type_trans} en cours` : (['completed', 'accept', 'approve', 'success'].includes(transaction.status?.toLowerCase()) ? `Paiement effectué avec succès.` : 'Aucune demande de paiement n’a été trouvée pour ce client.'))}
                    </p>
                </div>

                {/* Crypto Payment Codes (USSD) */}
                {['pending', 'payment_init_success', 'en attente'].includes(transaction.status?.toLowerCase() || '') && transaction.ussd_code && (
                    <div className={`w-full ${theme.mode === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-2xl px-5 py-4 w-full shadow-sm mb-4`}>
                        <p className={`text-xs font-medium ${theme.colors.d_text} opacity-50 uppercase tracking-wider mb-3`}>Code USSD à composer</p>
                        <div className="flex items-center justify-between gap-4">
                            <span className={`font-mono font-bold text-2xl ${theme.colors.text} tracking-widest break-all`}>
                                {transaction.ussd_code}
                            </span>
                            <button
                                onClick={() => copyToClipboard(transaction.ussd_code!)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${copied ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : `${theme.mode === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 border border-slate-200'}`}`}
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copié' : 'Copier'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Transaction Information Card */}
                <div className={`w-full ${theme.mode === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'} rounded-3xl p-4 border shadow-sm mb-4`}>
                    <h3 className={`text-base font-bold ${theme.colors.text} mb-3`}>
                        Informations du {transaction.type_trans}
                    </h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                            <span className="text-gray-400 text-sm">Type</span>
                            <span className={`font-bold uppercase ${theme.colors.text}`}>{transaction.type_trans}</span>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                {transaction.crypto ? (
                                    <img src={transaction.crypto.logo} alt={transaction.crypto.name} className="w-8 h-8 object-contain" />
                                ) : transaction.app?.image ? (
                                    <img src={transaction.app.image} alt={transaction.app.public_name} className="w-8 h-8 object-contain rounded" onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>';
                                    }} />
                                ) : (
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                        <CreditCard size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="text-gray-400 text-xs">{transaction.crypto ? 'Actif Crypto' : 'Application'}</span>
                                <span className={`font-semibold ${theme.colors.text}`}>
                                    {transaction.crypto ? `${transaction.crypto.name} (${transaction.crypto.symbol})` : (transaction.app?.public_name || '1xBet')}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                {transaction.network?.image ? (
                                    <img src={transaction.network.image} alt={transaction.network.public_name} className="w-8 h-8 object-contain rounded" onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white"><Smartphone size="20" /></div>';
                                    }} />
                                ) : (
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shrink-0">
                                        <Smartphone className="text-white" size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="text-gray-400 text-xs">Réseau</span>
                                <span className={`font-semibold ${theme.colors.text}`}>
                                    {transaction.network?.public_name || transaction.payment_method || 'ORANGE BURKINA'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                <Phone className="text-gray-400" size={20} />
                            </div>
                            <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="text-gray-400 text-xs">Numéro</span>
                                <span className={`font-semibold ${theme.colors.text}`}>{transaction.phone_number}</span>
                            </div>
                        </div>

                        {/* Crypto-Specific Details */}
                        {transaction.crypto && (
                            <>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                        <Hash className="text-blue-400" size={20} />
                                    </div>
                                    <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-400 text-xs">Quantité Crypto</span>
                                        <span className={`font-bold ${theme.colors.text}`}>
                                            {transaction.total_crypto} {transaction.crypto.symbol}
                                        </span>
                                    </div>
                                </div>
                                
                                {transaction.wallet_link && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                            <CreditCard className="text-gray-400" size={20} />
                                        </div>
                                        <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                            <span className="text-gray-400 text-xs">Portefeuille de réception</span>
                                            <div className="flex items-center justify-between">
                                                <span className={`font-mono text-sm ${theme.colors.text} truncate max-w-[200px]`}>
                                                    {transaction.wallet_link}
                                                </span>
                                                <button onClick={() => copyToClipboard(transaction.wallet_link!)} className="text-blue-400">
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {transaction.hash && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="text-green-400" size={20} />
                                        </div>
                                        <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                            <span className="text-gray-400 text-xs">Hash de transaction</span>
                                            <div className="flex items-center justify-between">
                                                <span className={`font-mono text-sm ${theme.colors.text} truncate max-w-[200px]`}>
                                                    {transaction.hash}
                                                </span>
                                                <button onClick={() => copyToClipboard(transaction.hash!)} className="text-blue-400">
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-gray-400">
                                <span className="font-bold text-xl">$</span>
                            </div>
                            <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="text-gray-400 text-xs">Montant</span>
                                <span className={`font-semibold ${theme.colors.text}`}>XOF {transaction.amount}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                <FileText className="text-gray-400" size={20} />
                            </div>
                            <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="text-gray-400 text-xs">Référence</span>
                                <div className="flex items-center justify-between">
                                    <span className={`font-semibold ${theme.colors.text} truncate`}>{transaction.reference}</span>
                                    <button
                                        onClick={() => copyToClipboard(transaction.reference)}
                                        className="text-blue-400 hover:text-blue-500"
                                    >
                                        <Copy size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                <Calendar className="text-gray-400" size={20} />
                            </div>
                            <div className="flex flex-col flex-1 border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="text-gray-400 text-xs">Date</span>
                                <span className={`font-semibold ${theme.colors.text}`}>
                                    {formatDate(transaction.created_at)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                <Contact className="text-gray-400" size={20} />
                            </div>
                            <div className="flex flex-col flex-1">
                                <span className="text-gray-400 text-xs">{transaction.app?.public_name || '1xBet'} ID</span>
                                <span className={`font-semibold ${theme.colors.text}`}>{(transaction as any).user_app_id || transaction.transaction_reference || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!['completed', 'accept', 'approve', 'success'].includes(transaction.status?.toLowerCase()) && (
                    <button
                        onClick={() => {
                            const firstName = userProfile?.first_name || 'Utilisateur';
                            const lastName = userProfile?.last_name || '';
                            const ref = transaction.reference;
                            const amount = transaction.amount;
                            const network = transaction.network?.public_name || transaction.payment_method || 'N/A';
                            const phone = transaction.phone_number;
                            const appName = transaction.app?.public_name || 'App';
                            const appId = (transaction as any).user_app_id || transaction.transaction_reference || 'N/A';

                            const transType = transaction.type_trans;
                            const message = `Bonjour moi c'est ${firstName} ${lastName}, j'ai besoin d'aide concernant mon ${transType}.\nDate: ${formatDate(transaction.created_at)}\nRéférence: ${ref}\nMontant: XOF ${amount}\nRéseau: ${network}\nTéléphone: ${phone}\n*${appName} ID:* ${appId}`;

                            window.open(`https://wa.me/22553445327?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full py-4 bg-[#ffdedb] hover:bg-[#ffcfcc] text-[#ff6b62] rounded-2xl text-xl font-bold transition-colors shadow-sm mt-4"
                    >
                        Contacter le support
                    </button>
                )}

                {['completed', 'accept', 'approve', 'success'].includes(transaction.status?.toLowerCase()) && (
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-4 bg-[#ffdedb] hover:bg-[#ffcfcc] text-[#ff6b62] rounded-2xl text-xl font-bold transition-colors shadow-sm mt-4"
                    >
                        Retour à l'historique
                    </button>
                )}
            </div>

            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default function TransactionDetailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        }>
            <TransactionDetailContent />
        </Suspense>
    );
}
