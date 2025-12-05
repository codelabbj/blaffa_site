// pages/withdraw.js


'use client';
import { useState, useEffect } from 'react';
//import Head from 'next/head';
//import axios from 'axios';
import { useTranslation } from 'react-i18next';
// import styles from '../styles/Withdraw.module.css';
//import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '../../components/ThemeProvider';
import { Check, CheckCircle, Smartphone, XCircle, HelpCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import api from '@/lib/axios';
import DashboardHeader from '@/components/DashboardHeader';


interface Network {
  id: string;
  name: string;
  public_name?: string;
  country_code?: string;
  indication?: string;
  image?: string;
  with_fee?: boolean;
  fee_percent?: number;
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
  why_withdrawal_fail?: string;
  minimum_withdrawal?: number;
  maximum_withdrawal?: number;
  // why_withdrawal_fail_link?: string;
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

interface UserPhone {
  id: string;
  phone: string;
  network: number;
  network_name?: string;
  is_default?: boolean;
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
  const [currentStep, setCurrentStep] = useState<'selectId' | 'selectNetwork' | 'selectPhone' | 'manageBetId' | 'enterDetails'>('selectId');
  const [selectedPlatform, setSelectedPlatform] = useState<App | null>(null);
  const [platforms, setPlatforms] = useState<App[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [formData, setFormData] = useState({
    withdrawalCode: '',
    phoneNumber: '',
    betid: '',
    amount: '',
  });
  
  const [validationErrors, setValidationErrors] = useState({
    amount: '',
    withdrawalCode: '',
    phoneNumber: '',
  });
  
  const [networks, setNetworks] = useState<Network[]>([]);
  const [savedAppIds, setSavedAppIds] = useState<IdLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const { theme } = useTheme();
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);
  // const [showInfoDropdown, setShowInfoDropdown] = useState(false);

  // Phone number management state
  const [userPhones, setUserPhones] = useState<UserPhone[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<UserPhone | null>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);
  const [phoneToEdit, setPhoneToEdit] = useState<UserPhone | null>(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');


  // Phone number management functions
  const fetchUserPhones = async (networkId?: string): Promise<UserPhone[]> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return [];

    try {
      const params = networkId ? { network: networkId } : {};
      const response = await api.get('/blaffa/user-phone/', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.status === 200) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching user phones:', error);
      return [];
    }
  };

  const addUserPhone = async (phone: string, networkId: string): Promise<UserPhone | null> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const response = await api.post('/blaffa/user-phone/', {
        phone: phone,
        network: networkId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error adding user phone:', error);
      return null;
    }
  };

  const updateUserPhone = async (phoneId: string, phone: string): Promise<UserPhone | null> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const response = await api.patch(`/blaffa/user-phone/${phoneId}/`, {
        phone: phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating user phone:', error);
      return null;
    }
  };

  const deleteUserPhone = async (phoneId: string): Promise<boolean> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const response = await api.delete(`/blaffa/user-phone/${phoneId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.status === 204;
    } catch (error) {
      console.error('Error deleting user phone:', error);
      return false;
    }
  };

  const fetchPlatforms = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await api.get('/blaffa/app_name?operation_type=withdrawal', {
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
            api.get('/blaffa/network/?type=withdrawal', {
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

  // Auto-hide error messages after 20 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 20000); // 20 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Format phone number with indication from selected network
  const formatPhoneWithCountryCode = (phoneNumber: string): string => {
    if (!selectedNetwork?.indication || !phoneNumber) return phoneNumber;

    const indication = selectedNetwork.indication;

    // If phone already starts with +, return as-is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }

    // If phone already starts with the indication, add +
    if (phoneNumber.startsWith(indication.replace('+', ''))) {
      return `+${phoneNumber}`;
    }

    // If phone already starts with indication (without +), add +
    if (phoneNumber.startsWith(indication)) {
      return phoneNumber;
    }

    // Otherwise, prepend the indication
    return `${indication}${phoneNumber}`;
  };

  // Strip indication from phone number for transaction requests
  const stripPhoneIndication = (phoneNumber: string): string => {
    if (!selectedNetwork?.indication || !phoneNumber) return phoneNumber;

    const indication = selectedNetwork.indication;

    // Remove + prefix from indication for comparison
    const indicationWithoutPlus = indication.replace('+', '');

    // If phone starts with +, remove the indication part
    if (phoneNumber.startsWith('+')) {
      if (phoneNumber.startsWith(indication)) {
        return phoneNumber.substring(indication.length);
      }
    }

    // If phone starts with indication without +, remove it
    if (phoneNumber.startsWith(indicationWithoutPlus)) {
      return phoneNumber.substring(indicationWithoutPlus.length);
    }

    // Return as-is if no indication found
    return phoneNumber;
  };

  // Phone management handlers
  const handlePhoneSelect = (phone: UserPhone) => {
    setSelectedPhone(phone);
    setCurrentStep('manageBetId');
  };

  const handleAddPhone = async () => {
    if (!selectedNetwork || !newPhoneNumber.trim()) return;

    // Format the phone number with country code before sending to API
    const formattedPhone = newPhoneNumber.startsWith('+')
      ? newPhoneNumber
      : formatPhoneWithCountryCode(newPhoneNumber);

    const addedPhone = await addUserPhone(formattedPhone, selectedNetwork.id);
    if (addedPhone) {
      setUserPhones(prev => [...prev, addedPhone]);
      setNewPhoneNumber('');
      setShowAddPhoneModal(false);
    } else {
      setError(t('Failed to add phone number'));
    }
  };

  const handleEditPhone = async () => {
    if (!phoneToEdit || !newPhoneNumber.trim()) return;

    // Format the phone number with country code before sending to API
    const formattedPhone = newPhoneNumber.startsWith('+')
      ? newPhoneNumber
      : formatPhoneWithCountryCode(newPhoneNumber);

    const updatedPhone = await updateUserPhone(phoneToEdit.id, formattedPhone);
    if (updatedPhone) {
      setUserPhones(prev => prev.map(phone =>
        phone.id === phoneToEdit.id ? updatedPhone : phone
      ));
      setNewPhoneNumber('');
      setShowEditPhoneModal(false);
      setPhoneToEdit(null);
    } else {
      setError(t('Failed to update phone number'));
    }
  };

  const handleDeletePhone = async (phoneId: string) => {
    const success = await deleteUserPhone(phoneId);
    if (success) {
      setUserPhones(prev => prev.filter(phone => phone.id !== phoneId));
      if (selectedPhone?.id === phoneId) {
        setSelectedPhone(null);
      }
    } else {
      setError(t('Failed to delete phone number'));
    }
  };

  const handlePlatformSelect = (platform: App) => {
    setSelectedPlatform(platform);
    setCurrentStep('selectNetwork');
  };

  const handleNetworkSelect = async (network: Network) => {
    setSelectedNetwork(network);

    // Fetch user phones for this network
    setPhoneLoading(true);
    const phones = await fetchUserPhones(network.id);
    setUserPhones(phones);
    setPhoneLoading(false);

    setCurrentStep('selectPhone');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function for amount
  const validateAmount = (amount: string): string => {
    if (!amount || amount.trim() === '') {
      return 'Le montant est requis';
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return 'Veuillez saisir un montant valide';
    }
    
    if (numAmount <= 0) {
      return 'Le montant doit être supérieur à 0';
    }
    
    // Use API-provided limits from selected platform, fallback to defaults
    const minAmount = selectedPlatform?.minimum_withdrawal || 100;
    const maxAmount = selectedPlatform?.maximum_withdrawal || 1000000;
    
    if (numAmount < minAmount) {
      return `Le montant minimum est ${minAmount} FCFA`;
    }
    
    if (numAmount > maxAmount) {
      return `Le montant maximum est ${maxAmount} FCFA`;
    }
    
    return '';
  };

  // Validation function for withdrawal code
  const validateWithdrawalCode = (code: string): string => {
    if (!code || code.trim() === '') {
      return 'Le code de retrait est requis';
    }
    
    if (code.trim().length < 3) {
      return 'Le code de retrait doit contenir au moins 3 caractères';
    }
    
    return '';
  };

  // Validation function for phone number
  const validatePhoneNumber = (phone: string): string => {
    if (!phone || phone.trim() === '') {
      return 'Le numéro de téléphone est requis';
    }
    
    // Remove spaces and check if it's a valid phone number format
    const cleanPhone = phone.replace(/\s+/g, '');
    const phoneRegex = /^[0-9]{8,12}$/; // 8-12 digits
    
    if (!phoneRegex.test(cleanPhone)) {
      return 'Veuillez saisir un numéro de téléphone valide (8-12 chiffres)';
    }
    
    return '';
  };

  // Validate all form fields
  const validateForm = (): boolean => {
    // Validate that a phone number is selected
    if (!selectedPhone) {
      setError(t('Veuillez sélectionner un numéro de téléphone'));
      return false;
    }

    const errors = {
      amount: validateAmount(formData.amount),
      withdrawalCode: validateWithdrawalCode(formData.withdrawalCode),
      phoneNumber: '', // No longer need to validate phone input
    };
    
    setValidationErrors(errors);
    
    // Return true if no errors
    return !Object.values(errors).some(error => error !== '');
  };

  // Calculate fee and net amount
  const calculateFeeAndNetAmount = () => {
    const amount = parseFloat(formData.amount) || 0;
    if (!selectedNetwork?.with_fee || !selectedNetwork?.fee_percent) {
      return {
        originalAmount: amount,
        feeAmount: 0,
        netAmount: amount
      };
    }
    
    const feeAmount = (amount * selectedNetwork.fee_percent) / 100;
    const netAmount = amount - feeAmount;
    
    return {
      originalAmount: amount,
      feeAmount,
      netAmount
    };
  };

  const { originalAmount, feeAmount, netAmount } = calculateFeeAndNetAmount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    if (!selectedPlatform || !selectedNetwork || !selectedBetId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Not authenticated');

      const countryCode = selectedNetwork.country_code?.toLowerCase() || 'ci'; // Default to 'ci' if not specified
    
      const response = await api.post(`/blaffa/transaction?country_code=${countryCode}`, {
        type_trans: 'withdrawal',
        withdriwal_code: formData.withdrawalCode,
        phone_number: selectedPhone ? stripPhoneIndication(selectedPhone.phone) : '',
        network_id: selectedNetwork.id,
        app_id: selectedPlatform.id,
        user_app_id: selectedBetId,
        source:'web',
        amount: parseFloat(formData.amount), // Send original amount, not fee-deducted amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
       
      const transaction = response.data;
      setSelectedTransaction({ transaction });
      setIsModalOpen(true);
      
      setSuccess('Retrait initié avec succès !');
      // Reset form
      setCurrentStep('selectId');
      setSelectedPlatform(null);
      setSelectedNetwork(null);
      setSelectedBetId(null);
      setFormData({ withdrawalCode: '', phoneNumber: '', betid: '', amount: '' });
      setValidationErrors({ amount: '', withdrawalCode: '', phoneNumber: '' });
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
           
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                {platforms.map((platform) => {
                  const isActive = selectedPlatform?.id === platform.id;
                  return (
                    <div
                      key={platform.id}
                      onClick={() => handlePlatformSelect(platform)}
                      className={`cursor-pointer bg-gradient-to-br ${theme.colors.s_background} border rounded-2xl shadow-md flex flex-col items-center p-6 group hover:scale-[1.03] transition-all duration-300
                        ${isActive ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-blue-200 dark:shadow-blue-900' : 'border-slate-600/30 hover:shadow-xl hover:border-blue-500'}`}
                      style={{ minWidth: 0, position: 'relative' }}
                    >
                      {isActive && (
                        <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1 shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {platform.image && (
                        <img
                          src={platform.image}
                          alt={platform.public_name || platform.name}
                          className="h-14 w-14 object-contain mb-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow"
                        />
                      )}
                      <div className="font-semibold text-lg text-center group-hover:text-blue-500 truncate w-full">
                        {platform.public_name || platform.name}
                      </div>
                    </div>
                  );
                })}
              </div>
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
        
      case 'selectPhone':
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
                <h2 className="text-2xl font-bold mb-1">{t("Sélectionner un numéro de téléphone")}</h2>
                <p className="text-slate-400 text-sm">{t("Choisissez ou ajoutez un numéro pour les transactions mobile money")}</p>
              </div>
            </div>

            {phoneLoading ? (
              <div className="flex justify-center items-center p-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                {/* List of saved phones */}
                <div className="space-y-2">
                  {userPhones.map((phone) => (
                    <div
                      key={phone.id}
                      onClick={() => handlePhoneSelect(phone)}
                      className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer ${
                        selectedPhone?.id === phone.id
                          ? 'bg-blue-600/20 border border-blue-500'
                          : 'bg-gradient-to-r hover:from-slate-600/50 hover:to-slate-500/50'
                      } border border-slate-600/30 transition-all duration-300 hover:shadow-lg`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-blue-400" />
                        <span className="font-mono text-sm">{formatPhoneWithCountryCode(phone.phone)}</span>
                        {phone.network_name && (
                          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                            {phone.network_name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhoneToEdit(phone);
                            setNewPhoneNumber(phone.phone);
                            setShowEditPhoneModal(true);
                          }}
                          className="p-1 text-xs text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 rounded-full transition"
                          title={t('Modifier')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhone(phone.id);
                          }}
                          className="p-1 text-xs text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-full transition"
                          title={t('Supprimer')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {userPhones.length === 0 && (
                  <div className="text-center py-8">
                    <Smartphone className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">{t("Aucun numéro de téléphone enregistré pour ce réseau")}</p>
                  </div>
                )}

                {/* Add new phone button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAddPhoneModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {t('Ajouter un numéro de téléphone')}
                  </button>
                </div>
              </>
            )}
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
                onClick={() => setCurrentStep('selectPhone')}
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
          
          {/* App Location Information */}
          {selectedPlatform && (selectedPlatform.city || selectedPlatform.street) && (
            <div className={`bg-gradient-to-r ${theme.colors.s_background} border border-slate-600/30 rounded-xl p-4 mb-6`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 dark:text-slate-500 text-sm">{t("City")}:</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedPlatform.city || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 dark:text-slate-500 text-sm">{t("Street")}:</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedPlatform.street || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("ID de pari")}</label>
              <div className="font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded px-3 py-2">
                {selectedBetId}
              </div>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("Montant")} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${
                  validationErrors.amount 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder={`Saisissez le montant à retirer (${selectedPlatform?.minimum_withdrawal || 100} - ${selectedPlatform?.maximum_withdrawal || 1000000} FCFA)`}
                required
                min={selectedPlatform?.minimum_withdrawal || 100}
                max={selectedPlatform?.maximum_withdrawal || 1000000}
                step="0.01"
              />
              {validationErrors.amount && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.amount}</p>
              )}
              {/* Min/Max withdrawal info */}
              {selectedPlatform && (
                <div className="mt-2 text-xs flex flex-wrap gap-2 items-center">
                  <span className={
                    formData.amount && Number(formData.amount) < Number(selectedPlatform.minimum_withdrawal || 100)
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-500'
                  }>
                    {t('Minimum withdrawal')}: {selectedPlatform.minimum_withdrawal || 100} FCFA
                  </span>
                  <span className="mx-2">|</span>
                  <span className={
                    formData.amount && Number(formData.amount) > Number(selectedPlatform.maximum_withdrawal || 1000000)
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-500'
                  }>
                    {t('Maximum withdrawal')}: {selectedPlatform.maximum_withdrawal || 1000000} FCFA
                  </span>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="withdrawalCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("Code de retrait")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="withdrawalCode"
                name="withdrawalCode"
                value={formData.withdrawalCode}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${
                  validationErrors.withdrawalCode 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Saisissez votre code de retrait"
                required
              />
              {validationErrors.withdrawalCode && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.withdrawalCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("Numéro de téléphone")}
              </label>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <div className="font-mono text-green-700 dark:text-green-300 font-medium">
                {selectedPhone ? formatPhoneWithCountryCode(selectedPhone.phone) : 'Aucun numéro sélectionné'}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                {selectedPhone?.network_name ? `${selectedPhone.network_name} Network` : 'Numéro de téléphone sélectionné'}
              </div>
            </div>
              </div>
            </div>
            
            {/* Fee Calculation Display */}
            {formData.amount && selectedNetwork && (
              <div className={`bg-gradient-to-r ${theme.colors.s_background} border border-slate-300 dark:border-slate-600/30 rounded-xl p-4 space-y-3`}>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{t("Transaction Summary")}</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">{t("Amount to withdraw")}:</span>
                    <span className="text-slate-900 dark:text-white font-medium">{originalAmount.toFixed(2)} FCFA</span>
                  </div>
                  
                  {selectedNetwork.with_fee && selectedNetwork.fee_percent && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 text-sm">
                          {t("Fee")} ({selectedNetwork.fee_percent}%):
                        </span>
                        <span className="text-red-600 dark:text-red-400 font-medium">-{feeAmount.toFixed(2)} FCFA</span>
                      </div>
                      
                      <div className="border-t border-slate-300 dark:border-slate-600/30 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{t("You will receive")}:</span>
                          <span className="text-green-600 dark:text-green-400 font-bold text-lg">{netAmount.toFixed(2)} FCFA</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {!selectedNetwork.with_fee && (
                    <div className="border-t border-slate-300 dark:border-slate-600/30 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{t("You will receive")}:</span>
                        <span className="text-green-600 dark:text-green-400 font-bold text-lg">{originalAmount.toFixed(2)} FCFA</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedPlatform?.withdrawal_link && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-4 text-center flex items-center justify-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  {t("Besoin d'aide avec votre retrait ?")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => window.open(selectedPlatform.withdrawal_link, '_blank')}
                    className="group relative flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 rounded-xl border border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-white font-medium hover:scale-105"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>{t("Comment obtenir un code de retrait ?")}</span>
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = selectedPlatform?.why_withdrawal_fail;
                      if (url) {
                        window.open(url, '_blank');
                      }
                    }}
                    className="group relative flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 py-3 rounded-xl border border-orange-300 dark:border-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 text-white font-medium hover:scale-105"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>{t("Pourquoi le retrait échoue ?")}</span>
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('selectPhone')}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
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
      case 'selectPhone':
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
        {/* <div className="mb-6">
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
          
          
          {showInfoDropdown && (
            <div className="mt-3 w-full max-w-2xl">
              <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-4">
                <div className="space-y-3">
                  
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white mb-1">Comment retirer vos gains ?</h3>
                    <p className="text-slate-300 text-sm">Suivez ces étapes simples</p>
                  </div>
                  
                  
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
        </div> */}

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

      {/* Add Phone Modal */}
      {showAddPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className={`${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t("Ajouter un numéro de téléphone")}</h3>
                <button
                  onClick={() => setShowAddPhoneModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("Numéro de téléphone")}
                  </label>
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                    placeholder="ex: 771234567"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("Entrez le numéro sans le préfixe +225")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddPhoneModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {t("Annuler")}
                </button>
                <button
                  onClick={handleAddPhone}
                  disabled={!newPhoneNumber.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {t("Ajouter")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Phone Modal */}
      {showEditPhoneModal && phoneToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className={`${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t("Modifier le numéro de téléphone")}</h3>
                <button
                  onClick={() => {
                    setShowEditPhoneModal(false);
                    setPhoneToEdit(null);
                    setNewPhoneNumber('');
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("Numéro de téléphone")}
                  </label>
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                    placeholder="ex: 771234567"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("Entrez le numéro sans le préfixe +225")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowEditPhoneModal(false);
                    setPhoneToEdit(null);
                    setNewPhoneNumber('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {t("Annuler")}
                </button>
                <button
                  onClick={handleEditPhone}
                  disabled={!newPhoneNumber.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {t("Modifier")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}