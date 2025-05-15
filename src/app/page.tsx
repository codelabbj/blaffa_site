// 'use client';
// import { useState, useEffect } from 'react';
// import Nav from '../components/navbar';
// import LeftSideContent from '../components/left_side_content';
// import Footer from '../components/footer';
// import AuthForm from '../components/AuthForm';
// // import { useRouter } from 'next/navigation';
// // import axios from 'axios';

// // Proper initialization for i18n
// import { useTranslation } from 'react-i18next';

// export default function Home() {
//   const [mounted, setMounted] = useState(false);
//   // The t function will be initialized properly after component mounts
//   const { t } = useTranslation(); // Initialize the translation function
  
//   // const router = useRouter();

//   useEffect(() => {
//     // Initialize i18n only on the client side
//     const initI18n = async () => {
//       try {
//         // Dynamic import to ensure this only runs on client side
//         // No need to dynamically import or call useTranslation here
//         console.log('i18n initialized');
//       } catch (error) {
//         console.error('Failed to initialize i18n:', error);
//       } finally {
//         setMounted(true);
//       }
//     };
//     initI18n();
    
//     // Your original token validation logic can go here
//     // const checkToken = async () => {
//     //   try {
//     //     const token = localStorage.getItem('accessToken');
//     //     if (!token) {
//     //       console.log('No token found');
//     //       return;
//     //     }
//     //
//     //     // Verify the token with the backend
//     //     const response = await axios.get('https://api.yapson.net/auth/me', {
//     //       headers: {
//     //         Authorization: `Bearer ${token}`,
//     //       },
//     //     });
//     //
//     //     // If the token is valid, redirect to the dashboard
//     //     if (response.status === 200) {
//     //       router.push('/dashboard');
//     //     }
//     //   } catch (error) {
//     //     console.error('Token validation failed:', error);
//     //   }
//     // };
//     //
//     // checkToken();
//   }, []);

//   // Show a simple loading state until the component is fully mounted
//   // Show a simple loading state until the component is fully mounted
//   // The t function is now directly available from useTranslation
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//         <div className="animate-pulse">Loading...</div>
//       </div>
//     );
  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors flex flex-col">
//       <Nav />
//       {/* Main Content - Side by side layout that stacks on mobile */}
//       <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center px-6 py-8 gap-30">
//         {/* Left Side Content */}
//         <LeftSideContent />
//         {/* Login Form - Right side on desktop, top on mobile */}
//         <div className="w-full md:w-1/2 lg:w-4/12 max-w-md mb-8 md:mb-0">
//           <AuthForm />
//           {/* Trust indicators */}
//           <div className="mt-4 text-center">
//             <div className="flex items-center justify-center space-x-2">
//               <svg
//                 className="w-5 h-5 text-green-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span className="text-xs text-gray-400">
//                 {t("Secure 256-bit SSL encryption")}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }






















// 'use client';
// import Nav from '../components/navbar';
// import LeftSideContent from '../components/left_side_content';
// import Footer from '../components/footer';
// import AuthForm from '../components/AuthForm';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';
// import { useTheme } from '../components/ThemeProvider';

// const HomePage: React.FC = () => {
//   const { t } = useTranslation();
//   const [isClient, setIsClient] = useState(false);
//   const router = useRouter(); // Next.js router for navigation

//   const checkToken = async () => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         console.log('No token found');
//         return; // Allow user to stay on the home page
//       }

//       // Verify the token with the backend
//       const response = await axios.get('https://api.yapson.net/auth/me', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // If the token is valid, redirect to the dashboard
//       if (response.status === 200) {
//         router.push('/dashboard'); // Redirect to the dashboard
//       }
//     } catch (error) {
//       console.error('Token validation failed:', error);
//       // If the token is invalid, allow the user to stay on the home page
//     }
//   };

//   useEffect(() => {
//     checkToken();
//     setIsClient(true); // Mark the component as mounted on the client
//   }, []);

//   const { theme } = useTheme();

//   // Only render the full content when on the client
//   if (!isClient) {
//     return <div className="min-h-screen "></div>; // Simple placeholder during SSR
//   }

//   return (
//     <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background} transition-colors flex flex-col`}>
//       <Nav />
//       {/* Main Content - Side by side layout that stacks on mobile */}
//       <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center px-6 py-8 gap-30">
//         {/* Left Side Content */}
//         <LeftSideContent />
//         {/* Login Form - Right side on desktop, top on mobile */}
//         <div className="w-full md:w-1/2 lg:w-4/12 max-w-md mb-8 md:mb-0">
//           <AuthForm />
//           {/* Trust indicators */}
//           <div className="mt-4 text-center">
//             <div className="flex items-center justify-center space-x-2">
//               <svg
//                 className="w-5 h-5 text-green-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span className="text-xs text-gray-400">
//                {t("Secure 256-bit SSL encryption")}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
// export default HomePage;




















'use client';
import Nav from '../components/navbar';
import LeftSideContent from '../components/left_side_content';
import Footer from '../components/footer';
import AuthForm from '../components/AuthForm';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useTheme } from '../components/ThemeProvider';

const HomePage: React.FC = () => {
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
        const response = await axios.get('https://api.yapson.net/auth/me', {
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

  // Show loading state during validation
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
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background} transition-colors flex flex-col`}>
      <Nav />
      {/* Main Content - Side by side layout that stacks on mobile */}
      <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center px-6 py-8 gap-30">
        {/* Left Side Content */}
        <LeftSideContent />
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
              <span className="text-xs text-gray-400">
                {t("Secure 256-bit SSL encryption")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;