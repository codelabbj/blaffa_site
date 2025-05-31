'use client';

//import Footer from '../components/footer';
import React, { useEffect } from 'react';
import AuthForm from '../../components/AuthForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
//import axios from 'axios';
import { useTheme } from '../../components/ThemeProvider';
import api from '@/lib/axios';

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { theme } = useTheme();

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
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} transition-colors flex flex-col`}>
     
      {/* Main Content - Side by side layout that stacks on mobile */}
      <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center px-6 py-8 gap-30">
        
        {/* Login Form - Right side on desktop, top on mobile */}
        <div className="w-full md:w-1/2 lg:w-4/12 max-w-md mb-8 md:mb-0">
          <AuthForm />
          {/* Trust indicators */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default AuthPage;