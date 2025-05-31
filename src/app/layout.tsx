
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

import React ,{ Suspense, useEffect} from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { WebSocketProvider } from '../context/WebSocketContext';
import { usePathname, useSearchParams } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import { initializeI18n } from '../../i18n';
import "./globals.css";

// Initialize i18n
const i18n = initializeI18n();

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Set language from localStorage or default to 'fr'
    const lang = localStorage.getItem('i18nextLng') || 'fr';
    i18n.changeLanguage(lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }, [pathname, searchParams]);

  //return <>{children}</>;
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    
    <html lang={i18n.language}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased">
      <I18nextProvider i18n={i18n}>
        <WebSocketProvider>
          <ThemeProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <LayoutContent>
                <div className="min-h-screen">
                  <main>{children}</main>
                </div>
              </LayoutContent>
            </Suspense>
          </ThemeProvider>
        </WebSocketProvider>
      </I18nextProvider>
      </body>
    </html>

  );
}