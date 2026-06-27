'use client';

import { useState } from 'react';
import {
  BookOpen,
  Wallet,
  Network,
  Coins,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ: FaqItem[] = [
  {
    q: 'MetaMask nedir?',
    a: 'MetaMask, blokzincir uygulamalarıyla etkileşime girmenizi sağlayan bir tarayıcı eklentisi ve mobil cüzdandır. Ethereum ve EVM uyumlu ağlarda (Monad dahil) kullanılır.',
  },
  {
    q: 'Monad Testnet nedir?',
    a: "Monad'ın geliştirici test ağıdır. Gerçek para harcamadan platformu deneyimleyebilirsiniz. Testnet MON token'ları gerçek değer taşımaz ama işlemleri test etmek için kullanılır.",
  },
  {
    q: 'NFT modeli satın almak ücretli mi?',
    a: "Testnet'te tüm işlemler ücretsizdir. Mainnet'e geçildiğinde çok küçük miktarda MON token gaz ücreti gerekecek (< $0.001). Modeli satın almak için ise model sahibinin belirlediği fiyat ödenir.",
  },
  {
    q: 'MON token nasıl alınır?',
    a: "Testnet MON token'ı için Monad faucet'ini kullanabilirsiniz. Faucet, cüzdan adresinize ücretsiz test tokeni gönderir. Günde 1 kez talep edebilirsiniz.",
  },
  {
    q: "Modelim IPFS'e yüklendi ama kaybolur mu?",
    a: "IPFS içerik adresleme kullanır: her dosyanın hash değeri benzersizdir ve değişmez. Hash, Monad blokzincirinde kayıtlıdır. Dosya IPFS'de pin'lendi (sabitlendi) mi bu da önemlidir — platforma yüklenen modeller otomatik pin'lenir.",
  },
  {
    q: 'Cüzdanımı bağlamak güvenli mi?',
    a: 'Evet. Cüzdan bağlamak yalnızca açık anahtarınızı (adresinizi) paylaşır; özel anahtarınız asla platform tarafından görülmez veya istenmez. MetaMask, işlemleri onaylamadan önce size gösterir.',
  },
];

const STEPS = [
  {
    icon: Wallet,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    title: '1. MetaMask Kur',
    content: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>MetaMask&apos;ı Chrome/Firefox tarayıcınıza yükleyin:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>metamask.io adresini ziyaret edin</li>
          <li>"Download" butonuna tıklayın ve tarayıcı eklentisini yükleyin</li>
          <li>Yeni cüzdan oluşturun; güçlü şifre seçin</li>
          <li>
            <strong>Gizli kurtarma ifadesini (12 kelime) güvenli bir yere not edin</strong>
          </li>
          <li>Kurulumu tamamlayın</li>
        </ol>
        <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mt-2">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs">
            12 kelimelik kurtarma ifadenizi asla kimseyle paylaşmayın ve dijital ortamda saklamayın.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: Network,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    title: '2. Monad Testnet Ekle',
    content: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>MetaMask&apos;a Monad Testnet ağını ekleyin:</p>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-3 font-mono text-xs space-y-1">
          <div>
            <span className="text-muted-foreground">Ağ Adı:</span> Monad Testnet
          </div>
          <div>
            <span className="text-muted-foreground">RPC URL:</span> https://testnet-rpc.monad.xyz
          </div>
          <div>
            <span className="text-muted-foreground">Chain ID:</span> 10143
          </div>
          <div>
            <span className="text-muted-foreground">Sembol:</span> MON
          </div>
        </div>
        <p className="text-xs">
          MetaMask &rsaquo; Ağlar &rsaquo; Ağ Ekle &rsaquo; Manuel Ekle kısmından yukarıdaki
          bilgileri girin.
        </p>
      </div>
    ),
  },
  {
    icon: Coins,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    title: '3. Test MON Token Al',
    content: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Testnet&apos;te işlem yapabilmek için ücretsiz MON token alın:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>MetaMask&apos;ta cüzdan adresinizi kopyalayın</li>
          <li>Monad Faucet&apos;ına gidin (faucet.monad.xyz)</li>
          <li>Adresinizi yapıştırın ve token talep edin</li>
          <li>Birkaç saniye içinde cüzdanınıza 0.1 MON gönderilir</li>
        </ol>
        <div className="flex items-start gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
          <p className="text-xs">Testnet token gerçek para değildir, risk yoktur.</p>
        </div>
      </div>
    ),
  },
  {
    icon: ShoppingBag,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: '4. Platformu Kullan',
    content: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Artık platforma bağlanmaya hazırsınız:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Sağ üstteki &ldquo;Cüzdan Bağla&rdquo; butonuna tıklayın</li>
          <li>MetaMask açılır — &ldquo;Bağlan&rdquo; deyin</li>
          <li>Pazar Yeri&apos;nde modelleri keşfedin</li>
          <li>Bir modelin Detaylar sayfasında &ldquo;Deneme Alanı&rdquo;nı deneyin</li>
          <li>Kazanç Merkezi&apos;nde görevleri tamamlayın ve MON kazanın</li>
        </ol>
      </div>
    ),
  },
];

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border/60 overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            {open === i ? (
              <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </button>
          {open === i && (
            <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/30">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function RehberPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Başlangıç Rehberi</h1>
          <p className="text-sm text-muted-foreground">
            Web3, cüzdan ve platform kullanımı hakkında adım adım açıklama
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">
          Yeni Kullanıcı
        </Badge>
      </div>

      {/* Intro Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex gap-4 items-start">
          <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Blokzincir deneyimi gerekmez</p>
            <p className="text-sm text-muted-foreground">
              Bu platform tamamen testnet üzerinde çalışır. Gerçek para harcamadan tüm özellikleri
              deneyimleyebilirsiniz. MetaMask kurmanız yeterli — 5 dakika içinde hazır olursunuz.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Kurulum Adımları</h2>
        <div className="space-y-4">
          {STEPS.map((step) => (
            <Card key={step.title}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step.bg}`}>
                    <step.icon className={`h-4 w-4 ${step.color}`} />
                  </div>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">{step.content}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Glossary */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Terimler Sözlüğü</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { term: 'NFT', desc: 'Blokzincirde benzersiz dijital varlık belgesi.' },
            { term: 'IPFS', desc: 'Merkeziyetsiz dosya depolama protokolü.' },
            { term: 'MON', desc: 'Monad ağının yerel kripto para birimi.' },
            { term: 'DAO', desc: 'Token sahiplerince yönetilen merkeziyetsiz organizasyon.' },
            { term: 'Gaz Ücreti', desc: 'Blokzincirde işlem yaptırmak için ödenen küçük ücret.' },
            {
              term: 'Cüzdan Adresi',
              desc: 'Blokzincirde kimliğinizi temsil eden 0x... ile başlayan kod.',
            },
            { term: 'Akıllı Kontrat', desc: 'Blokzincirde otomatik çalışan kod parçacığı.' },
            { term: 'Testnet', desc: 'Gerçek para kullanmadan deney yapılan test ağı.' },
          ].map(({ term, desc }) => (
            <div
              key={term}
              className="flex gap-3 p-3 rounded-lg border border-border/40 bg-muted/20"
            >
              <Badge variant="outline" className="shrink-0 h-fit mt-0.5 font-mono text-xs">
                {term}
              </Badge>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sık Sorulan Sorular</h2>
        <FaqAccordion items={FAQ} />
      </div>

      {/* CTA */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="font-bold text-lg">Hazır mısınız?</h3>
          <p className="text-sm text-muted-foreground">
            Adımları tamamladıysanız pazar yerini keşfetmeye başlayabilirsiniz.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild>
              <Link href={ROUTES.MARKETPLACE}>Pazar Yerini Keşfet</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.EARN}>Kazanç Merkezi</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* External links */}
      <div className="flex flex-wrap gap-3 text-sm">
        <a
          href="https://docs.monad.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Monad Dokümanları
        </a>
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          MetaMask İndir
        </a>
      </div>
    </div>
  );
}
