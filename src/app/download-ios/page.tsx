"use client";

import { useTranslation } from 'react-i18next';
import { ChevronLeft, Share, PlusSquare, Bell } from 'lucide-react';
import Link from 'next/link';

export default function DownloadIosPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#11233D] py-8 px-4 flex justify-center items-start">
            <div className="max-w-md w-full relative">
                {/* Back Button */}
                <div className="flex justify-start mt-12 mb-2 pl-2">
                    <button 
                        onClick={() => window.history.back()} 
                        className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Retour</span>
                    </button>
                </div>

                <div className="bg-white rounded-t-3xl rounded-b-3xl shadow-2xl overflow-hidden mt-6">
                    <div className="p-6 space-y-8">
                        <p className="text-center text-gray-600 font-medium text-[15px] leading-snug px-4">
                            {t("Installe la PWA pour recevoir les notifications push directement sur ton écran d'accueil.")}
                        </p>

                        <div className="space-y-6">
                            {/* Step 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#11233D] text-[#D8A752] flex items-center justify-center font-bold text-[15px] shrink-0 mt-0.5">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-[#11233D] font-bold text-lg mb-1">
                                        {t("Ouvre BLAFFA dans Safari")}
                                    </h3>
                                    <p className="text-gray-600 text-[14.5px] leading-relaxed">
                                        Cette page doit être chargée dans <strong>Safari iOS</strong> (pas Chrome, pas Firefox). L'installation PWA et les notifs push ne fonctionnent <em>que</em> via Safari sur iPhone.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#11233D] text-[#D8A752] flex items-center justify-center font-bold text-[15px] shrink-0 mt-0.5">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-[#11233D] font-bold text-lg mb-1">
                                        {t("Tape l'icône de partage")}
                                    </h3>
                                    <p className="text-gray-600 text-[14.5px] leading-relaxed">
                                        En bas de l'écran (ou en haut à droite sur iPad), tape l'icône 📤 <strong>Partager</strong>(carré avec une flèche vers le haut).
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#11233D] text-[#D8A752] flex items-center justify-center font-bold text-[15px] shrink-0 mt-0.5">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-[#11233D] font-bold text-lg mb-1">
                                        {t("« Sur l'écran d'accueil »")}
                                    </h3>
                                    <p className="text-gray-600 text-[14.5px] leading-relaxed">
                                        Dans le menu qui s'ouvre, fais défiler vers le bas et tape <strong>« Sur l'écran d'accueil »</strong> (icône + dans un carré). Confirme avec <strong>Ajouter</strong> en haut à droite.
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#11233D] text-[#D8A752] flex items-center justify-center font-bold text-[15px] shrink-0 mt-0.5">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-[#11233D] font-bold text-lg mb-1">
                                        {t("Ouvre BLAFFA depuis l'écran d'accueil")}
                                    </h3>
                                    <p className="text-gray-600 text-[14.5px] leading-relaxed">
                                        L'icône BLAFFA (carré bleu avec B doré) apparaît sur ton écran d'accueil. Tape dessus — l'app s'ouvre en plein écran, sans la barre d'adresse Safari.
                                    </p>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#11233D] text-[#D8A752] flex items-center justify-center font-bold text-[15px] shrink-0 mt-0.5">
                                    5
                                </div>
                                <div>
                                    <h3 className="text-[#11233D] font-bold text-lg mb-1">
                                        {t("Active les notifications")}
                                    </h3>
                                    <p className="text-gray-600 text-[14.5px] leading-relaxed">
                                        Une fois dans l'app installée, va sur n'importe quelle page admin. Un bandeau « 🔔 <strong>Activer les notifications</strong> » apparaîtra. Tape dessus → iOS demande l'autorisation → <strong>Autoriser</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Box */}
                        <div className="bg-[#EBF7EF] border border-[#C5E1D4] rounded-xl p-4 mt-8">
                            <div className="flex items-start gap-2">
                                <div className="text-[#2B8A4D] mt-0.5 font-bold text-lg">✅</div>
                                <div>
                                    <h4 className="text-[#1E6036] font-bold text-[15px]">
                                        {t("Tu recevras des notifications pour :")}
                                    </h4>
                                    <ul className="mt-2 text-[#2B8A4D] text-[14.5px] font-medium space-y-1">
                                        <li className="flex items-center gap-2">
                                            {t("Nouveau retrait sub-compte à payer")}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
