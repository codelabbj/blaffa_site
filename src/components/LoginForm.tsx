'use client';

import { useState, useEffect, useRef } from 'react';
// import { useTranslation } from 'react-i18next'; // Keeping translation optional for now based on image strictness
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import api from '@/lib/axios';

export default function LoginForm() {
    // const { t } = useTranslation();
    const { theme } = useTheme();

    // Login states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Forgot password states
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']); // 4 digit OTP
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // OTP input refs
    const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification(null);

        // Basic validation
        if (!email || !password) {
            setNotification({ type: 'error', message: 'Veuillez remplir tous les champs.' });
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                email_or_phone: email.replace(/\s+/g, ''),
                password
            };

            const response = await api.post('/auth/login', payload);

            console.log('Login response:', response.data);
            const { refresh, access, data } = response.data;

            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('accessToken', access);
            if (data && data.id) {
                localStorage.setItem('userId', data.id.toString());
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            // Initialize Push Notifications
            try {
                const { initializePushNotifications } = await import('@/lib/push-notifications');
                await initializePushNotifications();
            } catch (pushError) {
                console.error('Push Notification Initialization Error:', pushError);
            }

            setNotification({ type: 'success', message: 'Connexion réussie! Redirection...' });
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);

        } catch (error: any) {
            console.error('Login error:', error);
            let message = 'Une erreur est survenue.';

            if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.response?.status === 401) {
                message = 'Identifiants incorrects.';
            }

            setNotification({ type: 'error', message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification(null);

        try {
            if (forgotPasswordStep === 1) {
                // Step 1: Send OTP
                await api.post('/auth/send_otp', { email: forgotEmail });
                setNotification({ type: 'success', message: 'OTP envoyé à votre email.' });
                setForgotPasswordStep(2);
                setResendTimer(116); // Start 116 second countdown
            } else if (forgotPasswordStep === 2) {
                // Step 2: Verify OTP and move to password reset
                const otpCode = otp.join('');
                if (otpCode.length !== 4) {
                    setNotification({ type: 'error', message: 'Veuillez entrer le code complet.' });
                    setIsLoading(false);
                    return;
                }
                setForgotPasswordStep(3);
            } else if (forgotPasswordStep === 3) {
                // Step 3: Reset password
                if (newPassword !== confirmNewPassword) {
                    setNotification({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
                    setIsLoading(false);
                    return;
                }

                const otpCode = otp.join('');
                await api.post('/auth/reset_password', {
                    otp: otpCode,
                    new_password: newPassword,
                    confirm_new_password: confirmNewPassword
                });

                setForgotPasswordStep(4);
                // Auto redirect after 3 seconds
                setTimeout(() => {
                    handleBackToLogin();
                }, 3000);
            }
        } catch (error: any) {
            console.error('Forgot password error:', error);
            let message = 'Une erreur est survenue.';

            if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            setNotification({ type: 'error', message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        try {
            await api.post('/auth/send_otp', { email: forgotEmail });
            setNotification({ type: 'success', message: 'OTP renvoyé à votre email.' });
            setResendTimer(116);
        } catch (error: any) {
            setNotification({ type: 'error', message: 'Erreur lors de l\'envoi de l\'OTP.' });
        }
    };

    const handleBackToLogin = () => {
        setIsForgotPassword(false);
        setForgotPasswordStep(1);
        setForgotEmail('');
        setOtp(['', '', '', '']);
        setNewPassword('');
        setConfirmNewPassword('');
        setNotification(null);
    };

    // Render forgot password flow
    if (isForgotPassword) {
        return (
            <div className="w-full p-6 bg-transparent">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-700 mb-2">Réinitialiser le mot de passe</h1>
                </div>

                {/* Notification */}
                {notification && (
                    <div className={`mb-4 p-3 rounded text-sm ${notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"}`}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                    {/* Step 1: Email Input */}
                    {forgotPasswordStep === 1 && (
                        <>
                            <div className="space-y-2">
                                <label className="block text-sm font-normal text-gray-700">Adresse email pour recevoir l'OTP</label>
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70"
                            >
                                Réinitialiser le mot de passe
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleBackToLogin}
                                    className="text-sm text-[#1e40af] hover:underline font-medium"
                                >
                                    Retour
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 2: OTP Entry */}
                    {forgotPasswordStep === 2 && (
                        <>
                            <div className="space-y-4">
                                <label className="block text-sm font-normal text-gray-700">Entrez le code</label>
                                <div className="flex gap-3 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={otpRefs[index]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-16 h-16 text-center text-2xl font-semibold rounded-xl border-2 border-[#1e40af] bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70"
                            >
                                Réinitialiser le mot de passe
                            </button>

                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-gray-700">Pas reçu de code?</p>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0}
                                    className={`text-sm ${resendTimer > 0 ? 'text-gray-400' : 'text-[#1e40af] hover:underline'}`}
                                >
                                    Appuyez ici pour renvoyer l'OTP {resendTimer > 0 && `dans ${resendTimer} secondes`}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 3: New Password */}
                    {forgotPasswordStep === 3 && (
                        <>
                            <div className="space-y-4">
                                <label className="block text-sm font-normal text-gray-700">Nouveau mot de passe</label>

                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="ex: Tim00225@"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="ex: Tim00225@"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        required
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
                                disabled={isLoading}
                                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70"
                            >
                                Mise à jour
                            </button>
                        </>
                    )}

                    {/* Step 4: Success Message */}
                    {forgotPasswordStep === 4 && (
                        <>
                            <div className="text-center py-8">
                                <p className="text-lg text-gray-700 mb-6">Votre mot de passe a été changé avec succès</p>
                            </div>

                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-300"
                            >
                                Mise à jour
                            </button>
                        </>
                    )}
                </form>
            </div>
        );
    }

    // Regular login form
    return (
        <div className="w-full p-6 bg-transparent">
            {/* Header content matches image */}
            <div className="mb-8 ">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900 mb-2">Vous êtes de retour</h1>
                <p className="text-gray-500 text-sm">Faisons en sorte que cette journée soit exceptionnelle</p>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`mb-4 p-3 rounded text-sm ${notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"
                    }`}>
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email Field */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-900">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ex: johndoe@gmail.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                        required
                    />
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-900">Mot de passe</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-900 font-medium">Se Souvenir</span>
                    </label>

                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-sm font-medium text-[#FF6B6B] hover:text-[#ff5252]"
                    >
                        Mot de passe oublié ?
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    {isLoading ? 'Connexion...' : 'Connexion'}
                </button>

                {/* Register Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                        Vous avez pas un compte?{' '}
                        <Link href="/register" className="text-[#1e40af] font-bold hover:underline">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
