import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { FaPhoneAlt, FaMoneyBillWave, FaWallet, FaCheckCircle } from 'react-icons/fa';
import api from '@/lib/axios';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '@/context/WebSocketContext';

const API_URL = 'https://api.blaffa.net/blaffa/transaction'; // Replace with your real base URL

interface Crypto {
  id: string | number;
  name: string;
  symbol: string;
  public_amount: number;
  logo?: string;
}

interface Network {
  id: string;
  name: string;
  public_name: string;
  country_code: string;
  image?: string;
  otp_required?: boolean;
  message_init?: string;
}

export default function CryptoTransactionForm({ isVerified, crypto }: { isVerified: boolean; crypto: Crypto }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { addMessageHandler } = useWebSocket();
  const [amount, setAmount] = useState(''); // For buy: local currency, for sell: crypto amount
  const [calculatedValue, setCalculatedValue] = useState(''); // For buy: crypto, for sell: local currency
  const [phone, setPhone] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [walletLink, setWalletLink] = useState('');
  const [confirmWalletLink, setConfirmWalletLink] = useState('');
  const [transactionType, setTransactionType] = useState<'buy' | 'sell' | null>(null);
  const [modal, setModal] = useState<'type' | 'wallet' | 'confirm' | null>('type');
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');
  const [networks, setNetworks] = useState<Network[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [transactionLink, setTransactionLink] = useState<string | null>(null);

  // Fetch networks on mount
  useEffect(() => {
    const fetchNetworks = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) return;
      try {
        const response = await api.get('/blaffa/network/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(response.data)) {
          setNetworks(response.data);
        }
      } catch {
        // Optionally handle error
      }
    };
    
    fetchNetworks();
  }, []);

  // Calculate value when amount, crypto, or transactionType changes
  useEffect(() => {
    if (!amount || isNaN(Number(amount)) || !transactionType) {
      setCalculatedValue('');
      return;
    }
    if (transactionType === 'buy') {
      setCalculatedValue((Number(amount) / Number(crypto.public_amount)).toFixed(2));
    } else if (transactionType === 'sell') {
      setCalculatedValue((Number(amount) * Number(crypto.public_amount)).toFixed(2));
    }
  }, [amount, crypto, transactionType]);

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

  // Handle transaction type selection
  const handleTypeSelect = (type: 'buy' | 'sell') => {
    setTransactionType(type);
    setModal(null); // Close modal, show form
    setAmount('');
    setCalculatedValue('');
    setError('');
  };

  // Handle confirmation for buy (after wallet link)
  const handleWalletConfirm = () => {
    if (!walletLink || walletLink !== confirmWalletLink) {
      setError('Wallet links do not match.');
      return;
    }
    setError('');
    setModal('confirm');
  };

  // Handle API call
  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    setApiResult(null);
    try {
      if (!selectedNetwork) {
        setError('Please select a network.');
        setLoading(false);
        return;
      }
      const payload: Record<string, string> = {
        type_trans: transactionType === 'buy' ? 'buy' : 'sale',
        total_crypto: transactionType === 'buy' ? calculatedValue : amount, // For buy: calculated crypto, for sell: entered crypto
        crypto_id: String(crypto.id),
        phone_number: phone.replace(/\s+/g, ''),
        network_id: selectedNetwork.id,
        amount: transactionType === 'buy' ? amount : calculatedValue, // For buy: entered amount (local), for sell: calculated local
      };
      if (transactionType === 'buy') {
        payload.wallet_link = walletLink;
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setApiResult(data as Record<string, string>);
      if (data && data.transaction_link) {
        window.open(data.transaction_link, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setError('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
      setModal(null);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isVerified) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
        {t('Please verify your account to buy or sell crypto.')}
      </div>
    );
  }

  // Show transaction type modal first
  if (modal === 'type') {
    return (
      <Modal onClose={() => setModal(null)} theme={theme}>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4 text-center">{t('Are you buying or selling?')}</h3>
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-bold text-lg shadow-md hover:from-green-600 hover:to-green-800 transition flex items-center justify-center gap-2" onClick={() => handleTypeSelect('buy')}>
              <FaWallet /> {t('Buy')}
            </button>
            <button className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white py-2 rounded-lg font-bold text-lg shadow-md hover:from-red-600 hover:to-red-800 transition flex items-center justify-center gap-2" onClick={() => handleTypeSelect('sell')}>
              <FaWallet /> {t('Sell')}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <div
      className="max-w-lg mx-auto rounded-2xl shadow-2xl p-6 mt-8 backdrop-blur-md border"
      style={{
        background: theme.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(30,41,59,0.85) 60%, rgba(51,65,85,0.85) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(226,232,240,0.85) 100%)',
        borderColor: theme.mode === 'dark' ? '#334155' : '#e5e7eb',
      }}
    >
      <h2 className="text-2xl font-extrabold mb-6 text-center" style={{ color: theme.colors.primary }}>
        {transactionType === 'buy'
          ? `${t('Buy')} ${crypto.name}`
          : transactionType === 'sell'
            ? `${t('Sell')} ${crypto.name}`
            : `${t('Buy or Sell')} ${crypto.name}`}
      </h2>
      {/* Network selection */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">{t('Select Network')}</label>
        <select
          className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 text-lg transition-colors
            ${theme.mode === 'dark' ? 'bg-slate-900 border-slate-600 text-slate-100' : 'bg-white border-slate-300 text-slate-900'}`}
          value={selectedNetwork?.id || ''}
          onChange={e => {
            const net = networks.find(n => String(n.id) === e.target.value);
            setSelectedNetwork(net || null);
          }}
        >
          <option value="">{t('Select a network')}</option>
          {networks.map(net => (
            <option key={net.id} value={String(net.id)}>{net.public_name || net.name}</option>
          ))}
        </select>
        {selectedNetwork && selectedNetwork.image && (
          <div className="mt-2 flex items-center gap-2">
            <img src={selectedNetwork.image} alt={selectedNetwork.name} className="w-8 h-8 rounded" />
            <span className="text-sm">{selectedNetwork.public_name || selectedNetwork.name}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 mb-6 justify-center">
        {crypto.logo && <img src={crypto.logo} alt={crypto.name} className="w-14 h-14 rounded-full border-2 border-blue-400 shadow-md" />}
        <div>
          <div className="font-bold text-lg flex items-center gap-2">
            {crypto.name}
            <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold border border-blue-300 ml-1">
              {crypto.symbol}
            </span>
          </div>
          <div className="text-blue-500 text-sm font-mono">{t('Public Amount')}: {crypto.public_amount} XOF</div>
        </div>
      </div>
      {/* Amount input (dynamic) */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium">
          {transactionType === 'buy' ? t('Amount (Local Currency)') : t('Amount (Crypto)')}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            <FaMoneyBillWave />
          </span>
          <input
            type="number"
            className={`w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-400 text-lg transition-colors
              ${theme.mode === 'dark' ? 'bg-slate-900 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0"
            placeholder={transactionType === 'buy' ? t('Enter amount') : t('Enter crypto amount')}
          />
        </div>
      </div>
      {/* Calculated value display (dynamic) */}
      {calculatedValue && (
        <div className={`mb-4 ${transactionType === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} text-center text-lg font-semibold`}>
          {transactionType === 'buy'
            ? <>{t('You will get')}: <span className="font-bold">{calculatedValue} {crypto.symbol}</span></>
            : <>{t('You will receive')}: <span className="font-bold">{calculatedValue} XOF</span></>}
        </div>
      )}
      {/* Phone number input */}
      <div className="mb-4 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
          <FaPhoneAlt />
        </span>
        <input
          type="tel"
          className={`w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-400 transition-colors
            ${theme.mode === 'dark' ? 'bg-slate-900 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
          placeholder={t('Phone number')}
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>
      {/* Confirm phone number input */}
      <div className="mb-4 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
          <FaPhoneAlt />
        </span>
        <input
          type="tel"
          className={`w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-400 transition-colors
            ${theme.mode === 'dark' ? 'bg-slate-900 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
          placeholder={t('Confirm phone number')}
          value={confirmPhone}
          onChange={e => setConfirmPhone(e.target.value)}
        />
      </div>
      {/* Error message */}
      {error && <div className="mb-4 text-red-500 text-center font-medium">{t(error)}</div>}
      {/* Action button */}
      <button
        className="w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg active:scale-95"
        onClick={() => {
          const sanitizedPhone = phone.replace(/\s+/g, '');
          const sanitizedConfirmPhone = confirmPhone.replace(/\s+/g, '');
          if (!amount || !sanitizedPhone || sanitizedPhone !== sanitizedConfirmPhone) {
            setError('Please fill all fields and confirm your phone number.');
            return;
          }
          if (!selectedNetwork) {
            setError('Please select a network.');
            return;
          }
          setError('');
          if (transactionType === 'buy') {
            setModal('wallet');
          } else {
            setModal('confirm');
          }
        }}
        disabled={loading}
      >
        <FaCheckCircle /> {t('Continue')}
      </button>

      {/* Wallet link modal for buy */}
      {modal === 'wallet' && (
        <Modal onClose={() => setModal(null)} theme={theme}>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2 text-center">{t('Enter your wallet link')}</h3>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                <FaWallet />
              </span>
              <input
                type="text"
                className={`w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-400 transition-colors
                  ${theme.mode === 'dark' ? 'bg-slate-900 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                placeholder={t('Wallet link')}
                value={walletLink}
                onChange={e => setWalletLink(e.target.value)}
              />
            </div>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                <FaWallet />
              </span>
              <input
                type="text"
                className={`w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-400 transition-colors
                  ${theme.mode === 'dark' ? 'bg-slate-900 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                placeholder={t('Confirm wallet link')}
                value={confirmWalletLink}
                onChange={e => setConfirmWalletLink(e.target.value)}
              />
            </div>
            {error && <div className="mb-2 text-red-500 text-center">{t(error)}</div>}
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg font-bold text-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition mt-2 flex items-center justify-center gap-2" onClick={handleWalletConfirm}>
              <FaCheckCircle /> {t('Continue')}
            </button>
          </div>
        </Modal>
      )}

      {/* Confirmation modal */}
      {modal === 'confirm' && (
        <Modal onClose={() => setModal(null)} theme={theme}>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2 text-center">{t('Confirm your transaction')}</h3>
            <div className="mb-2">Type: <span className="font-semibold">{transactionType?.toUpperCase()}</span></div>
            <div className="mb-2">Crypto: <span className="font-semibold">{crypto.name}</span></div>
            <div className="mb-2">Amount: <span className="font-semibold">{
              transactionType === 'sell'
                ? `${calculatedValue} XOF`
                : `${calculatedValue} ${crypto.symbol}`
            }</span></div>
            <div className="mb-2">Phone: <span className="font-semibold">{phone}</span></div>
            <div className="mb-2">Network: <span className="font-semibold">{selectedNetwork?.public_name || selectedNetwork?.name}</span></div>
            {transactionType === 'buy' && (
              <div className="mb-2">Wallet Link: <span className="font-semibold break-all">{walletLink}</span></div>
            )}
            <button className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-bold text-lg shadow-md hover:from-green-600 hover:to-green-800 transition mt-4 flex items-center justify-center gap-2" onClick={handleConfirm} disabled={loading}>
              {loading ? t('Processing...') : <FaCheckCircle />} {t('Confirm')}
            </button>
          </div>
        </Modal>
      )}

      {/* API result display */}
      {apiResult && (
        <div className="mt-6 p-4 rounded-lg text-center shadow-lg"
          style={{
            background: theme.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(30,41,59,0.95) 60%, rgba(51,65,85,0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.95) 60%, rgba(226,232,240,0.95) 100%)',
          }}
        >
          {transactionType === 'sell' && apiResult?.wallet_address && (
            <>
              <div className="mb-2 font-bold">{t('Sell Wallet Address')}:</div>
              <div className="mb-2 break-all text-blue-600 dark:text-blue-300 font-mono text-lg">{apiResult.wallet_address}</div>
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-lg font-semibold mt-2" onClick={() => handleCopy(apiResult.wallet_address)}>{t('Copy')}</button>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('Send your crypto to this address to complete the sale.')}</div>
            </>
          )}
          {transactionType === 'buy' && (
            <div className="text-green-600 dark:text-green-400 font-bold flex flex-col items-center gap-2">
              <FaCheckCircle className="text-2xl" />
              {t('Your buy request has been submitted!')}
            </div>
          )}
        </div>
      )}

      {/* Transaction Link Modal */}
      {transactionLink && (
        <Modal onClose={() => setTransactionLink(null)} theme={theme}>
          <div className="p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-center">{t('Continue Payment')}</h3>
            <button
              onClick={() => window.open(transactionLink, '_blank', 'noopener,noreferrer')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-bold text-lg shadow-md"
            >
              {t('Click to continue payment')}
            </button>
            {/* <button
              onClick={() => setTransactionLink(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('Close')}
            </button> */}
          </div>
        </Modal>
      )}
    </div>
  );
}

// Modal with blur and shadow
function Modal({ children, onClose, theme }: { children: React.ReactNode; onClose: () => void; theme: { mode: string } }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backdropFilter: 'blur(6px)'}}>
      <div
        className="rounded-xl shadow-2xl max-w-md w-full relative border"
        style={{
          background: theme.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(30,41,59,0.97) 60%, rgba(51,65,85,0.97) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.97) 60%, rgba(226,232,240,0.97) 100%)',
          borderColor: theme.mode === 'dark' ? '#334155' : '#e5e7eb',
        }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
} 