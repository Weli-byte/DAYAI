'use client';

import { Wallet, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWalletStore } from '@/store/wallet.store';
import { isMetaMaskInstalled } from '@/lib/wallet';
import { toast } from 'sonner';

function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectWalletButton() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWalletStore();

  async function handleConnect() {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask not found', {
        description: 'Please install MetaMask browser extension to connect your wallet.',
      });
      return;
    }
    try {
      await connect();
      toast.success('Wallet connected', {
        description: shortAddress(useWalletStore.getState().address!),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      toast.error('Connection failed', { description: msg });
    }
  }

  if (isConnecting) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting…
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            {shortAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground">Connected wallet</p>
            <p className="font-mono text-xs mt-0.5 break-all">{address}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-muted-foreground"
            onClick={() =>
              navigator.clipboard.writeText(address).then(() => toast.success('Address copied'))
            }
          >
            Copy address
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-destructive"
            onClick={() => {
              disconnect();
              toast.info('Wallet disconnected');
            }}
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleConnect}>
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}

/** Compact inline warning shown when wallet is required but not connected */
export function WalletRequired() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>
        Please <ConnectWalletButton /> to upload a model and mint an NFT.
      </span>
    </div>
  );
}
