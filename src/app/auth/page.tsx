
'use client';

// import LeftSideContent from '../components/left_side_content';
// import Footer from '../components/footer';
import AuthForm from '../../components/AuthForm';
//import { useState } from 'react';
//import { useRouter } from 'next/navigation';
//import { useTranslation } from 'react-i18next';
//import axios from 'axios';
import { useTheme } from '../../components/ThemeProvider';

const AuthPage: React.FC = () => {
  //const { t } = useTranslation();
  // const [isClient, setIsClient] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
 // const router = useRouter();
  const { theme } = useTheme();

  // useEffect(() => {
  //   const validateToken = async () => {
  //     try {
  //       setIsLoading(true);
  //       const token = localStorage.getItem('accessToken');
        
  //       // If no token exists, allow user to stay on homepage
  //       if (!token) {
  //         setIsLoading(false);
  //         return;
  //       }

  //       // Verify token with backend
  //       const response = await axios.get('https://api.yapson.net/auth/me', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       // If token is valid, redirect to dashboard
  //       if (response.status === 200) {
  //         router.replace('/dashboard'); // Use replace instead of push to prevent back navigation
  //       }
  //     } catch (error) {
  //       // Token validation failed - clear the invalid token
  //       console.error('Token validation failed:', error);
  //       localStorage.removeItem('accessToken');
  //       setIsLoading(false);
  //     }
  //   };

  //   validateToken();
  //   setIsClient(true);
  // }, [router]); // Add router as a dependency

  // Show loading state during validation
  // if (isLoading && isClient) {
  //   return (
  //     <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}>
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  // // Only render the full content when on the client and not loading
  // if (!isClient) {
  //   return <div className="min-h-screen"></div>; // Simple placeholder during SSR
  // }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background} transition-colors flex flex-col`}>
      {/* <Nav /> */}
      {/* Main Content - Side by side layout that stacks on mobile */}
      <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center px-6 py-8 gap-30">
        {/* Left Side Content */}
        {/* <LeftSideContent /> */}
        {/* Login Form - Right side on desktop, top on mobile */}
        <div className="w-full md:w-1/2 lg:w-4/12 max-w-md mb-8 md:mb-0">
          <AuthForm />
          {/* Trust indicators */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {/* <span className="text-xs text-gray-400">
                {t("Secure 256-bit SSL encryption")}
              </span> */}
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default AuthPage;