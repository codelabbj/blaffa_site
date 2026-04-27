import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { FaPhoneAlt, FaArrowLeft, FaInfoCircle, FaTrash, FaCheckCircle, FaPlus, FaCopy } from 'react-icons/fa';
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
  address?: string;
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

interface UserPhone {
  id: string;
  phone: string;
  network: number;
  network_name?: string;
}

interface Cryptocurrency {
  id: string | number;
  name: string;
  symbol: string;
  public_amount: number;
  logo?: string;
  sale_adress?: string;
  buy_price?: number | string;
  sale_price?: number | string;
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
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [walletLink, setWalletLink] = useState('');
  const [confirmWalletLink, setConfirmWalletLink] = useState('');
  const transactionType = typeTrans;
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');
  const [hash, setHash] = useState('');
  const [view, setView] = useState<'form' | 'sale_confirm'>('form');
  const [selectedPaymentNetwork, setSelectedPaymentNetwork] = useState<Network | null>(null);

  // Steps: details (wallet for buy only) -> payment_network -> phone -> amounts
  const [internalStep, setInternalStep] = useState<'details' | 'payment_network' | 'phone' | 'amounts'>(
    typeTrans === 'sale' ? 'payment_network' : 'details'
  );

  // Phone management
  const [userPhones, setUserPhones] = useState<UserPhone[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<UserPhone | null>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [showAddPhone, setShowAddPhone] = useState(false);

  // Helper to parse API errors
  const parseError = (err: any) => {
    const data = err.response?.data;
    if (!data) return t('Une erreur est survenue. Veuillez réessayer.');
    const code = data.code;
    if (code) {
      switch (code) {
        case 'token_not_valid': return t('Votre session est expirée ou invalide. Veuillez vous reconnecter.');
        case 'user_not_found': return t('Utilisateur non trouvé.');
      }
    }
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.message === 'string') return data.message;
    if (typeof data === 'object') {
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError) && firstError.length > 0) return firstError[0] as string;
      if (typeof firstError === 'string') return firstError;
    }
    return t('Une erreur est survenue. Veuillez réessayer.');
  };

  // Helper to get country flag based on indication
  const getCountryFlag = (indication?: string) => {
    if (!indication) return '🇧🇫';
    const c = indication.replace('+', '');
    switch (c) {
      case '226': return '🇧🇫'; case '225': return '🇨🇮'; case '223': return '🇲🇱';
      case '221': return '🇸🇳'; case '228': return '🇹🇬'; case '229': return '🇧🇯';
      case '237': return '🇨🇲'; case '224': return '🇬🇳'; case '241': return '🇬🇦';
      case '242': return '🇨🇬'; case '243': return '🇨🇩'; case '227': return '🇳🇪';
      case '233': return '🇬🇭'; case '234': return '🇳🇬'; default: return '🌍';
    }
  };

  // Helper to get effective price
  const getPrice = () => {
    const p = transactionType === 'buy' ? crypto.buy_price : crypto.sale_price;
    return Number(p || crypto.public_amount || 0);
  };

  // Calculate equivalent when quantity changes (Crypto -> Fiat)
  const handleQuantityChange = (q: string) => {
    setQuantity(q);
    const price = getPrice();
    if (!q || isNaN(Number(q)) || price <= 0) { setAmount(''); return; }
    setAmount((Number(q) * price).toFixed(0));
  };

  const handleAmountChange = (a: string) => {
    setAmount(a);
    const price = getPrice();
    if (!a || isNaN(Number(a)) || price <= 0) { setQuantity(''); return; }
    setQuantity((Number(a) / price).toFixed(6));
  };

  // Listen for transaction_link from websocket — only open tab if link exists
  useEffect(() => {
    type WebSocketMessage = { type: string; data?: string };
    const handler = (data: WebSocketMessage) => {
      if (data.type === 'transaction_link' && data.data) {
        window.open(data.data, '_blank');
      }
    };
    const removeHandler = addMessageHandler(handler);
    return () => removeHandler();
  }, [addMessageHandler]);

  // Fetch phones for selected payment network
  const fetchUserPhones = async (networkId: string) => {
    setPhoneLoading(true);
    try {
      const res = await api.get('/blaffa/user-phone/', { params: { network: networkId } });
      setUserPhones(Array.isArray(res.data) ? res.data : []);
    } catch { setUserPhones([]); }
    finally { setPhoneLoading(false); }
  };

  const handleAddPhone = async () => {
    if (!selectedPaymentNetwork || !newPhoneNumber.trim()) return;
    setError('');
    try {
      const indication = selectedPaymentNetwork.indication || '';
      const formattedPhone = newPhoneNumber.startsWith('+') ? newPhoneNumber : `${indication}${newPhoneNumber}`;
      const res = await api.post('/blaffa/user-phone/', { phone: formattedPhone, network: selectedPaymentNetwork.id });
      if (res.status === 201) {
        setUserPhones(prev => [...prev, res.data]);
        setNewPhoneNumber('');
        setShowAddPhone(false);
      }
    } catch (err: any) { setError(parseError(err)); }
  };

  const handleDeletePhone = async (phoneId: string) => {
    try {
      await api.delete(`/blaffa/user-phone/${phoneId}/`);
      setUserPhones(prev => prev.filter(p => p.id !== phoneId));
      if (selectedPhone?.id === phoneId) setSelectedPhone(null);
    } catch { /* ignore */ }
  };

  const formatPhone = (phone: string) => {
    if (!selectedPaymentNetwork?.indication) return phone;
    if (phone.startsWith('+') || phone.startsWith(selectedPaymentNetwork.indication)) return phone;
    return `${selectedPaymentNetwork.indication}${phone}`;
  };

  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); };

  // Handle continuing through steps
  const handleContinue = async () => {
    setError('');

    if (internalStep === 'details') {
      if (transactionType === 'buy') {
        if (!walletLink || !confirmWalletLink || walletLink !== confirmWalletLink) {
          setError(t('Les adresses de portefeuille ne correspondent pas.'));
          return;
        }
      }
      setInternalStep('payment_network');
      return;
    }

    if (internalStep === 'payment_network') {
      if (!selectedPaymentNetwork) {
        setError(t('Veuillez sélectionner un réseau de paiement.'));
        return;
      }
      await fetchUserPhones(selectedPaymentNetwork.id);
      setInternalStep('phone');
      return;
    }

    if (internalStep === 'phone') {
      if (!selectedPhone) {
        setError(t('Veuillez sélectionner un numéro de téléphone.'));
        return;
      }
      setInternalStep('amounts');
      return;
    }

    if (internalStep === 'amounts') {
      if (!quantity || !amount || Number(amount) <= 0) {
        setError(t('Veuillez entrer une quantité et un montant valides.'));
        return;
      }
      if (transactionType === 'sale') {
        setView('sale_confirm');
        return;
      }
      await submitBuy();
    }
  };

  const submitBuy = async () => {
    if (!selectedPaymentNetwork || !selectedPhone) return;
    setLoading(true);
    try {
      const payload = {
        type_trans: 'buy',
        total_crypto: quantity,
        crypto_id: String(crypto.id),
        crypto_network_id: String(selectedCryptoNetwork.id),
        phone_number: selectedPhone.phone.replace(/\s+/g, ''),
        network_id: selectedPaymentNetwork.id,
        amount: amount,
        wallet_link: walletLink,
      };
      const response = await api.post(BUY_ENDPOINT, payload);
      const data = response.data;
      setApiResult(data as Record<string, string>);
      // Only open tab if transaction_link exists
      if (data?.transaction_link) {
        window.open(data.transaction_link, '_blank');
      }
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleHashSubmit = async () => {
    if (!selectedPaymentNetwork || !selectedPhone) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        type_trans: 'sale',
        total_crypto: quantity,
        crypto_id: String(crypto.id),
        crypto_network_id: String(selectedCryptoNetwork.id),
        phone_number: selectedPhone.phone.replace(/\s+/g, ''),
        network_id: selectedPaymentNetwork.id,
        amount: amount,
        hash,
      };
      const response = await api.post(SALE_ENDPOINT, payload);
      const data = response.data;
      setApiResult(data as Record<string, string>);
      // Only open tab if transaction_link exists
      if (data?.transaction_link) {
        window.open(data.transaction_link, '_blank');
      }
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
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

  // ─────────────────────────────────────────────────────
  // SALE CONFIRMATION VIEW
  // ─────────────────────────────────────────────────────
  if (view === 'sale_confirm') {
    return (
      <div className="w-full min-h-[400px] flex flex-col">
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
              {selectedCryptoNetwork.address || 'Adresse non disponible'}
            </span>
            <button
              onClick={() => handleCopy(selectedCryptoNetwork.address || '')}
              className={`p-2 rounded-lg ${theme.mode === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-blue-100 text-blue-800'}`}
            >
              <FaCopy />
            </button>
          </div>
        </div>

        {/* Instruction Message */}
        <div className={`p-4 rounded-xl flex items-start gap-3 mb-6 ${theme.mode === 'dark' ? 'bg-blue-900/10 border border-blue-900/30' : 'bg-blue-50 border border-blue-100'}`}>
          <FaInfoCircle className="text-blue-500 mt-0.5 shrink-0" />
          <p className={`text-xs font-medium leading-relaxed ${theme.mode === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
            Nous devons recevoir exactement <span className="font-bold underline">{quantity} {crypto.symbol || 'USDT'}</span> pour que vous puissiez recevoir <span className="font-bold underline">{amount} XOF</span>
          </p>
        </div>

        {/* Hash Input */}
        <div className={`p-3 rounded-xl flex items-start gap-2.5 mb-4 ${theme.mode === 'dark' ? 'bg-amber-900/10 border border-amber-900/30' : 'bg-amber-50 border border-amber-200'}`}>
          <FaInfoCircle className="text-amber-500 shrink-0 mt-0.5" />
          <p className={`text-xs font-medium leading-relaxed ${theme.mode === 'dark' ? 'text-amber-300' : 'text-amber-800'}`}>
            Veuillez copier le hash de la transaction et coller dans l&apos;espace ci-dessous.
          </p>
        </div>
        <div className="relative mt-2 mb-auto">
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

  // ─────────────────────────────────────────────────────
  // MAIN FORM STEPS
  // ─────────────────────────────────────────────────────
  const stepBack = () => {
    if (internalStep === 'details') onBack();
    else if (internalStep === 'payment_network') {
      if (transactionType === 'sale') onBack();
      else setInternalStep('details');
    }
    else if (internalStep === 'phone') setInternalStep('payment_network');
    else if (internalStep === 'amounts') setInternalStep('phone');
  };

  return (
    <div className="w-full">
      <button
        onClick={stepBack}
        className={`group flex items-center gap-2 mb-6 ${theme.mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
      >
        <FaArrowLeft />
        <span className="font-medium">Retour</span>
      </button>

      {/* ── STEP: Wallet details (buy only) ── */}
      {internalStep === 'details' && (
        <>
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${theme.colors.text}`}>3. Informations du portefeuille</h2>
          </div>
          {transactionType === 'buy' ? (
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
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border border-orange-400 text-orange-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">i</div>
                <p className="text-sm text-orange-800 leading-snug">Vérifiez bien votre adresse. Les transactions crypto sont irréversibles.</p>
              </div>
            </div>
          ) : (
            <p className={`text-sm mb-6 ${theme.colors.d_text}`}>
              Vous allez vendre <strong>{crypto.name} ({crypto.symbol})</strong> sur le réseau <strong>{selectedCryptoNetwork.name}</strong>.
              Continuez pour indiquer le réseau de paiement.
            </p>
          )}
        </>
      )}

      {/* ── STEP: Payment network selection ── */}
      {internalStep === 'payment_network' && (
        <div className="space-y-4 mb-6">
          <h3 className={`text-lg font-bold mb-4 ${theme.colors.text}`}>4. Sélectionnez votre réseau de paiement</h3>
          <div className="space-y-3">
            {paymentNetworks.map((net) => (
              <div
                key={net.id}
                onClick={() => {
                  setSelectedPaymentNetwork(net);
                  fetchUserPhones(net.id);
                  setInternalStep('phone');
                }}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all 
                  ${selectedPaymentNetwork?.id === net.id
                    ? (theme.mode === 'dark' ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
                    : (theme.mode === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50')} 
                  ${theme.colors.a_background}`}
              >
                <div className="w-12 h-12 flex-shrink-0">
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

      {/* ── STEP: Phone selection (deposit-style) ── */}
      {internalStep === 'phone' && selectedPaymentNetwork && (
        <div className="space-y-6">
          <h3 className={`text-lg font-bold ${theme.colors.text}`}>
            5. Choisissez ou enregistrez votre numéro {selectedPaymentNetwork.public_name || selectedPaymentNetwork.name}
          </h3>

          {phoneLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {userPhones.map((phone) => (
                  <div
                    key={phone.id}
                    onClick={() => setSelectedPhone(phone)}
                    className={`flex items-center justify-between ${theme.colors.a_background} border rounded-2xl px-4 py-4 cursor-pointer transition-all
                      ${selectedPhone?.id === phone.id
                        ? (theme.mode === 'dark' ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
                        : (theme.mode === 'dark' ? 'border-slate-700 hover:border-blue-400' : 'border-slate-200 hover:border-blue-300')
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaPhoneAlt className="text-white" />
                      </div>
                      <span className={`text-lg font-medium ${theme.colors.text}`}>
                        {formatPhone(phone.phone)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPhone?.id === phone.id && (
                        <FaCheckCircle className="text-blue-500 text-xl" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePhone(phone.id); }}
                        className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add phone */}
              {showAddPhone ? (
                <div className={`p-4 rounded-2xl border ${theme.mode === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-sm font-medium mb-3 ${theme.colors.text}`}>
                    Ajouter un numéro {selectedPaymentNetwork.public_name}
                  </p>
                  <div className="flex gap-3">
                    <div className={`flex items-center gap-2 px-3 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-600' : 'border-gray-300'} ${theme.colors.a_background}`}>
                      <span className="text-xl">{getCountryFlag(selectedPaymentNetwork.indication)}</span>
                      <span className={`font-bold ${theme.colors.text}`}>{selectedPaymentNetwork.indication || '+225'}</span>
                    </div>
                    <input
                      type="tel"
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Numéro de téléphone"
                      className={`flex-1 px-4 py-3 rounded-xl border outline-none ${theme.mode === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                    />
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => { setShowAddPhone(false); setNewPhoneNumber(''); }}
                      className={`flex-1 py-3 rounded-xl border font-bold ${theme.mode === 'dark' ? 'border-slate-600 text-slate-300' : 'border-gray-300 text-gray-600'}`}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddPhone}
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddPhone(true)}
                  className={`w-full py-4 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`}
                >
                  <FaPlus />
                  Ajouter un numéro
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ── STEP: Amounts (new final step) ── */}
      {internalStep === 'amounts' && (
        <>
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${theme.colors.text}`}>6. Entrez les montants</h2>
            {selectedPhone && (
              <p className={`text-sm mt-1 ${theme.colors.d_text}`}>
                Paiement via {selectedPaymentNetwork?.public_name} — {formatPhone(selectedPhone.phone)}
              </p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div className={`p-4 rounded-xl border ${theme.colors.a_background} ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <label className="block mb-1 text-sm text-gray-500">Quantité de {crypto.name} à {transactionType === 'buy' ? 'acheter' : 'vendre'}</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="0"
                className={`w-full bg-transparent outline-none text-xl font-medium ${theme.colors.text}`}
              />
            </div>

            <div className={`p-4 rounded-xl border ${theme.colors.a_background} ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <label className="block mb-1 text-sm text-gray-500">Montant équivalent (F CFA)</label>
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

      {/* Error message */}
      {error && (
        <div className="mt-4 mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Action button — hidden on payment_network step (auto-selects) */}
      {internalStep !== 'payment_network' && (
        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all mt-6
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[0.99]'}`}
          style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#002D74' }}
          disabled={loading}
        >
          {loading ? t('Traitement...') : (internalStep === 'amounts' ? 'Confirmer' : 'Continuer')}
        </button>
      )}
    </div>
  );
}