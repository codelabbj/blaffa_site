// pages/withdraw.js


'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
// import styles from '../styles/Withdraw.module.css';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '../../components/ThemeProvider';


interface Network {
  id: string;
  name: string;
  public_name?: string;
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

interface ErrorResponse {
  data?: {
    [key: string]: string[] | string | undefined;
    detail?: string;
    message?: string;
  };
  status?: number;
}

export default function Withdraw() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    id: '',
    withdrawalCode: '',
    number: '',
    confirmNumber: '',
    network: ''
  });

  const [networks, setNetworks] = useState<{ id: string; name: string; image?: string }[]>([]);
  const [apps, setApps] = useState<App[]>([]); // Use the full App interface here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const {theme} = useTheme();

  // State for saved app IDs and suggestions
  const [savedAppIds, setSavedAppIds] = useState<IdLink[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<IdLink[]>([]);
  // State to hold the selected saved IdLink for the withdrawal
  const [selectedSavedIdLink, setSelectedSavedIdLink] = useState<IdLink | null>(null);

  // Fetch networks, apps, and saved app IDs data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
      if (!token) {
        setError(t('You must be logged in to access this feature.'));
        return;
      }

      try {
        const networksResponse = await axios.get('https://api.yapson.net/yapson/network/', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the headers
          }
        });
        setNetworks(networksResponse.data);

        // Fetch available apps (needed to link saved IDs to app details)
        const appsResponse = await axios.get('https://api.yapson.net/yapson/app_name', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApps(appsResponse.data);

        // Fetch saved app IDs
        const savedIdsResponse = await axios.get('https://api.yapson.net/yapson/id_link', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Assuming the API returns an array of IdLink objects directly or within a 'results'/'data' field
        let processedData: IdLink[] = [];
        if (Array.isArray(savedIdsResponse.data)) {
          processedData = savedIdsResponse.data;
        } else if (savedIdsResponse.data && Array.isArray(savedIdsResponse.data.results)) {
          processedData = savedIdsResponse.data.results; // Handle paginated response
        } else if (savedIdsResponse.data && Array.isArray(savedIdsResponse.data.data)) {
          processedData = savedIdsResponse.data.data; // Handle other data structures
        } else if (savedIdsResponse.data && typeof savedIdsResponse.data === 'object') {
          // Handle case where a single object might be returned (less common for a list)
          // Ensure it conforms to IdLink structure or skip
          if (savedIdsResponse.data.id && savedIdsResponse.data.link && savedIdsResponse.data.app_name) {
            processedData = [savedIdsResponse.data as IdLink];
          }
        }
        console.log("Fetched Saved App IDs:", processedData); // Log fetched saved IDs
        setSavedAppIds(processedData);
      } catch (err: unknown) { // Use unknown for caught errors
        console.error(t('Error fetching data:'), err);
        if (err instanceof Error) { // Type guard
          setError(err.message || t('Failed to load necessary data. Please try again later.'));
        } else {
          setError(t('Failed to load necessary data. Please try again later.'));
        }
      }
    };

    fetchData();
  }, [t]);

  // Filter suggestions based on input value
  useEffect(() => {
    if (formData.id) {
      const filtered = savedAppIds.filter(item =>
        item.link.toLowerCase().includes(formData.id.toLowerCase()) ||
        item.app_name?.name?.toLowerCase().includes(formData.id.toLowerCase()) ||
        item.app_name?.public_name?.toLowerCase().includes(formData.id.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(savedAppIds); // Show all saved IDs when input is empty
    }
  }, [formData.id, savedAppIds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear selectedSavedIdLink when the user types in the ID field
    if (name === 'id') {
      setSelectedSavedIdLink(null);
    }
  };

  // Handler for selecting a suggestion
  const handleSelectSuggestion = (item: IdLink) => {
    setFormData(prev => ({ ...prev, id: item.link })); // Set the input value to the saved link
    setSelectedSavedIdLink(item); // Store the selected IdLink object
    setShowSuggestions(false); // Hide suggestions
  };

  const handleNetworkSelect = (networkName: string) => {
    setFormData(prevState => ({
      ...prevState,
      network: networkName
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTransactionTypeIcon = (type: string) => {
    if (type === "deposit") {
      return <span className="text-red-700">↓</span>;
    } else {
      return <span className="text-orange-700">↑</span>;
    }
  };

  const closeTransactionDetails = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const showTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction({ transaction });
    setIsModalOpen(true);
  };

  const extractErrorMessage = (error: AxiosError<ErrorResponse>): string => {
    // If the error response has data with field-specific errors
    if (error.response && error.response.data) {
      const data = error.response.data as unknown as Record<string, unknown>;
      
      // Check if the error is in the format { "amount": ["Minimum deposit is 200.00 F CFA"] }
      for (const field in data) {
        if (Array.isArray(data[field]) && data[field].length > 0) {
          return data[field][0] as string; // Cast to string
        }
      }
      
      // Check if there's a general error message
      if ('detail' in data && typeof data.detail === 'string') {
        return data.detail;
      }
      
      // Check if there's a general error message as string
      if (typeof data === 'string') {
        return data;
      }
      
      // Handle the case when there's a message about waiting between transactions
      if ('message' in data && typeof data.message === 'string') {
        return data.message;
      }
    }
    
    // Default error message
    return t('An error occurred. Please try again later.');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
    if (!token) {
      setError(t('You must be logged in to access this feature.'));
      window.location.href = '/';
      setLoading(false);
      return;
    }

    if (!formData.network) {
      setError(t('Please select a network'));
      setLoading(false);
      return;
    }

    if (!formData.id) {
      setError(t('Please enter or select a Bet ID'));
      setLoading(false);
      return;
    }

    // Validate phone numbers match
    if (formData.number !== formData.confirmNumber) {
      setError(t('Phone numbers do not match'));
      setLoading(false);
      return;
    }

    try {
      // Find the selected network's ID
      const selectedNetwork = networks.find(net =>
        net.name.toLowerCase() === formData.network.toLowerCase()
      ) as { id: string; name: string } | undefined;

      if (!selectedNetwork) {
        throw new Error(t('Please select a network'));
      }

      // Determine app_id and user_app_id based on whether a saved ID was selected
      let appIdToSend: string;
      let userAppIdToSend: string = formData.id;

      if (selectedSavedIdLink) {
        // If a saved ID was selected from suggestions
        appIdToSend = selectedSavedIdLink.app_name.id;
        userAppIdToSend = selectedSavedIdLink.link;
        console.log("Using selected saved ID:", selectedSavedIdLink); // Log selected saved ID
      } else {
        // If the user typed an ID that wasn't selected from suggestions
        // Try to find if the typed ID matches any saved ID's link
        const matchedSavedId = savedAppIds.find(item => item.link === formData.id);

        if (matchedSavedId) {
          // If the typed ID matches a saved ID, use that app's info
          appIdToSend = matchedSavedId.app_name.id;
          userAppIdToSend = matchedSavedId.link; // Use the typed ID (which matches the saved link)
          console.log("Typed ID matches saved ID, using app:", matchedSavedId.app_name);
        } else {
          // If the user typed an ID that wasn't selected from suggestions
          // We need a way to determine the app_id for this manually entered ID.
          // Currently, there's no UI element to select the app for a new ID.
          // For now, we'll default to 1xbet as in the original code
          console.log("Typed ID does not match saved ID, trying to find 1xbet app in:", apps); // Log apps before finding 1xbet
          const xbetAppInfo = apps.find(app =>
            app.name.toLowerCase() === '1xbet'
          );
          console.log("Found 1xbet app info:", xbetAppInfo); // Log result of finding 1xbet

          if (!xbetAppInfo) {
            setError(t('Application information not available for the default app.'));
            setLoading(false);
            return;
          }
          appIdToSend = xbetAppInfo.id;
          userAppIdToSend = formData.id; // Use the manually entered ID
        }
      }

      // Prepare the payload
      const payload = {
        type_trans: "withdrawal",
        network_id: selectedNetwork.id,
        phone_number: parseInt(formData.number),
        indication: "+229", // Country code as provided in example
        app_id: appIdToSend, // Use the determined app ID
        user_app_id: userAppIdToSend, // Use the determined user app ID
        withdriwal_code: formData.withdrawalCode // Note the typo 'withdriwal_code' which matches the original API
      };

      console.log("Sending withdrawal payload:", payload); // Log the payload

      // Send the withdrawal request
      const response = await axios.post('https://api.yapson.net/yapson/transaction', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Withdrawal response:", response.data); // Log the response

      setSuccess(t('Withdrawal request submitted successfully! Transaction ID:') + ' ' + (response.data.transaction_id || response.data.id || ''));
      
      // Show transaction details
      if (response.data) {
        // If the response contains transaction details directly
        if (response.data.transaction_id) {
          // Fetch the full transaction details
          const transactionResponse = await axios.get(`https://api.yapson.net/yapson/transaction/${response.data.transaction_id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Add user_app_id to the fetched transaction data
          const transactionDataWithId = {
            ...transactionResponse.data,
            user_app_id: userAppIdToSend // Add the ID from the form/selected saved ID
          };
          showTransactionDetails(transactionDataWithId);
        } else {
          // If the response is the transaction itself, add user_app_id to it
          const transactionDataWithId = {
            ...response.data,
            user_app_id: userAppIdToSend // Add the ID from the form/selected saved ID
          };
          showTransactionDetails(transactionDataWithId);
        }
      }
      
      // Reset form
      setFormData({
        id: '',
        withdrawalCode: '',
        number: '',
        confirmNumber: '',
        network: ''
      });
      setSelectedSavedIdLink(null); // Clear selected saved ID
      
    } catch (err: unknown) {
      console.error(t('Error processing withdrawal:'), err);
      
      // Extract the specific error message from the response
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = extractErrorMessage(axiosError);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Network images
  const networkImages = {
    MTN: 'https://firebasestorage.googleapis.com/v0/b/groupchat-d6de7.appspot.com/o/MTN-Mobile-Money-Senegal-Logo-1-550x298.webp?alt=media&token=6c70d498-35e3-4054-a2fd-e42a3138f3fb',
    MOOV: 'https://firebasestorage.googleapis.com/v0/b/groupchat-d6de7.appspot.com/o/Moov_Africa_logo.png?alt=media&token=281df10d-fe29-4eeb-83ef-bcb1f3ee2121'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.c_background}`}>
      <DashboardHeader/>
      <Head>
        <title>{t('Withdraw')}</title>
        <meta name="description" content={t('Withdraw from your account')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
  
      <main className={`container bg-gradient-to-br ${theme.colors.background} mx-auto px-4 py-12 max-w-4xl`}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
          <h1 className={`text-4xl font-bold ${theme.colors.text} mb-3 relative`}>
            {t('Withdraw')}
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-6">
            {t('Withdraw funds from your account here')}
          </p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-800 bg-white dark:bg-gray-800 dark:text-orange-400 dark:hover:text-orange-300 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('Back')}
          </button>
        </div>
  
        {/* Main Card */}
        <div className={`bg-gradient-to-br ${theme.colors.a_background} rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl`}>

          {/* Important notice banner */}
          <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 dark:border-amber-400 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  <span className="font-bold">{t('IMPORTANT')}</span> - {t('Your account currency must be in XOF.')}
                </p>
              </div>
            </div>
          </div>
  
          {/* Alerts */}
          {error && (
            <div className="mx-6 mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-fade-in">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
  
          {success && (
            <div className="mx-6 mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md animate-fade-in">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p>{success}</p>
              </div>
            </div>
          )}
  
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* ID Field with suggestions */}
              <div className="group">
                <label className="block text-sm font-medium mb-1" htmlFor="id">
                  {t('Betting App ID')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder={t('Enter or select your betting app ID')}
                    value={formData.id}
                    onChange={handleChange}
                    onFocus={() => setShowSuggestions(true)}
                    // Add onBlur to hide suggestions after a short delay to allow click
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300`}
                    required
                  />

                  {/* Suggestions dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Saved IDs')}</span>
                      </div>
                      {filteredSuggestions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectSuggestion(item)}
                          className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                        >
                          <span className="font-medium text-gray-800 dark:text-white">
                            {item.app_name?.public_name || item.app_name?.name || t('Unknown App')}
                            <span className="ml-2 text-gray-600 dark:text-gray-400 font-normal">
                              - {item.link}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Display selected app name if a saved ID is chosen */}
                {selectedSavedIdLink && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    {t('Selected App')}: {selectedSavedIdLink.app_name?.public_name || selectedSavedIdLink.app_name?.name || 'Unknown App'}
                  </p>
                )}
                {!selectedSavedIdLink && formData.id && (
                  <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                    {t('You are entering a new ID. Defaulting to 1xbet app.')} {/* Inform user about default */}
                  </p>
                )}
                {!selectedSavedIdLink && !formData.id && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('Enter your betting app ID or select from saved IDs.')}
                  </p>
                )}
              </div>
  
              {/* Withdrawal Code Field */}
              <div className="group">
                <label className="block text-sm font-medium mb-1" htmlFor="withdrawalCode">
                  {t('Withdrawal Code')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="withdrawalCode"
                    name="withdrawalCode"
                    placeholder={t('Enter your withdrawal code')}
                    value={formData.withdrawalCode}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme.colors.background} transition-all duration-300`}
                    required
                  />
                </div>
                <small className="mt-1 text-sm ">
                  {t('Code provided by 1xbet for withdrawal')}
                </small>
              </div>
  
              {/* Number Field */}
              <div className="group">
                <label className="block mb-1" htmlFor="number">
                  {t('Number')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    placeholder={t('Enter your mobile money number')}
                    pattern="^\+?\d{10,15}$"
                    value={formData.number}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${theme.colors.background} transition-all duration-300`}
                    required
                  />
                </div>
                <small className="mt-1 text-sm ">
                  {t('Your mobile money number')}
                </small>
              </div>
  
              {/* Confirm Number Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirmNumber">
                  {t('Confirm Number')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="confirmNumber"
                    name="confirmNumber"
                    placeholder={t('Confirm your mobile money number')}
                    pattern="^\+?\d{10,15}$"
                    value={formData.confirmNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    required
                  />
                </div>
                <small className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('Re-enter your mobile money number')}
                </small>
              </div>
  
              {/* Network Selection */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('Network')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                      formData.network === 'MTN'
                        ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-500 shadow-md'
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                    onClick={() => handleNetworkSelect('MTN')}
                  >
                    <div className="w-12 h-12 mr-3 flex items-center justify-center rounded-lg bg-white shadow-sm p-2">
                      <img
                        src={networkImages.MTN}
                        alt="MTN Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">MTN</span>
                    {formData.network === 'MTN' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
  
                  <div
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                      formData.network === 'MOOV'
                        ? 'bg-orange-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500 shadow-md'
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                    onClick={() => handleNetworkSelect('MOOV')}
                  >
                    <div className="w-12 h-12 mr-3 flex items-center justify-center rounded-lg bg-white shadow-sm p-2">
                      <img
                        src={networkImages.MOOV}
                        alt="MOOV Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">MOOV</span>
                    {formData.network === 'MOOV' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                {!formData.network && (
                  <small className="block mt-2 text-sm text-red-500">{t('Please select a network')}</small>
                )}
              </div>
  
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('Processing...')}
                  </>
                ) : (
                  <>
                    {t('Submit my request')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
  
      {/* Transaction Details Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeTransactionDetails}
          ></div>
  
          {/* Modal content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md z-10 overflow-hidden shadow-2xl transform transition-all duration-300 animate-scale-in">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-orange-600 to-orange-600 p-6 text-white">
              <button
                onClick={closeTransactionDetails}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
  
              <div className="flex flex-col items-center">
                {selectedTransaction.transaction.app && (
                  <div className="w-16 h-16 mb-4 rounded-full overflow-hidden bg-white flex items-center justify-center p-2 shadow-lg">
                    <img
                      src={selectedTransaction.transaction.app.image}
                      alt={selectedTransaction.transaction.app.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
  
                <div
                  className={`rounded-full p-3 mb-3 ${
                    selectedTransaction.transaction.type_trans === "deposit"
                      ? "bg-red-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {getTransactionTypeIcon(
                    selectedTransaction.transaction.type_trans
                  )}
                </div>
  
                {selectedTransaction.transaction.amount && (
                  <h3 className="text-2xl font-bold mb-1">
                    XOF {selectedTransaction.transaction.amount}
                  </h3>
                )}
  
                <div
                  className={`mt-1 px-4 py-1 rounded-full text-sm font-medium ${
                    selectedTransaction.transaction.status === "failed" ||
                    selectedTransaction.transaction.status === "error"
                      ? "bg-red-100 text-red-800"
                      : selectedTransaction.transaction.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {formatStatus(selectedTransaction.transaction.status)}
                </div>
  
                <p className="mt-3 text-sm text-white/90">
                  {selectedTransaction.transaction.type_trans === "deposit"
                    ? t("Deposit")
                    : t("Withdrawal")}
                  {selectedTransaction.transaction.app &&
                    ` - ${selectedTransaction.transaction.app.public_name || selectedTransaction.transaction.app.name}`}
                </p>
  
                <p className="text-sm text-white/70 mt-1">
                  {formatDate(selectedTransaction.transaction.created_at)}
                </p>
              </div>
            </div>
  
            {/* Transaction details */}
            <div className="p-6 text-gray-800 dark:text-white">
              <h4 className="text-lg font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t("Transaction details")}
              </h4>
  
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                {selectedTransaction.transaction.network && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-500 dark:text-gray-400">{t("Payment Method")}</span>
                    <div className="flex items-center">
                      {selectedTransaction.transaction.network.image && (
                        <img
                          src={selectedTransaction.transaction.network.image}
                          alt={selectedTransaction.transaction.network.name}
                          className="w-6 h-6 mr-2 object-contain"
                        />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedTransaction.transaction.network.public_name || selectedTransaction.transaction.network.name}
                      </span>
                    </div>
                  </div>
                )}
  
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">{t("Status")}</span>
                  <span
                    className={`font-medium px-3 py-1 rounded-full text-sm ${getStatusClass(
                      selectedTransaction.transaction.status
                    )}`}
                  >
                    {formatStatus(selectedTransaction.transaction.status)}
                  </span>
                </div>
  
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">{t("Reference")}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.transaction.reference}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          selectedTransaction.transaction.reference
                        )
                      }
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      title={t("Copy")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
  
                {selectedTransaction.transaction.phone_number && (
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-500 dark:text-gray-400">{t("Phone Number")}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.transaction.phone_number}
                    </span>
                  </div>
                )}
  
                {selectedTransaction.transaction.user_app_id && (
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-500 dark:text-gray-400">{t("User App ID")}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.transaction.user_app_id}
                    </span>
                  </div>
                )}
  
                {selectedTransaction.transaction.withdriwal_code && (
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-500 dark:text-gray-400">{t("Withdrawal Code")}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.transaction.withdriwal_code}
                    </span>
                  </div>
                )}
  
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">{t("Transaction Date")}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedTransaction.transaction.created_at)}
                  </span>
                </div>
  
                {selectedTransaction.transaction.error_message && (
                  <div className="flex justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                    <span className="text-red-500">{t("Error Message")}</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {selectedTransaction.transaction.error_message}
                    </span>
                  </div>
                )}
              </div>
            </div>
  
            {/* Footer with action buttons */}
            <div className="p-4 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={closeTransactionDetails}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium text-gray-700 dark:text-white"
              >
                {t("Close")}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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