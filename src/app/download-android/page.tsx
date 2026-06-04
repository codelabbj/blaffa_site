"use client";

import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { Download, ChevronLeft } from 'lucide-react';

function AndroidDownloadContent() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const downloadLink = searchParams.get('link') || '';

    const handleDownload = () => {
        if (downloadLink) {
            window.open(downloadLink, '_blank');
        }
    };

    return (
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t("How to download Android App")}
                    </h1>
                </div>
                
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                   
                    <ul className="list-decimal pl-5 space-y-2 text-sm">
                        <li>Cliquez sur le bouton de téléchargement ci-dessous.</li>
                        <li>Acceptez le téléchargement du fichier APK.</li>
                        <li>Une fois téléchargé, ouvrez le fichier et autorisez l'installation d'applications inconnues si demandé.</li>
                        <li>Suivez les instructions à l'écran pour installer l'application.</li>
                    </ul>
                </div>

                <button
                    onClick={handleDownload}
                    disabled={!downloadLink}
                    className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        downloadLink 
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-slate-700 dark:text-gray-400'
                    }`}
                >
                    <Download className="w-5 h-5" />
                    {t("Click here to continue")}
                </button>
            </div>
        </div>
    );
}

export default function DownloadAndroidPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <AndroidDownloadContent />
            </Suspense>
        </div>
    );
}
