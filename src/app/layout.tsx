
// 'use client';

// import React from 'react';
// import { ThemeProvider } from '../components/ThemeProvider';

// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
//       <body className="antialiased">
//         <ThemeProvider>
//           <div className="min-h-screen">
//             <main>{children}</main>
//           </div>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }




'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { WebSocketProvider } from '../context/WebSocketContext';
import { usePathname } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import { initializeI18n } from '../../i18n';
import "./globals.css";

// Initialize i18n
const i18n = initializeI18n();

import BottomNavbar from '../components/BottomNavbar';
import NotificationChannelDialog from '../components/NotificationChannelDialog';
import { QueryProvider } from '../providers/QueryProvider';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pushInitRef = useRef(false);

  useEffect(() => {
    const lang = localStorage.getItem('i18nextLng') || 'fr';
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    if (pushInitRef.current) return;
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    pushInitRef.current = true;
    import('../lib/push-notifications')
      .then(({ initializePushNotifications }) => initializePushNotifications())
      .catch(() => undefined);
  }, []);

  // Check if current path is an auth page (login or register)
  // const isAuthPage = pathname === '/login' || pathname === '/register';

  // Define pages that should have bottom navigation
  const showBottomNav = ['/', '/dashboard', '/notifications', '/all_transactions', '/profile'].includes(pathname || '');

  return (
    <div className="min-h-screen flex flex-col">
      <main className={`flex-grow ${showBottomNav ? 'pb-16' : ''}`}>
        {children}
      </main>
      {showBottomNav && <BottomNavbar />}
      <NotificationChannelDialog />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="overflow-x-hidden" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
        <I18nextProvider i18n={i18n}>
          <QueryProvider>
            <WebSocketProvider>
              <ThemeProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <LayoutContent>
                    {children}
                  </LayoutContent>
                </Suspense>
              </ThemeProvider>
            </WebSocketProvider>
          </QueryProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}