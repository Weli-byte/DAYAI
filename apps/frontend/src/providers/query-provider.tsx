'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Default query options aligned with typical blockchain + API latency patterns
const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 60 seconds — balances freshness vs. RPC rate limits
        staleTime: 60 * 1000,
        // Retry failed requests twice before showing an error
        retry: 2,
        // Do not refetch on window focus — avoids excessive blockchain queries
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new QueryClient
    return makeQueryClient();
  }
  // Browser: reuse the same client to preserve cache across rerenders
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
