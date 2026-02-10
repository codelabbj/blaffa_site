"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';
import { Download, ChevronDown } from 'lucide-react';

interface AndroidDownloadButtonProps {
    downloadLink: string;
    className?: string;
}

export default function AndroidDownloadButton({ downloadLink, className = "" }: AndroidDownloadButtonProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleDownload = () => {
        if (downloadLink) {
            window.open(downloadLink, '_blank');
            setIsOpen(false);
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 dark:bg-slate-800/10 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full hover:bg-white/20 transition-all duration-300 group shadow-sm`}
            >
                <div className="bg-green-500/10 p-1 rounded-full group-hover:bg-green-500/20 transition-colors">
                    <svg className="w-4 h-4 fill-current text-green-500" viewBox="0 0 24 24">
                        <path d="M17.523 15.3414C18.1109 15.3414 18.587 14.8653 18.587 14.2774C18.587 13.6896 18.1109 13.2135 17.523 13.2135C16.9351 13.2135 16.459 13.6896 16.459 14.2774C16.459 14.8653 16.9351 15.3414 17.523 15.3414ZM6.47702 15.3414C7.0649 15.3414 7.541 14.8653 7.541 14.2774C7.541 13.6896 7.0649 13.2135 6.47702 13.2135C5.88914 13.2135 5.41304 13.6896 5.41304 14.2774C5.41304 14.8653 5.88914 15.3414 6.47702 15.3414ZM17.9234 10.7495L19.7821 7.5303C19.9126 7.30424 19.8354 7.0152 19.6094 6.88478C19.3833 6.75436 19.0943 6.83147 18.9639 7.05753L17.0768 10.3251C15.6558 9.67812 14.0754 9.32431 12.4206 9.32431C10.7659 9.32431 9.18548 9.67812 7.76449 10.3251L5.87739 7.05753C5.74697 6.83147 5.45793 6.75436 5.23186 6.88478C5.0058 7.0152 4.9286 7.30424 5.05903 7.5303L6.91771 10.7495C3.89944 12.3385 1.8413 15.4294 1.77734 19.0494H23.0637C22.9997 15.4294 20.9416 12.3385 17.9234 10.7495Z" />
                    </svg>
                </div>
                <span className={`text-[10px] md:text-xs font-bold ${theme.colors.text} tracking-wide uppercase`}>
                    {t("Download mobile app")}
                </span>
                <ChevronDown className={`w-3 h-3 ${theme.colors.text} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 md:right-auto md:left-0 w-64 md:w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in duration-200 overflow-hidden">
                    <div className="p-4 space-y-4">
                        <p className={`text-xs md:text-sm leading-relaxed ${theme.colors.text} opacity-90`}>
                            {t("For downloading the mobile app on android devices you will be ask to add your email account")}
                        </p>
                        <button
                            onClick={handleDownload}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            {t("Click here to continue")}
                        </button>
                    </div>
                    <div className="bg-blue-600 h-1 w-full"></div>
                </div>
            )}
        </div>
    );
}
