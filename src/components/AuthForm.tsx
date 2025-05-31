'use client';

import { useState } from 'react';
import axios from 'axios';
// import '../globals.css';

import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, User, Lock, Mail, ArrowRight, Phone } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { useTheme } from './ThemeProvider';
import api from '@/lib/axios';


//const API_URL = `https://api.blaffa.net/auth`;

const firebaseConfig = {
  apiKey: "AIzaSyCpYf8cR98sJ9Vw12ARlXFUqJyy3PSI1Vg",
  authDomain: "betpay-509eb.firebaseapp.com",
  projectId: "betpay-509eb",
  storageBucket: "betpay-509eb.firebasestorage.app",
  messagingSenderId: "827338495555",
  appId: "1:827338495555:web:9949d7c2caffe2b599e6f6",
  vapidKey: "BFHKpREc3F52Eb4uBMUMmfuQQBj7yd_5IjXK248ZeVKO7axslH2S3s09DEo5r1zwQ3Apz4xZnNiyNBmx3vVNv38"
};

export default function AuthForm() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  const [fullName, setFullName] = useState(''); // Full name for registration
  const [email, setEmail] = useState(''); // Email for registration and forgot password
  const [phone, setPhone] = useState(''); // Phone for registration
  const [emailOrPhone, setEmailOrPhone] = useState(''); // Email or phone for login
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For registration only
  const [otp, setOtp] = useState(''); // For forgot password OTP
  const [newPassword, setNewPassword] = useState(''); // For forgot password new password
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // For forgot password confirm new password
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  // Add these state variables to your component
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();




  const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const isValidEmailOrPhone = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || /^\+?\d+$/.test(input);
  const isValidEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  const initializeFCM = async () => {
    try {
      // Initialize Firebase app if not already initialized
      const app = initializeApp(firebaseConfig);
      
      // Get messaging instance
      const messaging = getMessaging(app);
      
      // Request permission for notifications (required for web)
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Get token with your VAPID key
        const currentToken = await getToken(messaging, {
          vapidKey: firebaseConfig.vapidKey
        });
        
        if (currentToken) {
          console.log('FCM token received:', currentToken);
          // Here you can send this token to your backend
          return currentToken;
        } else {
          console.log('No registration token available. Request permission to generate one.');
          return null;
        }
      } else {
        console.log('Notification permission denied.');
        return null;
      }
    } catch (error) {
      console.error('Error initializing FCM:', error);
      return null;
    }
  };
  
  // Modify your handleSubmit function to include FCM initialization
  // This is how your handleSubmit function should look after modification:
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isForgotPassword) {
      handleForgotPasswordSubmit();
      return;
    }
  
    if (isLogin) {
      // Login validation
      if (!isValidEmailOrPhone(emailOrPhone)) {
        setNotification({ type: 'error', message: t('Invalid email or phone number') });
        return;
      }
    } else {
      // Registration validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setNotification({ type: 'error', message: t('Invalid email address') });
        return;
      }
      if (!/^\+?\d+$/.test(phone)) {
        setNotification({ type: 'error', message: t('Invalid phone number') });
        return;
      }
      if (!isValidPassword(password)) {
        setNotification({
          type: 'error',
          message: t(
            'The password must include at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long.'
          ),
        });
        return;
      }
      if (password !== confirmPassword) {
        setNotification({ type: 'error', message: t('Passwords do not match') });
        return;
      }
    }
  
    const payload = isLogin
      ? { email_or_phone: emailOrPhone, password }
      : {
          first_name: fullName.split(' ')[0] || '',
          last_name: fullName.split(' ')[1] || '',
          email,
          phone,
          phone_indicative: '+229',
          password,
          re_password: confirmPassword,
        };
  
        setIsLoading(true); // Set loading to true when login starts
  
  
    try {
      const response = await api.post(
        `/auth/${isLogin ? 'login' : 'registration'}`,
        payload
      );
  
      if (isLogin) {
        const { refresh, access } = response.data;
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('accessToken', access);

        // Set up axios default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        // Initialize FCM after successful login
        try {
          const fcmToken = await initializeFCM();
          if (fcmToken) {
            // Optionally send the token to your backend
            await api.post(
              `/blaffa/devices/`,
              { registration_id: fcmToken,
                type: 'web',
               },
              { 
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${access}`
                } 
              }
            );
            console.log('Device registered for notifications:', fcmToken);
          }
        } catch (fcmError) {
          console.error('Error registering device for notifications:', fcmError);
          // Non-critical error, don't block the login process
        }
        
        setNotification({ type: 'success', message: t('Login successful! Redirecting to your dashboard...') });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } else {
        setNotification({ type: 'success', message: t('Registration successful! Please login.') });
        setIsLogin(true);
        
      }
    } catch (error: unknown) {
      handleApiError(error);
    }finally {
      setIsLoading(false); // Set loading to false when login or registration is complete
    }
  };
  

  const handleForgotPasswordSubmit = async () => {
    try {
      if (forgotPasswordStep === 1) {
        // Step 1: Send email for OTP
        if (!isValidEmail(email)) {
          setNotification({ type: 'error', message: t('Please enter a valid email address') });
          return;
        }
        
        await api.post(`/send_otp`, { email });
        
        setNotification({ type: 'success', message: t('OTP has been sent to your email', 'if you cant see it check your Junk older as well') });
        setForgotPasswordStep(2);
      } 
      else if (forgotPasswordStep === 2) {
        // Step 2: Verify OTP and move to password reset
        if (!otp || otp.length < 4) {
          setNotification({ type: 'error', message: t('Please enter a valid OTP') });
          return;
        }
        
        // We don't need to verify OTP here, just move to the next step
        setNotification({ type: 'success', message: t('OTP verified successfully') });
        setForgotPasswordStep(3);
      } 
      else if (forgotPasswordStep === 3) {
        // Step 3: Reset password
        if (!isValidPassword(newPassword)) {
          setNotification({
            type: 'error',
            message: t(
              'The new password must include at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long.'
            ),
          });
          return;
        }
        
        if (newPassword !== confirmNewPassword) {
          setNotification({ type: 'error', message: t('Passwords do not match') });
          return;
        }
        
        const resetPayload = {
          otp,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword
        };
        
        await api.post(`/reset_password`, resetPayload);
        
        setNotification({ type: 'success', message: t('Password reset successful! Please login with your new password.') });
        // Reset states
        setIsForgotPassword(false);
        setForgotPasswordStep(1);
        setIsLogin(true);
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        setEmail('');
      }
    } catch (error: unknown) {
      handleApiError(error);
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setForgotPasswordStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setEmail('');
  };

  

  // Render forgot password form based on current step
  const renderForgotPasswordForm = () => {
    switch (forgotPasswordStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">{t('Forgot Password')}</h2>
            <p className="text-sm text-center">{t('Enter your email to receive a verification code')}</p>
            
            <div>
              <label className="block text-sm font-medium">{t('Email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t("Enter your email or phone")}
                    className="bg-gray-700 text-white w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300  relative overflow-hidden group`}
              >
              {t('Send Verification Code')}
            </button>
            
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 mt-2"
            >
              {t('Back to Login')}
            </button>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">{t('Enter Verification Code')}</h2>
            <p className="text-sm text-center">{t('We sent a code to your email. Please enter it below.')}</p>
            
            <div>
              <label className="block text-sm font-medium">{t('Verification Code')}</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 border rounded"
                placeholder={t('Enter verification code')}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              {t('Verify Code')}
            </button>
            
            <button
              type="button"
              onClick={() => setForgotPasswordStep(1)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 mt-2"
            >
              {t('Back')}
            </button>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">{t('Reset Password')}</h2>
            <p className="text-sm text-center">{t('Create a new password for your account')}</p>
            
            <div>
              <label className="block text-sm font-medium">{t('New Password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border rounded"
            placeholder={t('Enter new password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium">{t('Confirm New Password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full p-3 border rounded"
            placeholder={t('Confirm new password')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
            </div>
            
            <button
              type="submit"
              className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 relative overflow-hidden group`}
              >
              {t('Reset Password')}
            </button>
            
            <button
              type="button"
              onClick={() => setForgotPasswordStep(2)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 mt-2"
            >
              {t('Back')}
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Improved error handling function to make API errors more user-friendly
  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      
      // Log the full error for debugging
      console.error('API Error:', status, data);
      
      // Case 1: Direct message format: {"success":false,"message":"Error message"}
      if (data.message && typeof data.message === 'string') {
        setNotification({ type: 'error', message: data.message });
        return;
      }

      
      // Case 2: Field-specific errors without nested 'errors' object
      // Format: {"email": ["Error message"], "phone": ["Error message"]}
      const fieldErrors: string[] = [];
      
      // Check if data contains field-specific errors directly
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        let hasFieldErrors = false;
        
        Object.entries(data).forEach(([field, messages]) => {
          // Skip non-array fields or success/status indicators
          if (Array.isArray(messages) && field !== 'success' && field !== 'status') {
            hasFieldErrors = true;
            const fieldMessage = messages.join(', ');
            fieldErrors.push(`${field}: ${fieldMessage}`);
          }
        });
        
        if (hasFieldErrors) {
          setNotification({ 
            type: 'error', 
            message: t('Please correct the following:') + '\n' + fieldErrors.join('\n') 
          });
          return;
        }
      }
      
      // Case 3: Errors nested in an 'errors' property
      if (data.errors && typeof data.errors === 'object') {
        const errorMessages = Object.entries(data.errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        
        setNotification({ 
          type: 'error', 
          message: t('Please correct the following:') + '\n' + errorMessages 
        });
        return;
      }
      
      // Fall back to status-code based generic messages if no specific error format is detected
      switch (status) {
        case 400:
          setNotification({ 
            type: 'error', 
            message: t('There was a problem with your request. Please check your information and try again.') 
          });
          break;
          
        case 401:
          setNotification({ 
            type: 'error', 
            message: t('Authentication failed. Please check your credentials and try again.') 
          });
          break;
          
        case 403:
          setNotification({ 
            type: 'error', 
            message: t('You do not have permission to perform this action.') 
          });
          break;
          
        case 404:
          setNotification({ 
            type: 'error', 
            message: t('The requested resource was not found. Please try again later.') 
          });
          break;
          
        case 422:
          setNotification({ 
            type: 'error', 
            message: t('Validation failed. Please check your information and try again.') 
          });
          break;
          
        case 429:
          setNotification({ 
            type: 'error', 
            message: t('Too many requests. Please wait a moment and try again.') 
          });
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          setNotification({ 
            type: 'error', 
            message: t('Server error. Our team has been notified. Please try again later.') 
          });
          break;
          
        default:
          setNotification({ 
            type: 'error', 
            message: t('An error occurred. Please try again later.') 
          });
      }
    } else {
      // For non-Axios errors
      console.error('Non-API Error:', error);
      setNotification({ 
        type: 'error', 
        message: t('Connection error. Please check your internet connection and try again.') 
      });
    }
  };

  return (
   <div className={`bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm rounded-2xl p-8 shadow-xl`}>
        {/* {!isForgotPassword && (
          <h2 className={`text-2xl font-bold text-center mb-6 ${theme.colors.text}`}>
            {t("Welcome to Blaffa")}
          </h2>
        )} */}

        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-3 rounded ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {notification.message.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}

        {!isForgotPassword && (
          <div className="flex justify-around mb-6 font-bold">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 font-medium text-center transition-all ${
                isLogin ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-white rounded-lg" : "bg-transparent"
              }`}
            >
              {t("Login")}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 font-medium text-center transition-all ${
                !isLogin ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 rounded-lg" : "bg-transparent"
              }`}
            >
              {t("Register")}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isForgotPassword ? (
            renderForgotPasswordForm()
          ) : (
            <>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium">
                    {t("Full Name")}
                  </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder={t("Enter your full name")}
                        className="bg-gray-700 text-white w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  
                </div>
              )}

              {isLogin ? (
                <div>
                  <label className="block text-sm font-medium">
                    {t("Email or Phone")}
                  </label>
                  <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                      placeholder={t("Enter your email or phone")}
                      className="bg-gray-700 text-white w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium">
                      {t("Email")}
                    </label>
                    <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("Enter your email")}
                    className="bg-gray-700 text-white w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      {t("Phone")}
                    </label>
                    <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder={t("Enter your phone number")}
                    className="bg-gray-700 text-white w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                   
                  </div>
                </>
              )}

              {isLogin && (
                <div>
                  <label className="block text-sm font-medium">
                    {t("Password")}
                  </label>
                  <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("Enter your password")}
                    className="bg-gray-700 text-white w-full pl-10 pr-10 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                </div>
              )}

              {!isLogin && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium">
                      {t("Password")}
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-700 text-white w-full pl-10 pr-10 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={t("Enter your password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium">
                      {t("Confirm Password")}
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-gray-700 text-white w-44 pl-10 pr-10 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={t("Confirm your password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                     >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setForgotPasswordStep(1);
                    }}
                    className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                    {t("Forgot Password?")}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center duration-300 ${isLoading ? 'animate-pulse' : ''} relative overflow-hidden group"
              >
                <span className="flex items-center justify-center relative z-10">
                {isLogin ? (isLoading ? t('Processing...') : t('Log in')) : (isLoading ? t('Processing...') : t('Register'))}
                  
                  <ArrowRight className={`ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 ${isLoading ? 'animate-bounce' : ''}`} />
                </span>
                
                {/* Button animation overlay */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 duration-300"></span>
              
                
              </button>
            </>
          )}
        </form>
      
    </div>
  );
}