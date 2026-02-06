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
import { User, Pencil, ChevronRight, Shield, Star, LogOut, Trash2, HelpCircle, CheckCircle2, Moon, X } from 'lucide-react';

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
    isVerified: false,
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
          isVerified: profileData.status === 'verify',
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
    <div className={`${theme.mode === 'dark' ? 'bg-[#0a0a0a]' : 'bg-slate-50'}`}>
      <Head>
        <title>{t("Profile")}</title>
      </Head>

      {/* Redesigned Navy Blue Header */}
      <div className="bg-[#002d72] pt-12 pb-10 px-6 relative animate-in fade-in duration-700">
        {/* Edit Button in Top Right */}
        <button
          onClick={() => router.push('/profile/edit')}
          className="absolute top-8 right-6 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all shadow-sm"
        >
          <Pencil size={16} className="text-white" />
        </button>

        <div className="flex flex-col items-center">
          {/* Circular Avatar */}
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-5 shadow-xl border-4 border-white/10">
            <User size={40} className="text-[#002d72] stroke-[1.5]" />
          </div>

          {/* User Info */}
          <h1 className="text-xl font-bold text-white mb-1 tracking-tight">
            {formData.firstName} {formData.lastName}
          </h1>
          <p className="text-blue-100/70 text-xs mb-1 font-medium">{formData.email}</p>
          <p className="text-blue-100/70 text-xs font-medium">
            {formData.phoneCode || '+229'} {formData.phone || formData.phoneNumber}
          </p>
        </div>
      </div>

      {/* Parameters Section */}
      <div className="px-6 py-6 w-full space-y-4">
        <h3 className="text-gray-400 text-base font-bold mb-3 ml-1">Paramètres</h3>

        <div className="space-y-3">
          {/* Status Card */}
          <div className={`w-full p-5 ${theme.mode === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'} border rounded-3xl flex items-center shadow-sm`}>
            {formData.isVerified ? (
              <>
                <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center mr-4">
                  <CheckCircle2 size={20} className="text-[#4caf50]" />
                </div>
                <span className="text-[#4caf50] font-bold">Compte vérifié avec succès</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <HelpCircle size={20} className="text-yellow-600" />
                </div>
                <span className="text-yellow-600 font-bold">Compte non vérifié</span>
              </>
            )}
          </div>

          {/* Dark Mode Card */}
          <div className={`w-full p-5 ${theme.mode === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'} border rounded-3xl flex items-center justify-between shadow-sm`}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                <Moon size={22} className="text-gray-500" />
              </div>
              <span className={`text-lg font-bold ${theme.colors.text}`}>Mode sombre</span>
            </div>
            <div
              onClick={toggleTheme}
              className={`w-14 h-7 ${theme.mode === 'dark' ? 'bg-blue-600' : 'bg-gray-200'} rounded-full relative transition-all duration-300 cursor-pointer p-1 shadow-inner`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${theme.mode === 'dark' ? 'translate-x-7' : 'translate-x-0'} shadow-md`}></div>
            </div>
          </div>

          {/* Menu Items */}
          {[
            { label: 'Support', icon: HelpCircle, path: '/contact' },
            { label: 'Parametre de securite', icon: Shield, onClick: () => setShowSecurityMenu(true) },
            { label: 'Politique de l\'application', icon: Star, path: '/privacy-policy' },
            { label: 'Deconnexion', icon: LogOut, onClick: handleLogout },
            { label: 'Supprimer le compte', icon: Trash2, onClick: () => setShowDeleteConfirmation(true) }
          ].map((item, idx) => {
            const content = (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <item.icon size={20} className="text-gray-500 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <span className={`text-base font-bold ${theme.colors.text}`}>{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </>
            );

            if (item.path) {
              return (
                <Link
                  key={idx}
                  href={item.path}
                  className={`w-full p-4 ${theme.mode === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'} border rounded-3xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all group`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={idx}
                onClick={item.onClick}
                className={`w-full p-4 ${theme.mode === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'} border rounded-3xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all group`}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Menu Overlay */}
      {showSecurityMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSecurityMenu(false)}></div>
          <div className={`relative w-full max-w-lg mx-auto ${theme.mode === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-t-[3rem] p-10 animate-in slide-in-from-bottom duration-500 shadow-2xl border-t border-white/10`}>
            <div className="w-16 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-8 opacity-50"></div>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-2xl font-black ${theme.colors.text}`}>Sécurité</h3>
              <button
                onClick={() => setShowSecurityMenu(false)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold"
              >
                <X size={20} />
              </button>
            </div>

            <button
              onClick={() => router.push('/profile/security/password')}
              className={`w-full p-6 ${theme.mode === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-100'} border rounded-3xl flex items-center justify-between shadow-sm group hover:border-blue-500/50 transition-all`}
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Shield size={22} className="text-blue-500" />
                </div>
                <span className={`text-xl font-bold ${theme.colors.text}`}>Modifier le mot de passe</span>
              </div>
              <ChevronRight size={24} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="h-10"></div>
          </div>
        </div>
      )}
    </div>
  );
}
