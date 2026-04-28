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
        <div className={`min-h-screen ${theme.colors.background} pb-24 pt-[env(safe-area-inset-top)]`}>
            <Head>
                <title>{t("Modifier le profil")}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
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
                         Modifier le profil
                    </h2>
                </div>
            </div>

            <form onSubmit={handleUpdateDetails} className="px-5 space-y-8 max-w-lg mx-auto">
                <div className="mb-6">
                    <h4 className="text-[#002266] dark:text-blue-300 text-xl font-extrabold">Informations personnelles</h4>
                    <p className="text-gray-400 text-xs mt-1">Mettez à jour vos informations de contact</p>
                </div>

                <div className="space-y-7">
                    {[
                        { id: 'firstName', label: 'Prénom', name: 'firstName', icon: User, placeholder: 'Prénom' },
                        { id: 'lastName', label: 'Nom', name: 'lastName', icon: IdCard, placeholder: 'Nom' },
                        { id: 'email', label: 'Email', name: 'email', icon: Mail, placeholder: 'Email', type: 'email' },
                        { id: 'phoneNumber', label: 'Numéro de Téléphone', name: 'phoneNumber', icon: Phone, placeholder: 'Numéro de Téléphone' }
                    ].map((field) => (
                        <div key={field.id} className="relative group">
                            <label className={`absolute -top-3 left-5 px-1.5 ${theme.colors.d_text} opacity-60 text-xs font-bold ${theme.mode === 'dark' ? 'bg-slate-900' : 'bg-white'} group-focus-within:text-blue-600 transition-colors z-10`}>
                                {field.label}
                            </label>
                            <div className={`flex items-center ${theme.mode === 'dark' ? 'bg-slate-900' : 'bg-white'} border ${theme.mode === 'dark' ? 'border-slate-800' : 'border-gray-100'} rounded-2xl p-3.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all`}>
                                <div className={`w-11 h-11 rounded-xl ${theme.mode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} flex items-center justify-center mr-4 shrink-0`}>
                                    <field.icon className="text-blue-600 dark:text-blue-400" size={22} />
                                </div>
                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={formData[field.name as keyof typeof formData]}
                                    onChange={handleChange}
                                    className={`flex-1 text-lg font-bold bg-transparent outline-none ${theme.colors.text} min-w-0`}
                                    required
                                />
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
