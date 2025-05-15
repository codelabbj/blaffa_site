import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ClipboardIcon } from '@heroicons/react/24/outline'; 
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function Deposits() {
  const [formData, setFormData] = useState({
    id: '',
    amount: '',
    number: '',
    network: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Translation function (replace with your actual i18n setup)
  const t = (text) => text;

  // Network images
  const networkImages = {
    MTN: '/images/mtn-logo.png', // Update with actual path
    MOOV: '/images/moov-logo.png' // Update with actual path
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNetworkSelect = (network) => {
    setFormData(prev => ({ ...prev, network }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Your deposit request has been submitted successfully!');
      setFormData({
        id: '',
        amount: '',
        number: '',
        network: ''
      });
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeTransactionDetails = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const getTransactionTypeIcon = (type) => {
    return type === "deposit" ? "💰" : "↗️"; // Simple emojis for demonstration
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'failed':
      case 'error':
        return 'text-red-600';
      case 'pending':
        return 'text-amber-600';
      case 'success':
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <Head>
        <title>{t('Deposits')}</title>
        <meta name="description" content={t('Make deposits to your account')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {t('Deposits')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {t('Make your deposits to your account here')}
            </p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('Back')}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
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

          {/* Error and success alerts */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mt-4 mx-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 mt-4 mx-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form container */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* ID field */}
                <div>
                  <label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('ID')}
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
                      placeholder={t('Enter your ID')}
                      value={formData.id}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('This is your 1xbet user ID')}</p>
                </div>

                {/* Amount field */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('Amount')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">XOF</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      placeholder={t('Enter deposit amount')}
                      value={formData.amount}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Number field */}
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('Number')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('Your mobile money number')}</p>
                </div>

                {/* Network selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('Network')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`flex items-center border ${
                        formData.network === 'MTN'
                          ? 'bg-amber-50 border-amber-500 dark:bg-amber-900/30 dark:border-amber-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg p-4 cursor-pointer transition-all hover:shadow-md`}
                      onClick={() => handleNetworkSelect('MTN')}
                    >
                      <div className="w-10 h-10 flex-shrink-0 mr-4 bg-white rounded-full flex items-center justify-center p-1 shadow-sm">
                        <img 
                          src={networkImages.MTN}
                          alt="MTN Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-medium">MTN</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">Mobile Money</span>
                      </div>
                      {formData.network === 'MTN' && (
                        <div className="ml-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center border ${
                        formData.network === 'MOOV'
                          ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg p-4 cursor-pointer transition-all hover:shadow-md`}
                      onClick={() => handleNetworkSelect('MOOV')}
                    >
                      <div className="w-10 h-10 flex-shrink-0 mr-4 bg-white rounded-full flex items-center justify-center p-1 shadow-sm">
                        <img 
                          src={networkImages.MOOV}
                          alt="MOOV Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-medium">MOOV</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">Mobile Money</span>
                      </div>
                      {formData.network === 'MOOV' && (
                        <div className="ml-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  {!formData.network && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{t('Please select a network')}</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? t('Processing...') : t('Proceed')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Transaction Details Modal - Modern redesign */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeTransactionDetails}
          ></div>

          {/* Modal content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md z-10 overflow-hidden shadow-2xl transform transition-all">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6">
              <button
                onClick={closeTransactionDetails}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center">
                {selectedTransaction.transaction.app && (
                  <div className="w-16 h-16 mb-4 rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center p-2">
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
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {getTransactionTypeIcon(
                    selectedTransaction.transaction.type_trans
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  XOF {selectedTransaction.transaction.amount.toLocaleString()}
                </h3>

                <div
                  className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTransaction.transaction.status === "failed" ||
                    selectedTransaction.transaction.status === "error"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      : selectedTransaction.transaction.status === "pending"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }`}
                >
                  {formatStatus(selectedTransaction.transaction.status)}
                </div>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {selectedTransaction.transaction.type_trans === "deposit"
                    ? t("Deposit")
                    : t("Withdrawal")}
                  {selectedTransaction.transaction.app &&
                    ` - ${selectedTransaction.transaction.app.public_name || selectedTransaction.transaction.app.name}`}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(selectedTransaction.transaction.created_at)}
                </p>
              </div>
            </div>

            {/* Transaction details */}
            <div className="p-6 text-gray-800 dark:text-gray-200">
              <h4 className="text-lg font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                {t("Transaction details")}
              </h4>

              <div className="space-y-4">
                {selectedTransaction.transaction.network && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">{t("Payment Method")}</span>
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                      <img
                        src={selectedTransaction.transaction.network.image}
                        alt={selectedTransaction.transaction.network.name}
                        className="w-6 h-6 mr-2 object-contain"
                      />
                      <span className="font-medium">
                        {selectedTransaction.transaction.network.public_name || selectedTransaction.transaction.network.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">{t("Status")}</span>
                  <span
                    className={`font-medium px-3 py-1 rounded-lg ${
                      selectedTransaction.transaction.status === "failed" ||
                      selectedTransaction.transaction.status === "error"
                        ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                        : selectedTransaction.transaction.status === "pending"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                        : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    }`}
                  >
                    {formatStatus(selectedTransaction.transaction.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">{t("Reference")}</span>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    <span className="font-medium mr-2">
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
                      <ClipboardIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {selectedTransaction.transaction.phone_number && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">{t("Phone Number")}</span>
                    <span className="font-medium bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                      {selectedTransaction.transaction.phone_number}
                    </span>
                  </div>
                )}

                {selectedTransaction.transaction.user_app_id && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">{t("User App ID")}</span>
                    <span className="font-medium bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                      {selectedTransaction.transaction.user_app_id}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">{t("Transaction Date")}</span>
                  <span className="font-medium bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    {formatDate(selectedTransaction.transaction.created_at)}
                  </span>
                </div>

                {selectedTransaction.transaction.error_message && (
                  <div className="flex flex-col space-y-2 mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{t("Error Message")}</span>
                    <span className="text-red-600 dark:text-red-300 text-sm">
                      {selectedTransaction.transaction.error_message}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with action buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={closeTransactionDetails}
                className="px-4 py-2 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all"
              >
                {t("Close")}
              </button>
              {selectedTransaction.transaction.status === "pending" && (
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-sm transition-all"
                >
                  {t("Check Status")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent transactions section - This could be added if needed */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('Recent Deposits')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('View your recent deposit transactions')}</p>
        </div>
        
        <div className="p-6">
          {/* Sample transactions - This would be populated from API data */}
          <div className="space-y-4">
            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-8 text-center">
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
      </div>

      {/* FAQ Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
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
      </div>

      {/* Support Section */}
      <div className="mt-8 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
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
      </div>
    </div>
  );
}