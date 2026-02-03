// pages/withdraw.js


'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import Head from 'next/head';
//import axios from 'axios';
import { useTranslation } from 'react-i18next';
// import styles from '../styles/Withdraw.module.css';
//import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '../../components/ThemeProvider';
import { Check, CheckCircle, Phone, XCircle, HelpCircle, AlertTriangle, ExternalLink, Plus, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import DashboardHeader from '@/components/DashboardHeader';


interface Network {
  id: string;
  name: string;
  public_name?: string;
  country_code?: string;
  indication?: string;
  placeholder?: string;
  image?: string;
  with_fee?: boolean;
  fee_percent?: number;
  deposit_message?: string;
  tape_code?: string;
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
  minimun_with?: string;
  max_win?: string;
  deposit_message?: string;
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
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'selectId' | 'selectNetwork' | 'selectPhone' | 'manageBetId' | 'enterDetails' | 'addPhone' | 'summary'>('selectId');
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

  const handleAddPhone = async () => {
    if (!selectedNetwork || !newPhoneNumber.trim()) return;

    setError('');
    // Format the phone number with country code before sending to API
    const formattedPhone = newPhoneNumber.startsWith('+')
      ? newPhoneNumber
      : formatPhoneWithCountryCode(newPhoneNumber);

    const addedPhone = await addUserPhone(formattedPhone, selectedNetwork.id);
    if (addedPhone) {
      setUserPhones(prev => [...prev, addedPhone]);
      setNewPhoneNumber('');
      return true;
    } else {
      setError(t('Failed to add phone number'));
      return false;
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await api.get('/blaffa/app_name?operation_type=withdrawal');

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

      try {
        setLoading(true);
        const promises = [fetchPlatforms()];

        if (token) {
          promises.push(
            api.get('/blaffa/network/?type=withdrawal', {
              headers: { Authorization: `Bearer ${token}` }
            }).then(res => setNetworks(res.data))
          );
          promises.push(
            api.get('/blaffa/id_link', {
              headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
              const data = res.data;
              let processedData: IdLink[] = [];
              if (Array.isArray(data)) processedData = data;
              else if (data?.results) processedData = data.results;
              else if (data?.data) processedData = data.data;
              setSavedAppIds(processedData);
            })
          );
        }

        await Promise.allSettled(promises);

      } catch (err) {
        console.error('Error fetching data:', err);
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
    setCurrentStep('enterDetails');
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
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setSelectedPlatform(platform);
    setCurrentStep('manageBetId');
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

  // Get current min and max withdrawal limits
  const getWithdrawalLimits = () => {
    const minVal = selectedPlatform?.minimun_with || selectedPlatform?.minimum_withdrawal || '100';
    const maxVal = selectedPlatform?.max_win || selectedPlatform?.maximum_withdrawal || '1000000';
    return {
      min: parseFloat(String(minVal)),
      max: parseFloat(String(maxVal))
    };
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

    // Use API-provided limits from selected platform
    const { min: minAmount, max: maxAmount } = getWithdrawalLimits();

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
        source: 'web',
        amount: parseFloat(formData.amount), // Send original amount, not fee-deducted amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const transaction = response.data;
      setSuccess('Retrait initié avec succès !');
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/dashboard';
      }, 3000);

      // Reset form
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
            <div className="mb-8">
              <h3 className={`text-xl font-bold ${theme.colors.text} mb-2`}>1. Sélectionnez votre plateforme</h3>
            </div>

            <div className="w-full flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {platforms.map((platform) => {
                  const isActive = selectedPlatform?.id === platform.id;
                  return (
                    <div
                      key={platform.id}
                      onClick={() => handlePlatformSelect(platform)}
                      className={`cursor-pointer bg-white dark:bg-slate-800 border rounded-2xl flex flex-col items-center p-6 transition-all duration-300
                        ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                    >
                      {platform.image && (
                        <div className="h-20 w-20 flex items-center justify-center mb-4">
                          <img
                            src={platform.image}
                            alt={platform.public_name || platform.name}
                            className="h-16 w-16 object-contain"
                          />
                        </div>
                      )}
                      <div className={`font-medium text-base text-center uppercase tracking-wider ${theme.colors.text}`}>
                        {platform.public_name || platform.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {platforms.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <p className={`${theme.colors.d_text} opacity-40 text-center`}>{t("Aucune plateforme disponible")}</p>
              </div>
            )}
          </div>
        );


      case 'selectNetwork':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className={`text-xl font-bold ${theme.colors.text} mb-2`}>3. Sélectionnez votre réseau</h3>
            </div>

            <div className="space-y-3">
              {networks.map((network) => (
                <div
                  key={network.id}
                  onClick={() => handleNetworkSelect(network)}
                  className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border rounded-2xl cursor-pointer transition-all ${selectedNetwork?.id === network.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                >
                  {network.image ? (
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <img src={network.image} alt={network.name} className="w-12 h-12 object-contain" />
                    </div>
                  ) : (
                    <div className={`w-14 h-14 ${theme.mode === 'dark' ? 'bg-slate-800' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Phone className={`w-6 h-6 ${theme.colors.d_text} opacity-40`} />
                    </div>
                  )}
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {network.public_name || network.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  if (selectedNetwork) {
                    handleNetworkSelect(selectedNetwork);
                  }
                }}
                disabled={!selectedNetwork}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${selectedNetwork
                  ? 'bg-gray-400 hover:bg-gray-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Suivant
              </button>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setCurrentStep('manageBetId')}
                className={`${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t("Retour")}
              </button>
            </div>
          </div>
        );

      case 'selectPhone':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className={`text-xl font-bold ${theme.colors.text} mb-2`}>
                4. Choisissez ou enregistrez votre numéro {selectedNetwork?.public_name || selectedNetwork?.name}
              </h3>
            </div>

            {phoneLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {userPhones.map((phone) => (
                    <div
                      key={phone.id}
                      onClick={() => handlePhoneSelect(phone)}
                      className={`flex items-center justify-between ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} rounded-2xl px-4 py-4 cursor-pointer hover:border-blue-300 transition-all`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-lg font-medium ${theme.colors.text}`}>
                          {formatPhoneWithCountryCode(phone.phone)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhone(phone.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setCurrentStep('addPhone')}
                    className={`w-full py-4 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`}
                  >
                    <Plus size={24} strokeWidth={2.5} />
                    Ajouter un numéro
                  </button>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setCurrentStep('selectNetwork')}
                    className={`${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t("Retour")}
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 'manageBetId':
        const platformBetIds = savedAppIds.filter(id => id.app_name.id === selectedPlatform?.id);
        const handleDeleteBetId = async (id: string) => {
          const token = localStorage.getItem('accessToken');
          if (!token) return;
          try {
            await api.delete(`/blaffa/id_link/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setSavedAppIds(prev => prev.filter(bet => bet.id !== id));
          } catch {
            setError(t("Erreur lors de la suppression de l'ID"));
          }
        };
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className={`text-xl font-bold ${theme.colors.text} mb-2`}>2. Choisissez ou créez votre ID pour {selectedPlatform?.public_name || selectedPlatform?.name}</h3>
            </div>

            <div className="space-y-3">
              {platformBetIds.map((id) => (
                <div
                  key={id.id}
                  onClick={() => {
                    setSelectedBetId(id.link);
                    setCurrentStep('selectNetwork');
                  }}
                  className={`flex items-center justify-between ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} rounded-2xl px-6 py-5 cursor-pointer hover:border-blue-300 transition-all`}
                >
                  <div className="flex items-center gap-6">
                    {selectedPlatform?.image && (
                      <div className={`${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-slate-50'} p-2 rounded-lg`}>
                        <img src={selectedPlatform.image} alt="" className="w-10 h-10 object-contain" />
                      </div>
                    )}
                    <span className={`text-xl font-bold tracking-wider ${theme.colors.text}`}>{id.link}</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteBetId(id.id); }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  const platformName = selectedPlatform?.public_name || selectedPlatform?.name || '';
                  const platformId = selectedPlatform?.id || '';
                  window.location.href = `/bet_id?origin=withdraw&platform=${encodeURIComponent(platformName)}&platform_id=${platformId}`;
                }}
                className="w-full py-4 border border-[#002d72] dark:border-blue-400 rounded-2xl flex items-center justify-center gap-3 text-[#002d72] dark:text-blue-400 font-bold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
              >
                <Plus size={24} strokeWidth={2.5} />
                Créer un nouvel ID
              </button>
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={() => setCurrentStep('selectId')}
                className={`${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t("Retour aux plateformes")}
              </button>
            </div>
          </div>
        );
      case 'addPhone':
        return (
          <div className={`min-h-screen ${theme.colors.a_background}`}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setCurrentStep('selectPhone')}
                className={`p-1 ${theme.colors.hover} rounded-full transition-colors`}
              >
                <ArrowLeft size={28} className={theme.colors.text} />
              </button>
              <h3 className={`text-xl font-bold ${theme.colors.text}`}>
                Retrait - Numéro de télé...
              </h3>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h4 className={`text-lg font-bold ${theme.colors.text} mb-2`}>
                4. Choisissez ou enregistrez votre numéro {selectedNetwork?.public_name || selectedNetwork?.name}
              </h4>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block text-lg font-bold ${theme.colors.text} mb-2 px-1`}>
                  Nouveau numéro
                </label>
                <input
                  type="tel"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  placeholder="Entrez votre numéro"
                  className={`w-full h-14 px-4 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'} ${theme.colors.a_background} text-lg ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400`}
                />
                {error && <p className="text-red-500 text-sm mt-2 px-1">{error}</p>}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentStep('selectPhone')}
                  className="flex-1 h-14 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 font-bold text-lg rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    const success = await handleAddPhone();
                    if (success) {
                      setCurrentStep('selectPhone');
                    }
                  }}
                  disabled={!newPhoneNumber}
                  className={`flex-1 h-14 bg-[#1a4384] text-white font-bold text-lg rounded-2xl shadow-lg hover:bg-[#15386b] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#1a4384' }}
                >
                  {loading ? '...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'enterDetails':
        return (
          <div className={`min-h-screen ${theme.colors.a_background}`}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setCurrentStep('selectPhone')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft size={28} className="text-gray-900 dark:text-gray-100" />
              </button>
              <h3 className={`text-xl font-bold ${theme.colors.text}`}>
                5. Confirmer le retrait
              </h3>
            </div>

            {/* Badges for City/Street */}
            {selectedPlatform && (selectedPlatform.city || selectedPlatform.street) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPlatform.street && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Rue: {selectedPlatform.street}
                  </span>
                )}
                {selectedPlatform.city && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Ville: {selectedPlatform.city}
                  </span>
                )}
              </div>
            )}

            {/* Warning Limits */}
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-700">
                Assurez-vous que le montant est dans les limites autorisées {getWithdrawalLimits().min} F - {getWithdrawalLimits().max} F.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (validateForm()) setCurrentStep('summary'); }} className="space-y-6">
              {/* Withdrawal Code Field */}
              <div>
                <input
                  type="text"
                  name="withdrawalCode"
                  value={formData.withdrawalCode}
                  onChange={handleInputChange}
                  className={`w-full h-14 px-4 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'} ${theme.colors.a_background} text-lg ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Code de retrait"
                  required
                />
                {validationErrors.withdrawalCode && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.withdrawalCode}</p>
                )}
              </div>

              {/* Amount Field */}
              <div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full h-14 px-4 rounded-xl border ${!formData.amount
                    ? theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'
                    : (parseFloat(formData.amount) < getWithdrawalLimits().min || parseFloat(formData.amount) > getWithdrawalLimits().max)
                      ? 'border-red-500'
                      : 'border-green-500'
                    } ${theme.colors.a_background} text-lg ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Montant (F CFA)"
                  required
                  min={getWithdrawalLimits().min}
                  max={getWithdrawalLimits().max}
                  step="1"
                />
                {/* Range indicator with dynamic colors */}
                <div className={`mt-2 text-sm font-medium ${!formData.amount
                  ? 'text-red-500' // Previous behavior was red by default? Let's check. 
                  : (parseFloat(formData.amount) < getWithdrawalLimits().min || parseFloat(formData.amount) > getWithdrawalLimits().max)
                    ? 'text-red-500'
                    : 'text-green-500'
                  }`}>
                  {getWithdrawalLimits().min} F - {getWithdrawalLimits().max} F
                </div>
                {validationErrors.amount && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.amount}</p>
                )}
              </div>



              {/* Split Phone Display */}
              <div className="flex gap-4">
                <div className={`w-1/3 flex items-center justify-center gap-2 h-14 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'} ${theme.colors.a_background}`}>
                  <span className="text-2xl">
                    {getCountryFlag(selectedNetwork?.indication)}
                  </span>
                  <span className={`text-lg font-bold ${theme.colors.text}`}>
                    {selectedNetwork?.indication || '+226'}
                  </span>
                </div>
                <div className={`flex-1 relative flex items-center h-14 px-4 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'} ${theme.colors.a_background}`}>
                  <span className={`text-lg ${theme.colors.text}`}>
                    {selectedPhone ? stripPhoneIndication(selectedPhone.phone) : ''}
                  </span>
                  <label className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-slate-900 text-xs text-gray-500">Numéro de téléphone</label>
                </div>
              </div>

              {/* Youtube Buttons */}
              <div className="space-y-3">
                {selectedPlatform?.withdrawal_link && (
                  <button
                    type="button"
                    onClick={() => window.open(selectedPlatform.withdrawal_link, '_blank')}
                    className="w-full p-4 rounded-xl border border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                        {/* Youtube Play Icon */}
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                      <div className="text-left w-full">
                        <div className="text-xs text-gray-500 text-left">Tutoriel vidéo</div>
                        <div className={`font-bold text-sm ${theme.colors.text} text-red-600 text-left uppercase text-xs truncate max-w-[200px]`}>Comment obtenir un code de retrait avec {selectedPlatform?.public_name || selectedPlatform?.name} ?</div>
                      </div>
                    </div>
                    <div className="text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                )}

                {selectedPlatform?.why_withdrawal_fail && (
                  <button
                    type="button"
                    onClick={() => window.open(selectedPlatform.why_withdrawal_fail, '_blank')}
                    className="w-full p-4 rounded-xl border border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                      <div className="text-left w-full">
                        <div className="text-xs text-gray-500 text-left">Tutoriel vidéo</div>
                        <div className={`font-bold text-sm ${theme.colors.text} text-red-600 text-left uppercase text-xs`}>Pourquoi mon retrait a échoué ?</div>
                      </div>
                    </div>
                    <div className="text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 pb-20">
                <button
                  type="submit"
                  disabled={loading || !formData.amount || !selectedPhone}
                  className="w-full h-14 text-white font-bold text-lg rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#9ca3af' }}
                >
                  {loading ? 'Traitement...' : 'Retrait'}
                </button>
              </div>
            </form>
          </div>
        );
      case 'summary':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold ${theme.colors.text}`}>Confirmer le retrait</h3>
            </div>

            {/* Main Summary Card */}
            <div className={`${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} rounded-3xl overflow-hidden shadow-sm`}>

              {/* Amount Section */}
              <div className={`py-6 text-center bg-gradient-to-b ${theme.mode === 'dark' ? 'from-blue-900/10 to-transparent' : 'from-blue-50 to-transparent'}`}>
                <div className={`text-5xl font-extrabold ${theme.colors.text} tracking-tight`}>
                  {new Intl.NumberFormat('fr-FR').format(parseInt(formData.amount))} <span className="text-2xl align-top opacity-60 font-bold">F</span>
                </div>
              </div>

              {/* Details List */}
              <div className="px-6 pb-6 space-y-4">
                {/* Divider */}
                <div className={`h-px w-full ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}></div>

                {/* Platform */}
                <div className="flex items-center justify-between">
                  <span className={`${theme.colors.d_text} opacity-60 text-sm`}>Plateforme</span>
                  <div className="flex items-center gap-2">
                    {selectedPlatform?.image && (
                      <img src={selectedPlatform.image} alt="" className="w-5 h-5 object-contain" />
                    )}
                    <span className={`font-semibold ${theme.colors.text}`}>{selectedPlatform?.public_name || selectedPlatform?.name}</span>
                  </div>
                </div>

                {/* ID */}
                <div className="flex items-center justify-between">
                  <span className={`${theme.colors.d_text} opacity-60 text-sm`}>ID Utilisateur</span>
                  <span className={`font-mono font-medium ${theme.colors.text} bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm`}>{selectedBetId}</span>
                </div>

                {/* Network */}
                <div className="flex items-center justify-between">
                  <span className={`${theme.colors.d_text} opacity-60 text-sm`}>Moyen de paiement</span>
                  <div className="flex items-center gap-2">
                    {selectedNetwork?.image && (
                      <img src={selectedNetwork.image} alt="" className="w-5 h-5 object-contain" />
                    )}
                    <span className={`font-semibold ${theme.colors.text}`}>{selectedNetwork?.public_name || selectedNetwork?.name}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between">
                  <span className={`${theme.colors.d_text} opacity-60 text-sm`}>Téléphone</span>
                  <span className={`font-semibold ${theme.colors.text}`}>{selectedPhone ? stripPhoneIndication(selectedPhone.phone) : ''}</span>
                </div>
              </div>
            </div>

            {/* Warning - Minimalist */}
            <p className={`text-xs text-center ${theme.colors.d_text} opacity-50 px-6 leading-relaxed`}>
              En confirmant, vous acceptez d'initier cette transaction sur le numéro indiqué.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-14 bg-[#002d72] hover:bg-[#001d4a] text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#002d72' }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </>
                ) : (
                  <span>Confirmer le retrait</span>
                )}
              </button>

              <button
                onClick={() => setCurrentStep('enterDetails')}
                disabled={loading}
                className={`w-full py-3 text-center font-bold text-sm ${theme.colors.d_text} opacity-50 hover:opacity-100 transition-opacity`}
              >
                Modifier les informations
              </button>
            </div>
          </div>
        );
    }
  };

  // Helper to get country flag based on indication
  const getCountryFlag = (indication?: string) => {
    if (!indication) return '🇧🇫'; // Default
    const cleanIndication = indication.replace('+', '');
    switch (cleanIndication) {
      case '226': return '🇧🇫'; // Burkina Faso
      case '225': return '🇨🇮'; // Cote d'Ivoire
      case '223': return '🇲🇱'; // Mali
      case '221': return '🇸🇳'; // Senegal
      case '228': return '🇹🇬'; // Togo
      case '229': return '🇧🇯'; // Benin
      case '237': return '🇨🇲'; // Cameroon
      case '224': return '🇬🇳'; // Guinea
      case '241': return '🇬🇦'; // Gabon
      case '242': return '🇨🇬'; // Congo
      case '243': return '🇨🇩'; // DRC
      case '227': return '🇳🇪'; // Niger
      case '233': return '🇬🇭'; // Ghana
      case '234': return '🇳🇬'; // Nigeria
      default: return '🌍';
    }
  };



  // Get current step title
  const getCurrentStepTitle = () => {
    switch (currentStep) {
      case 'selectId':
        return "Retrait";
      case 'manageBetId':
        return "Retrait - ID Utilisateur";
      case 'selectNetwork':
        return "Retrait - Réseau";
      case 'selectPhone':
        return "Retrait - Numéro de télé...";
      case 'enterDetails':
        return "Retrait - Informations";
      case 'summary':
        return "Confirmer le retrait";
      default:
        return "Retrait";
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

      <div className="w-full px-6">
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => {
              if (currentStep === 'selectId') {
                router.back();
              } else if (currentStep === 'manageBetId') {
                setCurrentStep('selectId');
              } else if (currentStep === 'selectNetwork') {
                setCurrentStep('manageBetId');
              } else if (currentStep === 'selectPhone') {
                setCurrentStep('selectNetwork');
              } else if (currentStep === 'enterDetails') {
                setCurrentStep('selectPhone');
              } else if (currentStep === 'summary') {
                setCurrentStep('enterDetails');
              }
            }}
            className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold tracking-tight">{getCurrentStepTitle()}</h1>
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

        {/* Main Content */}
        <div className="pb-24">
          <div>
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