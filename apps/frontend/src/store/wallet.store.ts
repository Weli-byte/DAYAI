import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  connectWallet,
  getConnectedAccounts,
  onAccountsChanged,
  onChainChanged,
  isMetaMaskInstalled,
  signMessage as walletSign,
} from '@/lib/wallet';

interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  init: () => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      chainId: null,
      isConnecting: false,
      isConnected: false,
      error: null,

      connect: async () => {
        set({ isConnecting: true, error: null });
        try {
          const address = await connectWallet();
          set({ address, isConnected: true, isConnecting: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Wallet connection failed';
          set({ error: message, isConnecting: false });
          throw err;
        }
      },

      disconnect: () => {
        set({ address: null, chainId: null, isConnected: false, error: null });
      },

      signMessage: async (message: string) => {
        const { address } = get();
        if (!address) throw new Error('Wallet not connected');
        return walletSign(address, message);
      },

      init: async () => {
        if (!isMetaMaskInstalled()) return;

        // Restore connection if already granted
        const accounts = await getConnectedAccounts();
        if (accounts.length) {
          set({ address: accounts[0], isConnected: true });
        }

        // Listen for changes
        onAccountsChanged((accounts) => {
          if (accounts.length === 0) {
            set({ address: null, isConnected: false });
          } else {
            set({ address: accounts[0], isConnected: true });
          }
        });

        onChainChanged((chainId) => {
          set({ chainId });
        });
      },
    }),
    {
      name: 'wallet-store',
      // Only persist address — do not persist sensitive data
      partialize: (state) => ({ address: state.address, isConnected: state.isConnected }),
    },
  ),
);
