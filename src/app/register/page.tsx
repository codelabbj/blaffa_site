'use client';

import { useState, useEffect } from 'react';
import RegisterForm from '../../components/RegisterForm';
import Image from 'next/image';
import { transformDriveLink } from '@/lib/link-utils';

export default function RegisterPage() {
    const [downloadApkLink, setDownloadApkLink] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('https://api.blaffa.net/blaffa/setting/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const settingsData = await response.json();
                    const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;
                    const rawDownloadLink = settings?.dowload_apk_link || settings?.download_apk_link;
                    if (rawDownloadLink) {
                        setDownloadApkLink(rawDownloadLink);
                    }
                }
            } catch (error) {
                console.error('Error fetching settings for download link:', error);
            }
        };

        fetchSettings();
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col pt-10 px-4 sm:px-6 lg:px-8">
            {/* Top Bar with Logo */}
            <div className="w-full mb-8 flex items-center px-4 sm:px-6 lg:px-8">
                <Image src="/logo.jpg" alt="Blaffa" width={40} height={40} className="object-contain" />
                <span className="ml-2 text-xl font-bold text-[#1e40af]">Blaffa</span>
            </div>

            {/* Main Content */}
            <div className="w-full flex-1 flex flex-col items-center justify-start pt-4">
                <RegisterForm />

                {/* Android Download Button */}
                <div className="mt-8 flex justify-center">
                    <a
                        href={downloadApkLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 transition-all duration-300 group shadow-sm`}
                    >
                        <div className="bg-green-500/10 p-1 rounded-full group-hover:bg-green-500/20 transition-colors">
                            <svg className="w-4 h-4 fill-current text-green-500" viewBox="0 0 24 24">
                                <path d="M17.523 15.3414C18.1109 15.3414 18.587 14.8653 18.587 14.2774C18.587 13.6896 18.1109 13.2135 17.523 13.2135C16.9351 13.2135 16.459 13.6896 16.459 14.2774C16.459 14.8653 16.9351 15.3414 17.523 15.3414ZM6.47702 15.3414C7.0649 15.3414 7.541 14.8653 7.541 14.2774C7.541 13.6896 7.0649 13.2135 6.47702 13.2135C5.88914 13.2135 5.41304 13.6896 5.41304 14.2774C5.41304 14.8653 5.88914 15.3414 6.47702 15.3414ZM17.9234 10.7495L19.7821 7.5303C19.9126 7.30424 19.8354 7.0152 19.6094 6.88478C19.3833 6.75436 19.0943 6.83147 18.9639 7.05753L17.0768 10.3251C15.6558 9.67812 14.0754 9.32431 12.4206 9.32431C10.7659 9.32431 9.18548 9.67812 7.76449 10.3251L5.87739 7.05753C5.74697 6.83147 5.45793 6.75436 5.23186 6.88478C5.0058 7.0152 4.9286 7.30424 5.05903 7.5303L6.91771 10.7495C3.89944 12.3385 1.8413 15.4294 1.77734 19.0494H23.0637C22.9997 15.4294 20.9416 12.3385 17.9234 10.7495Z" />
                            </svg>
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">
                            APPLICATION ANDROID
                        </span>
                        <div className="ml-1 w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
                    </a>
                </div>
            </div>
        </div>
    );
}
