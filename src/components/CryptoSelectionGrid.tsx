'use client';

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useTheme } from "@/components/ThemeProvider";
// import { useTranslation } from "react-i18next";
// ... other imports
import { FaArrowLeft } from 'react-icons/fa';
import CryptoTransactionForm from '@/components/CryptoTransactionForm';
import { ImSpinner2 } from 'react-icons/im';

interface Crypto {
    id: number;
    public_amount: number;
    created_at: string;
    updated_at: string;
    logo: string;
    code: string;
    name: string;
    amount: string;
    symbol: string;
}

interface Network {
    id: string;
    name: string;
    public_name: string;
    image?: string;
}

const CRYPTO_API = "/blaffa/crypto";
const NETWORK_API = "/blaffa/network/";

interface CryptoSelectionGridProps {
    mode: 'buy' | 'sale';
    title: string;
}

export default function CryptoSelectionGrid({ mode, title }: CryptoSelectionGridProps) {
    const { theme } = useTheme();
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
    const [step, setStep] = useState<'crypto' | 'network' | 'details'>('crypto');

    // Fetch Cryptos
    useEffect(() => {
        const fetchCryptos = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(CRYPTO_API + `?type_trans=${mode}`);
                setCryptos(Array.isArray(response.data.results) ? response.data.results : []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch cryptocurrencies");
            } finally {
                setLoading(false);
            }
        };
        fetchCryptos();
    }, [mode]);

    // Fetch Networks
    useEffect(() => {
        const fetchNetworks = async () => {
            try {
                const response = await api.get(NETWORK_API);
                if (Array.isArray(response.data)) {
                    setNetworks(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch networks", err);
            }
        };
        fetchNetworks();
    }, []);

    const handleCryptoSelect = (crypto: Crypto) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        setSelectedCrypto(crypto);
        setStep('network');
    };

    const handleNetworkSelect = (network: Network) => {
        setSelectedNetwork(network);
        setStep('details');
    };

    const handleBack = () => {
        if (step === 'details') {
            setStep('network');
            setSelectedNetwork(null);
        } else if (step === 'network') {
            setStep('crypto');
            setSelectedCrypto(null);
        } else {
            window.history.back();
        }
    };

    if (step === 'details' && selectedCrypto && selectedNetwork) {
        return (
            <div className="w-full">
                <button
                    onClick={handleBack}
                    className={`group flex items-center gap-2 mb-6 ${theme.mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                    <FaArrowLeft />
                    <span className="font-medium">Retour</span>
                </button>
                <div className="mb-6">
                    <h2 className={`text-xl font-bold ${theme.colors.text}`}>4. Entrez les informations de la crypto</h2>
                </div>
                <CryptoTransactionForm
                    isVerified={true}
                    crypto={selectedCrypto}
                    // network={selectedNetwork} // Pass network prop (Typescript will complain until I update Form)
                    // For now, allow Form to update, I'll update Form next.
                    // But I need to pass it. I'll pass it as `selectedNetwork` and I'll update the interface in Form.
                    typeTrans={mode}
                    selectedNetwork={selectedNetwork} // Passing it here
                />
            </div>
        );
    }

    if (step === 'network' && selectedCrypto) {
        return (
            <div className="w-full">
                <button
                    onClick={handleBack}
                    className={`group flex items-center gap-2 mb-6 ${theme.mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                    <FaArrowLeft />
                    <span className="font-medium">Retour</span>
                </button>
                <h1 className={`text-2xl font-bold mb-6 ${theme.colors.text}`}>Réseau</h1>
                <p className={`font-medium mb-6 ${theme.colors.d_text}`}>3. Sélectionnez votre réseau</p>

                <div className="space-y-3">
                    {networks.map((network) => (
                        <div
                            key={network.id}
                            onClick={() => handleNetworkSelect(network)}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all 
                                ${theme.mode === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'} 
                                ${theme.colors.a_background}`}
                        >
                            <div className="w-10 h-10 relative flex-shrink-0">
                                {network.image ? (
                                    <img src={network.image} alt={network.name} className="w-full h-full object-contain rounded-md" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold text-gray-500">
                                        {network.name.substring(0, 2)}
                                    </div>
                                )}
                            </div>
                            <span className={`text-lg font-medium ${theme.colors.text}`}>{network.public_name || network.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h1 className={`text-2xl font-bold mb-2 ${theme.colors.text}`}>
                {title === 'Achat' && (
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className={theme.colors.hover}><FaArrowLeft className="text-xl" /></button>
                        <span>Achat</span>
                    </div>
                )}
                {title === 'Vente' && (
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className={theme.colors.hover}><FaArrowLeft className="text-xl" /></button>
                        <span>Vente</span>
                    </div>
                )}
            </h1>

            <p className={`font-medium mb-6 ${theme.colors.d_text}`}>1. Sélectionnez votre crypto monnaie</p>

            {loading ? (
                <div className="flex justify-center py-10">
                    <ImSpinner2 className="animate-spin text-3xl text-blue-600" />
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cryptos.map((crypto) => (
                        <div
                            key={crypto.id}
                            onClick={() => handleCryptoSelect(crypto)}
                            className={`border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-200'} rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all ${theme.colors.a_background} shadow-sm`}
                        >
                            <div className="w-12 h-12 relative mb-3">
                                <img src={crypto.logo} alt={crypto.name} className={`w-full h-full object-contain rounded-full ${theme.mode === 'dark' ? 'bg-slate-800' : 'bg-black'} text-white p-1`} />
                            </div>
                            <h3 className={`font-medium mb-1 ${theme.colors.text}`}>{crypto.name}</h3>
                            <p className={`font-bold ${theme.colors.primary}`}>{parseInt(crypto.public_amount.toString()).toFixed(1)} CFA</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
