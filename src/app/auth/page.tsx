'use client';

//import Footer from '../components/footer';
import React, { useEffect } from 'react';
import AuthForm from '../../components/AuthForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//import { useTranslation } from 'react-i18next';
//import axios from 'axios';
import { useTheme } from '../../components/ThemeProvider';
import api from '@/lib/axios';
// import { ArrowLeft } from 'lucide-react'; // No longer used
import { Player } from '@lottiefiles/react-lottie-player';
// const { t } = useTranslation(); // No longer used
import { Download } from 'lucide-react'; // Add this import

const AuthPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { theme } = useTheme();

  // Add this function inside your component
  const handleMenuItemClick = (callback: () => void) => {
    callback();
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        
        // If no token exists, allow user to stay on homepage
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If token is valid, redirect to dashboard
        if (response.status === 200) {
          router.replace('/dashboard'); // Use replace instead of push to prevent back navigation
        }
      } catch (error) {
        // Token validation failed - clear the invalid token
        console.error('Token validation failed:', error);
        localStorage.removeItem('accessToken');
        setIsLoading(false);
      }
    };

    validateToken();
    setIsClient(true);
  }, [router]); // Add router as a dependency

  if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
    router.replace('/dashboard');
    return null;
  }

  if (isLoading && isClient) {
    return (
      <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }


  // Only render the full content when on the client and not loading
  if (!isClient) {
    return <div className="min-h-screen"></div>; // Simple placeholder during SSR
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} transition-colors flex flex-col md:flex-row`}>
      {/* Left Side: Animation/Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-8 relative">
        <div className="w-full max-w-md flex flex-col items-center">
          <Player
            autoplay
            loop
            src="https://assets2.lottiefiles.com/packages/lf20_49rdyysj.json"
            style={{ height: '320px', width: '320px' }}
          />
          <h2 className="text-2xl font-bold text-white mt-8 text-center">Achetez, vendez des cryptomonnaies et pariez instantanément</h2>
          <p className="text-white/80 mt-4 text-center">
            Achetez, vendez et échangez vos cryptomonnaies en toute sécurité et simplicité.<br/>
            Déposez et retirez instantanément sur vos plateformes de paris préférées.<br/>
            Profitez de la meilleure expérience de trading crypto et de paris en ligne avec Blaffa.
          </p>
        </div>
      </div>
      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 bg-transparent">
        <div className="w-full max-w-md">
          <AuthForm />
          <br></br>
          <br></br>
          <button
            onClick={() => handleMenuItemClick(() => {
              window.location.href = 'https://api.blaffa.net/download_apk';
            })}
            className="flex px-3 py-2 items-center gap-2 bg-gray-900 hover:bg-gray-800 transition-colors text-left group rounded-lg max-w-fit mt-4 ml-30"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <Download size={16} className="text-blue-500" />
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors text-sm whitespace-nowrap">
              {"Télécharger l'application ANDROID"}
            </span>
          </button>
          {/* Trust indicators */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;