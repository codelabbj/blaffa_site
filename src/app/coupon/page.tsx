"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import StaticImageData
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../components/ThemeProvider'; 
import api from '@/lib/axios';
import DashboardHeader from '@/components/DashboardHeader';
// Define the type for a single coupon object
interface Coupon {
  id: string; // Assuming id is a string based on usage
  images: string[]; // Assuming images is an array of strings (URLs)
  created_at: string; // Assuming created_at is a string
  // Add any other properties that the coupon object might have
}

const CouponPage = () => {
  // Use the Coupon type for the coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Explicitly type error state
  // selectedImage can be a string (URL) or null
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t } = useTranslation();
  const { theme } = useTheme(); // Use the theme from ThemeProvider

  // Replace with your actual base URL and token
 // const BASE_URL = 'https://api.blaffa.net';

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token
    if (!accessToken) {
        console.error(t('No access token found.'));
        // Consider using Next.js router for navigation
        window.location.href = '/';
        return;
    }
    fetchCoupons(accessToken); // Pass accessToken to fetchCoupons
  }, []); // Add t to dependency array as it comes from useTranslation

  // Accept accessToken as a parameter
  const fetchCoupons = async (accessToken: string) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await api.get(`/blaffa/coupon`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        // Attempt to read error message from response body
        const errorData = await response.data.catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      const data = await response.data;
      // Ensure data.results is an array before setting state
      if (Array.isArray(data.results)) {
         setCoupons(data.results);
      } else {
         console.error('API response results is not an array:', data);
         setCoupons([]); // Set to empty array if results is not as expected
      }


    } catch (err) { // Use 'any' or a more specific error type if known
      console.error('Error fetching coupons:', err);
      // Set a user-friendly error message
      //setError(`Failed to load coupons: ${err.message || 'Please check your token and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Correct the type for imageUrl to string
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const formatDate = (dateString: string | number | Date) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    } catch (e) {
        console.error("Failed to parse date:", dateString, e);
        return "Invalid Date"; // Return a fallback string
    }
  };

  if (loading) {
  return (
    <>
      <Head>
        <title>Coupons - blaffa</title>
        <meta name="description" content="View all available coupons" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
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
            
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: translateY(30px) scale(0.9);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes backdropFadeIn {
              from {
                opacity: 0;
                backdrop-filter: blur(0px);
              }
              to {
                opacity: 1;
                backdrop-filter: blur(8px);
              }
            }
            
            .shimmer-effect {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
              background-size: 200px 100%;
              animation: shimmer 2s infinite;
            }
            
            .modal-backdrop {
              animation: backdropFadeIn 0.3s ease-out;
            }
            
            .modal-content {
              animation: modalSlideIn 0.4s ease-out;
            }
          `}
        </style>
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"></div>
          </div>
          <p className="text-slate-300 text-lg font-medium">Loading coupons...</p>
        </div>
      </div>
    </>
  );
}

if (error) {
  return (
    <>
      <Head>
        <title>Coupons - blaffa</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
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
        <div className="text-center max-w-md bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 p-8" style={{ animation: 'slideInUp 0.6s ease-out' }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400 shadow-lg shadow-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Coupons</h2>
          <p className="text-slate-400 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => {
               const accessToken = localStorage.getItem('accessToken');
               if (accessToken) {
                  fetchCoupons(accessToken);
               } else {
                  console.error(t('No access token found for retry.'));
                  window.location.href = '/';
               }
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    </>
  );
}

return (
  <>
    <Head>
      <title>Coupons - blaffa</title>
      <meta name="description" content="View all available coupons from blaffa" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

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
          
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes backdropFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(8px);
            }
          }
          
          .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }
          
          .modal-backdrop {
            animation: backdropFadeIn 0.3s ease-out;
          }
          
          .modal-content {
            animation: modalSlideIn 0.4s ease-out;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {/* <div>
            <h1 className="text-3xl font-bold  mb-2">{t("Available Coupons")}</h1>
            <p className="text-slate-400">Discover amazing deals and offers</p>
          </div> */}
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* <button
              onClick={() => {
                 const accessToken = localStorage.getItem('accessToken');
                 if (accessToken) {
                    fetchCoupons(accessToken);
                 } else {
                    console.error(t('No access token found for refresh.'));
                    window.location.href = '/';
                 }
              }}
              className="flex items-center  bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button> */}
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-white bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("Back")}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`bg-gradient-to-r ${theme.colors.s_background} backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden`}>
          <div className="p-8">
            {coupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-600/20 to-slate-500/20 text-slate-400 shadow-lg flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold e mb-3">{t("No Coupons Available")}</h3>
                {/* <p className="text-slate-400 text-center max-w-md leading-relaxed">{t("Check back later for amazing deals and offers!")}</p> */}
              </div>
            ) : (
              <div className="space-y-6">
                {coupons.map((coupon: Coupon, couponIndex: number) => (
                  <div 
                    key={coupon.id} 
                    className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/30 rounded-2xl transition-all duration-500 hover:from-slate-600/50 hover:to-slate-500/50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20`}
                    style={{
                      animation: `slideInUp 0.6s ease-out ${couponIndex * 100}ms both`
                    }}
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Coupon Header */}
                    <div className="relative bg-gradient-to-r from-blue-600/80 to-blue-600/80 backdrop-blur-sm px-6 py-4 border-b border-slate-600/30">
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center">
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mr-3">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            Coupon #{coupon.id.slice(0, 8)}
                          </h3>
                          <p className="text-blue-100 text-sm mt-1">Created: {formatDate(coupon.created_at)}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium border border-white/10">
                          {coupon.images.length} Image{coupon.images.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Images Grid */}
                    <div className="relative p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {coupon.images.map((imageUrl: string, index: number) => (
                          <div
                            key={index}
                            className="relative group/image cursor-pointer rounded-xl overflow-hidden bg-slate-800/50 aspect-square border border-slate-600/30 hover:border-blue-500/50 transition-all duration-300"
                            onClick={() => handleImageClick(imageUrl)}
                            style={{
                              animation: `slideInUp 0.6s ease-out ${(index + 1) * 100}ms both`
                            }}
                          >
                            <Image
                              src={imageUrl}
                              alt={`Coupon image ${index + 1}`}
                              fill
                              className="object-cover group-hover/image:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/image:opacity-100 transform scale-75 group-hover/image:scale-100 transition-all duration-300 border border-white/20">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Image number indicator */}
                            <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-sm font-medium border border-white/10">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop" 
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full modal-content">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:text-slate-300 hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-600/50 shadow-2xl">
              <Image
                src={selectedImage}
                alt="Coupon image enlarged"
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  </>
);
};

export default CouponPage;