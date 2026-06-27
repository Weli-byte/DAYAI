'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoModels } from '@/lib/demo-data';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  models?: typeof demoModels;
}

// ── Keyword-based smart search ─────────────────────────────────────────────────

const KEYWORD_MAP: Record<string, string[]> = {
  sağlık: ['health', 'tıbbi', 'medical', 'tanı', 'triyaj', 'röntgen', 'mri'],
  dil: ['language', 'türkçe', 'metin', 'nlp', 'text', 'özetleme', 'çeviri', 'duygu'],
  uç: ['edge', 'mobil', 'iot', 'hafif', 'küçük', 'uç'],
  görüntü: ['görüntü', 'image', 'vision', 'yolo', 'nesne', 'resnet', 'cifar'],
  veri: ['veri', 'data', 'oracle', 'kalite', 'dataset', 'katkı'],
  kod: ['kod', 'code', 'solidity', 'kontrat', 'akıllı', 'evm', 'sentinel'],
  konuşma: ['konuşma', 'ses', 'speech', 'whisper', 'audio', 'tanıma'],
  finansal: ['finansal', 'fiyat', 'tahmin', 'lstm', 'defi', 'token'],
  monad: ['monad', 'testnet', 'blokzincir', 'nft'],
  federe: ['federe', 'federated', 'dağıtık', 'gizlilik'],
};

function searchModels(query: string) {
  const q = query.toLowerCase();

  // Direct keyword category lookup
  const matchedCategories = new Set<string>();
  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => q.includes(kw)) || q.includes(category)) {
      matchedCategories.add(category);
    }
  }

  return demoModels
    .filter((model) => {
      const text =
        `${model.title} ${model.description} ${model.category?.name ?? ''} ${model.tags.map((t) => t.name).join(' ')}`.toLowerCase();

      // Direct text match
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      if (words.some((w) => text.includes(w))) return true;

      // Category keyword match
      for (const cat of matchedCategories) {
        const catKeywords = KEYWORD_MAP[cat] ?? [];
        if (catKeywords.some((kw) => text.includes(kw))) return true;
      }

      return false;
    })
    .slice(0, 4);
}

function generateResponse(query: string): { text: string; models: typeof demoModels } {
  const results = searchModels(query);

  if (results.length === 0) {
    return {
      text: `"${query}" için pazar yerinde eşleşen model bulunamadı. Farklı anahtar kelimeler deneyin: sağlık, dil, görüntü, kod, finansal, konuşma, federe öğrenme gibi.`,
      models: [],
    };
  }

  const categoryNames = [...new Set(results.map((m) => m.category?.name).filter(Boolean))];
  return {
    text: `"${query}" için ${results.length} model buldum${categoryNames.length ? ` (${categoryNames.join(', ')})` : ''}. Detaylar için modele tıklayın:`,
    models: results,
  };
}

const QUICK_PROMPTS = [
  'Sağlık modelleri',
  'Türkçe dil işleme',
  'Görüntü tanıma',
  'Monad + IPFS',
  'Federe öğrenme',
  'Akıllı kontrat',
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Merhaba! 👋 Pazar yerinde YZ modeli aramanıza yardımcı olabilirim. Hangi tür model arıyorsunuz? Hızlı öneriler için aşağıdaki etiketlere tıklayabilirsiniz.',
};

// ── Component ─────────────────────────────────────────────────────────────────

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send(text?: string) {
    const query = (text ?? input).trim();
    if (!query) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: query };
    const { text: responseText, models } = generateResponse(query);
    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: responseText,
      models: models.length > 0 ? models : undefined,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/30 hover:bg-primary/90 transition-colors"
            title="YZ Asistan"
          >
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold text-white">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col w-[360px] max-h-[520px] rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-primary/5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">YZ Model Asistanı</p>
                <p className="text-[10px] text-muted-foreground">Pazar yeri akıllı arama</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`h-6 w-6 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary/20' : 'bg-muted'}`}
                  >
                    {msg.role === 'user' ? (
                      <User className="h-3 w-3 text-primary" />
                    ) : (
                      <Bot className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="max-w-[80%] space-y-2">
                    <div
                      className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/60 text-foreground'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {/* Model results */}
                    {msg.models && msg.models.length > 0 && (
                      <div className="space-y-1.5">
                        {msg.models.map((model) => (
                          <Link
                            key={model.id}
                            href={`/models/${model.id}`}
                            className="flex items-start gap-2 p-2 rounded-lg border border-border/40 bg-background hover:border-primary/40 hover:bg-primary/5 transition-all group"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold truncate group-hover:text-primary transition-colors">
                                {model.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {model.description.slice(0, 60)}...
                              </p>
                              <div className="flex gap-1 mt-1">
                                {model.category && (
                                  <Badge variant="outline" className="h-4 text-[9px] px-1.5 py-0">
                                    {model.category.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick prompts — only after welcome */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick prompts (always visible below messages for easy access) */}
            {messages.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto px-3 py-2 border-t border-border/20 scrollbar-none">
                {QUICK_PROMPTS.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="shrink-0 text-[10px] px-2 py-1 rounded-full border border-border/50 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 p-3 border-t border-border/40">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Model ara... (örn: sağlık, görüntü)"
                className="flex-1 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background transition-all"
              />
              <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => send()}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
