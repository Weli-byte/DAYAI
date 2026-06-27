import Link from 'next/link';
import { ArrowRight, Brain, Shield, Zap, Users, Globe, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

// ── Feature cards data ────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'AI Models as NFTs',
    description:
      'Every model is tokenized as an ERC-721 NFT on Monad blockchain. Own, trade, and transfer AI models with cryptographic proof of ownership.',
  },
  {
    icon: Shield,
    title: 'On-Chain Incentives',
    description:
      'Contribute training data and earn MON token rewards. Deposit-based quality mechanism inspired by Microsoft Research SUM framework.',
  },
  {
    icon: Zap,
    title: 'Powered by Monad',
    description:
      '~10,000 TPS with ~1s block finality. Near-zero gas fees make AI model transactions economically viable at scale.',
  },
  {
    icon: Users,
    title: 'DAO Governance',
    description:
      'Token holders vote on model updates, fee structures, and platform rules. No central authority — community-owned from day one.',
  },
  {
    icon: Globe,
    title: 'IPFS Storage',
    description:
      'Model weights stored on IPFS. Only content hashes live on-chain, keeping storage costs minimal while ensuring integrity.',
  },
  {
    icon: Lock,
    title: 'Full Transparency',
    description:
      'Every model update, contribution, and transaction is permanently recorded on-chain. Full audit trail, zero trust required.',
  },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { label: 'AI Models', value: '—' },
  { label: 'Contributors', value: '—' },
  { label: 'Total Transactions', value: '—' },
  { label: 'Chain', value: 'Monad' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Simple top nav for landing page ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">AI Marketplace</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={ROUTES.MARKETPLACE}>
                Explore Models
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

          <div className="container relative text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5">
              <Zap className="mr-1.5 h-3 w-3 text-primary" />
              Built on Monad · EVM Compatible · ~10,000 TPS
            </Badge>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              The <span className="text-gradient">Decentralized</span>
              <br />
              AI Model Marketplace
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Publish, discover, and trade AI models as NFTs. Earn crypto rewards for data
              contributions. Governed by the community, for the community.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href={ROUTES.MARKETPLACE}>
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link href={ROUTES.UPLOAD}>Publish a Model</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="border-y border-border/60 bg-muted/30 py-12">
          <div className="container">
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 text-3xl font-bold tracking-tight">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Why Decentralized AI?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Built on research from Microsoft, Pluralis, Cambridge, and MIT.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-border/60 transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-border/60 py-24">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
            <p className="mt-4 text-muted-foreground">
              Connect your wallet and start exploring the future of AI ownership.
            </p>
            <Button size="lg" className="mt-8 h-12 px-10" asChild>
              <Link href={ROUTES.MARKETPLACE}>
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2025 Decentralized AI Marketplace. MIT License.</p>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href={ROUTES.MARKETPLACE} className="hover:text-foreground transition-colors">
              Marketplace
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
