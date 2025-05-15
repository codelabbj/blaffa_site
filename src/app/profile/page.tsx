
'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
//import styles from '../styles/Profile.module.css';
import { Eye, EyeOff } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';


const BASE_URL = 'https://api.yapson.net';


export default function Profile() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+229',
    phoneNumber: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { theme } = useTheme();



  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error(t('No access token found.'));
        alert(t('You must be logged in to access this page.'));
        window.location.href = '/';
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('Failed to fetch user data'));
        }

        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          phoneNumber: data.phone_number || '',
        }));
      } catch (error) {
        console.error(t('Error fetching user profile:'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateDetails = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setNotification({ type: 'error', message: t('You must be logged in to update your details.') });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('Failed to update details'));
      }

      setNotification({ type: 'success', message: t('Details updated successfully!') });
    } catch (error:  unknown) {
      if (error instanceof Error) {
        setNotification({ type: 'error', message: error.message || 'An unexpected error occurred.' });
      } else {
        setNotification({ type: 'error', message: 'An unexpected error occurred.' });
      }
    }
  };

  const handleResetPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setNotification({ type: 'error', message: t('You must be logged in to change your password.') });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({ type: 'error', message: t('New password and confirm password do not match.') });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/change_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: formData.oldPassword,
          new_password: formData.newPassword,
          confirm_new_password: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('Failed to change password'));
      }

      setNotification({ type: 'success', message: t('Password changed successfully!') });
      setFormData((prev) => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: unknown) {
      console.error('Error changing password:', error);
      if (error instanceof Error) {
        setNotification({ type: 'error', message: error.message || 'An unexpected error occurred.' });
      } else {
        setNotification({ type: 'error', message: 'An unexpected error occurred.' });
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== formData.email) {
      setNotification({ type: 'error', message: t('Please type your email correctly to confirm deletion') });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setNotification({ type: 'error', message: t('You must be logged in to delete your account.') });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/delete_account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('Failed to delete account'));
      }

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Show success notification briefly before redirecting
      setNotification({ type: 'success', message: t('Account deleted successfully!') });
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        setNotification({ type: 'error', message: error.message || t('An unexpected error occurred.') });
      } else {
        setNotification({ type: 'error', message: t('An unexpected error occurred.') });
      }
      setShowDeleteConfirmation(false);
    }
  };

  // Add this function at the top level of your component, after your existing state declarations
  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to home page
    window.location.href = '/';
  };

  if (loading) return <p className="p-6 text-center">{t('Loading profile...')}</p>;

  if (showDeleteConfirmation) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.c_background} `}>
        
        <Head>
          <title>{t('Delete Account')}</title>
          <meta name="description" content={t('Delete account confirmation')} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
  
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className={`w-full max-w-lg p-8 bg-gradient-to-br ${theme.colors.a_background} border-l-4 border-red-500 rounded-lg shadow-xl animate-fade-in`}>
            <div className="flex flex-col items-center mb-8">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-center">
                {t('Delete Account Permanently')}
              </h1>
              <div className="h-1 w-16 bg-red-500 mt-4 rounded-full"></div>
            </div>
  
            {notification && (
              <div
                className={`p-4 mb-6 rounded-lg shadow-sm ${
                  notification.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}
              >
                <div className="flex items-center">
                  {notification.type === 'success' ? (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.message}
                </div>
              </div>
            )}
  
            <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg mb-8 border border-red-200 dark:border-red-800">
              <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('Warning')}:
              </h2>
              <ul className="space-y-2 text-red-700 dark:text-red-400">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('This action cannot be undone.')}
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('All your personal data will be permanently deleted.')}
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('You will lose access to all your transactions and account history.')}
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  
                </li>
              </ul>
            </div>
  
            <div className="mb-8">
              <label className="block  font-medium mb-3">
                {t('Type your email to confirm deletion')}:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-800 dark:text-white"
                  placeholder={formData.email}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {deleteConfirmText === formData.email ? (
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm ">
                {t('Please type')} <span className="font-semibold">{formData.email}</span> {t('to confirm')}
              </p>
            </div>
  
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex-1 flex justify-center items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                {t('Cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                className={`${
                  deleteConfirmText !== formData.email
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex-1 flex justify-center items-center`}
                disabled={deleteConfirmText !== formData.email}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('Delete My Account')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.c_background} ${theme.colors.text}`}>
      <DashboardHeader/>
      <Head>
        <title>{t("Profile")}</title>
        <meta name="description" content={t("User profile page")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
  
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold ">{t("Profile")}</h1>
            <p className="">
              {t("Edit your personal information here")}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("Back")}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center text-sm font-medium text-orange-600 hover:text-white bg-white hover:bg-orange-600 dark:bg-gray-700 dark:hover:bg-red-600 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 border border-red-600"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          {t("Logout")}
        </button>
  
        {notification && (
          <div
            className={`p-4 mb-6 rounded-lg shadow-sm ${
              notification.type === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-l-4 border-green-500"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {notification.message}
            </div>
          </div>
        )}
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2">
            <div className={`bg-gradient-to-br ${theme.colors.a_background} rounded-xl shadow-sm p-6 mb-81`}>
              <div className="flex items-center mb-6">
                <div className={`p-3 bg-gradient-to-br ${theme.colors.a_background} rounded-full mr-4`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">{t("Personal Information")}</h2>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    {t("First Name")}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>
  
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    {t("Last Name")}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>
  
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t("E-mail")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
  
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                    {t("Mobile Number")}
                  </label>
                  <div className="flex">
                    <div className="w-1/4 mr-2">
                      <input
                        type="text"
                        id="phoneCode"
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleChange}
                        className="w-full p-3  border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 "
                        placeholder="+1"
                      />
                    </div>
                    <div className="w-3/4">
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 "
                      />
                    </div>
                  </div>
                </div>
              </div>
  
              <button 
                onClick={handleUpdateDetails} 
                className="mt-8 inline-flex items-center px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {t("Update Details")}
              </button>
            </div>
  
            {/* Password Section */}
            <div className={`bg-gradient-to-br ${theme.colors.a_background} rounded-xl shadow-sm p-6`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 dark:bg-orange-900/30 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">{t("Reset Password")}</h2>
              </div>
  
              <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg mb-6 border border-purple-100 dark:border-purple-900/30">
                <p className="text-red-700 dark:text-red-400 text-sm flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("To update your password, enter the old password and the new one you want to use")}
                </p>
              </div>
  
              <div className="space-y-6">
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium mb-2">
                    {t("Old Password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="oldPassword"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      className="w-full p-3  border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
  
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                    {t("New Password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full p-3  border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200  pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
  
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium  mb-2">
                    {t("Confirm Password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-3  border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
  
              <button 
                onClick={handleResetPassword} 
                className="mt-8 inline-flex items-center px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                {t("Reset Password")}
              </button>
            </div>
          </div>
  
          {/* Right Column - Account Danger Zone */}
          <div className="lg:col-span-1">
            <div className={`bg-gradient-to-br ${theme.colors.background} rounded-xl shadow-sm p-6 border-t-4 border-red-500`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-red-600 dark:text-red-500">{t("Danger Zone")}</h2>
              </div>
  
              <div className="border-2 border-red-200 dark:border-red-900/30 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-2">{t("Delete Account")}</h3>
                
                <p className=" mb-6">
                  {t("This action will permanently delete your account and all associated data. This cannot be undone.")}
                </p>
                
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg mb-6">
                  <p className="text-sm text-red-700 dark:text-red-400 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("All account data will be immediately erased from our systems.")}
                  </p>
                </div>
  
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="w-full inline-flex justify-center items-center px-5 py-3 bg-white hover:bg-red-50 text-red-600 font-medium rounded-lg border-2 border-red-600 transition-all duration-200 hover:shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t("Delete My Account")}
                </button>
              </div>
              
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold  mb-4">{t("Account Security Tips")}</h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm ">
                      {t("Use strong, unique passwords")}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm">
                      {/* {t("Enable two-factor authentication if available")} */}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm ">
                      {t("Update your password regularly")}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}