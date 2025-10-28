'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import DashboardHeader from '@/components/DashboardHeader';
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

      <DashboardHeader />

      <header className={`${theme.colors.s_background} border-b border-slate-600/50 py-8 mb-8`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${theme.colors.d_text}`}>BLAFFA — Termes et Conditions d'utilisation</h1>
          <p className="text-slate-400">
            Dernière mise à jour : <strong>Document fourni</strong>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <nav className="lg:col-span-1" aria-label="Table des matières">
            <div className={`sticky top-24 bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 shadow-lg`}>
              <h2 className={`text-lg font-bold mb-4 ${theme.colors.d_text}`}>Sommaire</h2>
              <ul className="space-y-2 text-sm">
                <li><a href="#presentation" className="text-blue-400 hover:text-blue-300 transition-colors">1. Présentation du Service</a></li>
                <li><a href="#acceptation" className="text-blue-400 hover:text-blue-300 transition-colors">2. Acceptation des Conditions</a></li>
                <li><a href="#inscription" className="text-blue-400 hover:text-blue-300 transition-colors">3. Conditions d'inscription et d'âge</a></li>
                <li><a href="#responsabilites" className="text-blue-400 hover:text-blue-300 transition-colors">4. Nature du Service et Responsabilités</a></li>
                <li><a href="#crypto" className="text-blue-400 hover:text-blue-300 transition-colors">5. Achat et vente de crypto-monnaies</a></li>
                <li><a href="#transactions" className="text-blue-400 hover:text-blue-300 transition-colors">6. Dépôts, retraits et transactions</a></li>
                <li><a href="#parissportifs" className="text-blue-400 hover:text-blue-300 transition-colors">7. Prévention risques paris sportifs</a></li>
                <li><a href="#utilisateur" className="text-blue-400 hover:text-blue-300 transition-colors">8. Responsabilité de l'utilisateur</a></li>
                <li><a href="#aml" className="text-blue-400 hover:text-blue-300 transition-colors">9. Lutte contre la fraude (AML/CFT)</a></li>
                <li><a href="#donnees" className="text-blue-400 hover:text-blue-300 transition-colors">10. Données personnelles</a></li>
                <li><a href="#limitations" className="text-blue-400 hover:text-blue-300 transition-colors">11. Risques et limitations de responsabilité</a></li>
                <li><a href="#resiliation" className="text-blue-400 hover:text-blue-300 transition-colors">12. Résiliation et suspension</a></li>
                <li><a href="#modifications" className="text-blue-400 hover:text-blue-300 transition-colors">13. Modifications des conditions</a></li>
                <li><a href="#droit" className="text-blue-400 hover:text-blue-300 transition-colors">14. Droit applicable</a></li>
                <li><a href="#contact" className="text-blue-400 hover:text-blue-300 transition-colors">15. Contact</a></li>
              </ul>
            </div>
          </nav>

          <article className={`lg:col-span-3 bg-gradient-to-br ${theme.colors.s_background} backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 shadow-lg space-y-8`}>
            <section id="presentation">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>1. Présentation du Service</h2>
              <p className={`${theme.colors.d_text} leading-relaxed mb-4`}>
                BLAFFA est une plateforme numérique exploitée par MANOS GROUP, permettant :
                l'achat et la vente de crypto-monnaies de manière rapide et sécurisée via les opérateurs de paiement mobile
                (Orange Money, MTN, Wave, Moov, etc.), ainsi que les dépôts et retraits sur les sites de paris sportifs agréés.
              </p>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA n'est pas un bookmaker et ne propose aucun service de pari, de pronostic ou de jeu d'argent.
                Elle agit uniquement comme intermédiaire technique et financier entre les utilisateurs et les plateformes partenaires.
              </p>
            </section>

            <section id="acceptation">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>2. Acceptation des Conditions</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                En accédant à la plateforme BLAFFA ou à l'une de ses applications, l'utilisateur reconnaît avoir lu,
                compris et accepté sans réserve les présents Termes et Conditions d'Utilisation (T&C).
              </p>
            </section>

            <section id="inscription">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>3. Conditions d'inscription et d'âge</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                L'accès à BLAFFA est strictement réservé aux personnes majeures (18 ans et plus). L'utilisateur doit
                s'inscrire avec son vrai nom et prénom, tels qu'indiqués sur sa pièce d'identité. Toute fausse information
                entraînera la suppression immédiate du compte. BLAFFA peut demander des justificatifs (CNI, passeport, etc.).
              </p>
            </section>

            <section id="responsabilites">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>4. Nature du Service et Responsabilités</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA offre un service d'achat/vente de crypto-monnaies en FCFA (XOF) et un service de transfert vers/depuis
                les sites partenaires. BLAFFA ne stocke pas d'argent ni de cryptomonnaies pour le compte des utilisateurs.
              </p>
            </section>

            <section id="crypto">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>5. Achat et vente de crypto-monnaies</h2>
              <p className={`${theme.colors.d_text} leading-relaxed mb-4`}>
                L'utilisateur doit vérifier attentivement l'adresse de réception avant toute transaction. Le cours du marché
                peut fluctuer ; BLAFFA n'est pas responsable des pertes liées à la volatilité. Aucune garantie de rendement
                ou gain n'est offerte.
              </p>
              <p className="text-yellow-400">⚠ Avertissement : le marché des crypto-monnaies est hautement volatil et risqué.</p>
            </section>

            <section id="transactions">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>6. Dépôts, retraits et transactions</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                Les dépôts et retraits s'effectuent via les opérateurs autorisés intégrés à la plateforme. BLAFFA ne peut être tenue
                responsable d'une erreur de numéro, d'adresse crypto ou d'un compte erroné saisi par l'utilisateur.
              </p>
            </section>

            <section id="parissportifs">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>7. Prévention des risques liés aux paris sportifs</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                Les paris sportifs comportent des risques de perte financière. BLAFFA n'encourage pas les utilisateurs à jouer excessivement.
                La plateforme recommande de retirer régulièrement ses gains.
              </p>
            </section>

            <section id="utilisateur">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>8. Responsabilité de l'utilisateur</h2>
              <ul className={`space-y-2 ${theme.colors.d_text} list-disc list-inside`}>
                <li>Ne pas utiliser BLAFFA pour des activités illégales.</li>
                <li>Avertir immédiatement le service client en cas de problème.</li>
                <li>Ne pas revendre ou céder son compte à un tiers.</li>
              </ul>
            </section>

            <section id="aml">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>9. Lutte contre la fraude et le blanchiment (AML/CFT)</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA applique des politiques strictes de vérification d'identité (KYC) et de surveillance des transactions suspectes.
                Toute activité illégale sera signalée aux autorités compétentes.
              </p>
            </section>

            <section id="donnees">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>10. Données personnelles</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA protège les informations personnelles conformément à la loi ivoirienne n°2013-450. Les données sont utilisées pour
                les transactions et la sécurité du compte. Aucune donnée n'est vendue sans autorisation.
              </p>
            </section>

            <section id="limitations">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>11. Risques et limitations de responsabilité</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA ne garantit pas la disponibilité continue du service. Elle ne pourra être tenue responsable des pertes
                résultant d'erreurs de saisie ou de problèmes liés aux partenaires externes.
              </p>
            </section>

            <section id="resiliation">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>12. Résiliation et suspension</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                BLAFFA se réserve le droit de suspendre ou fermer un compte en cas de fraude, d'utilisation illégale ou de refus
                de vérification d'identité.
              </p>
            </section>

            <section id="modifications">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>13. Modifications des conditions</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                Les présentes conditions peuvent être mises à jour à tout moment. Les modifications prendront effet dès leur publication
                sur la plateforme.
              </p>
            </section>

            <section id="droit">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>14. Droit applicable</h2>
              <p className={`${theme.colors.d_text} leading-relaxed`}>
                Les Termes et Conditions sont régis par le droit ivoirien. Tout litige sera soumis aux tribunaux d'Abidjan.
              </p>
            </section>

            <section id="contact">
              <h2 className={`text-2xl font-bold mb-4 ${theme.colors.d_text}`}>15. Contact</h2>
              <div className={`${theme.colors.d_text} leading-relaxed space-y-2`}>
                <p>
                  Email : <a href="mailto:support@blaffa.net" className="text-blue-400 hover:text-blue-300">support@blaffa.net</a>
                </p>
                <p>
                  WhatsApp : <a href="tel:+2250566643821" className="text-blue-400 hover:text-blue-300">+225 05 66 64 38 21</a>
                </p>
                <p>
                  Site officiel : <a href="https://blaffa.net" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">https://blaffa.net</a>
                </p>
              </div>
            </section>

            <footer className="pt-8 border-t border-slate-600/50">
              <p className="text-sm text-slate-400 text-center">
                Contenu basé sur le document fourni par l'utilisateur.
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
