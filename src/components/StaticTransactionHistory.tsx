'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';

// Define API response interfaces
interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface App {
    id: string;
    name: string;
    image: string;
    public_name: string;
    is_active: boolean;
}

interface Network {
    id: number;
    name: string;
    public_name: string;
    image: string;
    country_code: string;
    indication: string;
}

interface Transaction {
    id: string;
    amount: number;
    reference: string;
    type_trans: string;
    status: string;
    created_at: string;
    phone_number: string;
    app: App;
    network: Network;
    user: User;
    user_app_id: string;
    transaction_reference: string | null;
    error_message: string | null;
    net_payable_amount: number | null;
}

type HistoricItem = {
    id: string;
    user: string;
    created_at: string;
    transaction: Transaction;
};

export default function StaticTransactionHistory() {
    const [transactions, setTransactions] = useState<HistoricItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();
    const router = useRouter();

    // Format date from ISO string to readable format
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        });
    };

    // Fetch transactions from API (static, no WebSocket, no authentication)
    const fetchTransactions = async () => {
        setLoading(true);

        try {
            // Make API call WITHOUT authentication
            const response = await fetch('https://api.blaffa.net/blaffa/historic', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Only show first 5 transactions
                setTransactions(data.results.slice(0, 5));
            } else {
                setTransactions([]);
            }

            setError(null);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
            setError(null); // Don't show error to user, just show empty state
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Show transaction details
    const openTransactionDetails = (transaction: HistoricItem) => {
        router.push(`/transaction/detail?id=${transaction.transaction.id}`);
    };

    return (
        <div className={`mt-8 bg-gradient-to-br ${theme.colors.background} rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden`}>
            <div className="w-full overflow-hidden">
                {/* Header with title and controls */}
                <div className="px-6 py-4 flex items-center justify-between">
                    <h3 className={`text-xl font-medium ${theme.colors.text}`}>Activités récentes</h3>
                    <a className="text-[#134e9a] dark:text-blue-400 hover:text-blue-700 font-bold text-sm" href="/all_transactions">
                        voir tout
                    </a>
                </div>

                {/* Transaction list */}
                <div className="space-y-4">
                    <style>
                        {`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
              
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
      `}
                    </style>

                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"></div>
                            </div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-6">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 text-center font-normal">
                                your recent activities will appear here
                            </p>
                            <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                                No recent activity yet
                            </h3>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="grid gap-0">
                                {transactions.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="group relative w-full overflow-hidden bg-white dark:bg-transparent transition-all duration-300 cursor-pointer"
                                        onClick={() => openTransactionDetails(item)}
                                    >

                                        <div className="relative p-6 w-full">
                                            {/* Unified Layout (Simplified dots design for all screens) */}
                                            <div className="w-full">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-4">
                                                        {/* Stylized Dots Icon - Light gray circle with 3 blue dots */}
                                                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                            <div className="flex gap-0.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] dark:bg-[#60a5fa]"></div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] dark:bg-[#60a5fa]"></div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] dark:bg-[#60a5fa]"></div>
                                                            </div>
                                                        </div>

                                                        {/* Transaction Info */}
                                                        <div className="flex flex-col">
                                                            <h3 className="font-medium text-[1.05rem] text-gray-900 dark:text-white leading-tight">
                                                                {item.transaction.type_trans === 'deposit' ? 'Dépôt' : item.transaction.type_trans === 'withdrawal' ? 'Retrait' : item.transaction.type_trans}
                                                            </h3>
                                                            <p className="text-[0.85rem] text-gray-500 dark:text-gray-400 font-normal">
                                                                {formatDate(item.transaction.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Amount and Status */}
                                                    <div className="text-right">
                                                        <div className="font-medium text-[1rem] text-gray-900 dark:text-white">
                                                            XOF {item.transaction.amount}
                                                        </div>
                                                        <p className="text-[0.85rem] text-[#b3b3b3] dark:text-gray-500 font-normal">
                                                            {item.transaction.status === 'pending' ? 'pending' : item.transaction.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gradient border effect on hover */}
                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-blue-500/20 to-blue-500/20 blur-sm"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
