import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { FaPhoneAlt, FaMoneyBillWave, FaWallet, FaCheckCircle, FaCopy, FaArrowLeft } from 'react-icons/fa';
import api from '@/lib/axios';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '@/context/WebSocketContext';

const BUY_ENDPOINT = '/blaffa/buy-crypto/v2';
const SALE_ENDPOINT = '/blaffa/sale-crypto/v2';

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

interface Network {
  id: string;
  name: string;
  public_name: string;
  country_code?: string;
  indication?: string;
  image?: string;
}

interface Cryptocurrency {
  id: string | number;
  name: string;
  symbol: string;
  public_amount: number;
  logo?: string;
  sale_adress?: string;
}

interface CryptoTransactionFormProps {
  isVerified: boolean;
  crypto: Cryptocurrency;
  typeTrans: 'buy' | 'sale';
  selectedCryptoNetwork: CryptoNetwork;
  paymentNetworks: Network[];
  onBack: () => void;
}

export default function CryptoTransactionForm({ 
  isVerified, 
  crypto, 
  typeTrans, 
  selectedCryptoNetwork, 
  paymentNetworks,
  onBack
}: CryptoTransactionFormProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { addMessageHandler } = useWebSocket();
  const [amount, setAmount] = useState(''); // Amount in XOF (local currency)
  const [quantity, setQuantity] = useState(''); // Quantity of token
  const [phone, setPhone] = useState('');
  const [walletLink, setWalletLink] = useState('');
  const [confirmWalletLink, setConfirmWalletLink] = useState('');
  const transactionType = typeTrans;
  const [modal, setModal] = useState<'wallet' | 'confirm' | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');
  const [transactionLink, setTransactionLink] = useState<string | null>(null);
  const [hash, setHash] = useState('');
  const [view, setView] = useState<'form' | 'sale_confirm'>('form');
  const [selectedPaymentNetwork, setSelectedPaymentNetwork] = useState<Network | null>(null);
  const [internalStep, setInternalStep] = useState<'details' | 'payment_network' | 'phone'>('details');

  // Helper to parse API errors
  const parseError = (err: any) => {
    const data = err.response?.data;
    if (!data) return t('Une erreur est survenue. Veuillez réessayer.');

    // Handle specific error codes
    const code = data.code;
    if (code) {
      switch (code) {
        case 'token_not_valid':
          return t('Votre session est expirée ou invalide. Veuillez vous reconnecter.');
        case 'user_not_found':
          return t('Utilisateur non trouvé.');
        // Add more codes as they become known
      }
    }

    // Direct detail message
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.message === 'string') return data.message;

    // Handle validation errors (e.g., { "phone_number": ["This field is required."] })
    if (typeof data === 'object') {
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError) && firstError.length > 0) return firstError[0];
      if (typeof firstError === 'string') return firstError;
    }

    return t('Une erreur est survenue. Veuillez réessayer.');
  };

  // Helper to get country flag based on indication
  const getCountryFlag = (indication?: string) => {
    if (!indication) return '🇧🇫'; // Default
    const cleanIndication = indication.replace('+', '');
    switch (cleanIndication) {
      case '226': return '🇧🇫'; case '225': return '🇨🇮'; case '223': return '🇲🇱';
      case '221': return '🇸🇳'; case '228': return '🇹🇬'; case '229': return '🇧🇯';
      case '237': return '🇨🇲'; case '224': return '🇬🇳'; case '241': return '🇬🇦';
      case '242': return '🇨🇬'; case '243': return '🇨🇩'; case '227': return '🇳🇪';
      case '233': return '🇬🇭'; case '234': return '🇳🇬'; default: return '🌍';
    }
  };

  // Calculate equivalent when quantity changes (Crypto -> Fiat)
  const handleQuantityChange = (q: string) => {
    setQuantity(q);
    if (!q || isNaN(Number(q))) {
      setAmount('');
      return;
    }
    // Amount (XOF) = Quantity * Public Amount
    const xof = Number(q) * Number(crypto.public_amount);
    setAmount(xof.toFixed(0));
  };

  const handleAmountChange = (a: string) => {
    setAmount(a);
    if (!a || isNaN(Number(a))) {
      setQuantity('');
      return;
    }
    // Quantity = Amount / Public Amount
    const q = Number(a) / Number(crypto.public_amount);
    setQuantity(q.toFixed(2));
  };

  // Listen for transaction_link from websocket
  useEffect(() => {
    type WebSocketMessage = { type: string; data?: string };
    const handler = (data: WebSocketMessage) => {
      if (data.type === 'transaction_link' && data.data) {
        setTransactionLink(data.data);
      }
    };
    const removeHandler = addMessageHandler(handler);
    return () => removeHandler();
  }, [addMessageHandler]);


  // Handle API call
  const handleConfirm = async () => {
    setError('');
    setApiResult(null);

    if (internalStep === 'details') {
      if (transactionType === 'buy') {
        if (!walletLink || !confirmWalletLink || walletLink !== confirmWalletLink) {
          setError(t('Les adresses de portefeuille ne correspondent pas.'));
          return;
        }
      }
      if (!quantity || !amount || Number(amount) <= 0) {
        setError(t('Veuillez entrer une quantité et un montant valides.'));
        return;
      }
      setInternalStep('payment_network');
      return;
    }

    if (internalStep === 'payment_network') {
      if (!selectedPaymentNetwork) {
        setError(t('Veuillez sélectionner un réseau de paiement.'));
        return;
      }
      setInternalStep('phone');
      return;
    }

    // Step 3: Phone verification and final submission
    if (!selectedPaymentNetwork) {
      setInternalStep('payment_network');
      return;
    }

    if (!phone) {
      setError(t('Veuillez entrer votre numéro de téléphone.'));
      return;
    }

    // Open a blank tab immediately to bypass popup blockers
    const paymentWindow = window.open('about:blank', '_blank');

    if (transactionType === 'sale') {
      setView('sale_confirm');
      if (paymentWindow) paymentWindow.close();
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type_trans: 'buy',
        total_crypto: quantity,
        crypto_id: String(crypto.id),
        crypto_network_id: String(selectedCryptoNetwork.id),
        phone_number: phone.replace(/\s+/g, ''),
        network_id: selectedPaymentNetwork.id,
        amount: amount,
        wallet_link: walletLink,
      };

      const response = await api.post(BUY_ENDPOINT, payload);
      const data = response.data;

      setApiResult(data as Record<string, string>);

      // Update pre-opened tab if link exists
      if (data && data.transaction_link) {
        if (paymentWindow) {
          paymentWindow.location.href = data.transaction_link;
        }
      } else if (paymentWindow) {
        paymentWindow.close();
      }

      // Redirect main tab to dashboard
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/dashboard';
      }, 2000);

    } catch (err: any) {
      console.error("Transaction Error:", err);
      if (paymentWindow) paymentWindow.close();
      setError(parseError(err));
    } finally {
      setLoading(false);
      setModal(null);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Add a function to handle hash submission for sell
  const handleHashSubmit = async () => {
    setLoading(true);
    setError('');
    setApiResult(null);
    if (!selectedPaymentNetwork) {
      setError(t('Please select a network.'));
      setLoading(false);
      return;
    }

    // Open a blank tab immediately to bypass popup blockers
    const paymentWindow = window.open('about:blank', '_blank');

    try {
      const payload = {
        type_trans: 'sale',
        total_crypto: quantity,
        crypto_id: String(crypto.id),
        crypto_network_id: String(selectedCryptoNetwork.id),
        phone_number: phone.replace(/\s+/g, ''),
        network_id: selectedPaymentNetwork.id,
        amount: amount,
        hash,
      };

      const response = await api.post(SALE_ENDPOINT, payload);
      const data = response.data;

      setApiResult(data as Record<string, string>);

      // Update pre-opened tab if link exists
      if (data && data.transaction_link) {
        if (paymentWindow) {
          paymentWindow.location.href = data.transaction_link;
        }
      } else if (paymentWindow) {
        paymentWindow.close();
      }

      // Redirect main tab to dashboard
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/dashboard';
      }, 2000);

      setTimeout(() => {
        setView('form');
        setApiResult(null);
        setHash('');
        setModal(null);
      }, 2000);
    } catch (err: any) {
      console.error("Hash Submit Error:", err);
      if (paymentWindow) paymentWindow.close();
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
        {t('Please verify your account to buy or sell crypto.')}
      </div>
    );
  }

  if (view === 'sale_confirm') {
    return (
      <div className="w-full min-h-[400px] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('form')} className={`${theme.colors.hover} text-xl`}>
            <FaArrowLeft />
          </button>
          <h1 className={`text-xl font-bold ${theme.colors.text}`}>Confirmation de l&apos;envoi</h1>
        </div>

        <p className={`text-sm mb-8 ${theme.colors.d_text}`}>
          Veuillez envoyer vos cryptos à l&apos;adresse ci-dessous dans votre portefeuille ({selectedCryptoNetwork.name}).
        </p>

        <div className="mb-6">
          <p className={`text-sm font-bold mb-2 ${theme.mode === 'dark' ? 'text-blue-400' : 'text-blue-900'}`}>Adresse de destination :</p>
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${theme.mode === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <span className={`flex-1 font-mono text-sm break-all ${theme.colors.text}`}>
              {crypto.sale_adress || 'Adresse non disponible'}
            </span>
            <button
              onClick={() => handleCopy(crypto.sale_adress || '')}
              className={`p-2 rounded-lg ${theme.mode === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-blue-100 text-blue-800'}`}
            >
              <FaCopy />
            </button>
          </div>
        </div>

        {/* Hash Input with Floating Label */}
        <div className="relative mt-8 mb-auto">
          <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-slate-900 z-10">
            <span className="text-xs text-green-600 font-medium">Entrez le hash/id de la transaction</span>
          </div>
          <div className={`p-4 rounded-xl border-2 border-green-500 ${theme.colors.a_background}`}>
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x..."
              className={`w-full bg-transparent outline-none text-lg ${theme.colors.text} placeholder:text-gray-400`}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          <button
            onClick={handleHashSubmit}
            className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg bg-[#003087] hover:bg-[#002566] transition-all disabled:opacity-50"
            disabled={loading || !hash}
          >
            {loading ? t('Traitement...') : 'Valider'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Navigation for steps */}
      <button 
        onClick={() => {
          if (internalStep === 'details') onBack();
          else if (internalStep === 'payment_network') setInternalStep('details');
          else if (internalStep === 'phone') setInternalStep('payment_network');
        }}
        className={`group flex items-center gap-2 mb-6 ${theme.mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
      >
        <FaArrowLeft />
        <span className="font-medium">Retour</span>
      </button>

      {internalStep === 'details' && (
        <>
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${theme.colors.text}`}>3. Entrez les informations de la crypto</h2>
          </div>
          {/* Wallet Address Inputs (Buy only) */}
          {transactionType === 'buy' && (
            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-xl border ${theme.colors.a_background} ${theme.mode === 'dark' ? 'border-blue-900' : 'border-blue-800'}`}>
                <label className={`block mb-2 text-sm ${theme.colors.text}`}>Adresse du portefeuille ({selectedCryptoNetwork.name})</label>
                <input
                  type="text"
                  value={walletLink}
                  onChange={(e) => setWalletLink(e.target.value)}
                  placeholder="Entrez l'adresse du portefeuille"
                  className={`w-full bg-transparent outline-none text-lg ${theme.colors.text} placeholder:text-gray-400`}
                />
              </div>

              <div className={`p-4 rounded-xl border ${theme.colors.a_background} ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                <input
                  type="text"
                  value={confirmWalletLink}
                  onChange={(e) => setConfirmWalletLink(e.target.value)}
                  placeholder="Confirmer l'adresse du portefeuille"
                  className={`w-full bg-transparent outline-none text-lg ${theme.colors.text} placeholder:text-gray-400`}
                />
              </div>

              {/* Warning */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border border-orange-400 text-orange-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">i</div>
                <p className="text-sm text-orange-800 leading-snug">
                  Vérifiez bien votre adresse. Les transactions crypto sont irréversibles.
                </p>
              </div>
            </div>
          )}

          {/* Quantity & Amount Inputs */}
          <div className="space-y-4 mb-6">
            <div className={`p-4 rounded-xl border ${theme.colors.a_background} ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <label className={`block mb-1 text-sm text-gray-500`}>Quantité de {crypto.name} à {transactionType === 'buy' ? 'acheter' : 'vendre'}</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="0"
                className={`w-full bg-transparent outline-none text-xl font-medium ${theme.colors.text}`}
              />
            </div>

            <div className={`p-4 rounded-xl border ${theme.colors.a_background} ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <label className={`block mb-1 text-sm text-gray-500`}>Montant équivalent (F CFA)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                className={`w-full bg-transparent outline-none text-xl font-medium ${theme.colors.text}`}
              />
            </div>
            <p className="text-xs text-gray-400 pl-1">1000 F - 60000 F</p>
          </div>
        </>
      )}

      {internalStep === 'payment_network' && (
        <div className="space-y-4 mb-6">
          <h3 className={`text-lg font-bold mb-4 ${theme.colors.text}`}>4. Sélectionnez votre réseau de paiement</h3>
          <div className="space-y-3">
            {paymentNetworks.map((net) => (
              <div
                key={net.id}
                onClick={() => {
                  setSelectedPaymentNetwork(net);
                  setInternalStep('phone');
                }}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all 
                  ${selectedPaymentNetwork?.id === net.id 
                    ? (theme.mode === 'dark' ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50') 
                    : (theme.mode === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50')} 
                  ${theme.colors.a_background}`}
              >
                <div className="w-10 h-10 relative flex-shrink-0">
                  {net.image ? (
                    <img src={net.image} alt={net.name} className="w-full h-full object-contain rounded-md" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold text-gray-500">
                      {net.name.substring(0, 2)}
                    </div>
                  )}
                </div>
                <span className={`text-lg font-medium ${theme.colors.text}`}>{net.public_name || net.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {internalStep === 'phone' && selectedPaymentNetwork && (
        <div className="space-y-6">
          <h3 className={`text-lg font-bold mb-4 ${theme.colors.text}`}>5. Entrez votre numéro de téléphone</h3>
          
          {/* Info Box (*133#) */}
          {transactionType === 'buy' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">i</div>
              <p className="text-sm text-blue-800 leading-snug">
                Après avoir lancer, veuillez composer *133# puis 1 pour confirmer le montant qui apparaît sur votre mobile ({selectedPaymentNetwork.public_name}).
              </p>
            </div>
          )}

          {/* Phone Number with Flag */}
          <div className="flex gap-4">
            <div className={`w-1/3 flex items-center justify-center gap-2 h-14 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'} ${theme.colors.a_background}`}>
              <span className="text-2xl">
                {getCountryFlag(selectedPaymentNetwork.indication || '+225')}
              </span>
              <span className={`text-lg font-bold ${theme.colors.text}`}>
                {selectedPaymentNetwork.indication ? selectedPaymentNetwork.indication : "+225"}
              </span>
            </div>
            <div className={`flex-1 h-14 px-4 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'} ${theme.colors.a_background} flex items-center`}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPhone(value);
                }}
                placeholder="Numéro de téléphone"
                className={`w-full bg-transparent outline-none text-lg ${theme.colors.text} placeholder:text-gray-400`}
              />
            </div>
          </div>

          {transactionType === 'buy' && (
            <p className="text-center text-orange-400 text-sm italic">
              Les dépôts commencent a partir de 105 FCFA
            </p>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-6 mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <button
        onClick={handleConfirm}
        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all mt-6
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[0.99]'}
            `}
        style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#002D74' }}
        disabled={loading}
      >
        {loading ? t('Traitement...') : (internalStep === 'phone' ? 'Confirmer' : 'Continuer')}
      </button>


    </div>
  );
}

// Simple Modal Component
function Modal({ children, onClose, theme }: { children: React.ReactNode; onClose: () => void; theme: { mode: string } }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden`}>
        <button onClick={onClose} className="absolute top-2 right-3 text-2xl text-gray-500">&times;</button>
        {children}
      </div>
    </div>
  );
}