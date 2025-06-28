'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'react-toastify'; // Using react-toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import api from '@/lib/axios';

//const BASE_URL = 'https://api.blaffa.net';


export default function Profile() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '', // Default or fetched phone code
    phoneNumber: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch user profile, apps, and saved app IDs on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error(t('You must be logged in to access this page.'));
      window.location.href = '/'; // Redirect to login/home
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await api.get(`/auth/me`, {
          headers: { Authorization: `Bearer ${token}`, },
        });
        if (profileResponse.status !== 200) throw new Error(t('Failed to fetch user data'));
        const profileData = await profileResponse.data;
        setFormData((prev) => ({
          ...prev,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: profileData.email || '',
          phoneNumber: profileData.phone_number || '',
          // Assuming phoneCode is part of profileData if needed
        }));

      } catch (error: unknown) {
        console.error('Error fetching profile data:', error);
        //toast.error(error.message || t('An error occurred while loading profile data.'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]); // Depend on t for translation updates

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateDetails = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error(t('You must be logged in to update your details.'));
      return;
    }

    try {
      const response = await api.patch(`/api/auth/edit`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber.replace(/\s+/g, ''),
          // Include phoneCode if your API expects it separately
        }),
      });

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || t('Failed to update details'));
      }

      toast.success(t('Details updated successfully!'));
    } catch (error: unknown) {
      console.error('Error updating details:', error);
      //toast.error(error.message || t('An unexpected error occurred while updating details.'));
    }
  };

  const handleResetPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error(t('You must be logged in to change your password.'));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t('New password and confirm password do not match.'));
      return;
    }

    try {
      const response = await api.post(`/auth/change_password`, {
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

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || t('Failed to change password'));
      }

      toast.success(t('Password changed successfully!'));
      // Clear password fields on success
      setFormData((prev) => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: unknown) {
      console.error('Error changing password:', error);
      //toast.error(error.message || t('An unexpected error occurred while changing password.'));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== formData.email) {
      toast.error(t('Please type your email correctly to confirm deletion'));
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error(t('You must be logged in to delete your account.'));
      return;
    }

    try {
      const response = await api.delete(`/auth/delete_account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || t('Failed to delete account'));
      }

      // Clear local storage and redirect on success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      toast.success(t('Account deleted successfully!'));

      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error: unknown) {
      console.error('Error deleting account:', error);
     // toast.error(error.message || t('An unexpected error occurred while deleting account.'));
      setShowDeleteConfirmation(false); // Hide confirmation on error
    }
  };


  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    toast.info(t('Logged out successfully.'));

    // Redirect to home page
    window.location.href = '/';
  };
if (loading) return <p className="p-6 text-center text-white">{t('Loading profile...')}</p>;

  if (showDeleteConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <style>
          {`
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
            
            .modal-backdrop {
              animation: backdropFadeIn 0.3s ease-out;
            }
            
            .modal-content {
              animation: modalSlideIn 0.4s ease-out;
            }
          `}
        </style>

        <Head>
          <title>{t('Delete Account')}</title>
          <meta name="description" content={t('Delete account confirmation')} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-lg p-8 bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 border-l-4 border-l-red-500 rounded-3xl shadow-2xl modal-content">
            <div className="flex flex-col items-center mb-8">
              <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl mb-4 shadow-lg shadow-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
                {t('Delete Account Permanently')}
              </h1>
              <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-red-600 mt-4 rounded-full"></div>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-sm p-5 rounded-2xl mb-8 border border-red-600/30">
              <h2 className="text-lg font-bold text-red-400 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('Warning')}:
              </h2>
              <ul className="space-y-2 text-red-300">
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
              </ul>
            </div>

            <div className="mb-8">
              <label className="block text-slate-300 font-medium mb-3">
                {t('Type your email to confirm deletion')}:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300`}
                  placeholder={formData.email}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {deleteConfirmText === formData.email ? (
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {t('Please type')} <span className="font-semibold ">{formData.email}</span> {t('to confirm')}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50  font-medium py-3 px-6 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center border border-slate-600/30 hover:border-slate-500/50 backdrop-blur-sm"
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
                    ? 'bg-gradient-to-r from-red-600/50 to-red-700/50 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105'
                } text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center`}
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
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background}`}>
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
          
          .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }
        `}
      </style>

      <DashboardHeader/>
      <Head>
        <title>{t("Profile")}</title>
        <meta name="description" content={t("User profile page")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("Profile")}</h1>
            <p className="text-slate-400">
              {t("Edit your personal information here")}
            </p>
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

        <button
          onClick={handleLogout}
          className="flex items-center text-white bg-gradient-to-r from-blue-600/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-600 px-6 py-3 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 group mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2">
            <div 
              className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/50 rounded-3xl shadow-2xl p-8 mb-8  transition-all duration-500`}
              style={{
                animation: `slideInUp 0.6s ease-out`
              }}
            >
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20 flex items-center justify-center mr-4 transition-all duration-500 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold  group-hover:text-blue-200 transition-colors duration-300">{t("Personal Information")}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium  mb-2">
                      {t("First Name")}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                    />
                  </div>


                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium  mb-2">
                      {t("Last Name")}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full p-4 ${theme.colors.sl_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium  mb-2">
                      {t("E-mail")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium  mb-2">
                      {t("Mobile Number")}
                    </label>
                    <div className="flex gap-2">
                      <div className="w-1/4">
                        <input
                          type="text"
                          id="phoneCode"
                          name="phoneCode"
                          value={formData.phoneCode}
                          onChange={handleChange}
                          className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
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
                          className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdateDetails}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {t("Update Details")}
                </button>
              </div>
            </div>

            {/* Password Section */}
            <div 
              className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/50 rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-500`}
              style={{
                animation: `slideInUp 0.6s ease-out 0.1s both`
              }}
            >
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20 flex items-center justify-center mr-4 transition-all duration-500 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold  group-hover:text-blue-200 transition-colors duration-300">{t("Reset Password")}</h2>
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-blue-900/30 backdrop-blur-sm p-5 rounded-2xl mb-8 border border-blue-600/30">
                  <p className="text-blue-500 text-sm flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("To update your password, enter the old password and the new one you want to use")}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium  mb-2">
                      {t("Old Password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="oldPassword"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium  mb-2">
                      {t("New Password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-300"
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
                        className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-300"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleResetPassword}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  {t("Reset Password")}
                </button>
              </div>
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
//export default Profile;
