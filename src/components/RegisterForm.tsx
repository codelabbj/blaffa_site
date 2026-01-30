'use client';

import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import Image from 'next/image';

export default function RegisterForm() {
    const [step, setStep] = useState(1);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');

    // Country code defaults to Burkina Faso (+226) as per image, but logically adaptable
    const [countryCode, setCountryCode] = useState('+226');
    const [phone, setPhone] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setNotification(null);

        if (step === 1) {
            if (!lastName || !firstName || !email) {
                setNotification({ type: 'error', message: 'Veuillez remplir tous les champs.' });
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setNotification({ type: 'error', message: 'Adresse email invalide.' });
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!phone) {
                setNotification({ type: 'error', message: 'Veuillez entrer votre numéro de téléphone.' });
                return;
            }
            setStep(3);
        } else if (step === 3) {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!termsAccepted) {
            setNotification({ type: 'error', message: 'Veuillez accepter les conditions d\'utilisation.' });
            return;
        }
        if (password !== confirmPassword) {
            setNotification({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
            return;
        }
        if (password.length < 6) {
            setNotification({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères.' });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                phone: phone.replace(/\s+/g, ''),
                phone_indicative: countryCode,
                password,
                re_password: confirmPassword,
            };

            const response = await api.post('/auth/registration', payload);
            console.log('Registration response:', response.data);

            setNotification({ type: 'success', message: 'Inscription réussie! Veuillez vous connecter.' });
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);

        } catch (error: any) {
            console.error('Registration error:', error);
            let message = 'Erreur lors de l\'inscription.';
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            setNotification({ type: 'error', message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full p-4 sm:p-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 h-1.5 mx-1 rounded-full relative bg-gray-200">
                        <div
                            className={`absolute inset-0 rounded-full transition-all duration-300 ${s <= step ? 'bg-[#002d72]' : 'bg-transparent'
                                }`}
                        />
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Créez votre compte</h1>
                {step > 1 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="text-gray-400 font-medium text-sm hover:text-gray-600"
                    >
                        Retour
                    </button>
                )}
            </div>

            {notification && (
                <div className={`mb-4 p-3 rounded text-sm ${notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"
                    }`}>
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleNext} className="space-y-6">

                {/* STEP 1: Personal Info */}
                {step === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-1.5">Nom</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="ex: JOHN"
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#002d72] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-1.5">Prénom</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="ex: Doe"
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#002d72] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ex: johndoe@gmail.com"
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#002d72] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* STEP 2: Phone */}
                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-1.5">Téléphone</label>
                            <div className="flex rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-[#002d72] focus-within:border-transparent transition-all">
                                {/* Country Code Selector (Visual) */}
                                <div className="flex items-center px-3 border-r border-gray-200 bg-white">
                                    <div className="w-6 h-4 relative overflow-hidden rounded-sm mr-2">
                                        {/* Simple CSS flag or image placeholder. Using a generic colored div for BF flag approximation if needed, or just Emoji if compatible */}
                                        {/* Burkina Faso Flag approximation */}
                                        <div className="flex flex-col h-full w-full">
                                            <div className="h-1/2 bg-[#EF3340]"></div>
                                            <div className="h-1/2 bg-[#009739]"></div>
                                            {/* Star currently omitted for simplicity or use emoji 🇧🇫 */}
                                        </div>
                                    </div>
                                    <span className="text-gray-900 font-medium">{countryCode}</span>
                                    {/* <ChevronDown size={16} className="ml-1 text-gray-400" /> */}
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 px-4 py-3.5 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                                    placeholder="00 00 00 00"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="text-right mt-1">
                                <span className="text-gray-400 text-xs">{phone.length}/8</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Password & Terms */}
                {step === 3 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-1.5">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="ex: Tim00225@"
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#002d72] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-1.5">Confirmer le mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="ex: Tim00225@"
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#002d72] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="w-5 h-5 rounded border-2 border-gray-300 text-[#002d72] focus:ring-[#002d72]"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-600">
                                    En cliquant sur Suivant, vous acceptez nos <a href="#" className="font-semibold text-[#002d72]">conditions d'utilisation</a> et confirmez que vous avez plus de 18 ans.
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit / Next Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-base"
                >
                    {isLoading ? 'Traitement...' : step === 3 ? "S'inscrire" : 'Suivant'}
                </button>

                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm font-medium">
                        Vous avez un compte?{' '}
                        <Link href="/login" className="text-[#002d72] font-bold hover:underline">
                            Se Connecter
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
