'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

/**
 * Page callback Google OAuth pour blaffa_site.
 * Google Identity Services envoie le credential directement via callback JS
 * mais en cas de redirection manuelle, on capte ici.
 */
export default function GoogleCallbackPage() {
    const [message, setMessage] = useState('Connexion avec Google...');
    const [error, setError] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);
                const idToken = params.get('id_token');

                if (!idToken) {
                    setError('Token Google non trouvé. Veuillez réessayer.');
                    return;
                }

                const res = await api.post('/auth/google-login', { id_token: idToken });
                const { refresh, access, data } = res.data;

                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('accessToken', access);
                if (data?.id) localStorage.setItem('userId', data.id.toString());
                if (data?.email) localStorage.setItem('userEmail', data.email);

                api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                setMessage('Connexion réussie ! Redirection...');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 800);

            } catch (err: any) {
                console.error('Google callback error:', err);
                const msg = err.response?.data?.message || 'Erreur lors de la connexion Google.';
                setError(msg);
            }
        };

        handleCallback();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
            <div className="flex flex-col items-center gap-4">
                <svg className="w-12 h-12" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>

                {error ? (
                    <>
                        <p className="text-red-500 font-medium text-center">{error}</p>
                        <a href="/login" className="mt-4 px-6 py-3 bg-[#1e40af] text-white rounded-xl font-semibold">
                            Retour à la connexion
                        </a>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 border-4 border-[#1e40af] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">{message}</p>
                    </>
                )}
            </div>
        </div>
    );
}
