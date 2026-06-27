'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Brain,
  LayoutDashboard,
  Store,
  Package,
  Upload,
  User,
  Settings,
  X,
  ChevronRight,
  Play,
  Heart,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSidebarStore } from '@/store/sidebar-store';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

// ── Navigation items ─────────────────────────────────────────────────────────
const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.MARKETPLACE, label: 'Marketplace', icon: Store },
  { href: ROUTES.PLAYGROUND, label: 'Playground', icon: Play },
  { href: ROUTES.FAVORITES, label: 'Favorites', icon: Heart },
  { href: ROUTES.MODELS, label: 'My Models', icon: Package },
  { href: ROUTES.MODEL_CREATE, label: 'Publish Model', icon: Upload },
];

const bottomNavItems = [
  { href: '/health', label: 'System Health', icon: Activity },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
  { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

// ── Nav Item ──────────────────────────────────────────────────────────────────
function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-border/60 hover:text-sidebar-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active && 'text-primary')} />
      <span className="truncate">{label}</span>
      {active && <ChevronRight className="ml-auto h-3 w-3 opacity-60" />}
    </Link>
  );
}

// ── Sidebar Content ───────────────────────────────────────────────────────────
function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
          <Brain className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none">AI Marketplace</span>
          <span className="mt-0.5 text-[10px] text-sidebar-foreground/50">Powered by Monad</span>
        </div>
        <Badge variant="outline" className="ml-auto text-[10px]">
          Testnet
        </Badge>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main navigation">
        <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
          Navigation
        </p>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="space-y-1 border-t border-sidebar-border p-3">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
            onClick={onLinkClick}
          />
        ))}
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export function Sidebar() {
  const { isOpen, close } = useSidebarStore();

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* ── Mobile overlay + drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={close}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl lg:hidden"
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3.5 z-10"
                onClick={close}
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </Button>
              <SidebarContent onLinkClick={close} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
