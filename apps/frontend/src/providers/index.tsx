'use client';

import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';
import { ToastProvider } from './toast-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

// All client-side providers are composed here and wrapped around the app in
// the root layout. The order matters:
// 1. ThemeProvider — must wrap everything to avoid FOUC
// 2. QueryProvider — TanStack Query context
// 3. ToastProvider — uses theme, so goes after ThemeProvider
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <ToastProvider />
      </QueryProvider>
    </ThemeProvider>
  );
}
