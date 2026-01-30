'use client';

import { useEffect } from 'react';
import Head from 'next/head';
// import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/components/ThemeProvider';

export default function PrivacyPolicy() {
  const { theme } = useTheme();

  // Smooth scroll for anchors
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.a_background}`}>
      <Head>
        <title>Termes et conditions - BLAFFA</title>
        <meta name="description" content="Termes et conditions d'utilisation de BLAFFA" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      {/* <DashboardHeader /> */}

      <header className={`${theme.colors.s_background} border-b border-slate-600/50 py-8 mb-8`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${theme.colors.d_text}`}>TERMES ET CONDITIONS D’UTILISATION – BLAFFA</h1>
          <p className="text-slate-400">
            Dernière mise à jour : <strong>30 Janvier 2026</strong>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <nav className="lg:col-span-1" aria-label="Table des matières">
            <div className={`sticky top-24 bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 shadow-lg`}>
              <h2 className={`text-lg font-bold mb-4 ${theme.colors.d_text}`}>Sommaire</h2>
              <ul className="space-y-2 text-sm">
                <li><a href="#presentation" className="text-blue-400 hover:text-blue-300 transition-colors">1. Présentation de BLAFFA</a></li>
                <li><a href="#acces" className="text-blue-400 hover:text-blue-300 transition-colors">2. Conditions d’accès</a></li>
                <li><a href="#responsabilite" className="text-blue-400 hover:text-blue-300 transition-colors">3. Responsabilité de l’utilisateur</a></li>
                <li><a href="#transactions" className="text-blue-400 hover:text-blue-300 transition-colors">4. Dépôts et retraits</a></li>
                <li><a href="#equitable" className="text-blue-400 hover:text-blue-300 transition-colors">5. Utilisation équitable</a></li>
                <li><a href="#coupons" className="text-blue-400 hover:text-blue-300 transition-colors">6. Coupons et pronostics</a></li>
                <li><a href="#frais" className="text-blue-400 hover:text-blue-300 transition-colors">7. Frais et commissions</a></li>
                <li><a href="#fraude" className="text-blue-400 hover:text-blue-300 transition-colors">8. Lutte contre la fraude</a></li>
                <li><a href="#limitation" className="text-blue-400 hover:text-blue-300 transition-colors">9. Limitation de responsabilité</a></li>
                <li><a href="#service" className="text-blue-400 hover:text-blue-300 transition-colors">10. Service client</a></li>
                <li><a href="#conformite" className="text-blue-400 hover:text-blue-300 transition-colors">11. Conformité et réglementation</a></li>
                <li><a href="#modification" className="text-blue-400 hover:text-blue-300 transition-colors">12. Modification des conditions</a></li>
                <li><a href="#acceptation" className="text-blue-400 hover:text-blue-300 transition-colors">13. Acceptation</a></li>
              </ul>
            </div>
          </nav>

          <article className={`lg:col-span-3 bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 shadow-lg space-y-8`}>
            <section id="presentation">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>1. Présentation de BLAFFA</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA est une plateforme de services financiers permettant d’effectuer des dépôts et retraits vers des plateformes de paris sportifs partenaires. BLAFFA n’est pas un site de paris sportifs et ne garantit aucun gain.
              </p>
            </section>

            <section id="acces">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>2. Conditions d’accès</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                Vous devez être âgé d’au moins 18 ans, utiliser un numéro valide et fournir des informations exactes. BLAFFA peut refuser ou suspendre l’accès en cas de non-respect.
              </p>
            </section>

            <section id="responsabilite">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>3. Responsabilité de l’utilisateur</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                L’utilisateur est seul responsable de son compte, de ses dépôts, retraits, gains et pertes. BLAFFA n’est pas responsable des décisions des plateformes de paris sportifs.
              </p>
            </section>

            <section id="transactions">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>4. Dépôts et retraits</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                Les opérations suivent les procédures indiquées. Vérifiez toujours les informations de paiement. Un code de validation peut être exigé pour les retraits.
              </p>
            </section>

            <section id="equitable">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>5. Utilisation équitable</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                L’utilisation uniquement pour des retraits sans dépôts peut entraîner des limitations ou un refus de service.
              </p>
            </section>

            <section id="coupons">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>6. Coupons et pronostics</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                Les coupons publiés par les utilisateurs ne sont pas forcément rentables. Téléchargez et analysez chaque coupon avant de jouer. Vous jouez à vos propres risques.
              </p>
            </section>

            <section id="frais">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>7. Frais et commissions</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                Certains services peuvent être sans frais. BLAFFA peut modifier ses frais si nécessaire.
              </p>
            </section>

            <section id="fraude">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>8. Lutte contre la fraude</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA met en place des mesures pour prévenir la fraude, le blanchiment et l’utilisation abusive.
              </p>
            </section>

            <section id="limitation">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>9. Limitation de responsabilité</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA n’est pas responsable des pertes liées aux paris, des pannes partenaires ou des retards opérateurs.
              </p>
            </section>

            <section id="service">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>10. Service client</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                En cas de souci, contactez rapidement le service client via WhatsApp ou Telegram uniquement.
              </p>
            </section>

            <section id="conformite">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>11. Conformité et réglementation</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA applique des règles de conformité, peut demander des documents (KYC), bloquer des transactions suspectes et coopérer avec les autorités si la loi l’exige.
              </p>
            </section>

            <section id="modification">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>12. Modification des conditions</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA peut modifier les présentes conditions à tout moment.
              </p>
            </section>

            <section id="acceptation">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>13. Acceptation</h2>
              <p className={`${theme.colors.d_text} leading-relaxed font-bold`}>
                L’utilisation de BLAFFA vaut acceptation complète des présents Termes et Conditions.
              </p>
            </section>

            <footer className="pt-8 border-t border-slate-600/50">
              <p className="text-sm text-slate-400 text-center italic">
                Ceci constitue l'intégralité des termes et conditions régissant votre utilisation du service BLAFFA.
              </p>
            </footer>
          </article>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className={`flex items-center bg-gradient-to-r ${theme.colors.s_background} hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
      </main>
    </div>
  );
}
