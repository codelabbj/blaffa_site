'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { ImagePlus, Send } from 'lucide-react';
import { sendChatbotMessage, uploadChatImage } from '@/lib/blaffa-api';

type ChatRole = 'user' | 'assistant';

type ChatBubble = {
  id: string;
  role: ChatRole;
  content: string;
  /** URL image affichée dans la bulle (contenu = lien pour My Customer). */
  imageUrl?: string;
};

const STORAGE_KEY = 'blaffa_chatbot_session_v1';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

type StoredSession = {
  conversationId: string | null;
  messages: ChatBubble[];
  savedAt: number;
};

const WELCOME: ChatBubble = {
  id: 'welcome',
  role: 'assistant',
  content: 'Bonjour ! Comment puis-je vous aider ?',
};

function isHttpUrl(text: string): boolean {
  const t = text.trim().toLowerCase();
  return t.startsWith('http://') || t.startsWith('https://');
}

function looksLikeImageUrl(text: string): boolean {
  if (!isHttpUrl(text)) return false;
  const path = text.trim().split('?')[0].toLowerCase();
  return /\.(png|jpe?g|gif|webp|bmp|heic)$/.test(path) || path.includes('/media/');
}

function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredSession;
    if (!data?.savedAt || Date.now() - data.savedAt > SESSION_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function persistSession(conversationId: string | null, messages: ChatBubble[]) {
  try {
    const payload: StoredSession = {
      conversationId,
      messages: messages.filter((m) => m.id !== 'welcome' || messages.length === 1),
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

function TypingDots() {
  return (
    <div
      className="flex items-center gap-1.5 px-1 py-0.5"
      aria-label="En train d’écrire"
      role="status"
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function BubbleBody({ m }: { m: ChatBubble }) {
  const showImg = Boolean(m.imageUrl) || (m.role === 'user' && looksLikeImageUrl(m.content));
  const src = m.imageUrl || (showImg ? m.content.trim() : '');
  if (showImg && src) {
    return (
      <div className="space-y-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Capture envoyée"
          className="max-h-56 max-w-full rounded-xl object-contain bg-black/10"
        />
        {!m.imageUrl && looksLikeImageUrl(m.content) ? null : null}
      </div>
    );
  }
  return <>{m.content}</>;
}

type SupportChatbotProps = {
  pageKey?: string;
  route?: string;
  screenTitle?: string;
  /** Cache le titre interne (quand le parent affiche déjà un header) */
  hideHeader?: boolean;
  className?: string;
  /** Texte prérempli dans le champ de saisie (ex. réclamation transaction) */
  initialMessage?: string;
};

export function SupportChatbot({
  pageKey = 'support',
  route = '/contact',
  screenTitle = 'Support',
  hideHeader = false,
  className = '',
  initialMessage = '',
}: SupportChatbotProps) {
  const [messages, setMessages] = useState<ChatBubble[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const prefillApplied = useRef(false);

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      if (saved.conversationId) setConversationId(saved.conversationId);
      if (saved.messages?.length) {
        setMessages(saved.messages);
      }
    }
    // Migre l’ancien storage (id seul, sans TTL)
    try {
      localStorage.removeItem('blaffa_chatbot_conversation_id');
    } catch {
      /* ignore */
    }
    setHydrated(true);
    const t = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated || prefillApplied.current) return;
    const text = (initialMessage || '').trim();
    if (!text) return;
    prefillApplied.current = true;
    setInput(text);
    const t = window.setTimeout(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(text.length, text.length);
    }, 300);
    return () => window.clearTimeout(t);
  }, [hydrated, initialMessage]);

  useEffect(() => {
    if (!hydrated) return;
    persistSession(conversationId, messages);
  }, [hydrated, conversationId, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const sendText = async (text: string, opts?: { imageUrl?: string; displayAs?: string }) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError('');
    setInput('');
    const userMsg: ChatBubble = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: opts?.displayAs || trimmed,
      imageUrl: opts?.imageUrl,
    };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const data = await sendChatbotMessage({
        message: trimmed,
        conversation_id: conversationId,
        page_key: pageKey,
        route,
        screen_title: screenTitle,
      });
      const reply = (data.message || data.detail || '').trim();
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      if (data.escalated && data.silent && !reply) {
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: reply || 'Je n’ai pas pu répondre pour le moment. Réessayez.',
        },
      ]);
    } catch (err: unknown) {
      const ax = err as {
        code?: string;
        response?: { status?: number; data?: { detail?: string } };
      };
      const isTimeout = ax.code === 'ECONNABORTED';
      const detail =
        (isTimeout
          ? 'La réponse prend trop de temps. Réessayez dans un instant.'
          : ax.response?.data?.detail) ||
        'Impossible de contacter le chatbot. Réessayez plus tard.';
      setError(String(detail));
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: String(detail),
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending || !input.trim()) return;
    await sendText(input);
  };

  const onPickImage = async (file: File | null) => {
    if (!file || sending) return;
    if (!file.type.startsWith('image/')) {
      setError('Veuillez choisir une image (JPG, PNG…).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image trop lourde (max 8 Mo).');
      return;
    }

    setError('');
    setSending(true);
    try {
      const url = await uploadChatImage(file);
      // sendText gère sending jusqu’à la fin du tour chatbot
      await sendText(url, { imageUrl: url, displayAs: '📷 Capture' });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { image?: string[] | string; detail?: string } } };
      const imgErr = ax.response?.data?.image;
      const detail =
        (Array.isArray(imgErr) ? imgErr[0] : imgErr) ||
        ax.response?.data?.detail ||
        'Impossible d’envoyer l’image. Réessayez.';
      setError(String(detail));
      setSending(false);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div
      className={`flex flex-col min-h-0 h-full max-h-full rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm ${className}`}
    >
      {!hideHeader && (
        <div className="shrink-0 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <p className="text-lg font-bold text-gray-900 dark:text-white">Assistant Blaffa</p>
          <p className="text-sm text-gray-500">Réponses automatiques · support</p>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[#1a4384] text-white rounded-br-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
              }`}
            >
              <BubbleBody m={m} />
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="shrink-0 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-gray-100 dark:border-gray-800 flex items-end gap-2 bg-white dark:bg-gray-900"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onPickImage(e.target.files?.[0] || null)}
        />
        <button
          type="button"
          disabled={sending}
          onClick={() => fileRef.current?.click()}
          className="h-11 w-11 shrink-0 self-end rounded-full border border-gray-200 dark:border-gray-700 text-[#1a4384] dark:text-blue-300 flex items-center justify-center disabled:opacity-50"
          aria-label="Joindre une image"
          title="Joindre une capture"
        >
          <ImagePlus className="h-5 w-5" />
        </button>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Écrivez votre message…"
          className="flex-1 resize-none rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm leading-5 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a4384]/30 min-h-[4.5rem]"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="h-11 w-11 shrink-0 self-end rounded-full bg-[#1a4384] text-white flex items-center justify-center disabled:opacity-50"
          aria-label="Envoyer"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
      {error ? <p className="shrink-0 px-4 pb-2 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
