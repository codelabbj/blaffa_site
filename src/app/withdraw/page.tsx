// pages/withdraw.js


'use client';
import { useState, useEffect } from 'react';
//import Head from 'next/head';
//import axios from 'axios';
import { useTranslation } from 'react-i18next';
// import styles from '../styles/Withdraw.module.css';
//import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '../../components/ThemeProvider';
import { Check, CheckCircle, ChevronRight, CopyIcon, CreditCard, Key, Phone, Smartphone, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import DashboardHeader from '@/components/DashboardHeader';


interface Network {
  id: string;
  name: string;
  public_name?: string;
  country_code?: string;
  image?: string;
}

interface App {
  id: string;
  name: string;
  public_name?: string;
  image?: string;
  is_active?: boolean;
  hash?: string;
  cashdeskid?: string;
  cashierpass?: string;
  order?: string | null;
  city?: string;
  street?: string;
  deposit_tuto_content?: string;
  deposit_link?: string;
  withdrawal_tuto_content?: string;
  withdrawal_link?: string;
}

// Updated IdLink interface to match the structure from deposit/page.tsx
interface IdLink {
  id: string;
  user: string;
  link: string; // This is the saved bet ID
  app_name: App; // This should be the full App object
}

interface Transaction {
  id: string;
  amount?: number;
  type_trans: string;
  status: string;
  reference: string;
  created_at: string;
  network?: Network;
  app?: App;
  phone_number?: string;
  user_app_id?: string;
  error_message?: string;
  withdriwal_code?: string;
}

interface TransactionDetail {
  transaction: Transaction;
}

// interface ErrorResponse {
//   data?: {
//     [key: string]: string[] | string | undefined;
//     detail?: string;
//     message?: string;
//   };
//   status?: number;
// }

export default function Withdraw() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'selectId' | 'selectNetwork' | 'enterDetails'>('selectId');
  const [selectedPlatform, setSelectedPlatform] = useState<App | null>(null);
  const [platforms, setPlatforms] = useState<App[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<{ id: string; name: string; public_name?: string; country_code?: string; image?: string } | null>(null);
  const [formData, setFormData] = useState({
    withdrawalCode: '',
    phoneNumber: '',
    betid: '',
  });
  
  const [networks, setNetworks] = useState<{ id: string; name: string; public_name?: string; image?: string }[]>([]);
  const [savedAppIds, setSavedAppIds] = useState<IdLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const { theme } = useTheme();


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
        window.location.href = '/';
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

  const handleNetworkSelect = (network: { id: string; name: string; public_name?: string; country_code?: string; image?: string }) => {
    setSelectedNetwork(network);
    setCurrentStep('enterDetails');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform || !selectedNetwork) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Not authenticated');

      const countryCode = selectedNetwork.country_code?.toLowerCase() || 'ci'; // Default to 'ci' if not specified
    
      const response = await api.post(`/blaffa/transaction?country_code=${countryCode}`, {
        type_trans: 'withdrawal',
        withdriwal_code: formData.withdrawalCode,
        phone_number: formData.phoneNumber,
        network_id: selectedNetwork.id,
        app_id: selectedPlatform.id,
        user_app_id: formData.betid
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
       
      const transaction = response.data;
      setSelectedTransaction({ transaction });
      setIsModalOpen(true);
      
      setSuccess('Withdrawal initiated successfully!');
      // Reset form
      setCurrentStep('selectId');
      setSelectedPlatform(null);
      setSelectedNetwork(null);
      setFormData({ withdrawalCode: '', phoneNumber: '', betid: '' });
    } catch (err: any) {
      console.error('Withdrawal error:', err);
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 400 && data) {
          const errorMessages: string[] = [];
          
          // Handle field-specific errors
          if (data.withdrawal_code) {
            errorMessages.push(`withdrawal_code: ${Array.isArray(data.withdrawal_code) ? data.withdrawal_code[0] : data.withdrawal_code}`);
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
          
          // Add any non-field errors
          if (data.detail) {
            errorMessages.push(data.detail);
          }
          
          setError(errorMessages.join('\n') || 'Validation error');
        } else if (status === 401) {
          setError('Your session has expired. Please log in again.');
          // Optionally redirect to login
          // window.location.href = '/auth';
        } else if (status === 403) {
          setError('You do not have permission to perform this action.');
        } else if (status === 404) {
          setError('The requested resource was not found.');
        } else if (status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else if (status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(data?.detail || 'An error occurred. Please try again.');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        setError('An error occurred while setting up the request: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
    case 'selectId':
      return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{t("Step 1: Select Your Betting Platform")}</h2>
              <p className="text-slate-400">{t("Choisissez la plateforme de pari que vous souhaitez utiliser")}</p>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform, index) => (
                <div
                  key={platform.id}
                  onClick={() => handlePlatformSelect(platform)}
                  className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.sl_background} backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 cursor-pointer hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20`}
                  style={{
                    animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
                  }}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                  <div className="relative">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-600/20 text-purple-400 shadow-lg shadow-purple-500/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
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
                        <div className="font-semibold group-hover:text-purple-200 transition-colors duration-300">
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
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
           
            {platforms.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <h3 className="text-xl font-semibold  mb-3">Aucune plateforme de pari trouvée</h3>
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
              <h2 className="text-2xl font-bold  mb-2">{t("Step 2: Select Network")}</h2>
              <p className="text-slate-400">Choisissez votre réseau de paiement mobile</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {networks.map((network, index) => (
                <div
                  key={network.id}
                  onClick={() => handleNetworkSelect(network)}
                  className={`group relative overflow-hidden p-6 border rounded-2xl cursor-pointer text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    selectedNetwork?.id === network.id 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-600/20 to-blue-600/20 shadow-lg shadow-purple-500/20' 
                      : `border-slate-600/30 bg-gradient-to-br ${theme.colors.s_background} hover:from-slate-600/50 hover:to-slate-500/50 hover:shadow-purple-500/2`}
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
                    <div className="text-sm font-medium  group-hover:text-purple-200 transition-colors duration-300">
                      {network.public_name}
                    </div>
                    
                    {selectedNetwork?.id === network.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
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
                {t("Back to Bet IDs")}
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
            className="group mr-4 p-2 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 text-white hover:text-purple-400 hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold mb-1">{t("Step 3: Enter Details")}</h2>
            <p className="text-slate-400 text-sm">{t("Remplissez les détails de votre pari")}</p>
          </div>
        </div>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bet ID Section */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6">
                <label className="block text-sm font-semibold text-purple-200 mb-3">
                  {t("Bet ID")} ({selectedPlatform?.public_name || selectedPlatform?.name})
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.betid}
                      onChange={(e) => setFormData(prev => ({ ...prev, betid: e.target.value }))}
                      className="w-full p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                      placeholder={t("Enter your bet ID")}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  
                  {platformBetIds.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-300 mb-3">{t("Saved Bet IDs")}</label>
                      <div className="flex flex-wrap gap-3">
                        {platformBetIds.map((id, index) => (
                          <div
                            key={id.id}
                            className="group relative overflow-hidden bg-gradient-to-br from-slate-700/50 to-slate-600/50 backdrop-blur-sm border border-slate-600/30 rounded-xl px-4 py-3 text-sm hover:from-slate-600/50 hover:to-slate-500/50 cursor-pointer flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                            style={{
                              animation: `slideInUp 0.3s ease-out ${index * 50}ms both`
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, betid: id.link }));
                            }}
                          >
                            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="mr-3 text-white font-mono truncate relative z-10">{id.link}</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigator.clipboard.writeText(id.link);
                              }}
                              className="relative z-10 p-1.5 hover:bg-slate-500/30 rounded-lg transition-colors duration-200"
                            >
                              <CopyIcon className="h-4 w-4 text-slate-400 hover:text-purple-400 transition-colors duration-200" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="withdrawalCode" className="block text-sm font-medium text-slate-400 mb-2">
                    {t("Withdrawal Code")}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      id="withdrawalCode"
                      name="withdrawalCode"
                      value={formData.withdrawalCode}
                      onChange={handleInputChange}
                      className={`w-full p-4 pl-12 ${theme.colors.c_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300`}
                      placeholder={t("Enter your withdrawal code")}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-400 mb-2">
                    {t("Phone Number")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full p-4 pl-12 ${theme.colors.c_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300`}
                      placeholder="ex: 771234567"
                      required
                    />
                  </div>
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
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[140px]"
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
            </form>
          </div>
        );
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
            <h1 className="text-3xl font-bold mb-2">{t("Withdraw Funds")}</h1>
            <p className="text-slate-400">Retirez vos fonds en quelques étapes simples</p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("Back")}
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative max-w-2xl mx-auto">
          {['selectId', 'selectNetwork', 'enterDetails'].map((step, index) => {
            const stepNum = index + 1;
            let stepName = '';
            const currentStepIndex = ['selectId', 'selectNetwork', 'enterDetails'].indexOf(currentStep);
            
            switch (step) {
              case 'selectId': stepName = t('Select Bet ID'); break;
              case 'selectNetwork': stepName = t('Select Network'); break;
              case 'enterDetails': stepName = t('Enter Details'); break;
            }
            
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            
            return (
              <div key={step} className="flex flex-col items-center flex-1 relative">
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 scale-110' 
                      : isCompleted 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50' 
                        : 'bg-gradient-to-br from-slate-700 to-slate-600 text-slate-400 border border-slate-600/50'
                  }`}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : stepNum}
                </div>
                <span className={`text-sm text-center transition-all duration-300 ${
                  isActive 
                    ? 'font-medium text-purple-300' 
                    : isCompleted 
                      ? 'text-green-400' 
                      : 'text-slate-500'
                }`}>
                  {stepName}
                </span>
                
                {index < 2 && (
                  <div className="absolute top-6 left-1/2 w-full h-1 bg-slate-700 -z-10 rounded-full">
                    {isCompleted && (
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Main Content */}
        <div className={`bg-gradient-to-r ${theme.colors.s_background}  backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden`}>
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
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${theme.colors.background} rounded-lg shadow-xl w-full max-w-md`}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t("Transaction Details")}</h3>
              <div className="space-y-2">
                <p><span className="font-medium">{t("Status")}:</span> {selectedTransaction.transaction.status}</p>
                <p><span className="font-medium">{t("Reference")}:</span> {selectedTransaction.transaction.reference}</p>
                <p><span className="font-medium">{t("Date")}:</span> {new Date(selectedTransaction.transaction.created_at).toLocaleString()}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
  
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}