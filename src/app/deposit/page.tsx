'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import Head from 'next/head';
//import axios from 'axios';
import { useTranslation } from 'react-i18next';
//import styles from '../styles/Deposits.module.css';
//import { ClipboardIcon } from 'lucide-react'; // Make sure to install this package
//import { Transaction } from 'mongodb';
//import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';
import { useWebSocket } from '../../context/WebSocketContext';
import { Check, CheckCircle, Phone, XCircle, Copy, Plus, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import DashboardHeader from '@/components/DashboardHeader';
// import { CopyIcon } from 'lucide-react';


//import { Transaction } from 'mongodb';

interface Network {
  id: string;
  name: string;
  public_name: string;
  country_code: string;
  indication?: string;
  placeholder?: string;
  image?: string;
  otp_required?: boolean;
  message_init?: string;
  deposit_api?: string;
  deposit_message?: string;
  tape_code?: string;
  payment_by_link?: boolean;
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
  minimun_deposit?: string;
  max_deposit?: string;
  minimum_deposit?: number;
  maximum_deposit?: number;
  deposit_message?: string;
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

interface UserPhone {
  id: string;
  phone: string;
  network: number;
  network_name?: string;
  is_default?: boolean;
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
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'selectId' | 'selectNetwork' | 'selectPhone' | 'manageBetId' | 'enterDetails' | 'addPhone' | 'summary'>('selectId');
  const [selectedPlatform, setSelectedPlatform] = useState<App | null>(null);
  const [platforms, setPlatforms] = useState<App[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<{ id: string; name: string; public_name?: string; country_code?: string; indication?: string; placeholder?: string; image?: string, otp_required?: boolean, tape_code?: string, deposit_api?: string, deposit_message?: string, payment_by_link?: boolean } | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    phoneNumber: '',
    betid: '',
    otp_code: '',// Add OTP field to form state
  });

  const [validationErrors, setValidationErrors] = useState({
    amount: '',
    phoneNumber: '',
    otp_code: '',
  });

  const [networks, setNetworks] = useState<{ id: string; name: string; public_name?: string; indication?: string; placeholder?: string; image?: string, otp_required?: boolean, tape_code?: string, deposit_api?: string, payment_by_link?: boolean }[]>([]);
  const [savedAppIds, setSavedAppIds] = useState<IdLink[]>([]); // Used in manageBetId and other steps
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const [transactionLink, setTransactionLink] = useState<string | null>(null);
  const { theme } = useTheme();
  const { addMessageHandler } = useWebSocket();
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);
  const [showMoovModal, setShowMoovModal] = useState(false);
  const [moovUssdCode, setMoovUssdCode] = useState('');
  const [moovMerchantPhone, setMoovMerchantPhone] = useState('');
  const [showOrangeModal, setShowOrangeModal] = useState(false);
  const [orangeUssdCode, setOrangeUssdCode] = useState('');
  const [orangeMerchantPhone, setOrangeMerchantPhone] = useState('');
  const [orangeTransactionLink, setOrangeTransactionLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Phone number management state
  const [userPhones, setUserPhones] = useState<UserPhone[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<UserPhone | null>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);
  // const [showAddPhoneModal, setShowAddPhoneModal] = useState(false); // Removed
  const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);
  const [phoneToEdit, setPhoneToEdit] = useState<UserPhone | null>(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');


  useEffect(() => {
    const handleTransactionLink = (data: WebSocketMessage) => {
      if (data.type === 'transaction_link' && data.data) {
        setTransactionLink(data.data); // Save the link for the modal button
      }
    };
    const removeHandler = addMessageHandler(handleTransactionLink);
    return () => removeHandler();
  }, [addMessageHandler]);

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

  // Fetch networks and saved app IDs on component mount
  const fetchPlatforms = async () => {
    // Public fetch - no token required
    try {
      // Use axios directly or api instance without auth header for this request if possible
      // Or just let api instance handle it (if no token in localStorage, no header added usually)
      const response = await api.get('/blaffa/app_name?operation_type=deposit');

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

  // ... (UserPhones functions unchanged) ...

  // Fetch networks and saved app IDs on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');

      // We allow loading the page without token now to see platforms
      // specific user data (networks, saved IDs) will only be fetched if token exists

      try {
        setLoading(true);
        const promises = [fetchPlatforms()];

        if (token) {
          promises.push(
            api.get('/blaffa/network/?type=deposit', {
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
        // Don't show critical error if just public load
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlatformSelect = (platform: App) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setSelectedPlatform(platform);
    setCurrentStep('manageBetId');
  };

  // Fetch user phones for a specific network
  const fetchUserPhones = async (networkId: string): Promise<UserPhone[]> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return [];

    try {
      const response = await api.get('/blaffa/user-phone/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: { network: networkId }
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

  const handleNetworkSelect = async (network: { id: string; name: string; public_name?: string; country_code?: string; indication?: string; placeholder?: string; image?: string, otp_required?: boolean, tape_code?: string, deposit_api?: string, payment_by_link?: boolean }) => {
    setSelectedNetwork(network);

    // Fetch user phones for this network
    setPhoneLoading(true);
    const phones = await fetchUserPhones(network.id);
    setUserPhones(phones);
    setPhoneLoading(false);

    setCurrentStep('selectPhone');
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

  // Phone management handlers
  const handlePhoneSelect = (phone: UserPhone) => {
    setSelectedPhone(phone);
    setCurrentStep('enterDetails');
  };

  const handleAddPhone = async () => {
    if (!selectedNetwork || !newPhoneNumber.trim()) return;

    // Validate phone number length
    if (newPhoneNumber.length > 10) {
      setError(`Numéro de téléphone invalide. Le numéro ne doit pas dépasser 10 chiffres. Exemple: ${selectedNetwork.placeholder || '771234567'}`);
      return;
    }

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

  // Get current min and max deposit limits
  const getDepositLimits = () => {
    const minVal = selectedPlatform?.minimun_deposit || selectedPlatform?.minimum_deposit || '100';
    const maxVal = selectedPlatform?.max_deposit || selectedPlatform?.maximum_deposit || '1000000';
    return {
      min: parseFloat(String(minVal)),
      max: parseFloat(String(maxVal))
    };
  };

  const getNetworkMinAmount = (): number => {
    return getDepositLimits().min;
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

    // Network-specific minimum amounts
    let minAmount: number;
    if (selectedNetwork?.name?.toLowerCase() === 'moov') {
      minAmount = 505; // Moov minimum is 505 FCFA
    } else if (selectedNetwork?.name?.toLowerCase() === 'orange') {
      minAmount = 100; // Orange minimum is 100 FCFA
    } else {
      // Use platform-level minimum for other networks
      minAmount = selectedPlatform?.minimum_deposit || parseFloat(selectedPlatform?.minimun_deposit || '100');
    }

    const maxAmount = selectedPlatform?.maximum_deposit || parseFloat(selectedPlatform?.max_deposit || '1000000');

    if (numAmount < minAmount) {
      return `Le montant minimum est ${minAmount} FCFA`;
    }

    if (numAmount > maxAmount) {
      return `Le montant maximum est ${maxAmount} FCFA`;
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

  // Validation function for OTP code
  const validateOtpCode = (otp: string): string => {
    if (selectedNetwork?.otp_required) {
      if (!otp || otp.trim() === '') {
        return 'Le code OTP est requis';
      }

      if (otp.trim().length < 4) {
        return 'Le code OTP doit contenir au moins 4 caractères';
      }
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
      phoneNumber: '', // No longer need to validate phone input
      otp_code: validateOtpCode(formData.otp_code),
    };

    setValidationErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some(error => error !== '');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    if (!selectedPlatform || !selectedNetwork) return;

    // Open a blank tab immediately to bypass popup blockers
    const paymentWindow = window.open('about:blank', '_blank');

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
        phone_number: selectedPhone ? stripPhoneIndication(selectedPhone.phone) : '',
        user_app_id: selectedBetId,
        source: 'web',
      };

      // Calculate net_payable_amount for USSD networks (Moov and Orange with connect API)
      if (shouldTriggerMoovRedirect(selectedNetwork) || shouldTriggerOrangeRedirect(selectedNetwork)) {
        const amount = parseFloat(formData.amount);
        const netPayableAmount = amount * 0.01; // 1% of the amount
        transactionData.net_payable_amount = netPayableAmount;
      }

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

      setSuccess('Transaction initiée avec succès !');

      // Check for transaction link in response and update the pre-opened tab
      if (transaction.transaction_link) {
        if (paymentWindow) {
          paymentWindow.location.href = transaction.transaction_link;
        }
      } else if (paymentWindow) {
        // If no link, close the blank tab
        paymentWindow.close();
      }

      // Check if Moov redirection should be triggered
      if (shouldTriggerMoovRedirect(selectedNetwork)) {
        const amount = parseFloat(formData.amount);
        const countryCode = selectedNetwork.country_code;
        await handleMoovRedirect(amount, countryCode);
      }
      // Check if Orange redirection should be triggered
      else if (shouldTriggerOrangeRedirect(selectedNetwork)) {
        const amount = parseFloat(formData.amount);
        const countryCode = selectedNetwork.country_code;

        if (selectedNetwork.payment_by_link !== true || !transaction.transaction_link) {
          await handleOrangeRedirect(amount, countryCode);
        }
      }

      // Redirect main tab to dashboard regardless of link presence
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/dashboard';
      }, 2000);

      // Reset form
      setFormData({ amount: '', phoneNumber: '', betid: '', otp_code: '' });
      setValidationErrors({ amount: '', phoneNumber: '', otp_code: '' });
    } catch (error) {
      console.error('Transaction error:', error);
      if (paymentWindow) paymentWindow.close();
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
    setTransactionLink(null); // Reset link when closing modal
  };

  // Fetch settings to get merchant phone number
  const fetchSettings = async (networkName?: string, countryCode?: string): Promise<string | null> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const response = await api.get('/blaffa/setting/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        const settingsData = response.data;
        const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;

        if (!settings) return null;

        // Handle different networks
        if (networkName?.toLowerCase() === 'moov') {
          if (countryCode?.toLowerCase() === 'bf') {
            return settings.bf_moov_marchand_phone || settings.moov_marchand_phone || null;
          } else if (countryCode?.toLowerCase() === 'ci') {
            return settings.ci_moov_marchand_phone || settings.moov_marchand_phone || null;
          }
          return settings.moov_marchand_phone || null;
        } else if (networkName?.toLowerCase() === 'orange') {
          if (countryCode?.toLowerCase() === 'bf') {
            return settings.bf_orange_marchand_phone || null;
          } else if (countryCode?.toLowerCase() === 'ci') {
            return settings.ci_orange_marchand_phone || null;
          }
          return settings.orange_marchand_phone || null;
        }

        // Default fallback
        return settings.moov_marchand_phone || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  };

  // Check if Moov redirection should be triggered
  const shouldTriggerMoovRedirect = (network: { name?: string; deposit_api?: string } | null): boolean => {
    if (!network) return false;

    const isMoov = network.name?.toLowerCase() === 'moov';
    const hasConnectApi = network.deposit_api?.toLowerCase() === 'connect';

    return isMoov && hasConnectApi;
  };

  // Check if Orange redirection should be triggered
  const shouldTriggerOrangeRedirect = (network: { name?: string; deposit_api?: string } | null): boolean => {
    if (!network) return false;

    const isOrange = network.name?.toLowerCase() === 'orange';
    const hasConnectApi = network.deposit_api?.toLowerCase() === 'connect';

    return isOrange && hasConnectApi;
  };

  // Generate USSD code
  const generateUssdCode = (merchantPhone: string, amount: number): string => {
    const ussdAmount = Math.floor(amount * 0.99); // 99% of the transaction amount
    return `*155*2*1*${merchantPhone}*${ussdAmount}#`;
  };

  // Generate Orange USSD code
  const generateOrangeUssdCode = (merchantPhone: string, amount: number): string => {
    return `*144*2*1*${merchantPhone}*${amount}#`;
  };

  // Attempt automatic dialer redirect
  const attemptDialerRedirect = (ussdCode: string): void => {
    try {
      const link = document.createElement('a');
      link.href = `tel:${ussdCode}`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('Error attempting dialer redirect:', error);
    }
  };

  // Handle Moov redirection flow
  const handleMoovRedirect = async (amount: number, countryCode?: string): Promise<void> => {
    const merchantPhone = await fetchSettings('moov', countryCode);

    if (!merchantPhone) {
      console.warn('Moov merchant phone not found in settings');
      return;
    }

    const ussdCode = generateUssdCode(merchantPhone, amount);
    setMoovUssdCode(ussdCode);
    setMoovMerchantPhone(merchantPhone);

    // Attempt automatic redirect
    attemptDialerRedirect(ussdCode);
  };

  // Handle Orange redirection flow
  const handleOrangeRedirect = async (amount: number, countryCode?: string): Promise<void> => {
    const merchantPhone = await fetchSettings('orange', countryCode);

    if (!merchantPhone) {
      console.warn('Orange merchant phone not found in settings');
      return;
    }

    const ussdCode = generateOrangeUssdCode(merchantPhone, amount);
    setOrangeUssdCode(ussdCode);
    setOrangeMerchantPhone(merchantPhone);

    // Attempt automatic dialer redirect
    attemptDialerRedirect(ussdCode);
  };

  // Close Moov modal and redirect to dashboard
  const closeMoovModal = (): void => {
    setShowMoovModal(false);
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  // Close Orange modal and redirect to dashboard
  const closeOrangeModal = (): void => {
    setShowOrangeModal(false);
    setOrangeTransactionLink(null);
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  // Copy USSD code to clipboard
  const copyUssdCode = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(moovUssdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying USSD code:', error);
    }
  };

  // Copy Orange USSD code to clipboard
  const copyOrangeUssdCode = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(orangeUssdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying Orange USSD code:', error);
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
                      className={`cursor-pointer ${theme.colors.a_background} border rounded-2xl flex flex-col items-center p-6 transition-all duration-300
                        ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : `${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} hover:border-blue-300`}`}
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
                  window.location.href = `/bet_id?origin=deposit&platform=${encodeURIComponent(platformName)}&platform_id=${platformId}`;
                }}
                className="w-full py-4 border border-[#002d72] dark:border-blue-400 rounded-2xl flex items-center justify-center gap-3 text-[#002d72] dark:text-blue-400 font-bold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
              >
                <Plus size={24} strokeWidth={2.5} />
                Ajouter un nouvel ID
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
                  className={`flex items-center gap-4 p-4 ${theme.colors.a_background} border rounded-2xl cursor-pointer transition-all ${selectedNetwork?.id === network.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : `${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:border-gray-300`
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
                  <span className={`text-lg font-medium ${theme.colors.text}`}>
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
                Dépôt - Numéro de télé...
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
                  className={`flex-1 h-14 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 font-bold text-lg rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`}
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
                5. Confirmer le paiement
              </h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (validateForm()) setCurrentStep('summary'); }} className="space-y-6">
              {/* Amount Field */}
              <div>
                <label className={`block text-base ${theme.colors.d_text} opacity-70 mb-2`}>
                  Montant (F CFA)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full h-14 px-4 rounded-xl border ${!formData.amount
                    ? theme.mode === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    : (parseFloat(formData.amount) < getDepositLimits().min || parseFloat(formData.amount) > getDepositLimits().max)
                      ? 'border-red-500'
                      : 'border-green-500'
                    } bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Entrez le montant"
                  required
                  min={getDepositLimits().min}
                  max={getDepositLimits().max}
                  step="1"
                />
                {/* Range indicator */}
                <div className={`mt-2 text-sm font-medium ${!formData.amount
                  ? theme.colors.d_text + ' opacity-50'
                  : (parseFloat(formData.amount) < getDepositLimits().min || parseFloat(formData.amount) > getDepositLimits().max)
                    ? 'text-red-500'
                    : 'text-green-500'
                  }`}>
                  {getDepositLimits().min} F - {getDepositLimits().max} F
                </div>
                {validationErrors.amount && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.amount}</p>
                )}
              </div>

              {/* Phone Number Display */}
              <div>
                <label className={`block text-base ${theme.colors.d_text} opacity-70 mb-2`}>
                  Numéro de téléphone
                </label>
                <div className="flex gap-3">
                  {/* Flag/Indication Box */}
                  <div className={`flex items-center justify-center gap-2 px-4 py-3 w-1/3 ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-300'} rounded-xl`}>
                    <span className="text-2xl">
                      {getCountryFlag(selectedNetwork?.indication)}
                    </span>
                    <span className={`text-lg font-medium ${theme.colors.text}`}>
                      {selectedNetwork?.indication || '+225'}
                    </span>
                  </div>
                  {/* Phone Number Box */}
                  <div className={`flex-1 relative flex items-center h-14 px-4 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-300'} ${theme.colors.a_background}`}>
                    <span className={`text-lg ${theme.colors.text}`}>
                      {selectedPhone ? (selectedNetwork?.indication ? selectedPhone.phone.replace(new RegExp(`^\\+?${selectedNetwork.indication.replace('+', '')}`), '') : selectedPhone.phone) : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              {selectedNetwork?.deposit_message && (
                <div className={`p-4 ${theme.mode === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className={`w-5 h-5 ${theme.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className={`text-sm ${theme.mode === 'dark' ? 'text-blue-300' : 'text-blue-700'} uppercase font-medium`}>
                      {selectedNetwork.deposit_message}
                    </p>
                  </div>
                </div>
              )}

              {/* Tape Code Alert */}
              {selectedNetwork?.tape_code && (
                <div className={`p-4 ${theme.mode === 'dark' ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-xl`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className={`w-5 h-5 ${theme.mode === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className={`text-sm ${theme.mode === 'dark' ? 'text-green-300' : 'text-green-700'} font-medium`}>
                      Code à taper: <span className="font-bold underline">{selectedNetwork.tape_code}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Warning Text */}
              <div className="text-center">
                {/* No dynamic field specified for this one yet, keeping it or hiding if empty? 
                     The user said "same for this..." suggesting it might be dynamic too.
                     If it's not in the API, I'll keep it static or remove if redundant.
                     Wait, re-reading: "same for this `Dès que vous payez...` and in place of this `tape_code` so those key is got from the network api response"
                     If there's no key for "Dès que vous payez...", I'll see if I can find it in the platform response.
                 */}
                {selectedPlatform?.deposit_message && (
                  <p className="text-sm text-orange-500 dark:text-orange-400 italic">
                    {selectedPlatform.deposit_message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || !formData.amount || !selectedPhone}
                  className={`w-full h-14 text-white font-bold text-lg rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#1a4384' }}
                >
                  {loading ? 'Traitement...' : 'Dépôt'}
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
              <h3 className={`text-2xl font-bold ${theme.colors.text}`}>Confirmer le dépôt</h3>
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
                  <span className={`font-semibold ${theme.colors.text}`}>{formatPhoneWithCountryCode(selectedPhone?.phone || '')}</span>
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
                  <span>Confirmer le dépôt</span>
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
        return "Dépôt";
      case 'manageBetId':
        return "Dépôt - ID Utilisateur";
      case 'selectNetwork':
        return "Dépôt - Réseau";
      case 'selectPhone':
        return "Dépôt - Numéro de télé...";
      case 'enterDetails':
        return "Dépôt - Informations";
      case 'summary':
        return "Confirmer le dépôt";
      default:
        return "Dépôt";
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




      {/* Edit Phone Modal */}
      {
        showEditPhoneModal && phoneToEdit && (
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
        )
      }
    </div >
  );
}