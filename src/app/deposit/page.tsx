'use client';
import React, { useState, useEffect } from 'react';
//import Head from 'next/head';
//import axios from 'axios';
import { useTranslation } from 'react-i18next';
//import styles from '../styles/Deposits.module.css';
//import { ClipboardIcon } from 'lucide-react'; // Make sure to install this package
//import { Transaction } from 'mongodb';
//import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';
import { useWebSocket } from '../../context/WebSocketContext';
import {  Check, CheckCircle, Smartphone, XCircle, Copy } from 'lucide-react';
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
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'selectId' | 'selectNetwork' | 'selectPhone' | 'manageBetId' | 'enterDetails'>('selectId');
  const [selectedPlatform, setSelectedPlatform] = useState<App | null>(null);
  const [platforms, setPlatforms] = useState<App[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<{ id: string; name: string; public_name?: string; country_code?: string; indication?: string; placeholder?: string; image?: string, otp_required?: boolean, tape_code?: string, deposit_api?: string, deposit_message?: string } | null>(null);
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
  
  const [networks, setNetworks] = useState<{ id: string; name: string; public_name?: string; indication?: string; placeholder?: string; image?: string, otp_required?: boolean, tape_code?: string, deposit_api?: string }[]>([]);
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
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
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
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await api.get('/blaffa/app_name?operation_type=deposit', {
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
          api.get('/blaffa/network/?type=deposit', {
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

  const handleNetworkSelect = async (network: { id: string; name: string; public_name?: string; country_code?: string; indication?: string; placeholder?: string; image?: string, otp_required?: boolean, tape_code?: string, deposit_api?: string }) => {
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
    setCurrentStep('manageBetId');
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

  // Get network-specific minimum amount
  const getNetworkMinAmount = (): number => {
    if (selectedNetwork?.name?.toLowerCase() === 'moov') {
      return 505; // Moov minimum is 505 FCFA
    } else if (selectedNetwork?.name?.toLowerCase() === 'orange') {
      return 100; // Orange minimum is 100 FCFA
    } else {
      // Use platform-level minimum for other networks
      return selectedPlatform?.minimum_deposit || parseFloat(selectedPlatform?.minimun_deposit || '100');
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
        source:'web',
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
        await handleOrangeRedirect(amount, countryCode);
      } else {
        setIsModalOpen(true);
      }
      
      setSuccess('Transaction initiée avec succès !');
      // Reset form
      setCurrentStep('selectId');
      setSelectedPlatform(null);
      setSelectedNetwork(null);
      setFormData({ amount: '', phoneNumber: '', betid: '', otp_code: '' });
      setValidationErrors({ amount: '', phoneNumber: '', otp_code: '' });
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

    // Always show modal as fallback
    setShowMoovModal(true);
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

    // Always show modal as fallback
    setShowOrangeModal(true);
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
      <div className="text-center mb-8">
        {/* <h2 className="text-2xl font-bold mb-2">{t("Step 1: Select Your Betting Platform")}</h2> */}
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
                {/* {platform.city && (
                  <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">{platform.city}</div>
                )} */}
              </div>
            );
          })}
        </div>
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
            setError(t('Erreur lors de la suppression de l\'ID de pari.'));
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
                      className={`flex items-center justify-between rounded-lg px-4 py-2 cursor-pointer ${theme.colors.hover} transition`}
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

      case 'enterDetails':
        return (
      <div className="space-y-6">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => {
              setSelectedNetwork(null);
              setCurrentStep('manageBetId');
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
    
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("ID de pari")}</label>
          <div className="font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded px-3 py-2">
            {selectedBetId}
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t("Montant")} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${
              validationErrors.amount 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder={`Saisissez le montant à déposer (${getNetworkMinAmount()} - ${selectedPlatform?.maximum_deposit || selectedPlatform?.max_deposit || 1000000} FCFA)`}
            required
            min={getNetworkMinAmount()}
            max={selectedPlatform?.maximum_deposit || selectedPlatform?.max_deposit || 1000000}
            step="0.01"
          />
          {validationErrors.amount && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.amount}</p>
          )}
          {/* Min/Max deposit info */}
          {selectedPlatform && (
            <div className="mt-2 text-xs flex flex-wrap gap-2 items-center">
              <span className={
                formData.amount && Number(formData.amount) < getNetworkMinAmount()
                  ? 'text-red-500 font-semibold'
                  : 'text-gray-500'
              }>
                {t('Minimum deposit')}: {getNetworkMinAmount()} FCFA
              </span>
              <span className="mx-2">|</span>
              <span className={
                formData.amount && Number(formData.amount) > Number(selectedPlatform.maximum_deposit || selectedPlatform.max_deposit || 1000000)
                  ? 'text-red-500 font-semibold'
                  : 'text-gray-500'
              }>
                {t('Maximum deposit')}: {selectedPlatform.maximum_deposit || selectedPlatform.max_deposit || 1000000} FCFA
              </span>
            </div>
          )}
        </div>

        {selectedNetwork?.otp_required && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("Code OTP")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="otp_code"
              value={formData.otp_code}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${
                validationErrors.otp_code 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Saisissez le code OTP"
              required={selectedNetwork?.otp_required}
            />
            {validationErrors.otp_code && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.otp_code}</p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedNetwork?.tape_code || t("Veuillez composer *133# puis l'option 1 pour valider le paiement")}
            </p>
          </div>
        )}
  
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

        {/* Display deposit message from selected network */}
        {selectedNetwork?.deposit_message && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                {selectedNetwork.deposit_message}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep('selectPhone')}
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
        return t("");
      case 'selectNetwork':
        return t("");
      case 'selectPhone':
        return t("");
      case 'enterDetails':
        return t("");
      case 'manageBetId':
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
          {/* <div>
            <h1 className="text-3xl font-bold  mb-2">{t("Deposit Funds")}</h1>
            <p className="text-slate-400">Rechargez votre compte en quelques étapes simples</p>
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

                {/* Add this block for the transaction link button */}
                {transactionLink && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => window.open(transactionLink, '_blank', 'noopener,noreferrer')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      {t("Click to continue payment")}
                    </button>
                  </div>
                )}

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

      {/* Moov USSD Modal */}
      {showMoovModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className={`${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Code USSD Moov</h3>
                <button 
                  onClick={() => setShowMoovModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Veuillez copier et coller ce code dans votre application téléphone pour compléter le paiement.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Numéro du marchand
                  </label>
                  <div className="font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded px-3 py-2">
                    {moovMerchantPhone}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Code USSD
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={moovUssdCode}
                      className="flex-1 p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 font-mono text-sm"
                    />
                    <button
                      onClick={copyUssdCode}
                      className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                        copied
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Copy size={16} />
                      {copied ? 'Copié!' : 'Copier'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeMoovModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orange USSD Modal */}
      {showOrangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className={`${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Paiement Orange</h3>
                <button
                  onClick={() => setShowOrangeModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {orangeTransactionLink ? (
                  // Show transaction link button
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cliquez sur le bouton ci-dessous pour continuer votre paiement.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => window.open(orangeTransactionLink, '_blank', 'noopener,noreferrer')}
                        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        Continuer le paiement
                      </button>
                    </div>
                  </>
                ) : (
                  // Show USSD code
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Veuillez copier et coller ce code dans votre application téléphone pour compléter le paiement.
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Numéro du marchand
                      </label>
                      <div className="font-mono text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900 rounded px-3 py-2">
                        {orangeMerchantPhone}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Code USSD
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={orangeUssdCode}
                          className="flex-1 p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 font-mono text-sm"
                        />
                        <button
                          onClick={copyOrangeUssdCode}
                          className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                            copied
                              ? 'bg-green-600 text-white'
                              : 'bg-orange-600 text-white hover:bg-orange-700'
                          }`}
                        >
                          <Copy size={16} />
                          {copied ? 'Copié!' : 'Copier'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeOrangeModal}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    placeholder={selectedNetwork?.placeholder || "Entrez votre numéro"}
                    maxLength={10}
                  />
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