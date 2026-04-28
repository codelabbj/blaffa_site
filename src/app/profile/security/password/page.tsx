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
            const response = await api.post(`/auth/users/set_password/`, {
                current_password: formData.currentPassword,
                new_password: formData.newPassword,
                re_new_password: formData.confirmPassword,
            });

            if (response.status === 204 || response.status === 200) {
                // Update remembered credentials if they belong to this user
                const CREDS_KEY = 'blaffa_remembered_creds';
                const userEmail = localStorage.getItem('userEmail');
                const savedCreds = localStorage.getItem(CREDS_KEY);

                if (userEmail && savedCreds) {
                    try {
                        const creds = JSON.parse(savedCreds);
                        if (creds.email === userEmail) {
                            localStorage.setItem(CREDS_KEY, JSON.stringify({ ...creds, password: formData.newPassword }));
                        }
                    } catch (e) {
                        console.error('Error updating saved credentials', e);
                    }
                }

                toast.success(t('Password updated successfully!'));
                router.push('/profile');
            }
        } catch (error: any) {
            console.error('Error updating password:', error);
            const data = error.response?.data;
            let errorMessage = t('Failed to update password.');
            
            if (data) {
                if (data.current_password) errorMessage = data.current_password[0];
                else if (data.new_password) errorMessage = data.new_password[0];
                else if (data.non_field_errors) errorMessage = data.non_field_errors[0];
                else if (data.detail) errorMessage = data.detail;
            }
            
            toast.error(errorMessage);
        }
    };

    return (
        <div className={`min-h-screen ${theme.mode === 'dark' ? 'bg-slate-900' : 'bg-white'} pb-24 pt-[env(safe-area-inset-top)]`}>
            <Head>
                <title>{t("Modifier le mot de passe")}</title>
            </Head>

            <div className="bg-[#003399] pt-14 pb-12 px-6 rounded-b-[3rem] relative mb-8 shadow-2xl overflow-hidden">
                <div className="max-w-lg mx-auto flex items-center relative">
                    <button
                        onClick={() => router.push('/profile')}
                        className="text-white hover:opacity-70 transition-opacity shrink-0"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <h2 className="text-white text-xl md:text-2xl font-bold flex-1 text-center pr-8">
                        Modifier le mot de passe
                    </h2>
                </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="px-5 space-y-8 max-w-lg mx-auto">
                <div className="mb-6">
                    <h4 className="text-[#002266] dark:text-blue-300 text-xl font-extrabold">Informations de sécurité</h4>
                    <p className="text-gray-400 text-xs mt-1">Gérez la protection de votre compte</p>
                </div>

                <div className="space-y-7">
                    {[
                        { id: 'current', label: 'Mot de passe actuel', name: 'currentPassword' },
                        { id: 'new', label: 'Nouveau mot de passe', name: 'newPassword' },
                        { id: 'confirm', label: 'Confirmer le mot de passe', name: 'confirmPassword' }
                    ].map((field) => (
                        <div key={field.id} className="relative group">
                            <label className={`absolute -top-3 left-5 px-1.5 ${theme.colors.d_text} opacity-60 text-xs font-bold ${theme.mode === 'dark' ? 'bg-slate-900' : 'bg-white'} group-focus-within:text-blue-600 transition-colors z-10`}>
                                {field.label}
                            </label>
                            <div className={`flex items-center ${theme.mode === 'dark' ? 'bg-slate-900' : 'bg-white'} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-2xl p-3.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all`}>
                                <div className={`w-11 h-11 rounded-xl ${theme.mode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} flex items-center justify-center mr-4 shrink-0`}>
                                    <Lock className="text-blue-600 dark:text-blue-400" size={22} />
                                </div>
                                <div className="flex-1 relative flex items-center min-w-0">
                                    <input
                                        type={showPassword[field.id as keyof typeof showPassword] ? "text" : "password"}
                                        name={field.name}
                                        placeholder="••••••••"
                                        value={formData[field.name as keyof typeof formData]}
                                        onChange={handleChange}
                                        className={`flex-1 text-lg font-bold bg-transparent outline-none ${theme.colors.text} pr-9 min-w-0`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility(field.id as keyof typeof showPassword)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword[field.id as keyof typeof showPassword] ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-[#003399] text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all"
                    >
                        <Save size={24} />
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}
