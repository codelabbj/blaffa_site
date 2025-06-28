// pages/withdraw.js


'use client';
import { useState, useEffect } from 'react';
//import Head from 'next/head';
//import axios from 'axios';
import { useTranslation } from 'react-i18next';
// import styles from '../styles/Withdraw.module.css';
//import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '../../components/ThemeProvider';
import { Check, CheckCircle, Smartphone, XCircle } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState<'selectId' | 'selectNetwork' | 'manageBetId' | 'enterDetails'>('selectId');
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
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);


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
    setCurrentStep('manageBetId');
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
    if (!selectedPlatform || !selectedNetwork || !selectedBetId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Not authenticated');

      const countryCode = selectedNetwork.country_code?.toLowerCase() || 'ci'; // Default to 'ci' if not specified
    
      const response = await api.post(`/blaffa/transaction?country_code=${countryCode}`, {
        type_trans: 'withdrawal',
        withdriwal_code: formData.withdrawalCode,
        phone_number: formData.phoneNumber.replace(/\s+/g, ''),
        network_id: selectedNetwork.id,
        app_id: selectedPlatform.id,
        user_app_id: selectedBetId,
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
      setSelectedBetId(null);
      setFormData({ withdrawalCode: '', phoneNumber: '', betid: '' });
    } catch (err: unknown) {
      console.error('Withdrawal error:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response: { status: number; data: Record<string, unknown> } };
        const { status, data } = errorResponse.response;
        
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
            errorMessages.push(data.detail as string);
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
          setError(data?.detail as string || 'An error occurred. Please try again.');
        }
      } else if (err && typeof err === 'object' && 'request' in err) {
        // The request was made but no response was received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError('An error occurred while setting up the request: ' + errorMessage);
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
              {/* <h2 className="text-2xl font-bold mb-2">{t("Select Your Betting Platform")}</h2> */}
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
              {/* <h2 className="text-2xl font-bold  mb-2">{t("Sélectionnez le réseau")}</h2> */}
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
                      : `border-slate-600/30 bg-gradient-to-br ${theme.colors.s_background} hover:from-slate-600/50 hover:to-slate-500/50 hover:shadow-blue-500/2`}
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
        
      case 'manageBetId':
        // Only show Bet IDs for the selected platform
        const platformBetIds = savedAppIds.filter(id => id.app_name.id === selectedPlatform?.id);
        // Function to delete a bet ID
        const handleDeleteBetId = async (id: string) => {
          const token = localStorage.getItem('accessToken');
          if (!token) return;
          try {
            await api.delete(`/blaffa/id_link/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setSavedAppIds(prev => prev.filter(bet => bet.id !== id));
          } catch {
            setError(t("Erreur lors de la suppression de l'ID de pari."));
          }
        };
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-8">
              <button 
                onClick={() => setCurrentStep('selectNetwork')}
                className="group mr-4 p-2 rounded-xl border border-slate-600/30 hover:text-blue-400 hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div>
                <p className="text-slate-400 text-sm">{t("Gérer vos IDs de pari")}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => window.location.href = '/bet_id'}
              >
                {t('Ajouter un ID de pari')}
              </button>
            </div>
            {/* List of saved Bet IDs for the selected platform */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">{t('Vos IDs de pari enregistrés')}</h4>
              {platformBetIds.length === 0 ? (
                <div className="text-gray-400">{t('Aucun ID de pari enregistré.')}</div>
              ) : (
                <div className="space-y-2">
                  {platformBetIds.map((id) => (
                    <div
                      key={id.id}
                      className={`flex items-center justify-between  rounded-lg px-4 py-2 cursor-pointer ${theme.colors.hover} transition`}
                      onClick={() => {
                        setSelectedBetId(id.link);
                        setCurrentStep('enterDetails');
                      }}
                    >
                      <div>
                        <span className="font-mono text-sm mr-2">{id.link}</span>
                        <span className="text-xs text-gray-500">({id.app_name.public_name || id.app_name.name})</span>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteBetId(id.id); }}
                        className="ml-2 p-1 text-xs text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-full transition"
                        title={t('Supprimer')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    case 'enterDetails':
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
              <p className="text-slate-400 text-sm">{t("Remplissez les détails de votre pari")}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("Bet ID")}</label>
              <div className="font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded px-3 py-2">
                {selectedBetId}
              </div>
            </div>
            <div>
              <label htmlFor="withdrawalCode" className="block text-sm font-medium mb-1">
                {t("Withdrawal Code")}
              </label>
              <input
                type="text"
                id="withdrawalCode"
                name="withdrawalCode"
                value={formData.withdrawalCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder={t("Enter your withdrawal code")}
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                {t("Phone Number")}
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="e.g., 771234567"
                required
              />
            </div>
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('manageBetId')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← {t("Back")}
              </button>
              <button
                type="submit"
                disabled={loading}
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
        return t("");
      case 'selectNetwork':
        return t("");
      case 'manageBetId':
        return t("");
      case 'enterDetails':
        return t("");
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
          
          @keyframes flash {
            0%, 50% {
              opacity: 1;
              transform: scale(1);
            }
            25%, 75% {
              opacity: 0.7;
              transform: scale(1.05);
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
          
          .flash-animation {
            animation: flash 2s infinite;
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <DashboardHeader/>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {/* <div>
            <h1 className="text-3xl font-bold mb-2">{t("Withdraw Funds")}</h1>
            <p className="text-slate-400">Retirez vos fonds en quelques étapes simples</p>
          </div> */}
          
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

        {/* Information Icon with Dropdown */}
        <div className="mb-6">
          <div className="flex items-center justify-start">
            <button
              onClick={() => setShowInfoDropdown(!showInfoDropdown)}
              className="group relative flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 px-4 py-2 rounded-xl border border-slate-600/30 transition-all duration-300"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">?</span>
              </div>
              <span className="text-slate-300 group-hover:text-white font-medium text-sm">Comment retirer</span>
            </button>
          </div>
          
          {/* Dropdown Content - Now in normal page flow */}
          {showInfoDropdown && (
            <div className="mt-3 w-full max-w-2xl">
              <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white mb-1">Comment retirer vos gains ?</h3>
                    <p className="text-slate-300 text-sm">Suivez ces étapes simples</p>
                  </div>
                  
                  {/* Steps */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 p-2 rounded-lg bg-slate-700/50">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Plateforme de pari</h4>
                        <p className="text-slate-300 text-xs">Sélectionnez votre plateforme</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-2 rounded-lg bg-slate-700/50">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Réseau mobile</h4>
                        <p className="text-slate-300 text-xs">Choisissez votre opérateur</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-2 rounded-lg bg-slate-700/50">
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">ID de pari</h4>
                        <p className="text-slate-300 text-xs">Ajoutez votre ID enregistré</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-2 rounded-lg bg-slate-700/50">
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-xs">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">Détails finaux</h4>
                        <p className="text-slate-300 text-xs">Code + numéro de téléphone</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tips Section */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-700/50">
                    <h4 className="font-medium text-emerald-300 text-sm mb-2">💡 Conseils :</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        <span className="text-slate-300 text-xs">Vérifiez votre code de retrait</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        <span className="text-slate-300 text-xs">Numéro de téléphone actif</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        <span className="text-slate-300 text-xs">Gardez votre référence</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setShowInfoDropdown(false)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-300"
                    >
                      Compris !
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simplified Progress Steps - Show only current step */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-600 shadow-lg shadow-blue-500/50 mb-4">
            <div className="w-3 h-3 rounded-full bg-white"></div>
          </div> */}
          <h2 className="text-xl font-bold ">{getCurrentStepTitle()}</h2>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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