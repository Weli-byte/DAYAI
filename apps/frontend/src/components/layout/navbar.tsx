'use client';

import Link from 'next/link';
import { Brain, Menu, Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebarStore } from '@/store/sidebar-store';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';
import { ROUTES } from '@/constants/routes';

// ── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar() {
  const { toggle } = useSidebarStore();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/95 px-4 backdrop-blur-sm lg:px-6">
      {/* Mobile: hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 lg:hidden"
        onClick={toggle}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo — visible on mobile when sidebar closed */}
      <Link
        href={ROUTES.HOME}
        className="flex items-center gap-2 lg:hidden"
        aria-label="Go to home"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Brain className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm">AI Market</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        <div className="ml-2">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
