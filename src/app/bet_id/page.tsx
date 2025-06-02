'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';
import { CopyIcon } from 'lucide-react';
// import axios from 'axios';
import api from '@/lib/axios';

// const BASE_URL = 'https://api.blaffa.net';

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
}

interface IdLink {
  id: string;
  user: string;
  link: string;
  app_name: App;
}

export default function BetIdsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [savedAppIds, setSavedAppIds] = useState<IdLink[]>([]);
  const [newAppId, setNewAppId] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's saved bet IDs
  const fetchBetIds = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error("Access token not found for fetching saved app IDs.");
      setSavedAppIds([]);
      return;
    }

    try {
      const response = await api.get(`/blaffa/id_link`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      if (response.status === 200) {
        const data = response.data;
        let processedData: IdLink[] = [];
        
        if (Array.isArray(data)) {
          processedData = data;
        } else if (data && Array.isArray(data.results)) {
          processedData = data.results;
        } else if (data && Array.isArray(data.data)) {
          processedData = data.data;
        } else if (data && data.id && data.link && data.app_name) {
          processedData = [data];
        }
        
        setSavedAppIds(processedData);
      } else {
        console.error('Failed to fetch saved app IDs:', response.status);
        setSavedAppIds([]);
      }
    } catch (error) {
      console.error('Error fetching bet IDs:', error);
      setSavedAppIds([]);
    }
  };

  // Fetch available apps
  const fetchApps = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await api.get(`/blaffa/app_name`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      
      if (response.status === 200) {
        const data = response.data;
        setApps(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch apps:', response.status);
        setApps([]);
      }
    } catch (error) {
      console.error('Error fetching apps:', error);
      setApps([]);
    }
  };

  // Add new bet ID
  const handleAddBetId = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedApp || !newAppId.trim()) {
      console.log(t('Please select an app and enter a bet ID.'));
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log(t('You must be logged in to add a bet ID.'));
      return;
    }

    try {
      const response = await api.post(`/blaffa/id_link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          link: newAppId.trim(),
          app_name_id: selectedApp
        }),
      });

      if (response.status !== 200) {
        throw new Error(t('Failed to add bet ID'));
      }

      console.log(t('Bet ID added successfully!'));
      setNewAppId('');
      setSelectedApp('');
      await fetchBetIds();
    } catch (error: any) {
      console.error('Error adding bet ID:', error);
      console.log(error.message || t('Failed to add bet ID'));
    }
  };

  // Delete bet ID
  const handleDeleteBetId = async (id: string) => {
    if (!confirm(t('Are you sure you want to delete this bet ID?'))) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log(t('You must be logged in to delete a bet ID.'));
      return;
    }

    try {
      const response = await api.delete(`/blaffa/id_link/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(t('Failed to delete bet ID'));
      }

      console.log(t('Bet ID deleted successfully!'));
      setSavedAppIds(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Error deleting bet ID:', error);
      console.log(error.message || t('Failed to delete bet ID'));
    }
  };

  // Initial data fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchApps(), fetchBetIds()]);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

 if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
      </div>
    </div>
  );
}

return (
  <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} p-4`}>
    <DashboardHeader/>
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

    
    
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold  mb-2">{t("Betting App IDs")}</h1>
          <p className="text-slate-400">Gérez vos identifiants de paris en toute sécurité</p>
        </div>
        
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-white bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group mt-4 md:mt-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("Back")}
        </button>
      </div>

      {/* Main Content Container */}
      <div className={`bg-gradient-to-r ${theme.colors.a_background} backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden`}>
        <div className="p-8 space-y-8">
          
          {/* Add New Bet ID Section */}
          <div className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.background} backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 transition-all duration-500 hover:from-slate-600/50 hover:to-slate-500/50`}>
            {/* Hover shimmer effect */}
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-slate-600/20 text-blue-400 shadow-lg shadow-blue-500/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold ">{t("Add New Bet ID")}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t("App Name")}</label>
                  <div className="relative">
                    <select
                      value={selectedApp}
                      onChange={(e) => setSelectedApp(e.target.value)}
                      className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="">{t("Select App")}</option>
                      {apps.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.public_name || app.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t("User Bet ID")}</label>
                  <input
                    type="text"
                    value={newAppId}
                    onChange={(e) => setNewAppId(e.target.value)}
                    className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder={t("Enter your bet ID")}
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleAddBetId}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-amber-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                  >
                    {t("Add Bet ID")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Bet IDs Section */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold  mb-2">{t("Saved Bet IDs")}</h2>
              <p className="text-slate-400">Vos identifiants de paris sauvegardés</p>
            </div>

            {!savedAppIds || savedAppIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-600/50 text-slate-400 shadow-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M15 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold  mb-3">{t("No bet IDs saved yet")}</h3>
                <p className="text-slate-400 text-center max-w-md leading-relaxed">
                  Ajoutez votre premier ID de pari pour commencer à gérer vos identifiants.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedAppIds.map((item, index) => {
                  const appName = item.app_name?.public_name || item.app_name?.name || 'Unknown App';
                  return (
                    <div 
                      key={item.id}
                      className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20`}
                      style={{
                        animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
                      }}
                    >
                      {/* Hover shimmer effect */}
                      <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-600/20 text-purple-400 shadow-lg shadow-purple-500/20 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M15 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className=" font-semibold group-hover:text-purple-200 transition-colors duration-300">
                                {appName}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteBetId(item.id)}
                            className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-500/10 transition-all duration-300 group-hover:scale-110"
                            title={t('Delete')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className={`${theme.colors.c_background} rounded-xl p-3`}>
                          <div className="text-slate-400 text-xs mb-1">ID de pari</div>
                          <div className=" font-mono text-sm truncate">{item.link} <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigator.clipboard.writeText(item.link);
                            // alert(t('Bet ID copied to clipboard'));
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <CopyIcon className="h-4 w-4 text-gray-500" />
                        </button></div>
                          
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}