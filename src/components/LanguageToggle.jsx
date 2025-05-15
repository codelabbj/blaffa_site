"use client"
import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import i18n from '../../i18n';


const LanguageToggle = () => {
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
  ];

  useEffect(() => {
    // Check if user has a language preference in localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setCurrentLang(savedLang);
      i18n.changeLanguage(savedLang); // Set the language in i18next
    }
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('language', langCode);
    setShowLanguages(false);
    
    // Here you would implement your actual translation logic
    // This might involve using a library like i18next or similar
    i18n.changeLanguage(langCode); // Change the language in i18next
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setShowLanguages(!showLanguages)}
        className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors cursor-pointer group"
      >
        <Globe size={16} className="text-gray-300 group-hover:text-white group-hover:scale-110 transition-all" />
      </div>
      
      {showLanguages && (
        <div className="absolute right-0 mt-2 py-2 w-32 bg-gray-800 rounded-md shadow-xl z-10">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-700 transition-colors ${
                currentLang === lang.code ? 'text-orange-500' : 'text-gray-300'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;