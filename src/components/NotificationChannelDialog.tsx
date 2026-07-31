'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import api from '@/lib/axios';
import { fetchSettings } from '@/lib/blaffa-api';
import NotificationChannelsPanel, {
  DISMISS_COUNT_KEY,
  MAX_DISMISS_COUNT,
  hasAnyChannelVerified,
} from './NotificationChannelsPanel';

const SESSION_DISMISS_KEY = 'blaffaNotificationPromptSessionDismiss';

export default function NotificationChannelDialog() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const checkedRef = useRef(false);

  const closePrompt = useCallback(() => {
    sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    setOpen(false);
  }, []);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const checkPrompt = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      if (pathname === '/profile') return;
      if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return;

      const dismissCount = Number(localStorage.getItem(DISMISS_COUNT_KEY) || '0');
      if (dismissCount >= MAX_DISMISS_COUNT) return;

      try {
        const [settings, userResponse] = await Promise.all([
          fetchSettings(),
          api.get('/auth/me'),
        ]);

        const user = userResponse.data;

        if (hasAnyChannelVerified(user)) return;

        const needWhatsapp = Boolean(
          settings?.use_whatsapp &&
            !(user?.whatsapp_verified || user?.user_whatsapp_phone || user?.whatsapp)
        );
        const needTelegram = Boolean(settings?.use_telegram && !user?.telegram_verified);
        const needSms = Boolean(settings?.use_sms && !user?.sms_verified);

        if (!needWhatsapp && !needTelegram && !needSms) return;

        setOpen(true);
      } catch (err) {
        console.error('Erreur vérification notifications:', err);
      }
    };

    checkPrompt();
  }, [pathname]);

  const handleAllDone = () => {
    localStorage.setItem(DISMISS_COUNT_KEY, String(MAX_DISMISS_COUNT));
    closePrompt();
  };

  const handleLater = () => {
    const dismissCount = Number(localStorage.getItem(DISMISS_COUNT_KEY) || '0');
    localStorage.setItem(DISMISS_COUNT_KEY, String(dismissCount + 1));
    closePrompt();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="bg-gradient-to-br from-[#003399] to-[#002d72] px-6 pb-6 pt-6 text-white">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Bell className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold">Activez vos alertes BLAFFA</h2>
          <p className="mt-2 text-sm leading-6 text-blue-100">
            Connectez au moins un canal pour recevoir vos alertes. Vous pourrez configurer les autres depuis votre profil.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white">
            blaffa
          </p>
        </div>

        <div className="p-4">
          <NotificationChannelsPanel
            mode="prompt"
            showHeader={false}
            showLaterButton
            onAllDone={handleAllDone}
            onClose={handleLater}
          />
        </div>
      </div>
    </div>
  );
}
