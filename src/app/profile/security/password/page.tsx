'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const router = useRouter();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field: keyof typeof showPassword) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error(t('Passwords do not match'));
            return;
        }

        if (formData.newPassword.length < 8) {
            toast.error(t('Password must be at least 8 characters long'));
            return;
        }

        try {
            // Assuming endpoint /auth/set_password or similar. 
            // In Djoser it's /auth/users/set_password/ but let's try /auth/set_password based on project patterns.
            const response = await api.post(`/auth/set_password`, {
                current_password: formData.currentPassword,
                new_password: formData.newPassword,
                re_new_password: formData.confirmPassword,
            });

            if (response.status === 204 || response.status === 200) {
                toast.success(t('Password updated successfully!'));
                router.push('/profile');
            }
        } catch (error: any) {
            console.error('Error updating password:', error);
            const errorMessage = error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.current_password?.[0] ||
                t('Failed to update password. Please check your current password.');
            toast.error(errorMessage);
        }
    };

    return (
        <div className={`min-h-screen ${theme.mode === 'dark' ? 'bg-slate-900' : 'bg-white'} pb-24`}>
            <Head>
                <title>{t("Modifier le mot de passe")}</title>
            </Head>

            <div className="animate-in slide-in-from-bottom-10 fade-in duration-500 min-h-screen">
                <div className="bg-[#003399] pt-14 pb-12 px-6 rounded-b-[3.5rem] relative mb-12 shadow-2xl shadow-blue-900/40">
                    <button
                        onClick={() => router.push('/profile')}
                        className="absolute top-14 left-6 text-white hover:opacity-70 transition-opacity"
                    >
                        <ChevronLeft size={36} />
                    </button>
                    <h2 className="text-white text-2xl font-bold text-center mt-1">Sécurité</h2>

                    <div className="flex flex-col items-center mt-12">
                        <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
                            <Lock className="text-white w-16 h-16" />
                        </div>
                        <h3 className="text-white text-3xl font-bold mb-1">Mot de passe</h3>
                        <p className="text-blue-100/70 text-lg font-medium tracking-wide">Modifier votre mot de passe</p>
                    </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="px-6 space-y-10 pb-36 max-w-lg mx-auto">
                    <h4 className="text-[#002266] dark:text-blue-300 text-2xl font-extrabold mb-8">Nouveau mot de passe</h4>

                    <div className="space-y-8">
                        {/* Current Password */}
                        <div className="relative group">
                            <label className="absolute -top-3.5 left-6 px-1.5 text-gray-400 dark:text-gray-500 text-sm font-bold bg-white dark:bg-slate-900 group-focus-within:text-blue-600 transition-colors">Mot de passe actuel</label>
                            <div className="flex items-center bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-5">
                                    <Lock className="text-blue-600" size={28} />
                                </div>
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    name="currentPassword"
                                    placeholder="••••••••"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="flex-1 text-xl font-bold bg-transparent outline-none text-gray-900 dark:text-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword.current ? <EyeOff size={24} /> : <Eye size={24} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="relative group">
                            <label className="absolute -top-3.5 left-6 px-1.5 text-gray-400 dark:text-gray-500 text-sm font-bold bg-white dark:bg-slate-900 group-focus-within:text-blue-600 transition-colors">Nouveau mot de passe</label>
                            <div className="flex items-center bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-5">
                                    <Lock className="text-blue-600" size={28} />
                                </div>
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="••••••••"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="flex-1 text-xl font-bold bg-transparent outline-none text-gray-900 dark:text-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword.new ? <EyeOff size={24} /> : <Eye size={24} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative group">
                            <label className="absolute -top-3.5 left-6 px-1.5 text-gray-400 dark:text-gray-500 text-sm font-bold bg-white dark:bg-slate-900 group-focus-within:text-blue-600 transition-colors">Confirmer le nouveau mot de passe</label>
                            <div className="flex items-center bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-5">
                                    <Lock className="text-blue-600" size={28} />
                                </div>
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="flex-1 text-xl font-bold bg-transparent outline-none text-gray-900 dark:text-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword.confirm ? <EyeOff size={24} /> : <Eye size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#003399] text-white py-6 rounded-[2rem] flex items-center justify-center gap-4 text-2xl font-bold shadow-2xl shadow-blue-500/30 mt-12 active:scale-[0.98] transition-all hover:bg-[#002b80]"
                    >
                        <Save size={28} />
                        Modifier le mot de passe
                    </button>
                </form>
            </div>
        </div>
    );
}
