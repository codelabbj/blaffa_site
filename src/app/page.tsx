"use client"

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield, Zap, Users, Menu, X, Star, ChevronDown, Smartphone, Globe } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';
// import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
//import LanguageSwitcher from '../components/LanguageSwitcher';


// Adjust the path as necessary
 

type Translation = {
  // Navigation
  getStarted: string;

  // Hero Section
  approvedBy: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroTitleEnd: string;
  heroDescription: string;
  startNow: string;

  // Stats
  activeUsers: string;
  monthlyTransfers: string;
  uptime: string;
  networksSupported: string;

  // Quick Transfer
  quickTransfer: string;
  amount: string;
  toPlatform: string;

  // Supported Platforms
  supportedPlatforms: string;
  supportedPlatformsDesc: string;

  // Mobile Networks
  mobileNetworks: string;
  mobileNetworksDesc: string;

  // Features
  whyChoose: string;
  whyChooseDesc: string;

  bankingSecurity: string;
  bankingSecurityDesc: string;

  instantDeposits: string;
  instantDepositsDesc: string;

  support247: string;
  support247Desc: string;

  // Testimonials
  approvedByPros: string;
  testimonialsDesc: string;

  testimonial1: string;
  testimonial2: string;
  testimonial3: string;

  professionalTrader: string;
  sportsEnthusiast: string;
  financeExpert: string;

  // FAQ
  faqTitle: string;
  faqDesc: string;

  faq1Q: string;
  faq1A: string;

  faq2Q: string;
  faq2A: string;

  faq3Q: string;
  faq3A: string;

  faq4Q: string;
  faq4A: string;

  faq5Q: string;
  faq5A: string;

  // CTA
  readyToStart: string;
  ctaDesc: string;
  createFreeAccount: string;
  contactSales: string;

  // Footer
  footerDesc: string;
  product: string;
  features: string;
  security: string;
  pricing: string;
  api: string;
  company: string;
  about: string;
  careers: string;
  press: string;
  contact: string;
  legal: string;
  privacy: string;
  terms: string;
  compliance: string;
  licenses: string;
  copyright: string;
};
type Language = 'en' | 'fr';

const translations: Record<Language, Translation> = {
  en: {
    // Navigation
    getStarted: "Get Started",
    
    // Hero Section
    approvedBy: "🚀 Trusted by 500,000+ Users",
    heroTitle: "The Future of",
    heroTitleHighlight: "Betting",
    heroTitleEnd: "Deposits & Withdrawals",
    heroDescription: "Deposit and withdraw from your favorite betting platforms instantly and securely. Join thousands of users who trust Blaffa for seamless betting transactions.",
    startNow: "Get Started Now",
    
    // Stats
    activeUsers: "Active Users",
    monthlyTransfers: "Transferred/Month",
    uptime: "Uptime",
    networksSupported: "Networks Supported",
    
    // Quick Transfer
    quickTransfer: "Quick Transfer",
    amount: "Amount",
    toPlatform: "To Platform",
    
    // Supported Platforms
    supportedPlatforms: "Supported Betting Platforms",
    supportedPlatformsDesc: "Easily deposit and withdraw on your favorite platforms",
    
    // Mobile Networks
    mobileNetworks: "Mobile Money Networks And Available Countries",
    mobileNetworksDesc: "Pay with your favorite mobile payment networks",
    
    // Features
    whyChoose: "Why Choose Blaffa?",
    whyChooseDesc: "We've built the most secure, fast, and reliable platform for betting deposits and withdrawals",
    
    bankingSecurity: "Banking Security",
    bankingSecurityDesc: "Your transactions are protected by military-grade encryption and multi-layer security protocols.",
    
    instantDeposits: "Instant Deposits & Withdrawals",
    instantDepositsDesc: "Deposit to betting platforms instantly or withdraw your winnings with our ultra-fast processing technology.",
    
    support247: "24/7 Support",
    support247Desc: "Our dedicated support team is available 24/7 to help you with all your questions.",
    
    // Testimonials
    approvedByPros: "Trusted by Professionals",
    testimonialsDesc: "See what our users say about Blaffa",
    
    testimonial1: "Blaffa has revolutionized how I manage my betting funds. Deposits are instant and withdrawals seamless.",
    testimonial2: "Finally, a platform that understands serious bettors' needs. Smooth experience every time.",
    testimonial3: "The security features give me complete peace of mind. This is how financial transfers should work.",
    
    professionalTrader: "Professional Trader",
    sportsEnthusiast: "Sports Enthusiast",
    financeExpert: "Finance Professional",
    
    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqDesc: "Everything you need to know about Blaffa",
    
    faq1Q: "How fast are deposits and withdrawals?",
    faq1A: "Most deposits are completed within seconds. Withdrawals typically take 2-5 minutes depending on the betting platform and verification requirements.",
    
    faq2Q: "Is my money safe with Blaffa?",
    faq2A: "Absolutely. We use bank-level security, are fully regulated, and maintain insurance coverage for all user funds.",
    
    faq3Q: "What are your fees?",
    faq3A: "We offer competitive rates starting from 0.5% per transaction, with volume discounts available for frequent users.",
    
    faq4Q: "Which betting platforms do you support?",
    faq4A: "We support 1xbet, 888STARZ, BETWINNER, and MELBET, with new integrations added regularly.",
    
    faq5Q: "Which mobile payment networks do you accept?",
    faq5A: "We support all major networks: Orange, MTN, Moov, and Wave across multiple West African countries.",
    
    // CTA
    readyToStart: "Ready to Get Started?",
    ctaDesc: "Join thousands of users who trust Blaffa for secure and instant betting deposits and withdrawals",
    createFreeAccount: "Create Free Account",
    contactSales: "Contact Sales",
    
    // Footer
    footerDesc: "The world's most trusted platform for betting deposits and withdrawals.",
    product: "Product",
    features: "Features",
    security: "Security",
    pricing: "Pricing",
    api: "API",
    company: "Company",
    about: "About",
    careers: "Careers",
    press: "Press",
    contact: "Contact",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    compliance: "Compliance",
    licenses: "Licenses",
    copyright: "© 2025 Blaffa. All rights reserved. Licensed and regulated financial services provider."
  },
  fr: {
    // Navigation
    getStarted: "Commencer",
    
    // Hero Section
    approvedBy: "🚀 Approuvé par 500 000+ Utilisateurs",
    heroTitle: "L'Avenir des",
    heroTitleHighlight: "Paris",
    heroTitleEnd: "Dépôts & Retraits",
    heroDescription: "Déposez et retirez de vos plateformes de paris préférées instantanément et en toute sécurité. Rejoignez des milliers d'utilisateurs qui font confiance à Blaffa pour des transactions de paris fluides.",
    startNow: "Commencer Maintenant",
    
    // Stats
    activeUsers: "Utilisateurs Actifs",
    monthlyTransfers: "Transférés/Mois",
    uptime: "Disponibilité",
    networksSupported: "Réseaux Supportés",
    
    // Quick Transfer
    quickTransfer: "Transfert Rapide",
    amount: "Montant",
    toPlatform: "Vers la Plateforme",
    
    // Supported Platforms
    supportedPlatforms: "Plateformes de Paris Supportées",
    supportedPlatformsDesc: "Déposez et retirez facilement sur vos plateformes préférées",
    
    // Mobile Networks
    mobileNetworks: "Réseaux Mobile Money et Pays Disponibles",
    mobileNetworksDesc: "Payez avec vos réseaux de paiement mobile favoris",
    
    // Features
    whyChoose: "Pourquoi Choisir Blaffa ?",
    whyChooseDesc: "Nous avons construit la plateforme la plus sécurisée, rapide et fiable pour les dépôts et retraits de paris",
    
    bankingSecurity: "Sécurité Bancaire",
    bankingSecurityDesc: "Vos transactions sont protégées par un cryptage de niveau militaire et des protocoles de sécurité multicouches.",
    
    instantDeposits: "Dépôts et Retraits Instantanés",
    instantDepositsDesc: "Déposez sur les plateformes de paris instantanément ou retirez vos gains avec notre technologie de traitement ultra-rapide.",
    
    support247: "Support 24h/24 7j/7",
    support247Desc: "Notre équipe de support dédiée est disponible 24h/24 pour vous aider avec toutes vos questions.",
    
    // Testimonials
    approvedByPros: "Approuvé par les Professionnels",
    testimonialsDesc: "Découvrez ce que nos utilisateurs disent de Blaffa",
    
    testimonial1: "Blaffa a révolutionné la façon dont je gère mes fonds de paris. Les dépôts sont instantanés et les retraits transparents.",
    testimonial2: "Enfin, une plateforme qui comprend les besoins des parieurs sérieux. Expérience fluide à chaque fois.",
    testimonial3: "Les fonctionnalités de sécurité me donnent une tranquillité d'esprit totale. C'est ainsi que les transferts financiers devraient fonctionner.",
    
    professionalTrader: "Trader Professionnel",
    sportsEnthusiast: "Passionnée de Sport",
    financeExpert: "Professionnel de la Finance",
    
    // FAQ
    faqTitle: "Questions Fréquemment Posées",
    faqDesc: "Tout ce que vous devez savoir sur Blaffa",
    
    faq1Q: "À quelle vitesse sont les dépôts et retraits ?",
    faq1A: "La plupart des dépôts sont complétés en quelques secondes. Les retraits prennent généralement 2-5 minutes selon la plateforme de paris et les exigences de vérification.",
    
    faq2Q: "Mon argent est-il en sécurité avec Blaffa ?",
    faq2A: "Absolument. Nous utilisons une sécurité de niveau bancaire, sommes entièrement réglementés et maintenons une couverture d'assurance pour tous les fonds des utilisateurs.",
    
    faq3Q: "Quels sont vos frais ?",
    faq3A: "Nous offrons des tarifs compétitifs à partir de 0,5% par transaction, avec des remises sur volume disponibles pour les utilisateurs fréquents.",
    
    faq4Q: "Quelles plateformes de paris supportez-vous ?",
    faq4A: "Nous supportons 1xbet, 888STARZ, BETWINNER, et MELBET, avec de nouvelles intégrations ajoutées régulièrement.",
    
    faq5Q: "Quels réseaux de paiement mobile acceptez-vous ?",
    faq5A: "Nous supportons tous les principaux réseaux : Orange, MTN, Moov et Wave dans plusieurs pays d'Afrique de l'Ouest.",
    
    // CTA
    readyToStart: "Prêt à Commencer ?",
    ctaDesc: "Rejoignez des milliers d'utilisateurs qui font confiance à Blaffa pour des dépôts et retraits de paris sécurisés et instantanés",
    createFreeAccount: "Créer un Compte Gratuit",
    contactSales: "Contacter les Ventes",
    
    // Footer
    footerDesc: "La plateforme la plus fiable pour les dépôts et retraits de paris dans le monde.",
    product: "Produit",
    features: "Fonctionnalités",
    security: "Sécurité",
    pricing: "Tarification",
    api: "API",
    company: "Entreprise",
    about: "À Propos",
    careers: "Carrières",
    press: "Presse",
    contact: "Contact",
    legal: "Légal",
    privacy: "Politique de Confidentialité",
    terms: "Conditions d'Utilisation",
    compliance: "Conformité",
    licenses: "Licences",
    copyright: "© 2025 Blaffa. Tous droits réservés. Fournisseur de services financiers licencié et réglementé."
  }
};

export default function BlaffaLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [language, setLanguage] = useState<Language>('fr');

  const [openFaq, setOpenFaq] = useState(-1);

  const { theme } = useTheme();
  const { i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
   
  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language || navigator.languages[0];
    const detectedLang: Language = browserLang.startsWith('fr') ? 'fr' : 'en';
    setLanguage(detectedLang);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        
        // If no token exists, allow user to stay on homepage
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If token is valid, redirect to dashboard
        if (response.status === 200) {
          router.replace('/dashboard'); // Use replace instead of push to prevent back navigation
        }
      } catch (error) {
        // Token validation failed - clear the invalid token
        console.error('Token validation failed:', error);
        localStorage.removeItem('accessToken');
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('i18nextLng');
      if (!savedLang) {
        i18n.changeLanguage('fr');
      }
    }
    

    validateToken();
    setIsClient(true);
  }, [router, i18n]); // Add router as a dependency

  if (isLoading && isClient) {
    return (
      <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render the full content when on the client and not loading
  // if (!isClient) {
  //   return <div className="min-h-screen"></div>; // Simple placeholder during SSR
  // }

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedLang = localStorage.getItem('i18nextLng');
  //     if (!savedLang) {
  //       i18n.changeLanguage('fr');
  //     }
  //   }
  // }, [i18n]);

  

  const t = translations[language];

  

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.bankingSecurity,
      description: t.bankingSecurityDesc
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t.instantDeposits,
      description: t.instantDepositsDesc
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t.support247,
      description: t.support247Desc
    }
  ];

  const bettingPlatforms = [
    { 
      name: "1xbet", 
      logo: "/1x.jpg"
    },
    { 
      name: "888STARZ", 
      logo: "88.png"
    },
    { 
      name: "BETWINNER", 
      logo: "/bw.jpg"
    },
    { 
      name: "MELBET", 
      logo: "/mb.png"
    }
  ];

  const mobileNetworks = [
    { name: "ORANGE BF", country: "Burkina Faso", flag: "BF", color: "/bf.png", logo: "/orange.png" },
    { name: "WAVE CI", country: "Côte d'Ivoire", flag: "🇨🇮", color: "/ci.png", logo: "/w.jpg" },
    { name: "MOOV CI", country: "Côte d'Ivoire", flag: "🇨🇮", color: "/ci.png", logo: "/moov.png" },
    { name: "ORANGE CI", country: "Côte d'Ivoire", flag: "🇨🇮", color: "/ci.png", logo: "/orange.png" },
    { name: "MTN CI", country: "Côte d'Ivoire", flag: "🇨🇮", color: "/ci.png", logo: "/mtn.jpg" },
    { name: "MOOV BENIN", country: "Bénin", flag: "🇧🇯", color: "/bj.png", logo: "/moov.png" },
    { name: "MTN BÉNIN", country: "Bénin", flag: "🇧🇯", color: "/bj.png", logo: "/mtn.jpg" },
    { name: "MOOV BF", country: "Burkina Faso", flag: "🇧🇫", color: "bf.png", logo: "/moov.png" }
  ];

  const stats = [
    { number: "500K+", label: t.activeUsers },
    { number: "50M+ FCFA", label: t.monthlyTransfers },
    { number: "99.9%", label: t.uptime },
    { number: "12+", label: t.networksSupported }
  ];

  const testimonials = [
    {
      name: "Marcus Chen",
      role: t.professionalTrader,
      content: t.testimonial1,
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Sarah Williams",
      role: t.sportsEnthusiast, 
      content: t.testimonial2,
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3ff?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "David Rodriguez",
      role: t.financeExpert,
      content: t.testimonial3,
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
    }
  ];

  const faqs = [
    {
      question: t.faq1Q,
      answer: t.faq1A
    },
    {
      question: t.faq2Q,
      answer: t.faq2A
    },
    {
      question: t.faq3Q,
      answer: t.faq3A
    },
    {
      question: t.faq4Q,
      answer: t.faq4A
    },
    {
      question: t.faq5Q,
      answer: t.faq5A
    }
  ];

  // const [openFaq, setOpenFaq] = useState(-1);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background} transition-all duration-300`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? `${theme.colors.sl_background} backdrop-blur-md border-b border-slate-700` : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Blaffa Logo" className="w-15 h-15" ></img>
              <span className="text-2xl font-bold">Blaffa</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all"
              >
                 
                <Globe className="w-4 h-4" />
                {/* <LanguageSwitcher /> */}
                <span className="text-sm">{language === 'en' ? 'FR' : 'EN'}</span>
              </button>
              <ThemeToggle /> 
              <a href='/auth' className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-white">
                {t.getStarted}
              </a>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden ${theme.colors.sl_background} backdrop-blur-md border-t border-slate-700`}>
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'fr' : 'en')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all w-full"
              >
                <Globe className="w-4 h-4" />
                {/* <LanguageSwitcher /> */}
                <span className="text-sm">{language === 'fr' ? 'Français' : 'English'}</span>
              </button>
              <ThemeToggle /> 
              <a href='/auth' className="w-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all block text-center text-white">
                {t.getStarted}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className={`inline-block bg-blue-500/20 ${theme.colors.text} px-4 py-2 rounded-full text-sm font-medium`}>
                  {t.approvedBy}
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  {t.heroTitle}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> {t.heroTitleHighlight} </span>
                  {t.heroTitleEnd}
                </h1>
                <p className="text-xl leading-relaxed">
                  {t.heroDescription}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href='/auth' className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-semibold text-white">
                  <span>{t.startNow}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className={`relative z-10 bg-gradient-to-br ${theme.colors.s_background} rounded-2xl p-8 border border-slate-700 shadow-2xl`}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{t.quickTransfer}</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`${theme.colors.background} rounded-lg p-4`}>
                      <label className="text-sm text-slate-400">{t.amount}</label>
                      <div className="text-2xl font-bold">50,000 FCFA</div>
                    </div>
                    
                    <div className={`${theme.colors.background} rounded-lg p-4`}>
                      <label className="text-sm text-slate-400">{t.toPlatform}</label>
                      <div className="text-lg font-semibold">1xbet</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Betting Platforms Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${theme.colors.c_background}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">{t.supportedPlatforms}</h2>
            <p className="text-xl ">
              {t.supportedPlatformsDesc}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bettingPlatforms.map((platform, index) => (
              <div key={index} className={`bg-gradient-to-br ${theme.colors.s_background} p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 text-center`}>
                <img 
                  src={platform.logo} 
                  alt={platform.name}
                  className="w-16 h-16 mx-auto mb-4 rounded-lg object-cover"
                />
                <h3 className="text-lg font-semibold">{platform.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Networks Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Smartphone className="w-8 h-8 text-blue-400" />
              <h2 className="text-4xl font-bold">{t.mobileNetworks}</h2>
            </div>
            <p className="text-xl ">
              {t.mobileNetworksDesc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mobileNetworks.map((network, index) => (
              <div key={index} className={`bg-gradient-to-br ${theme.colors.s_background} p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">{network.flag}</div>
                    <img 
                      src={network.logo} 
                      alt={network.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  </div>
                  {/* <CreditCard className={`w-5 h-5 ${
                    network.color === 'orange' ? 'text-orange-400' :
                    network.color === 'blue' ? 'text-blue-400' :
                    network.color === 'green' ? 'text-green-400' :
                    'text-yellow-400'
                  }`} /> */}
                  <img 
                   src={network.color} 
                      alt={network.name}
                      className="w-8 h-8 rounded object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{network.name}</h3>
                <p className="text-sm text-slate-400">{network.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 sm:px-6 lg:px-8 ${theme.colors.c_background}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">{t.whyChoose}</h2>
            <p className="text-xl  max-w-3xl mx-auto">
              {t.whyChooseDesc}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`bg-gradient-to-br ${theme.colors.s_background} p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105`}>
                <div className="text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className=" leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">{t.approvedByPros}</h2>
            <p className="text-xl ">{t.testimonialsDesc}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`bg-gradient-to-br ${theme.colors.s_background} p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105`}>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed italic">
                  {testimonial.content}
                </p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${theme.colors.c_background}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">{t.faqTitle}</h2>
            <p className={`text-xl ${theme.colors.d_text}`}>{t.faqDesc}</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className={`bg-gradient-to-br ${theme.colors.s_background} rounded-xl border border-slate-700 overflow-hidden`}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-all"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${
                    openFaq === index ? 'transform rotate-180' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`bg-gradient-to-br ${theme.colors.s_background} p-12 rounded-2xl border border-slate-700`}>
            <h2 className="text-4xl font-bold mb-4">{t.readyToStart}</h2>
            <p className={`text-xl ${theme.colors.d_text} mb-8 max-w-2xl mx-auto`}>
              {t.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href='/auth' className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold text-white">
                {t.createFreeAccount}
              </a>
              <a href='/contact' className="border border-slate-600 px-8 py-4 rounded-lg hover:bg-slate-700/50 transition-all font-semibold">
                {t.contactSales}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 px-4 sm:px-6 lg:px-8 ${theme.colors.sl_background} border-t border-slate-700`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Blaffa Logo" className="w-15 h-15" ></img>
                <span className="text-2xl font-bold">Blaffa</span>
              </div>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                {t.footerDesc}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">{t.product}</h3>
              <ul className={`space-y-2 ${theme.colors.d_text}`}>
                <li><a href="#features" className="hover:text-white transition-colors">{t.features}</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">{t.security}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t.pricing}</a></li>
                <li><a href="#api" className="hover:text-white transition-colors">{t.api}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">{t.company}</h3>
              <ul className={`space-y-2 ${theme.colors.d_text}`}>
                <li><a href="#about" className="hover:text-white transition-colors">{t.about}</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">{t.careers}</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">{t.press}</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">{t.contact}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">{t.legal}</h3>
              <ul className={`space-y-2 ${theme.colors.d_text}`}>
                <li><a href="#privacy" className="hover:text-white transition-colors">{t.privacy}</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">{t.terms}</a></li>
                <li><a href="#compliance" className="hover:text-white transition-colors">{t.compliance}</a></li>
                <li><a href="#licenses" className="hover:text-white transition-colors">{t.licenses}</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`pt-8 border-t border-slate-700 text-center ${theme.colors.d_text}`}>

            <p>{t.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}