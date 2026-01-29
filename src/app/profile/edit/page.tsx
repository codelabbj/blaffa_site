'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, User, CreditCard as IdCard, Mail, Phone, Save } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function EditProfile() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneCode: '',
        phoneNumber: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const profileResponse = await api.get(`/auth/me`);
                if (profileResponse.status !== 200) throw new Error(t('Failed to fetch user data'));
                const profileData = await profileResponse.data;
                setFormData((prev) => ({
                    ...prev,
                    firstName: profileData.first_name || '',
                    lastName: profileData.last_name || '',
                    email: profileData.email || '',
                    phoneNumber: profileData.phone_number || '',
                }));
            } catch (error: unknown) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [t, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error(t('You must be logged in to update your details.'));
            return;
        }

        try {
            const response = await api.patch(`/auth/edit`, {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone_number: formData.phoneNumber.replace(/\s+/g, ''),
            });

            if (response.status !== 200) {
                throw new Error(t('Failed to update details'));
            }

            toast.success(t('Details updated successfully!'));
            router.push('/profile');
        } catch (error: unknown) {
            console.error('Error updating details:', error);
            toast.error(t('An unexpected error occurred while updating details.'));
        }
    };

    if (loading) return <p className="p-6 text-center text-white">{t('Loading profile...')}</p>;

    return (
        <div className={`min-h-screen ${theme.mode === 'dark' ? 'bg-slate-900' : 'bg-white'} pb-24`}>
            <Head>
                <title>{t("Modifier le profil")}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            <div className="animate-in slide-in-from-bottom-10 fade-in duration-500 min-h-screen">
                <div className="bg-[#003399] pt-14 pb-12 px-6 rounded-b-[3.5rem] relative mb-12 shadow-2xl shadow-blue-900/40">
                    <button
                        onClick={() => router.back()}
                        className="absolute top-14 left-6 text-white hover:opacity-70 transition-opacity"
                    >
                        <ChevronLeft size={36} />
                    </button>
                    <h2 className="text-white text-2xl font-bold text-center mt-1">Modifier le profil</h2>

                    <div className="flex flex-col items-center mt-12">
                        <div className={`w-36 h-36 rounded-full ${theme.colors.a_background} flex items-center justify-center mb-6 shadow-xl border-4 border-white/20`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-20 h-20 ${theme.colors.text} opacity-20`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-white text-3xl font-bold mb-1">{formData.firstName} {formData.lastName}</h3>
                        <p className="text-blue-100/70 text-lg font-medium tracking-wide">{formData.email}</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateDetails} className="px-6 space-y-10 pb-36 max-w-lg mx-auto">
                    <h4 className="text-[#002266] dark:text-blue-300 text-2xl font-extrabold mb-8">Informations personnelles</h4>

                    <div className="space-y-8">
                        {/* Prénom */}
                        <div className="relative group">
                            <label className={`absolute -top-3.5 left-6 px-1.5 ${theme.colors.d_text} opacity-60 text-sm font-bold ${theme.colors.a_background} group-focus-within:text-blue-600 transition-colors`}>Prénom</label>
                            <div className={`flex items-center ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-3xl p-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all`}>
                                <div className={`w-14 h-14 rounded-2xl ${theme.mode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} flex items-center justify-center mr-5`}>
                                    <User className="text-blue-600 dark:text-blue-400" size={28} />
                                </div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Rasheed"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`flex-1 text-xl font-bold bg-transparent outline-none ${theme.colors.text}`}
                                />
                            </div>
                        </div>

                        {/* Nom */}
                        <div className="relative group">
                            <label className={`absolute -top-3.5 left-6 px-1.5 ${theme.colors.d_text} opacity-60 text-sm font-bold ${theme.colors.a_background} group-focus-within:text-blue-600 transition-colors`}>Nom</label>
                            <div className={`flex items-center ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-3xl p-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all`}>
                                <div className={`w-14 h-14 rounded-2xl ${theme.mode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} flex items-center justify-center mr-5`}>
                                    <IdCard className="text-blue-600 dark:text-blue-400" size={28} />
                                </div>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="idris"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`flex-1 text-xl font-bold bg-transparent outline-none ${theme.colors.text}`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <label className={`absolute -top-3.5 left-6 px-1.5 ${theme.colors.d_text} opacity-60 text-sm font-bold ${theme.colors.a_background} group-focus-within:text-blue-600 transition-colors`}>Email</label>
                            <div className={`flex items-center ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-3xl p-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all`}>
                                <div className={`w-14 h-14 rounded-2xl ${theme.mode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} flex items-center justify-center mr-5`}>
                                    <Mail className="text-blue-600 dark:text-blue-400" size={28} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="viralrarsh@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`flex-1 text-xl font-bold bg-transparent outline-none ${theme.colors.text}`}
                                />
                            </div>
                        </div>

                        {/* Téléphone */}
                        <div className="relative group">
                            <label className={`absolute -top-3.5 left-6 px-1.5 ${theme.colors.d_text} opacity-60 text-sm font-bold ${theme.colors.a_background} group-focus-within:text-blue-600 transition-colors`}>Téléphone</label>
                            <div className={`flex items-center ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-3xl p-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all`}>
                                <div className={`w-14 h-14 rounded-2xl ${theme.mode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} flex items-center justify-center mr-5`}>
                                    <Phone className="text-blue-600 dark:text-blue-400" size={28} />
                                </div>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="08110798402"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`flex-1 text-xl font-bold bg-transparent outline-none ${theme.colors.text}`}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white py-6 rounded-[2rem] flex items-center justify-center gap-4 text-2xl font-bold shadow-2xl transition-all hover:opacity-90 active:scale-[0.98] mt-12`}
                        style={{ backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#003399', boxShadow: `0 20px 40px ${theme.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,51,153,0.3)'}` }}
                    >
                        <Save size={28} />
                        Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
}
