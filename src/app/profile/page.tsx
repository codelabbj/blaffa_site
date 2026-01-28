'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/lib/axios';

export default function Profile() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSecurityMenu, setShowSecurityMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // Fetch user profile metrics/data
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const profileResponse = await api.get(`/auth/me`);
        if (profileResponse.status !== 200) throw new Error(t('Failed to fetch user data'));
        const profileData = await profileResponse.data;
        setFormData((prev) => ({
          ...prev,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: profileData.email || '',
          phoneNumber: profileData.phone_number || '',
        }));

        setIsUpdate(profileData.is_update === true);
      } catch (error: unknown) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t, router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.info(t('Logged out successfully.'));
    router.push('/');
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
      const response = await api.delete(`/auth/delete_account`);
      if (response.status !== 200) {
        throw new Error(t('Failed to delete account'));
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.success(t('Account deleted successfully!'));
      router.push('/');
    } catch (error: unknown) {
      console.error('Error deleting account:', error);
      setShowDeleteConfirmation(false);
    }
  };

  if (loading) return <p className="p-6 text-center text-white">{t('Loading profile...')}</p>;

  if (showDeleteConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-lg p-8 bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 border-l-4 border-l-red-500 rounded-3xl shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl mb-4 shadow-lg shadow-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
                {t('Delete Account Permanently')}
              </h1>
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
              </ul>
            </div>

            <div className="mb-8">
              <label className="block text-slate-300 font-medium mb-3">
                {t('Type your email to confirm deletion')}:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className={`w-full p-4 ${theme.colors.c_background} border border-slate-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300`}
                placeholder={formData.email}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 font-medium py-3 px-6 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center border border-slate-600/30"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                className={`${deleteConfirmText !== formData.email ? 'opacity-50' : ''} bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center`}
                disabled={deleteConfirmText !== formData.email}
              >
                {t('Delete My Account')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.a_background} pb-24`}>
      <Head>
        <title>{t("Profile")}</title>
      </Head>

      <div className="animate-in slide-in-from-top-10 fade-in duration-500">
        <div className="flex flex-col items-center pt-10 pb-6 px-6">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <button
            onClick={() => router.push('/profile/edit')}
            className="text-blue-600 dark:text-blue-400 text-lg font-bold underline decoration-2 underline-offset-4"
          >
            Modifier le profil
          </button>
        </div>

        {/* User Info Section */}
        <div className="px-6 space-y-5 mb-10">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-500 dark:text-gray-400">User ID</span>
            <span className={`font-semibold ${theme.colors.text}`}>---</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-500 dark:text-gray-400">Nom</span>
            <span className={`font-semibold ${theme.colors.text}`}>{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-500 dark:text-gray-400">E-mail</span>
            <span className={`font-semibold ${theme.colors.text}`}>{formData.email}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-500 dark:text-gray-400">Numéro de téléphone</span>
            <span className={`font-semibold ${theme.colors.text}`}>
              {formData.phoneCode || '+229'} {formData.phoneNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Parameters Section */}
      <div className="px-5">
        <h3 className="text-gray-400 dark:text-gray-500 text-xl font-medium mb-4 ml-1">Paramètres</h3>

        <div className="space-y-3">
          {/* Status Card */}
          <button className={`w-full p-4 ${theme.colors.c_background} dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-green-500 font-medium text-lg">Compte vérifié avec succès</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dark Mode Card */}
          <div className={`w-full p-5 ${theme.colors.c_background} dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm`}>
            <span className={`text-lg font-medium ${theme.colors.text}`}>Mode sombre</span>
            <div
              onClick={toggleTheme}
              className={`w-12 h-6 ${theme.mode === 'dark' ? 'bg-blue-600' : 'bg-gray-200'} rounded-full relative transition-colors duration-300 cursor-pointer`}
            >
              <div className={`absolute top-1 ${theme.mode === 'dark' ? 'left-7' : 'left-1'} w-4 h-4 bg-white rounded-full transition-all duration-300`}></div>
            </div>
          </div>

          {/* Support Card */}
          <button className={`w-full p-5 ${theme.colors.c_background} dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`text-lg font-medium ${theme.colors.text}`}>Support</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Security Card */}
          <button
            onClick={() => setShowSecurityMenu(true)}
            className={`w-full p-5 ${theme.colors.c_background} dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className={`text-lg font-medium ${theme.colors.text}`}>Parametre de securite</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Notifications Card */}
          <button
            onClick={() => setShowNotificationMenu(true)}
            className={`w-full p-5 ${theme.colors.c_background} dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className={`text-lg font-medium ${theme.colors.text}`}>Notifications</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Privacy Card */}
          <button className={`w-full p-5 ${theme.colors.c_background} dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className={`text-lg font-medium ${theme.colors.text}`}>Politique de l'application</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Logout Card */}
          <button
            onClick={handleLogout}
            className={`w-full p-5 ${theme.colors.c_background} dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm mt-2`}
          >
            <span className={`text-lg font-medium ${theme.colors.text}`}>Deconnexion</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>

          {/* Delete Card */}
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className={`w-full p-5 ${theme.colors.c_background} dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <span className={`text-lg font-medium ${theme.colors.text}`}>Supprimer le compte</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      {/* Security Menu Overlay */}
      {showSecurityMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSecurityMenu(false)}
          ></div>
          <div className={`relative w-full max-w-lg mx-auto ${theme.mode === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl border-t border-gray-100 dark:border-gray-800`}>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowSecurityMenu(false)}
                className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => router.push('/profile/security/password')}
              className={`w-full p-6 ${theme.colors.c_background} border border-gray-200 dark:border-gray-800 rounded-3xl flex items-center justify-between shadow-sm group hover:border-blue-500/50 transition-all duration-300`}
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center border border-blue-100 dark:border-blue-800 relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping opacity-25"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className={`text-xl font-semibold ${theme.colors.text}`}>Modifier le mot de passe</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="h-10"></div>
          </div>
        </div>
      )}

      {/* Notification Menu Overlay */}
      {showNotificationMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNotificationMenu(false)}
          ></div>
          <div className={`relative w-full max-w-lg mx-auto ${theme.mode === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl border-t border-gray-100 dark:border-gray-800`}>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowNotificationMenu(false)}
                className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${theme.colors.text} leading-tight mb-8`}>
                Sélectionnez votre notification préférée.
              </h2>

              {/* Push Notifications Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-medium ${theme.colors.text}`}>Push notifications</span>
                  <div
                    onClick={() => setPushEnabled(!pushEnabled)}
                    className={`w-14 h-7 ${pushEnabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'} rounded-full relative transition-colors duration-300 cursor-pointer p-1`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${pushEnabled ? 'translate-x-7' : 'translate-x-0'} shadow-sm`}></div>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                  Définir Push pour recevoir une notification hors ligne, à tout moment n'importe quel jour
                </p>
              </div>

              {/* Email Notifications Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-medium ${theme.colors.text}`}>Email notifications</span>
                  <div
                    onClick={() => setEmailEnabled(!emailEnabled)}
                    className={`w-14 h-7 ${emailEnabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'} rounded-full relative transition-colors duration-300 cursor-pointer p-1`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${emailEnabled ? 'translate-x-7' : 'translate-x-0'} shadow-sm`}></div>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                  Définir des e-mails pour savoir ce qui se passe hors ligne
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    toast.success(t('Paramètres de notification enregistrés !'));
                    setShowNotificationMenu(false);
                  }}
                  className="w-full bg-[#134e9a] text-white py-5 rounded-2xl text-xl font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
            <div className="h-6"></div>
          </div>
        </div>
      )}
    </div>
  );
}
