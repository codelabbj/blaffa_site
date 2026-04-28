'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/lib/axios';
import { User, Pencil, ChevronRight, Shield, Star, LogOut, Trash2, HelpCircle, CheckCircle2, Moon, X, Mail } from 'lucide-react';

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
    phone: '',
    status: '',
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
          phone: profileData.phone || '',
          status: profileData.status || '',
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
    <div className={`min-h-screen ${theme.colors.background} pt-[env(safe-area-inset-top)]`}>
      <Head>
        <title>{t("Profile")}</title>
      </Head>

      <div className="bg-[#003399] pt-12 pb-16 px-6 rounded-b-[2.5rem] relative mb-8 shadow-2xl">
        <button
          onClick={() => router.push('/profile/edit')}
          className="absolute top-12 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"
        >
          <Pencil size={20} />
        </button>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 shadow-xl">
            <User size={48} className="text-[#002d72]" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">
            {formData.firstName} {formData.lastName}
          </h1>
          <p className="text-blue-100/70 text-sm font-medium">{formData.email}</p>
        </div>
      </div>

      <div className="px-6 pb-24 space-y-4">
        {formData.status === 'verify' ? (
          <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-500" />
            <span className="text-green-700 dark:text-green-400 font-bold text-sm">Compte vérifié</span>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-center gap-3">
            <HelpCircle size={24} className="text-yellow-500" />
            <span className="text-yellow-700 dark:text-yellow-500 font-bold text-sm">Vérification en attente</span>
          </div>
        )}

        <div className="space-y-2">
          {/* Dark Mode Toggle */}
          <div className={`w-full p-4 ${theme.mode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'} border rounded-2xl flex items-center justify-between shadow-sm`}>
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-blue-600" />
              <span className={`font-bold ${theme.colors.text}`}>Mode sombre</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 ${theme.mode === 'dark' ? 'bg-blue-600' : 'bg-gray-200'} rounded-full relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${theme.mode === 'dark' ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>

          {[
            { label: 'Paramètres de sécurité', icon: Shield, onClick: () => setShowSecurityMenu(true) },
            { label: 'Support & Assistance', icon: HelpCircle, path: '/contact' },
            { label: 'Politique de confidentialité', icon: Star, path: '/privacy-policy' },
            { label: 'Déconnexion', icon: LogOut, onClick: handleLogout },
            { label: 'Zone de danger', icon: Trash2, onClick: () => setShowDeleteConfirmation(true), color: 'text-red-500' }
          ].map((item, idx) => {
            const content = (
              <div className={`w-full p-4 ${theme.mode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'} border rounded-2xl flex items-center justify-between shadow-sm`}>
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={item.color || "text-blue-600"} />
                  <span className={`font-bold ${theme.colors.text}`}>{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            );

            if (item.path) {
              return (
                <Link key={idx} href={item.path} className="block w-full">
                  {content}
                </Link>
              );
            }

            return (
              <button key={idx} onClick={item.onClick} className="block w-full text-left">
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {showSecurityMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSecurityMenu(false)}></div>
          <div className={`relative w-full max-w-sm ${theme.mode === 'dark' ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-6 shadow-2xl`}>
            <h3 className={`text-xl font-bold ${theme.colors.text} mb-6`}>Sécurité</h3>
            <button
              onClick={() => router.push('/profile/security/password')}
              className={`w-full p-4 ${theme.mode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} rounded-2xl flex items-center justify-between mb-4`}
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-blue-600" />
                <span className={`font-bold ${theme.colors.text}`}>Changer le mot de passe</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => setShowSecurityMenu(false)}
              className="w-full py-3 text-center font-bold text-gray-500"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
