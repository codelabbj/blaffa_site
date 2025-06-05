
'use client';
import { useState, useEffect } from 'react';
//import Head from 'next/head';
//import axios from 'axios';
import { useTranslation } from 'react-i18next';
//import styles from '../styles/Deposits.module.css';
//import { ClipboardIcon } from 'lucide-react'; // Make sure to install this package
//import { Transaction } from 'mongodb';
//import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';
import { useWebSocket } from '../../context/WebSocketContext';
import {  Check, CheckCircle, ChevronRight, CreditCard, Smartphone, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import DashboardHeader from '@/components/DashboardHeader';
import { CopyIcon } from 'lucide-react';


//import { Transaction } from 'mongodb';

interface Network {
  id: string;
  name: string;
  public_name: string;
  country_code: string;
  image?: string;
  otp_required?: boolean;
  message_init?: string;
}

interface App {
  id: string;
  name: string;
  image: string;
  is_active: boolean;
  hash: string;
  cashdeskid: string;
  cashierpass: string;
  order: string | null;
  city: string;
  street: string;
  deposit_tuto_content: string;
  deposit_link: string;
  withdrawal_tuto_content: string;
  withdrawal_link: string;
  public_name: string;
}


// Updated IdLink interface to match the structure from profile/page.tsx
interface IdLink {
  id: string;
  user: string;
  link: string; // This is the saved bet ID
  app_name: App; // This should be the full App object
}

interface WebSocketMessage {
  type: string;
  data?: string;
}

interface Transaction {
  id: string;
  amount: number;
  type_trans: string;
  status: string;
  reference: string;
  created_at: string;
  network?: Network;
  app?: App;
  phone_number?: string;
  user_app_id?: string;
  error_message?: string;
}

interface TransactionDetail {
  transaction: Transaction;
}

// interface ApiError extends Error {
//   response?: {
//     status: number;
//     data: {
//       [key: string]: string | string[] | undefined;
//       detail?: string;
//     };
//   };
// }

// interface ErrorResponse {

//   data?: {
//     [key: string]: string[] | string | undefined;
//     detail?: string;
//     message?: string;
//   };
//   status?: number;
// }
function isAxiosError(error: unknown): error is { response?: { status: number; data: any } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}


interface ApiErrorResponse {
  status: number;
  data: {
    [key: string]: any;
    detail?: string;
    message?: string;
  };
}

interface ApiError extends Error {
  response?: ApiErrorResponse;
}

export default function Deposits() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'selectId' | 'selectNetwork' | 'enterDetails'>('selectId');
  const [selectedPlatform, setSelectedPlatform] = useState<App | null>(null);
  const [platforms, setPlatforms] = useState<App[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<{ id: string; name: string; public_name?: string; country_code?: string; image?: string, otp_required?: boolean, message_init?: string } | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    phoneNumber: '',
    betid: '',
    otp_code: '' // Add OTP field to form state
  });
  
  const [networks, setNetworks] = useState<{ id: string; name: string; public_name?: string; image?: string, otp_required?: boolean, message_init?: string }[]>([]);
  const [savedAppIds, setSavedAppIds] = useState<IdLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const { theme } = useTheme();
  const { addMessageHandler } = useWebSocket();


  useEffect(() => {
    const handleTransactionLink = (data: WebSocketMessage) => {
      if (data.type === 'transaction_link' && data.data) {
        console.log('Opening transaction link:', data.data);
        // Try to open in a new tab
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.location.href = data.data;
      } else {
        // Fallback to direct open if popup is blocked
        window.open(data.data, '_blank', 'noopener,noreferrer');
      }
    }
  };


    const removeHandler = addMessageHandler(handleTransactionLink);
    return () => removeHandler();
  }, [addMessageHandler]);

  // Fetch networks and saved app IDs on component mount
  const fetchPlatforms = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await api.get('/blaffa/app_name', {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      
      if (response.status === 200) {
        const data = response.data;
        setPlatforms(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch platforms:', response.status);
        setPlatforms([]);
      }
    } catch (error) {
      console.error('Error fetching platforms:', error);
      setPlatforms([]);
    }
  };

  // Fetch networks and saved app IDs on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError(t('You must be logged in to access this feature.'));
        setLoading(false);
        window.location.href = '/auth';
        return;
      }

      try {
        setLoading(true);
        // Fetch all data in parallel
        const [networksResponse, savedIdsResponse] = await Promise.all([
          api.get('/blaffa/network/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/blaffa/id_link', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetchPlatforms() // Fetch platforms in parallel
        ]);

        if (networksResponse.status === 200) {
          const networksData = networksResponse.data;
          setNetworks(networksData);
        }

        if (savedIdsResponse.status === 200) {
          const data = savedIdsResponse.data;
          let processedData: IdLink[] = [];
          
          if (Array.isArray(data)) {
            processedData = data;
          } else if (data?.results) {
            processedData = data.results;
          } else if (data?.data) {
            processedData = data.data;
          }
          
          setSavedAppIds(processedData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('Failed to load data. Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 const handlePlatformSelect = (platform: App) => {
    setSelectedPlatform(platform);
    setCurrentStep('selectNetwork');
  };

  const handleNetworkSelect = (network: { id: string; name: string; public_name?: string; country_code?: string; image?: string, otp_required?: boolean, message_init?: string }) => {
    setSelectedNetwork(network);
    setCurrentStep('enterDetails');
  };

  // Save new bet ID
   const saveBetId = async (betId: string) => {
    if (!selectedPlatform || !betId) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await api.post('/blaffa/id_link', {
        
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          app_name: selectedPlatform.id,
          link: betId
        })
      });

      if (response.status === 201) {
        const newIdLink = response.data;
        setSavedAppIds(prev => [...prev, newIdLink]);
      }
    } catch (error) {
      console.error('Error saving bet ID:', error);
    }
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform || !selectedNetwork) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Not authenticated');

      // Get the country code from the selected network
      const countryCode = selectedNetwork.country_code?.toLowerCase(); // Default to 'ci' if not specified
    
      const transactionData: any = {
        type_trans: 'deposit',
        amount: formData.amount,
        app_id: selectedPlatform.id,
        network_id: selectedNetwork.id,
        phone_number: formData.phoneNumber,
        user_app_id: formData.betid,
        };

      // const response = await api.post(`/blaffa/transaction?country_code=${countryCode}`, {
      //   type_trans: 'deposit',
      //   amount: formData.amount,
      //   phone_number: formData.phoneNumber,
      //   network_id: selectedNetwork.id,
      //   app_id: selectedPlatform.id,
      //   user_app_id: formData.betid
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Add OTP to payload if required
      if (selectedNetwork.otp_required && formData.otp_code) {
        transactionData.otp_code = formData.otp_code;
      }

      const response = await api.post(`/blaffa/transaction?country_code=${countryCode}`, transactionData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const transaction = response.data;
      setSelectedTransaction({ transaction });
      setIsModalOpen(true);
      
      setSuccess('Transaction initiated successfully!');
      // Reset form
      setCurrentStep('selectId');
      setSelectedPlatform(null);
      setSelectedNetwork(null);
      setFormData({ amount: '', phoneNumber: '', betid: '', otp_code: '' });
    } catch (error) {
      console.error('Transaction error:', error);
  //     if (
  //       typeof err === 'object' &&
  //       err !== null &&
  //       'response' in err &&
  //       typeof (err as { response?: unknown }).response === 'object'
  //     ) {
  //       const response = (err as { response?: { data?: { detail?: string } } }).response;
  //       setError(response?.data?.detail || 'Failed to process transaction');
  //     } else {
  //       setError('Failed to process transaction');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (typeof error === 'string') {
    setError(error);
  } else if (error && typeof error === 'object' && 'response' in error) {
    const { status, data } = (error as ApiError).response || {};
    // Handle the error response
    if (status === 400 && data) {
      const errorMessages = [];
      if (data.amount) {
        errorMessages.push(`Amount: ${Array.isArray(data.amount) ? data.amount[0] : data.amount}`);
      }
      // Add more field checks as needed
      setError(errorMessages.length > 0 ? errorMessages.join('\n') : data.detail || 'Validation error');
    } else {
      setError(data?.detail || 'An error occurred');
    }
  } else {
    setError('An unexpected error occurred');
  }

  if (isAxiosError(error) && error.response) {
    const { status, data } = error.response;
      
    // Handle field-specific validation errors
    if (status === 400 && data) {
      const errorMessages = [];
      
      // Check for field errors
      if (data.amount) {
        errorMessages.push(`Amount: ${Array.isArray(data.amount) ? data.amount[0] : data.amount}`);
      }
      
      if (data.phone_number) {
        errorMessages.push(`Phone: ${Array.isArray(data.phone_number) ? data.phone_number[0] : data.phone_number}`);
      }
      
      if (data.network_id) {
        errorMessages.push(`Network: ${Array.isArray(data.network_id) ? data.network_id[0] : data.network_id}`);
      }
      
      if (data.user_app_id) {
        errorMessages.push(`Bet ID: ${Array.isArray(data.user_app_id) ? data.user_app_id[0] : data.user_app_id}`);
      }
      
      // Check for non-field errors
      if (data.detail) {
        errorMessages.push(data.detail);
      }
      
      // If no specific errors found, use a generic message
      if (errorMessages.length === 0) {
        errorMessages.push(t('Invalid data. Please check your input.'));
      }
      
      setError(errorMessages.join('\n'));
    } else if (status === 401) {
      setError(t('Your session has expired. Please log in again.'));
      // Optionally redirect to login
      // window.location.href = '/auth';
    } else if (status === 403) {
      setError(t('You do not have permission to perform this action.'));
    } else if (status === 404) {
      setError(t('The requested resource was not found.'));
    } else if (status === 429) {
      setError(t('Too many requests. Please wait a moment and try again.'));
    } else if (status >= 500) {
      setError(t('Server error. Please try again later.'));
    } else {
      setError(t('An error occurred. Please try again.'));
    }
  // } else if ((error as ApiError).response) {
  //   // The request was made but no response was received
  //   setError(t('Network error. Please check your connection and try again.'));
  } else {
    // Something happened in setting up the request
    setError(t('An error occurred while setting up the request.'));
  }
} finally {
  setLoading(false);
}
};

  const closeTransactionDetails = () => {
  setIsModalOpen(false);
  setSelectedTransaction(null);
};

 const renderStep = () => {
    switch (currentStep) {
      case 'selectId':
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        {/* <h2 className="text-2xl font-bold mb-2">{t("Step 1: Select Your Betting Platform")}</h2> */}
        <p className="text-slate-400">{t("Choisissez la plateforme de pari que vous souhaitez utiliser")}</p>
      </div>
     
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, index) => (
          <div
            key={platform.id}
            onClick={() => handlePlatformSelect(platform)}
            className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.sl_background} backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 cursor-pointer hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20`}
            style={{
              animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
            }}
          >
           
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                  {platform.image ? (
                    <img
                      src={platform.image}
                      alt={platform.public_name || platform.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <CreditCard className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-4">
                  <div className="font-semibold group-hover:text-blue-200 transition-colors duration-300">
                    {platform.public_name || platform.name}
                  </div>
                </div>
              </div>
             
              <div className={`${theme.colors.background} rounded-xl p-3 mb-4`}>
                <div className="text-slate-400 text-xs mb-1">Plateforme de pari</div>
                <div className="font-mono text-sm truncate">{platform.public_name || platform.name}</div>
              </div>
             
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Cliquez pour sélectionner</span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </div>
          
        ))}
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div 
            key={platform.id}
            onClick={() => handlePlatformSelect(platform)}
            className={`p-4 border rounded-lg cursor-pointer ${theme.colors.hover} transition-colors`}
          >
            <div className="font-medium">{platform.public_name || platform.name}</div>
            {platform.image && (
              <img 
                src={platform.image} 
                alt={platform.public_name || platform.name}
                className="h-10 w-10 object-contain mt-2"
              />
            )}
          </div>
        ))}
      </div>
      {platforms.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <h3 className="text-xl font-semibold text-white mb-3">Aucune plateforme de pari trouvée</h3>
          <p className="text-slate-400 text-center max-w-md leading-relaxed">
          {t("Aucune plateforme de pari n'est disponible pour le moment.")}
          </p>
        </div>
      )}
    </div>
  );
        
      case 'selectNetwork':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              {/* <h2 className="text-2xl font-bold  mb-2">{t("Step 2: Select Network")}</h2> */}
              <p className="text-slate-400">Choisissez votre réseau de paiement mobile</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {networks.map((network, index) => (
                <div
                  key={network.id}
                  onClick={() => handleNetworkSelect(network)}
                  className={`group relative overflow-hidden p-6 border rounded-2xl cursor-pointer text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    selectedNetwork?.id === network.id 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-600/20 to-blue-600/20 shadow-lg shadow-blue-500/20' 
                    : `border-slate-600/30 bg-gradient-to-br ${theme.colors.s_background} hover:from-slate-600/50 hover:to-slate-500/50 hover:shadow-blue-500/20`}
                  }`}
                  style={{
                    animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
                  }}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    {network.image ? (
                      <img src={network.image} alt={network.name} className="h-12 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="h-12 flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                          <Smartphone className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                    <div className="text-sm font-medium  group-hover:text-blue-200 transition-colors duration-300">
                      {network.public_name}
                    </div>
                    
                    {selectedNetwork?.id === network.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-4 h-4 " />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentStep('selectId')}
                className="flex items-center text-slate-400 hover:text-white px-6 py-3 rounded-xl transition-all duration-300 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t("Back to Platforms")}
              </button>
            </div>
          </div>
        );
        
      case 'enterDetails':
        const platformBetIds = savedAppIds.filter(id => id.app_name.id === selectedPlatform?.id);
        return (
      <div className="space-y-6">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => {
              setSelectedNetwork(null);
              setCurrentStep('selectNetwork');
            }}
            className="group mr-4 p-2 rounded-xl border border-slate-600/30 hover:text-blue-400 hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            {/* <h2 className="text-2xl font-bold mb-1">{t("Step 3: Enter Details")}</h2> */}
            <p className="text-slate-400 text-sm">{t("Remplissez les détails de votre pari")}</p>
          </div>
        </div>
    
    {/* <form onSubmit={handleSubmit} className="space-y-6">
      
              <div className={`bg-gradient-to-br ${theme.colors.sl_background} backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6`}>
                <label className="block text-sm font-semibold text-blue-400 mb-3">
                  {t("Bet ID")} ({selectedPlatform?.public_name || selectedPlatform?.name})
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.betid}
                      onChange={(e) => setFormData(prev => ({ ...prev, betid: e.target.value }))}
                      className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                      placeholder={t("Enter your bet ID")}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  
                  {platformBetIds.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-400 mb-3">{t("Saved Bet IDs")}</label>
                      <div className="flex flex-wrap gap-3">
                        {platformBetIds.map((id, index) => (
                          <div
                            key={id.id}
                            className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.sl_background} backdrop-blur-sm border border-slate-600/30 rounded-xl px-4 py-3 text-sm hover:from-slate-600/50 hover:to-slate-500/50 cursor-pointer flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20`}
                            style={{
                              animation: `slideInUp 0.3s ease-out ${index * 50}ms both`
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, betid: id.link }));
                            }}
                          >
                            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="mr-3  font-mono truncate relative z-10">{id.link}</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigator.clipboard.writeText(id.link);
                              }}
                              className="relative z-10 p-1.5 hover:bg-slate-500/30 rounded-lg transition-colors duration-200"
                            >
                              <CopyIcon className="h-4 w-4 text-slate-400 hover:text-blue-400 transition-colors duration-200" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

             
              <div className={`bg-gradient-to-br ${theme.colors.sl_background} backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6`}>
                <label className="block text-sm font-semibold text-blue-400 mb-3">{t("Amount")}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                    placeholder={t("Enter amount")}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

             
              <div className={`bg-gradient-to-br ${theme.colors.sl_background} backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6`}>
                <label className="block text-sm font-semibold text-blue-400 mb-3">{t("Phone Number")}</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className={`w-full p-4 ${theme.colors.sl_background} border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                    placeholder={t("Enter phone number")}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            

              
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('selectNetwork')}
                  className="flex items-center justify-center text-slate-400 hover:text-white px-6 py-3 rounded-xl transition-all duration-300 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t("Back")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[140px]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                      {t('Processing...')}
                    </div>
                  ) : (
                    t('Submit')
                  )}
                </button>
              </div>
            </form> */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("Bet ID")} ({selectedPlatform?.public_name || selectedPlatform?.name})
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.betid}
                      onChange={(e) => setFormData(prev => ({ ...prev, betid: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder={t("Enter your bet ID")}
                    />
                    {platformBetIds.length > 0 && (
                      <div className="mt-2">
                        <label className="block text-sm text-gray-500 mb-1">{t("Saved Bet IDs")}</label>
                        <div className="flex flex-wrap gap-2">
                          {platformBetIds.map((id) => (
                            <div
                            key={id.id}
                            className="px-3 py-1 bg-gray-100 rounded-full text-black text-sm hover:bg-gray-200 cursor-pointer flex items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, betid: id.link }));
                            }}
                          >
                            <span className="mr-2">{id.link}</span>
                            <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(id.link);
                                  // alert(t('Bet ID copied to clipboard'));
                                }}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                              <CopyIcon className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-medium mb-1">{t("Amount")}</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full p-2 border rounded"
                    placeholder={t("Enter amount")}
                  />
                </div>

                {selectedNetwork?.otp_required && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("OTP Code")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.otp_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, otp_code: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder={t("Enter OTP code")}
                      required={selectedNetwork?.otp_required}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedNetwork?.message_init || t("Veuillez composer *133# puis l'option 1 pour valider le paiement")}
                    </p>
                  </div>
                )}
  
                <div>
                  <label className="block text-sm font-medium mb-1">{t("Phone Number")}</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full p-2 border rounded"
                    placeholder={t("Enter phone number")}
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('selectNetwork')}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ← {t("Back")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (selectedNetwork?.otp_required && !formData.otp_code)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? t('Processing...') : t('Submit')}
                  </button>
                </div>
              </form>
          </div>
        );
    }
  };

  // Get current step title
  const getCurrentStepTitle = () => {
    switch (currentStep) {
      case 'selectId':
        return t("Select Your Betting Platform");
      case 'selectNetwork':
        return t("Select Network");
      case 'enterDetails':
        return t("Enter Details");
      default:
        return "";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} p-4`}>
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
          
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes backdropFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(8px);
            }
          }
          
          .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }
          
          .modal-backdrop {
            animation: backdropFadeIn 0.3s ease-out;
          }
          
          .modal-content {
            animation: modalSlideIn 0.4s ease-out;
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <DashboardHeader/>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold  mb-2">{t("Deposit Funds")}</h1>
            <p className="text-slate-400">Rechargez votre compte en quelques étapes simples</p>
          </div>
          
          <button
            onClick={() => window.history.back()}
           className={`flex items-center bg-gradient-to-r ${theme.colors.s_background} hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group mt-4 md:mt-0`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("Back")}
          </button>
        </div>

        {/* Simplified Progress Steps - Show only current step */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-600 shadow-lg shadow-blue-500/50 mb-4">
            <div className="w-3 h-3 rounded-full bg-white"></div>
          </div> */}
          <h2 className="text-xl font-bold ">{getCurrentStepTitle()}</h2>
        </div>
        
        {/* Main Content */}
        <div className={`bg-gradient-to-r ${theme.colors.s_background} backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden`}>
          <div className="p-8">
            {/* Alert Messages */}
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-600/50 text-red-300 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 mr-3" />
                  {error}
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 border border-green-600/50 text-green-300 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  {success}
                </div>
              </div>
            )}
            
            {loading && !success && !error ? (
              <div className="flex justify-center items-center p-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"></div>
                </div>
              </div>
            ) : (
              renderStep()
            )}
          </div>
        </div>
      </div>
    
  
      {/* Transaction Details Modal */}
        {isModalOpen && selectedTransaction && (
          <div className={`fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50`}>
            <div className={`${theme.colors.background} rounded-lg shadow-xl w-full max-w-md`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t("Transaction Details")}</h3>
                  <button 
                    onClick={closeTransactionDetails}
                    className=""
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">{t("Amount")}</span>
                    <span className="font-medium">{selectedTransaction.transaction.amount} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">{t("Status")}</span>
                    <span className={`font-medium ${
                      selectedTransaction.transaction.status === 'completed' 
                        ? 'text-green-600 dark:text-green-400'
                        : selectedTransaction.transaction.status === 'pending'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {selectedTransaction.transaction.status.charAt(0).toUpperCase() + 
                      selectedTransaction.transaction.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                    <span className="">{t("Reference")}</span>
                    <span className="font-medium">{selectedTransaction.transaction.reference}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                    <span className="">{t("Date")}</span>
                    <span className="font-medium">
                      {new Date(selectedTransaction.transaction.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  {selectedTransaction.transaction.phone_number && (
                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <span className="">{t("Phone Number")}</span>
                      <span className="font-medium">{selectedTransaction.transaction.phone_number}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeTransactionDetails}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t("Close")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

      {/* Recent transactions section - This could be added if needed */}
      {/* <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('Recent Deposits')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('View your recent deposit transactions')}</p>
        </div> */}
        
        {/* <div className="p-6"> */}
          {/* Sample transactions - This would be populated from API data */}
          {/* <div className="space-y-4"> */}
            {/* Empty state */}
            {/* <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">{t('No recent deposits')}</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                {t('Your recent deposit transactions will appear here once you make your first deposit.')}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* FAQ Section */}
      {/* <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('Frequently Asked Questions')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('Common questions about deposits')}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white">
                <span className="font-medium">{t('How long do deposits take to process?')}</span>
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 text-gray-600 dark:text-gray-300">
                <p>{t('Deposits are typically processed within 5-15 minutes. During high volume periods, it may take up to 30 minutes. If your deposit has not been processed within 1 hour, please contact customer support.')}</p>
              </div>
            </details>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white">
                <span className="font-medium">{t('What is the minimum deposit amount?')}</span>
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 text-gray-600 dark:text-gray-300">
                <p>{t('The minimum deposit amount is 500 XOF. There is no maximum limit for deposits.')}</p>
              </div>
            </details>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white">
                <span className="font-medium">{t('Which payment methods are available?')}</span>
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 text-gray-600 dark:text-gray-300">
                <p>{t('We currently support MTN Mobile Money and MOOV Money for deposits. Additional payment methods will be added in the future.')}</p>
              </div>
            </details>
          </div>
        </div>
      </div> */}

      {/* Support Section */}
      {/* <div className="mt-8 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="p-6 md:p-8 md:w-3/5">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{t('Need help with your deposit?')}</h2>
              <p className="text-blue-100 mb-6">{t('Our support team is available 24/7 to assist you with any issues.')}</p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{t('Live Chat')}</span>
                </a>
                <a href="mailto:support@example.com" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{t('Email Support')}</span>
                </a>
              </div>
            </div>
            <div className="hidden md:block md:w-2/5 relative">
              <div className="absolute inset-0 bg-blue-800/20 backdrop-blur-sm"></div>
              <div className="h-full flex items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
//     </div>
//   );
// }