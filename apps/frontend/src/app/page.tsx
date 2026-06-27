'use client';

import Link from 'next/link';
import { ArrowRight, Brain, Shield, Zap, Users, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

const features = [
  {
    icon: Brain,
    title: 'YZ Modelleri NFT Olarak',
    description:
      'Her model Monad blokzincirinde ERC-721 NFT olarak tokenize edilir. Kriptografik sahiplik kanıtıyla YZ modellerini sahiplen, takas et ve devret.',
  },
  {
    icon: Shield,
    title: 'Zincir Üstü Teşvikler',
    description:
      'Eğitim verisi katkısında bulun ve MON token ödülü kazan. Microsoft Research SUM çerçevesinden ilham alan depozitolu kalite mekanizması.',
  },
  {
    icon: Zap,
    title: "Monad'la Güçlendirildi",
    description:
      '~10.000 TPS ve ~1 saniyelik blok kesinliği. Neredeyse sıfır gaz ücretleri ile YZ işlemleri büyük ölçekte ekonomik hale gelir.',
  },
  {
    icon: Users,
    title: 'DAO Yönetişimi',
    description:
      'Token sahipleri model güncellemeleri, ücret yapıları ve platform kurallarını oylar. Merkezi otorite yok — topluluk tarafından yönetilir.',
  },
  {
    icon: Globe,
    title: 'IPFS Depolama',
    description:
      'Model ağırlıkları IPFS üzerinde saklanır. Yalnızca içerik hash değerleri zincire yazılır; depolama maliyetleri düşük, bütünlük garantili.',
  },
  {
    icon: Lock,
    title: 'Tam Şeffaflık',
    description:
      'Her model güncellemesi, katkı ve işlem zincirde kalıcı olarak kaydedilir. Eksiksiz denetim izi, sıfır güven gereksinimi.',
  },
];

const stats = [
  { label: 'Kayıtlı YZ Modeli', value: '6+' },
  { label: 'Blokzincir Ağı', value: 'Monad Testnet' },
  { label: 'Blok Kesinliği', value: '~1sn' },
  { label: 'Gaz Ücreti', value: '< $0.001' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* Navigasyon */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground animate-pulse" />
            </div>
            <span className="font-semibold tracking-tight text-foreground">YZ Pazarı</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.DASHBOARD}>Kontrol Paneli</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
            >
              <Link href={ROUTES.MARKETPLACE}>
                Modelleri Keşfet
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <motion.div
              animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[120px]"
            />
          </div>

          <div className="container relative text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
              className="inline-block"
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-1.5 bg-muted/40 backdrop-blur-sm border-primary/20"
              >
                <Zap className="mr-1.5 h-3 w-3 text-primary animate-pulse" />
                Monad üzerinde · EVM Paralel · ~10.000 TPS
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl leading-tight"
            >
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Merkeziyetsiz
              </span>{' '}
              YZ Model Pazarı
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl"
            >
              Açık kaynak YZ modellerini NFT olarak yayımla, keşfet ve çalıştır. Veri katkısı ve
              sorgu yürütmesi için ödül kazan. Denetlenebilir, dayanıklı ve topluluk tarafından
              sahiplenilmiş.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button
                size="lg"
                className="h-12 px-8 shadow-xl shadow-primary/10 hover:shadow-primary/20"
                asChild
              >
                <Link href={ROUTES.MARKETPLACE}>
                  Pazar Yerini Keşfet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 bg-background/50 backdrop-blur-sm"
                asChild
              >
                <Link href={ROUTES.MODEL_CREATE}>Model Yayımla</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* İstatistikler */}
        <section className="border-y border-border/40 bg-muted/20 py-12 backdrop-blur-sm">
          <div className="container">
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </section>

        {/* Özellikler */}
        <section className="py-24 relative">
          <div className="container">
            <div className="mb-16 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight md:text-4xl"
              >
                Neden Merkeziyetsiz YZ?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-muted-foreground"
              >
                Web3 kriptografik güvenliğini yüksek performanslı YZ iş hatlarıyla birleştiriyor.
              </motion.p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="flex"
                >
                  <Card className="border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 flex flex-col w-full">
                    <CardHeader>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/40 py-24 bg-gradient-to-b from-transparent to-muted/20">
          <div className="container text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                YZ Devrimine Katılmaya Hazır mısın?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                Cüzdanını bağla, doğrulanmış model ağırlıklarını indir, deneme alanında modelleri
                çalıştır ve zincir üstü değerlendirme bırak.
              </p>
              <Button
                size="lg"
                className="h-12 px-10 shadow-xl shadow-primary/20 hover:shadow-primary/30 mt-4"
                asChild
              >
                <Link href={ROUTES.MARKETPLACE}>
                  Uygulamayı Başlat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 Merkeziyetsiz YZ Pazarı. MIT Lisansı.</p>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Dokümanlar
            </Link>
            <Link href={ROUTES.MARKETPLACE} className="hover:text-foreground transition-colors">
              Pazar Yeri
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
