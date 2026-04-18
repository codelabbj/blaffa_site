'use client';

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useTheme } from "@/components/ThemeProvider";
// import { useTranslation } from "react-i18next";
// ... other imports
import { FaArrowLeft } from 'react-icons/fa';
import CryptoTransactionForm from '@/components/CryptoTransactionForm';
import { ImSpinner2 } from 'react-icons/im';

interface Cryptocurrency {
    id: number;
    public_amount: number;
    created_at: string;
    updated_at: string;
    logo: string;
    code: string;
    name: string;
    amount: string;
    symbol: string;
    buy_price?: number | string;
    sale_price?: number | string;
}

interface Network {
    id: string;
    name: string;
    public_name: string;
    country_code?: string;
    indication?: string;
    image?: string;
}

interface CryptoNetwork {
    id: number;
    name: string;
    symbol: string;
    logo: string;
    is_active: boolean;
    crypto: {
        id: number;
        name: string;
    };
}

const CRYPTO_API = "/blaffa/crypto";
const NETWORK_API = "/blaffa/network/";
const CRYPTO_NETWORK_API = "/betpay/crypto-network/";

interface CryptoSelectionGridProps {
    mode: 'buy' | 'sale';
    title: string;
}

export default function CryptoSelectionGrid({ mode, title }: CryptoSelectionGridProps) {
    const { theme } = useTheme();
    const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [cryptoNetworks, setCryptoNetworks] = useState<CryptoNetwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);
    const [selectedCryptoNetwork, setSelectedCryptoNetwork] = useState<CryptoNetwork | null>(null);
    const [step, setStep] = useState<'crypto' | 'crypto-network' | 'details'>('crypto');

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

    // Fetch Networks (Payment Networks)
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

    const handleCryptoSelect = async (crypto: Cryptocurrency) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        setSelectedCrypto(crypto);
        setLoading(true);
        try {
            const response = await api.get(CRYPTO_NETWORK_API);
            const allNetworks = Array.isArray(response.data.results) ? response.data.results : (Array.isArray(response.data) ? response.data : []);
            const filtered = allNetworks.filter((n: CryptoNetwork) => n.crypto?.id === crypto.id && n.is_active);
            setCryptoNetworks(filtered);
            setStep('crypto-network');
        } catch (err) {
            console.error("Failed to fetch crypto networks", err);
            // Fallback: stay on crypto or show error
        } finally {
            setLoading(false);
        }
    };

    const handleCryptoNetworkSelect = (network: CryptoNetwork) => {
        setSelectedCryptoNetwork(network);
        setStep('details');
    };

    const handleBack = () => {
        if (step === 'details') {
            setStep('crypto-network');
            setSelectedCryptoNetwork(null);
        } else if (step === 'crypto-network') {
            setStep('crypto');
            setSelectedCrypto(null);
            setCryptoNetworks([]);
        } else {
            window.history.back();
        }
    };

    if (step === 'details' && selectedCrypto && selectedCryptoNetwork) {
        return (
            <div className="w-full">
                <CryptoTransactionForm
                    isVerified={true}
                    crypto={selectedCrypto}
                    typeTrans={mode}
                    selectedCryptoNetwork={selectedCryptoNetwork}
                    paymentNetworks={networks}
                    onBack={handleBack}
                />
            </div>
        );
    }

    if (step === 'crypto-network' && selectedCrypto) {
        return (
            <div className="w-full">
                <button
                    onClick={handleBack}
                    className={`group flex items-center gap-2 mb-6 ${theme.mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                    <FaArrowLeft />
                    <span className="font-medium">Retour</span>
                </button>
                <h1 className={`text-2xl font-bold mb-6 ${theme.colors.text}`}>Crypto-Network Step</h1>
                <p className={`font-medium mb-6 ${theme.colors.d_text}`}>2. Sélectionnez votre réseau blockchain</p>

                <div className="space-y-3">
                    {cryptoNetworks.length > 0 ? (
                        cryptoNetworks.map((network) => (
                            <div
                                key={network.id}
                                onClick={() => handleCryptoNetworkSelect(network)}
                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all 
                                    ${theme.mode === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'} 
                                    ${theme.colors.a_background}`}
                            >
                                <div className="w-10 h-10 relative flex-shrink-0">
                                    {network.logo ? (
                                        <img src={network.logo} alt={network.name} className="w-full h-full object-contain rounded-md" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold text-gray-500">
                                            {network.symbol}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-lg font-bold ${theme.colors.text}`}>{network.name}</span>
                                    <span className={`text-sm text-gray-500`}>{network.symbol}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`p-8 text-center rounded-xl border border-dashed ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                            <p className={theme.colors.d_text}>Aucun réseau disponible pour cette crypto.</p>
                            <button onClick={handleBack} className="mt-4 text-blue-500 font-medium">Retour</button>
                        </div>
                    )}
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
                            <p className={`font-bold ${theme.colors.primary}`}>
                                {parseInt(((mode === 'buy' ? crypto.buy_price : crypto.sale_price) || 0).toString()).toFixed(1)} CFA
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
