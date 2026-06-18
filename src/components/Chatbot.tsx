'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { X, Send, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'assistant'; content: string };

/** Renderiza texto con URLs convertidas en links clickeables */
function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  const urlRegex = /(https?:\/\/[^\s]+|\/cotizar\/[^\s]+|\/agenda[^\s]*)/g;
  const parts = content.split(urlRegex);
  return (
    <>
      {parts.map((part, i) => {
        if (urlRegex.test(part)) {
          const href = part.startsWith('http') ? part : part;
          const label = part.includes('/cotizar') ? '👉 Ir al cotizador' : part.includes('/agenda') ? '📅 Agendar visita' : part;
          return (
            <a
              key={i}
              href={href}
              target={part.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className={cn(
                'block mt-1.5 rounded-lg px-3 py-2 text-center text-[12px] font-semibold transition-colors',
                isUser ? 'bg-white/20 text-white' : 'bg-ink text-white hover:bg-ink/80',
              )}
            >
              {label}
            </a>
          );
        }
        urlRegex.lastIndex = 0;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function Chatbot() {
  const t = useTranslations('chatbot');
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<'form' | 'chat'>('form');
  const [leadForm, setLeadForm] = useState({ fullName: '', phone: '' });
  const [leadSaving, setLeadSaving] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!leadForm.fullName.trim() || !leadForm.phone.trim()) return;
    setLeadSaving(true);
    try {
      await fetch('/api/chat-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: leadForm.fullName, phone: leadForm.phone }),
      });
    } catch {}
    const welcome = `¡Gracias, ${leadForm.fullName.split(' ')[0]}! ¿En qué te puedo ayudar?`;
    setMessages([{ role: 'assistant', content: welcome }]);
    setStage('chat');
    setLeadSaving(false);
  }

  async function quickSend(text: string) {
    if (loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.message ?? 'Lo siento, hubo un error.' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'No pude conectarme. Intenta de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.message ?? 'Lo siento, hubo un error.' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'No pude conectarme. Intenta de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-20 right-5 z-50 md:bottom-6 md:right-6">
        {/* Ondas de pulso — mismo tamaño que el botón */}
        {!open && (
          <>
            <span className="absolute h-14 w-14 rounded-full bg-accent animate-ping opacity-25" />
            <span className="absolute h-14 w-14 rounded-full bg-accent animate-ping opacity-15 [animation-delay:0.5s]" />
          </>
        )}
        <button
          aria-label="Abrir asistente"
          onClick={() => setOpen((v) => !v)}
          className="relative h-14 w-14 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.22)] transition-all duration-300 hover:scale-105"
        >
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            {open ? (
              <span className="flex h-full w-full items-center justify-center bg-ink text-white">
                <ChevronDown size={22} strokeWidth={2} />
              </span>
            ) : (
              <Image src="/luis.png" alt="Luis" fill className="object-cover" />
            )}
          </span>
          {/* Green online dot — outside overflow-hidden so it doesn't get clipped */}
          {!open && (
            <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-60" />
            </span>
          )}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]
            inset-x-0 bottom-[64px] rounded-t-2xl
            md:inset-x-auto md:bottom-24 md:right-6 md:w-[380px] md:rounded-2xl"
          style={{
            height: 'min(calc(100dvh - 64px - 20px), 580px)',
          } as React.CSSProperties}
        >

          {/* Header */}
          <div className="relative flex items-center gap-3.5 bg-ink px-5 py-4">
            {/* Avatar con foto */}
            <div className="relative h-11 w-11 shrink-0">
              <div className="h-full w-full overflow-hidden rounded-full ring-2 ring-white/20">
                <Image src="/luis.png" alt="Luis" fill className="object-cover" />
              </div>
              {/* Green dot — fuera del overflow-hidden para que no se recorte */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ink">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-60" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-serif text-[17px] font-light italic text-white leading-tight">Luis</div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-caps text-white/50">{t('subtitle')}</span>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Form de captación o Chat */}
          {stage === 'form' ? (
            <div className="flex flex-1 flex-col justify-center px-6 py-8">
              <p className="mb-6 text-[14px] leading-relaxed text-ink-2">
                ¡Hola! Soy Luis, tu asesor de Quattro Plaza Center. Por favor ingresa tus datos para comenzar:
              </p>
              <form onSubmit={submitLead} className="flex flex-col gap-4">
                <label className="field">
                  <span className="field-label">Nombre completo *</span>
                  <input
                    required
                    type="text"
                    className="field-input"
                    placeholder="Tu nombre"
                    value={leadForm.fullName}
                    onChange={(e) => setLeadForm((f) => ({ ...f, fullName: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span className="field-label">Teléfono *</span>
                  <input
                    required
                    type="tel"
                    className="field-input"
                    placeholder="+52 998 000 0000"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </label>
                <button
                  type="submit"
                  disabled={leadSaving || !leadForm.fullName.trim() || !leadForm.phone.trim()}
                  className="btn btn-lg mt-2 w-full font-bold disabled:opacity-40"
                  style={{ background: '#FAB413', color: '#0E0E0E' }}
                >
                  {leadSaving ? 'Un momento…' : 'Comenzar'}
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 no-scrollbar">
                {messages.map((m, i) => (
                  <div key={i} className={cn('flex items-end gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {m.role === 'assistant' && (
                      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full mb-0.5">
                        <Image src="/luis.png" alt="Luis" fill className="object-cover" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed',
                        m.role === 'user'
                          ? 'rounded-br-sm bg-ink text-white'
                          : 'rounded-bl-sm bg-[#F4F2EE] text-ink-2',
                      )}
                    >
                      <MessageContent content={m.content} isUser={m.role === 'user'} />
                    </div>
                  </div>
                ))}

                {/* Quick replies — solo después del mensaje de bienvenida */}
                {messages.length === 1 && !loading && (
                  <div className="flex flex-col gap-2 pl-8">
                    {[
                      '¿Qué locales tienen disponibles?',
                      'Quiero cotizar un local',
                      'Quiero agendar una visita',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => quickSend(suggestion)}
                        className="w-fit rounded-full border border-line bg-white px-4 py-2 text-left text-[12.5px] font-medium text-ink-2 transition-all hover:border-ink hover:bg-bg-soft"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {loading && (
                  <div className="flex items-end gap-2 justify-start">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-ink mb-0.5">
                      <Sparkles size={10} strokeWidth={2} />
                    </div>
                    <div className="rounded-2xl rounded-bl-sm bg-[#F4F2EE] px-4 py-3.5">
                      <span className="inline-flex gap-1.5 items-center">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: '120ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: '240ms' }} />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="border-t border-line bg-white px-3 pb-3 pt-2.5">
                <form onSubmit={send} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('placeholder')}
                    className="flex-1 rounded-full border border-line bg-bg-soft px-4 py-2.5 text-[13.5px] outline-none transition-colors focus:border-ink focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-all hover:brightness-90 disabled:opacity-35"
                  >
                    <Send size={15} strokeWidth={2} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
