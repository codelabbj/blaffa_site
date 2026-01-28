"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, History, User } from 'lucide-react';

import { useTheme } from './ThemeProvider';

const BottomNavbar = () => {
    const pathname = usePathname();
    const { theme } = useTheme();

    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    React.useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('accessToken'));
    }, []);

    const navItems = [
        {
            label: 'Accueil',
            href: isAuthenticated ? '/dashboard' : '/',
            icon: Home,
        },
        {
            label: 'Notification',
            href: '/notifications',
            icon: Bell,
        },
        {
            label: 'Historiques',
            href: '/all_transactions',
            icon: History,
        },
        {
            label: isAuthenticated ? 'Profil' : 'Se connecter',
            href: isAuthenticated ? '/profile' : '/login',
            icon: User,
        },
    ];

    return (
        <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-br ${theme.colors.a_background} border-t border-gray-200 dark:border-gray-800 safe-area-bottom shadow-lg`}>
            <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    const handleClick = (e: React.MouseEvent) => {
                        // Redirect logic removed as per user request to show pages even if empty
                    };

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleClick}
                            className="flex flex-col items-center justify-center gap-1 group py-1"
                        >
                            <div className={`p-1 transition-colors duration-200`}>
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={isActive
                                        ? 'text-[#002d72] fill-[#002d72] dark:text-blue-400 dark:fill-blue-400'
                                        : 'text-[#94a3b8] dark:text-gray-400'
                                    }
                                />
                            </div>
                            <span className={`text-[0.7rem] font-medium transition-colors duration-200 ${isActive
                                ? 'text-[#002d72] dark:text-blue-400'
                                : 'text-[#94a3b8] dark:text-gray-400'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavbar;
