"use client"
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, X, Camera, Plus } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import { fetchSettings } from '@/lib/blaffa-api';
import { SupportChatbot } from '@/components/SupportChatbot';

const PREFILL_STORAGE_KEY = 'blaffa_chatbot_prefill';

function ContactPageContent() {
    const { theme } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [chatbotEnabled, setChatbotEnabled] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [prefillMessage, setPrefillMessage] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const settings = await fetchSettings();
                if (!cancelled) {
                    setChatbotEnabled(Boolean(settings?.use_chatbot));
                }
            } catch {
                if (!cancelled) setChatbotEnabled(false);
            } finally {
                if (!cancelled) setSettingsLoaded(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(PREFILL_STORAGE_KEY);
            if (stored) {
                setPrefillMessage(stored);
                sessionStorage.removeItem(PREFILL_STORAGE_KEY);
            }
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        if (!settingsLoaded) return;
        const openAssistant = searchParams.get('open') === 'assistant';
        if (openAssistant && chatbotEnabled) {
            setIsChatOpen(true);
        }
    }, [settingsLoaded, chatbotEnabled, searchParams]);

    // Custom QA Icon SVG
    const QAIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 8H17M7 12H13M12 20L8 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H16L12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="7" y="13" fontSize="6" fontWeight="bold" fill="currentColor" className="select-none">Q A</text>
        </svg>
    );

    const BotIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M12 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
            <circle cx="15" cy="13" r="1.5" fill="currentColor" />
            <path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className={`min-h-screen ${theme.mode === 'dark' ? theme.colors.a_background : 'bg-white'} font-sans relative`}>
            {/* Main Landing View */}
            <div className={`transition-opacity duration-300 ${isFormOpen || isChatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <header className="px-4 h-20 flex items-center">
                    <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className={theme.colors.text} size={32} />
                    </button>
                </header>

                <main className="max-w-md mx-auto px-8 pt-20">
                    <div className="flex flex-col items-start text-left">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="text-black dark:text-white">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                                    <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h1 className={`text-[2.25rem] font-bold ${theme.colors.text}`}>Support</h1>
                        </div>
                        <p className="text-gray-900 dark:text-gray-100 text-[1.45rem] leading-[1.35] font-medium max-w-[95%]">
                            Trouvez les réponses aux questions les plus courantes ou contactez-nous.
                        </p>
                    </div>

                    <div className="mt-20 space-y-6">
                        {settingsLoaded && chatbotEnabled && (
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className={`w-full flex items-center gap-5 py-2 px-1 rounded-2xl transition-all active:scale-[0.98]`}
                            >
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm text-black dark:text-white">
                                    <BotIcon />
                                </div>
                                <div className="flex flex-1 flex-col items-start gap-1">
                                    <span className={`text-2xl font-bold ${theme.colors.text}`}>Assistant IA</span>
                                    <span className="text-gray-500 text-[1rem] font-medium text-left leading-tight">
                                        Discutez avec notre chatbot pour une aide rapide
                                    </span>
                                </div>
                                <ChevronRight className="text-black dark:text-white" size={32} />
                            </button>
                        )}

                        <button
                            onClick={() => setIsFormOpen(true)}
                            className={`w-full flex items-center gap-5 py-2 px-1 rounded-2xl transition-all active:scale-[0.98]`}
                        >
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm text-black dark:text-white">
                                <QAIcon />
                            </div>
                            <div className="flex flex-1 flex-col items-start gap-1">
                                <span className={`text-2xl font-bold ${theme.colors.text}`}>Email Support</span>
                                <span className="text-gray-500 text-[1rem] font-medium text-left leading-tight">Envoyez-nous un message et nous vous répondrons</span>
                            </div>
                            <ChevronRight className="text-black dark:text-white" size={32} />
                        </button>
                    </div>
                </main>
            </div>

            {/* Chatbot overlay */}
            {isChatOpen && chatbotEnabled && (
                <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/50 animate-in fade-in duration-200">
                    <div className="mt-auto w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-t-[2rem] shadow-2xl flex flex-col h-[min(78vh,640px)] max-h-[calc(100dvh-env(safe-area-inset-top)-4.5rem)] pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
                        <div className="shrink-0 flex items-center justify-between px-4 pt-4 pb-2">
                            <div>
                                <p className={`font-bold text-lg ${theme.colors.text}`}>Assistant IA</p>
                                <p className="text-sm text-gray-500">Tapez votre message en bas</p>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="w-10 h-10 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 px-3 pb-2">
                            <SupportChatbot hideHeader initialMessage={prefillMessage} />
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal Overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black/10 backdrop-blur-[1px] animate-in fade-in duration-200" onClick={() => setIsFormOpen(false)}>
                    <div
                        className={`mt-auto w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-t-[3rem] shadow-2xl p-8 pb-10 relative animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto scrollbar-hide`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Pull Bar Indicator (Mobile Style) */}
                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>

                        {/* Close Button */}
                        <div className="absolute top-8 right-8">
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="w-12 h-12 border-2 border-black dark:border-gray-700 rounded-xl flex items-center justify-center text-black dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="text-center mb-10 pt-2">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dites nous</h2>
                            <p className="text-gray-500 text-xl font-medium">Nous aimons avoir de vos nouvelles.</p>
                        </div>

                        <form className="space-y-8 px-2" onSubmit={(e) => { e.preventDefault(); setIsFormOpen(false); }}>
                            <div className="space-y-3">
                                <label className="text-xl font-bold text-gray-900 dark:text-gray-100 block px-1">Nom & Prénom</label>
                                <input
                                    type="text"
                                    className="w-full h-16 px-6 rounded-[1.25rem] border border-gray-100 dark:border-gray-800 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm font-medium text-lg bg-gray-50/30"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xl font-bold text-gray-900 dark:text-gray-100 block px-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full h-16 px-6 rounded-[1.25rem] border border-gray-100 dark:border-gray-800 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm font-medium text-lg bg-gray-50/30"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xl font-bold text-gray-900 dark:text-gray-100 block px-1">Téléphone ou votre ID</label>
                                <input
                                    type="text"
                                    className="w-full h-16 px-6 rounded-[1.25rem] border border-gray-100 dark:border-gray-800 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm font-medium text-lg bg-gray-50/30"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xl font-bold text-gray-900 dark:text-gray-100 block px-1">Contenu</label>
                                <textarea
                                    rows={4}
                                    placeholder="Bonjour, j'ai besoin d'aide concernant..."
                                    className="w-full p-6 rounded-[1.25rem] border border-gray-100 dark:border-gray-800 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm resize-none placeholder:text-gray-400 font-medium text-lg bg-gray-50/30"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xl font-bold text-gray-900 dark:text-gray-100 block px-1">Capture d&apos;écran du paiement</label>
                                <div className="w-full h-44 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] flex items-center justify-center text-[#B0B0B0] dark:text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all shadow-sm bg-gray-50/30">
                                    <div className="relative">
                                        <Camera size={64} strokeWidth={1} />
                                        <Plus size={20} strokeWidth={3} className="absolute top-2 -right-1 text-[#B0B0B0]" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 pb-2">
                                <button
                                    type="submit"
                                    className="w-full h-18 py-5 bg-[#1a4384] hover:bg-[#15386b] text-white rounded-2xl text-2xl font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        }>
            <ContactPageContent />
        </Suspense>
    );
}
