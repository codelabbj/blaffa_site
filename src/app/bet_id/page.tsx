'use client';

import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';
import { CopyIcon, ArrowLeft, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import React from 'react';

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

type ConfirmModalData = {
  Name: string;
  UserId: number;
  CurrencyId: number;
};

function BetIdsContent() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const origin = searchParams.get('origin') || 'deposit';
  const platformName = searchParams.get('platform') || 'Plateforme';
  const platformParamId = searchParams.get('platform_id') || '';

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [savedAppIds, setSavedAppIds] = useState<IdLink[]>([]);
  const [newAppId, setNewAppId] = useState('');
  const [selectedApp, setSelectedApp] = useState(platformParamId);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<
    | null
    | { type: 'confirm'; data: ConfirmModalData }
    | { type: 'error'; message: string; title?: string }
  >(null);
  const [pendingBetId, setPendingBetId] = useState<{ appId: string; betId: string } | null>(null);

  useEffect(() => {
    if (platformParamId) {
      setSelectedApp(platformParamId);
    }
  }, [platformParamId]);

  // Fetch user's saved bet IDs
  const fetchBetIds = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
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

        if (Array.isArray(data)) { processedData = data; }
        else if (data && Array.isArray(data.results)) { processedData = data.results; }
        else if (data && Array.isArray(data.data)) { processedData = data.data; }
        else if (data && data.id && data.link && data.app_name) { processedData = [data]; }

        setSavedAppIds(processedData);
      } else {
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
        setApps(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching apps:', error);
    }
  };

  // Search user before adding bet ID
  const handleSearchUserAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedApp || !newAppId.trim()) {
      setError(t('Veuillez sélectionner une application et saisir un ID de pari.'));
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError(t('Vous devez être connecté pour ajouter un ID de pari.'));
      return;
    }

    try {
      const searchResponse = await api.get(`/blaffa/search-user?app_id=${selectedApp}&userid=${encodeURIComponent(newAppId.trim())}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const searchData = searchResponse.data;
      if (searchData && searchData.UserId && searchData.UserId !== 0) {
        if (searchData.CurrencyId !== 27) {
          setModal({
            type: 'error',
            title: t('Compte non trouvé'),
            message: t('Aucun compte n\'a été trouvé avec l\'ID {{betid}} ou votre compte n\'est pas configuré en Franc CFA (XOF - Afrique de l\'Ouest).', { betid: newAppId.trim() }),
          });
          return;
        }
        setModal({
          type: 'confirm',
          data: {
            Name: searchData.Name,
            UserId: searchData.UserId,
            CurrencyId: searchData.CurrencyId,
          },
        });
        setPendingBetId({ appId: selectedApp, betId: newAppId.trim() });
      } else {
        setModal({
          type: 'error',
          title: t('Compte non trouvé'),
          message: t('Aucun compte n\'a été trouvé avec l\'ID {{betid}}.', { betid: newAppId.trim() }),
        });
      }
    } catch {
      setModal({
        type: 'error',
        title: t('Erreur de validation'),
        message: t('Échec de la validation de l\'ID de pari.'),
      });
    }
  };

  // Confirm add bet ID after modal
  const handleConfirmAddBetId = async () => {
    if (!pendingBetId) return;
    setModal(null);
    const { appId, betId } = pendingBetId;
    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.post(`/blaffa/id_link`, { link: betId, app_name_id: appId }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 200 || response.status === 201) {
        setSuccess(t('ID de pari ajouté avec succès !'));
        // Redirect back to origin after success
        setTimeout(() => {
          if (origin === 'deposit') router.push('/deposit');
          else if (origin === 'withdraw') router.push('/withdraw');
          else router.back();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || t('Failed to add bet ID'));
    }
  };

  const handleDeleteBetId = async (id: string) => {
    if (!confirm(t('Are you sure you want to delete this bet ID?'))) return;
    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.delete(`/blaffa/id_link/${id}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 200) {
        setSavedAppIds(prev => prev.filter(item => item.id !== id));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('Failed to delete bet ID'));
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchApps(), fetchBetIds()]);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const headerTitle = origin === 'deposit' ? 'Dépôt - ID Utilisateur' : 'Retrait - ID Utilisateur';

  return (
    <div className={`min-h-screen ${theme.colors.a_background} font-sans`}>
      {/* Custom Header */}
      <header className="px-4 h-16 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft size={28} className={theme.colors.text} />
        </button>
        <h1 className={`text-2xl font-bold ${theme.colors.text}`}>{headerTitle}</h1>
      </header>

      <main className="w-full px-6 pt-6">
        {/* Step Guide */}
        <div className="mb-10">
          <h2 className={`text-xl font-bold ${theme.colors.text}`}>2. Choisissez ou créez votre ID pour {platformName}</h2>
        </div>

        {/* Global Messages */}
        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl font-medium">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-xl font-medium">{success}</div>}

        {/* Input Form */}
        <form onSubmit={handleSearchUserAndAdd} className="space-y-8">
          <div className="space-y-3">
            <label className={`${theme.colors.text} font-bold text-lg block px-1`}>Nouvel identifiant</label>
            <input
              type="text"
              value={newAppId}
              onChange={(e) => setNewAppId(e.target.value)}
              placeholder="Entrez votre ID"
              className={`w-full h-16 px-6 rounded-2xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-200'} ${theme.colors.a_background} text-xl font-medium focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-400`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className={`h-16 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 font-bold text-xl rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`h-16 text-white font-bold text-xl rounded-2xl shadow-lg transition-all active:scale-[0.98]`}
              style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#1a4384' }}
            >
              Enregistrer
            </button>
          </div>
        </form>

        {/* List of saved IDs (if relevant, though usually we want back to flow) */}
        {!loading && savedAppIds.length > 0 && (
          <div className="mt-16 space-y-4">
            <h3 className={`${theme.colors.d_text} font-bold mb-4 px-1 opacity-60`}>{t('Vos IDs sauvegardés')}</h3>
            {savedAppIds.filter(id => id.app_name?.id === selectedApp).map(id => (
              <div key={id.id} className={`flex items-center justify-between p-4 ${theme.colors.a_background} rounded-2xl border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'}`}>
                <span className={`text-lg font-bold ${theme.colors.text}`}>{id.link}</span>
                <button onClick={() => handleDeleteBetId(id.id)} className="p-2 text-red-500">
                  <XCircle size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className={`${theme.colors.a_background} rounded-[2rem] shadow-2xl w-full max-w-sm p-8 overflow-hidden animate-in zoom-in-95 duration-200 border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'}`}>
            {modal.type === 'confirm' ? (
              <>
                <h3 className={`text-2xl font-bold mb-6 ${theme.colors.text}`}>Compte trouvé</h3>
                <div className={`space-y-2 mb-10 text-lg leading-relaxed ${theme.colors.text}`}>
                  <p><span className="font-bold opacity-60">Nom :</span> {modal.data.Name}</p>
                  <p><span className="font-bold opacity-60">Devise :</span> {modal.data.CurrencyId}</p>
                  <p><span className="font-bold opacity-60">UserID :</span> {modal.data.UserId}</p>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { setModal(null); setPendingBetId(null); }}
                    className={`font-medium text-lg px-2`}
                    style={{ color: theme.colors.primary }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmAddBetId}
                    className={`text-white font-bold py-3 px-8 rounded-2xl transition-all`}
                    style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#1a4384' }}
                  >
                    Confirmer
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className={`text-2xl font-bold mb-4 ${theme.colors.text}`}>{modal.title}</h3>
                <p className={`${theme.colors.d_text} opacity-70 mb-8 leading-relaxed font-medium`}>{modal.message}</p>
                <div className="flex justify-end">
                  <button onClick={() => setModal(null)}
                    className={`text-white font-bold py-3 px-8 rounded-2xl transition-all`}
                    style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#1a4384' }}
                  >
                    Quitter
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BetIdsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BetIdsContent />
    </Suspense>
  );
}