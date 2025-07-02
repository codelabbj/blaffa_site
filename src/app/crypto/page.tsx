"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import CryptoTransactionForm from '@/components/CryptoTransactionForm';
import { FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

interface Crypto {
  id: number;
  public_amount: number;
  created_at: string;
  updated_at: string;
  logo: string;
  code: string;
  name: string;
  amount: string;
  symbol: string;
}

const CRYPTO_API = "https://api.blaffa.net/blaffa/crypto";
const CHECK_USER_STATUS_API = "https://api.blaffa.net/auth/check-user-account-status";
const UPLOAD_API = "https://api.blaffa.net/blaffa/upload/file";

export default function CryptoPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [userVerified, setUserVerified] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);

  useEffect(() => {
    // Fetch cryptos
    const fetchCryptos = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(CRYPTO_API, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        setCryptos(Array.isArray(response.data.results) ? response.data.results : []);
      } catch {
        setError(t("Failed to fetch cryptocurrencies"));
      } finally {
        setLoading(false);
      }
    };
    fetchCryptos();
    // Get userId from localStorage (assuming it's stored there)
    const uid = localStorage.getItem("userId");
    if (uid) {
      setUserId(uid);
    } else {
      // Fallback: fetch user profile if accessToken exists
      const token = localStorage.getItem("accessToken");
      if (token) {
        api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => {
            const profile = res.data;
            if (profile && profile.id) {
              localStorage.setItem("userId", profile.id.toString());
              setUserId(profile.id.toString());
            }
          })
          .catch(() => {});
      }
    }
    // Force language to French
    i18n.changeLanguage('fr');
    // eslint-disable-next-line no-console
    console.log('Current language:', i18n.language, 'Back:', t('Back'));
  }, [i18n.language]);

  // Check user verification status ONCE per mount, when userId is available
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    const checkStatus = async () => {
      setStatusLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(CHECK_USER_STATUS_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ user_id: userId }),
        });
        const data = await response.json();
        const verified = data.is_verified ?? data.is_verify ?? false;
        if (isMounted) setUserVerified(!!verified);
      } catch {
        if (isMounted) setUserVerified(false);
      } finally {
        if (isMounted) setStatusLoading(false);
      }
    };
    checkStatus();
    return () => { isMounted = false; };
  }, [userId]);

  // When user selects a crypto
  const handleCryptoSelect = (crypto: Crypto) => {
    if (!userId) {
      setError(t("User ID not found. Please log in."));
      return;
    }
    if (userVerified) {
      setSelectedCrypto(crypto);
    } else {
      setShowVerifyModal(true);
    }
  };

  // Handle image upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);
    if (!userImage || !cardImage) {
      setUploadError(t("Please select both images."));
      setUploading(false);
      return;
    }
    try {
      const formData = new FormData();
      // Try different field name combinations
      // Option 1: Both files with same field name (array)
      // formData.append("user_card[]", userImage);
      // formData.append("user_card[]", cardImage);
      
      // Option 2: Individual field names (matching server response)
      formData.append("file", userImage);
      formData.append("image", cardImage);
      
      // Option 3: Try with different field names (uncomment if others don't work)
      // formData.append("user_image", userImage);
      // formData.append("card_image", cardImage);
      
      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (const pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }
      
      const token = localStorage.getItem("accessToken");
      
      // Use fetch directly to avoid axios header conflicts
      const response = await fetch(UPLOAD_API, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      
      // Debug: Log response details
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Upload response:", result);
      
      setShowVerifyModal(false);
      setSuccessMessage(t("Images uploaded. Please wait for admin verification."));
      setShowSuccessModal(true);
      setUserVerified(false);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(t("Failed to upload images. Try again."));
    } finally {
      setUploading(false);
    }
  };

  // Top right status button
  const renderStatusButton = () => {
    // Mobile: fixed at top right, Desktop: normal
    const baseClass =
      'rounded-full flex items-center justify-center shadow-md transition-all';
    const sizeClass = 'w-9 h-9 text-xl';
    const mobileClass =
      'fixed top-3 right-3 z-50 sm:static sm:top-auto sm:right-auto';
    if (statusLoading)
      return (
        <span
          className={`${baseClass} ${sizeClass} ${mobileClass} bg-gray-300 animate-spin text-blue-500`}
          title={t("Checking...")}
        >
          <ImSpinner2 />
        </span>
      );
    if (userVerified === true)
      return (
        <span
          className={`${baseClass} ${sizeClass} ${mobileClass} bg-green-500 text-white`}
          title={t("Verified")}
        >
          <FaCheckCircle />
        </span>
      );
    return (
      <span
        className={`${baseClass} ${sizeClass} ${mobileClass} bg-yellow-400 text-white`}
        title={t("Not Verified")}
      >
        <FaExclamationTriangle />
      </span>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} p-2 sm:p-4 flex flex-col items-center`}>
      <button
        onClick={() => window.history.back()}
        className={`fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center rounded-full shadow-md
           bg-transparent text-blue-600 dark:text-blue-200  transition-all`}
        aria-label={t('Back to Crypto')}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <FaArrowLeft className="text-xl" />
      </button>
      <div className="w-full max-w-screen-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left w-full sm:w-auto">{t("Cryptocurrencies")}</h1>
          <div className="flex justify-center sm:justify-end w-full sm:w-auto relative">{renderStatusButton()}</div>
        </div>
        {error && <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">{error}</div>}
        {selectedCrypto ? (
          <>
            <button
              className={
                `mb-4 flex items-center gap-2 rounded-lg shadow-sm font-semibold transition-all
                px-2 py-1 sm:px-4 sm:py-2
                text-base sm:text-lg
                ${theme.mode === 'dark' ? 'bg-slate-800 text-blue-300 hover:bg-slate-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}
                `
              }
              style={{ border: `1px solid ${theme.colors.accent}` }}
              onClick={() => setSelectedCrypto(null)}
            >
              <FaArrowLeft className="text-lg sm:mr-2" />
              <span className="hidden sm:inline">{t('Back to Cryptos')}</span>
            </button>
            <CryptoTransactionForm
              isVerified={userVerified === true}
              crypto={selectedCrypto}
            />
          </>
        ) : loading ? (
          <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {cryptos.map((crypto) => (
              <div
                key={crypto.id}
                className={`group relative overflow-hidden bg-gradient-to-br ${theme.colors.s_background} border border-slate-600/30 rounded-2xl p-4 sm:p-6 flex flex-col items-center shadow-md hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer`}
                onClick={() => handleCryptoSelect(crypto)}
              >
                <img src={crypto.logo} alt={crypto.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain mb-3 sm:mb-4 rounded-full border border-slate-300 bg-white" />
                <div className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-center">{crypto.name}</div>
                <div className="text-slate-400 text-xs sm:text-sm mb-1">{crypto.symbol}</div>
                <div className="text-blue-500 font-mono text-2xl sm:text-3xl font-extrabold">{crypto.public_amount}xof</div>
              </div>
            ))}
          </div>
        )}

        {/* Verification Modal */}
        {showVerifyModal && !userVerified && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 sm:px-0">
            <div className={`bg-gradient-to-r ${theme.colors.a_background} rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md relative`}>
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">{t("Account Verification Required")}</h2>
              <form onSubmit={handleUpload}>
                <div className="mb-3 sm:mb-4">
                  <label className="block mb-1 sm:mb-2 text-sm sm:text-base font-semibold">{t("Upload your image (face)")}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setUserImage(e.target.files?.[0] || null)}
                    className="w-full text-xs sm:text-sm border rounded p-2"
                  />
                  {userImage && (
                    <div className="mt-2 flex justify-center">
                      <img src={URL.createObjectURL(userImage)} alt="Preview" className="h-20 w-20 object-cover rounded shadow" />
                    </div>
                  )}
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block mb-1 sm:mb-2 text-sm sm:text-base font-semibold">{t("Upload your card image (ID card)")}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setCardImage(e.target.files?.[0] || null)}
                    className="w-full text-xs sm:text-sm border rounded p-2"
                  />
                  {cardImage && (
                    <div className="mt-2 flex justify-center">
                      <img src={URL.createObjectURL(cardImage)} alt="Preview" className="h-20 w-20 object-cover rounded shadow" />
                    </div>
                  )}
                </div>
                {uploadError && <div className="mb-2 text-red-600 text-xs sm:text-sm text-center">{uploadError}</div>}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
                  <button
                    type="button"
                    className="w-full sm:flex-1 px-4 py-2 bg-gray-400 dark:bg-slate-700 rounded hover:bg-gray-300 dark:hover:bg-slate-600 text-sm sm:text-base"
                    onClick={() => setShowVerifyModal(false)}
                    disabled={uploading}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
                    disabled={uploading}
                  >
                    {uploading ? t("Uploading...") : t("Upload & Submit")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 sm:px-0">
            <div className={`bg-gradient-to-r ${theme.colors.a_background} rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md relative`}>
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-green-600">{t("Success")}</h2>
              <div className="mb-6 text-center text-base sm:text-lg">{successMessage}</div>
              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-base"
                  onClick={() => setShowSuccessModal(false)}
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 