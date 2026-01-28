'use client'

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, RefreshCw, CheckCircle2, XCircle, Clock, Smartphone, Phone, CreditCard, Hash, MessageCircle } from 'lucide-react';
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
    };
    network?: {
        id: number;
        name: string;
        public_name: string;
    };
};

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fetchTransactionDetails = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Authentication required');

            // Note: Using the historic endpoint and finding the transaction by ID 
            // since a specific detail endpoint wasn't explicitly provided.
            const response = await api.get('/blaffa/historic', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const transactions = response.data.results;
            const found = transactions.find((item: any) => item.transaction.id === params.id);

            if (found) {
                setTransaction(found.transaction);
            } else {
                setError('Transaction introuvable');
            }
        } catch (err: any) {
            console.error('Error fetching details:', err);
            setError(err.message || 'Failed to load transaction details');
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) {
            fetchTransactionDetails();
        }
    }, [params.id, fetchTransactionDetails]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'accept':
            case 'approve':
                return <CheckCircle2 size={70} className="text-green-500" />;
            case 'failed':
            case 'error':
                return <XCircle size={70} className="text-red-500" />;
            case 'pending':
            default:
                return <RefreshCw size={70} className="text-gray-400 animate-spin-slow" />;
        }
    };

    const getStatusText = (status: string) => {
        const map: Record<string, string> = {
            pending: 'En attente',
            completed: 'Terminé',
            failed: 'Échoué',
            accept: 'Accepté',
            approve: 'Approuvé'
        };
        return map[status.toLowerCase()] || status;
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${theme.colors.a_background} flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className={`min-h-screen ${theme.colors.a_background} p-6 flex flex-col items-center justify-center`}>
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 text-center max-w-sm">
                    <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className={`text-xl font-bold ${theme.colors.text} mb-2`}>Oups!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'Something went wrong'}</p>
                    <button
                        onClick={() => router.back()}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium"
                    >
                        Retourner
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.colors.a_background} relative`}>
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <ArrowLeft className={theme.colors.text} size={28} />
            </button>

            <div className="max-w-md mx-auto pt-20 pb-10 px-6 flex flex-col items-center">
                {/* Large Status Icon */}
                <div className="mb-8">
                    {getStatusIcon(transaction.status)}
                </div>

                {/* Status and Amount */}
                <p className={`text-lg font-medium text-gray-500 dark:text-gray-400 mb-1`}>
                    {getStatusText(transaction.status)}
                </p>
                <h2 className={`text-3xl font-bold ${theme.colors.text} mb-3`}>
                    XOF {transaction.amount}
                </h2>

                {/* Description Label */}
                <p className={`text-center text-lg ${theme.colors.text} font-medium px-4 mb-10`}>
                    Votre {transaction.type_trans === 'withdrawal' ? 'retrait' : 'dépôt'} sur {transaction.app?.public_name || 'Blaffa'} est {transaction.status}
                </p>

                {/* Details List */}
                <div className="w-full space-y-6 mb-12">
                    <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-500 dark:text-gray-400">Méthode de paiement</span>
                        <span className={`text-lg font-medium ${theme.colors.text}`}>
                            {transaction.network?.public_name || transaction.payment_method || 'N/A'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-500 dark:text-gray-400">Référence</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-lg font-medium ${theme.colors.text} font-mono`}>
                                {transaction.reference}
                            </span>
                            <button
                                onClick={() => copyToClipboard(transaction.reference)}
                                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                <Copy size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-500 dark:text-gray-400">Numéro de téléphone</span>
                        <span className={`text-lg font-medium ${theme.colors.text} font-mono`}>
                            {transaction.phone_number}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-500 dark:text-gray-400">Émetteur de la facture</span>
                        <span className={`text-lg font-medium ${theme.colors.text}`}>
                            {transaction.user ? `${transaction.user.first_name} ${transaction.user.last_name}` : transaction.issuer || 'Utilisateur Blaffa'}
                        </span>
                    </div>
                </div>

                {/* Support Button - Coral style matching reference */}
                <button
                    onClick={() => window.open('https://wa.me/22553445327', '_blank')}
                    className="w-full py-4 bg-[#ffc1bb] hover:bg-[#ffb1aa] text-[#ff6b62] rounded-xl text-xl font-medium transition-colors shadow-sm"
                >
                    Contacter le support
                </button>
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
