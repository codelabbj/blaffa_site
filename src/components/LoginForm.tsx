'use client';

import { useState } from 'react';
// import { useTranslation } from 'react-i18next'; // Keeping translation optional for now based on image strictness
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import api from '@/lib/axios';
export default function LoginForm() {
    // const { t } = useTranslation();
    const { theme } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

                    <button type="button" className="text-sm font-medium text-[#FF6B6B] hover:text-[#ff5252]">
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
