"use client";
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';
import { User } from 'lucide-react';
import Image from 'next/image';
import  ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const DashboardHeader = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [pulseNotification, setPulseNotification] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const {t} = useTranslation();
  const [userName, setUserName] = useState(''); // State to store the user's name


useEffect(() => {
    const fetchUserName = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token
        if (!accessToken) {
        console.error(t('No access token found.'));
        window.location.href = '/';
        return;
      }

        // Fetch user data from the backend
        const response = await axios.get('https://api.yapson.net/auth/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Concatenate first_name and last_name to form the full name
        const { first_name, last_name } = response.data;
        setUserName(`${first_name} ${last_name}`); // Combine first_name and last_name
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      }
    };

    fetchUserName();
  }, []);


  useEffect(() => {
    setAnimateHeader(true);
    setTimeout(() => {
      setShowNotification(true);
      setPulseNotification(true);
      setTimeout(() => {
        setPulseNotification(false);
      }, 5000);
    }, 3000);
  }, []);

  return (
    <header className={`py-4 px-4 md:px-6 flex items-center justify-between border-b border-gray-800 transition-all duration-700 ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
        <p className="text-sm">
          {t("Hello")}, <span className="text-orange-500 font-medium">{userName || 'User'}</span>!
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageToggle />
        
        <div className={`relative ${showNotification ? 'animate-bounce' : ''} ${pulseNotification ? 'animate-pulse' : ''}`}>
          {/* <Bell size={20} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs"></span> */}
          <NotificationBell />
        </div>
        
        <a className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center relative group" href='/profile'>
          <User size={16} className="text-sm text-white font-bold group-hover:scale-110 transition-transform"/>
          <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75 duration-1000 hidden group-hover:block"></div>
        </a>
      </div>
    </header>
  );
};

export default DashboardHeader;